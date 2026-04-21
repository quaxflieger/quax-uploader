import uuid
from pathlib import Path
from typing import Optional, Annotated

import aiofiles
from fastapi import Depends, FastAPI, Request, Header, HTTPException, Response, status, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import PlainTextResponse
from uuid_extensions import uuid7, uuid7str


#from .dependencies import get_query_token, get_token_header
#from .internal import admin
#from .routers import items, users

app = FastAPI()   # dependencies=[Depends(get_query_token)])
#
#
#app.include_router(users.router)
#app.include_router(items.router)
#app.include_router(
#    admin.router,
#    prefix="/admin",
#    tags=["admin"],
#    dependencies=[Depends(get_token_header)],
#    responses={418: {"description": "I'm a teapot"}},
#)


app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

BASE_DIR = Path(__file__).parent.parent
TMP_ROOT = BASE_DIR / "tmp_uploads"
FINAL_ROOT = BASE_DIR / "uploads"
TMP_ROOT.mkdir(exist_ok=True)
FINAL_ROOT.mkdir(exist_ok=True)


@app.get("/")
async def root(request: Request):
    upload_id = uuid7str()
    return templates.TemplateResponse(
        request=request, name="index.html", context={"upload_id": upload_id}
    )


def get_transfer_dir(transfer_id: str) -> Path:
    return TMP_ROOT / transfer_id


def ensure_transfer_exists(transfer_id: str):
    d = get_transfer_dir(transfer_id)
    if not d.exists():
        raise HTTPException(status_code=404, detail="Transfer not found")


async def get_current_offset(transfer_id: str) -> int:
    """Return current size (offset) of temp file if exists, else 0"""
    d = get_transfer_dir(transfer_id)
    tmp_file = d / "upload.bin"
    if not tmp_file.exists():
        return 0
    return tmp_file.stat().st_size


@app.post("/upload/", response_class=PlainTextResponse, status_code=201)
async def create_transfer(
    files: Annotated[bytes, File()],
    request: Request,
    upload_length: Annotated[str | None, Header()] = None,
):
    """
    Starts a chunked transfer. Expects Upload-Length header with total file size.
    Returns a plain-text transfer id.
    """
    # Upload-Length is only available in FilePind v5
    #if upload_length is None:
    #    raise HTTPException(status_code=400, detail="Missing Upload-Length header")
    transfer_id = uuid7str()
    d = get_transfer_dir(transfer_id)
    d.mkdir(parents=True, exist_ok=False)
    
    upload_length = len(files)
    # # Save some metadata, upload name is a placeholder
    # meta = {
    #     "upload_length": str(upload_length),
    #     "upload_name": "",
    # }
    # meta_file = d / "meta.txt"
    # async with aiofiles.open(meta_file, "w") as f:
    #     for k, v in meta.items():
    #         await f.write(f"{k}:{v}\n")
    
    tmp_file = d / "upload.bin"
    async with aiofiles.open(tmp_file, "wb") as f:
        await f.write(files)
    
    # Return transfer id in plain text (FilePond expects body text with id)
    return PlainTextResponse(content=transfer_id, status_code=201)


@app.patch("/upload/")
async def upload_chunk(
    contentType: str,
    id: str,
    request: Request,
    upload_offset: Annotated[int | None, Header()] = None,
    upload_length: Annotated[int | None, Header()] = None,
    upload_name: Annotated[str | None, Header()] = None,
):
    """
    Accepts a chunk of bytes. Expects Content-Type 'application/offset+octet-stream',
    Upload-Offset (offset of this chunk), Upload-Length (total file size),
    Upload-Name (filename).
    Appends bytes to tmp file. Validates offset matches current size.
    """
    ensure_transfer_exists(id)
    content_type = contentType   # because query param is in camelCase.
    if content_type != "application/offset+octet-stream":
        raise HTTPException(status_code=415, detail="Unsupported Content-Type")

    if upload_offset is None:
        raise HTTPException(status_code=400, detail="Missing Upload-Offset header")
    if upload_length is None:
        raise HTTPException(status_code=400, detail="Missing Upload-Length header")

    # get current temp file size
    current_offset = await get_current_offset(id)
    if upload_offset != current_offset:
        # 409 Conflict is suitable for mismatch
        raise HTTPException(
            status_code=409,
            detail=f"Offset mismatch: client {upload_offset} != server {current_offset}",
        )

    # Read incoming body (the chunk bytes)
    body = await request.body()
    if not body:
        # zero-length chunk? allow if upload completed? treat as no-op
        return Response(status_code=204)

    d = get_transfer_dir(id)
    tmp_file = d / "upload.bin"

    meta_file = d / "meta.txt"
    meta = {
        "upload_length": str(upload_length),
        "upload_name": upload_name or "",
    }
    async with aiofiles.open(meta_file, "w") as f:
        for k, v in meta.items():
            await f.write(f"{k}:{v}\n")

    # Append chunk to file
    async with aiofiles.open(tmp_file, "ab") as f:
        await f.write(body)

    # Optionally verify total length reached; if reached, create a marker file
    new_offset = await get_current_offset(id)
    if new_offset > int(upload_length):
        # Received more bytes than declared
        raise HTTPException(status_code=400, detail="Received more bytes than Upload-Length")

    if new_offset == int(upload_length):
        # Mark completed
        done_flag = d / "done"
        # await aiofiles.os.wrap(d)  # noop to satisfy linter if needed
        async with aiofiles.open(done_flag, "w") as f:
            await f.write("done")

    # Respond with 204 No Content
    return Response(status_code=204)


@app.get("/upload/")
async def head_transfer(id: str):
    """
    Returns Upload-Offset header indicating next expected byte.
    """
    ensure_transfer_exists(id)
    offset = await get_current_offset(id)
    headers = {"Upload-Offset": str(offset)}
    return Response(status_code=200, headers=headers)


@app.post("/commit/{transfer_id}")
async def commit_transfer(transfer_id: str):
    """
    Optional: move temp file to final destination if upload is complete.
    FilePond sends the transfer id as server id when submitting parent form.
    """
    ensure_transfer_exists(transfer_id)
    d = get_transfer_dir(transfer_id)
    meta_file = d / "meta.txt"
    if not meta_file.exists():
        raise HTTPException(status_code=500, detail="Missing metadata")

    meta = {}
    async with aiofiles.open(meta_file, "r") as f:
        async for line in f:
            if ":" in line:
                k, v = line.strip().split(":", 1)
                meta[k] = v

    upload_length = int(meta.get("upload_length", "0"))
    upload_name = meta.get("upload_name") or f"{transfer_id}.bin"
    tmp_file = d / "upload.bin"
    if not tmp_file.exists() or tmp_file.stat().st_size != upload_length:
        raise HTTPException(status_code=400, detail="Upload not complete")

    final_path = FINAL_ROOT / upload_name
    # ensure unique final filename
    if final_path.exists():
        final_path = FINAL_ROOT / f"{transfer_id}_{upload_name}"

    # Move file
    tmp_file.replace(final_path)

    # cleanup tmp dir
    try:
        for p in d.iterdir():
            p.unlink()
        d.rmdir()
    except Exception:
        pass

    return {"file": str(final_path.name)}


@app.delete("/upload/{transfer_id}")
async def delete_transfer(transfer_id: str):
    """
    Delete/cleanup a transfer (e.g., when user removes file).
    """
    d = get_transfer_dir(transfer_id)
    if d.exists():
        for p in d.iterdir():
            try:
                p.unlink()
            except Exception:
                pass
        try:
            d.rmdir()
        except Exception:
            pass
    return Response(status_code=204)
