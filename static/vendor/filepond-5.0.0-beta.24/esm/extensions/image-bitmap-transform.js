/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { blobToFile as S } from "../utils/file.js";
import { getImageSize as k } from "../utils/media.js";
import { rectApply as q, rectFromSize as A } from "../utils/rect.js";
import { sizeIsEmpty as H, sizeFromRect as W } from "../utils/size.js";
import { isFileEntry as C, isImageFile as L } from "../utils/test.js";
import { thread as O, createThreadWorker as U } from "../utils/thread.js";
import { createTransformExtension as Q } from "./common/createTransformExtension.js";
import { transformImage as j } from "../workers/transformImage.js";
const Z = Q(
  "ImageBitmapTransform",
  {
    actionTransform: "transformImage",
    width: void 0,
    height: void 0,
    upscale: !1,
    fit: "contain",
    aspectRatio: void 0,
    type: void 0,
    quality: "medium",
    compression: 0.98,
    workersURL: void 0,
    shouldTransform: () => !0
  },
  ({ props: v, extensionName: b }) => {
    function z(o) {
      return C(o) && L(o.file) && !/svg/.test(o.file.type);
    }
    async function F(o, { abortController: T }) {
      const {
        aspectRatio: c,
        width: f,
        height: l,
        upscale: I,
        fit: d,
        quality: R,
        compression: x,
        type: E,
        workersURL: B
      } = v, { file: n } = o, M = [...o.extension[b].history ?? []], h = await k(n);
      if (h === null || H(h))
        throw "Failed to read image size";
      const e = q(A(h, c), Math.round);
      let t = W(e);
      if (f || l) {
        const m = e.width / e.height, a = c || m;
        let i = f, r = l;
        if (r ? i || (i = r * a) : r = i / a, t.width = i, t.height = r, d === "contain" ? i > r ? t.width = r * a : t.height = i / a : d === "cover" && (i > r ? t.height = i / a : t.width = r * a), !I && (t.width > e.width || t.height > e.height)) {
          const y = Math.min(
            e.width / t.width,
            e.height / t.height
          );
          t.width *= y, t.height *= y;
        }
      }
      let s;
      try {
        s = await O(
          U(B, j),
          [
            n,
            e,
            {
              resizeWidth: Math.round(t.width),
              resizeHeight: Math.round(t.height),
              resizeQuality: R,
              imageOrientation: "from-image"
            }
          ],
          {
            abortController: T
          }
        );
      } catch {
        throw "Failed to create image bitmap";
      }
      const p = new OffscreenCanvas(s.width, s.height), g = p.getContext("bitmaprenderer");
      if (g === null)
        throw "Failed to create bitmap renderer";
      g.transferFromImageBitmap(s);
      let u;
      try {
        u = await p.convertToBlob({
          type: E || n.type,
          quality: x
        });
      } catch {
        throw "Failed to convert canvas to blob";
      }
      const w = S(u, n.name);
      return {
        file: w,
        history: [...M, w]
      };
    }
    return {
      canTransformEntry: z,
      transformEntry: F
    };
  }
);
export {
  Z as ImageBitmapTransform
};
