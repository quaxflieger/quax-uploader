/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createStoreExtension as L } from "./common/createStoreExtension.js";
import { isString as g, isFileEntry as N, isFile as W, isNumber as x } from "../utils/test.js";
import { toURL as A } from "../utils/url.js";
import { naturalFileSizeToBytes as H } from "../utils/file.js";
import { noop as O } from "../utils/placeholder.js";
import { sleep as K } from "../utils/sleep.js";
import { createProgressEvent as E, xhr as m, getResponseHeaders as M } from "../utils/xhr.js";
import { warn as $ } from "../common/console.js";
const _ = L(
  "ChunkedUploadStore",
  {
    url: "",
    chunkSize: 1 / 0,
    retryDelays: [500, 1e3, 3e3],
    resume: !1,
    parallelChunks: 2,
    willRequestWithOptions: (l, w, k) => w
  },
  ({ props: l, didSetProps: w }, { updateEntry: k }) => {
    let h = 1 / 0;
    w(({ chunkSize: e }) => {
      if (h = g(e) ? H(e) : e || 1 / 0, h <= 1024) {
        $("Chunk size has to be more than 1 kilobyte");
        return;
      }
    });
    function q(e, o) {
      const { valueKey: r } = l;
      k(e, {
        state: {
          [r]: o
        }
      });
    }
    function C(e, o, r) {
      const { url: t } = l, n = A(t);
      n.searchParams.append("id", e);
      const i = new EventSource(n);
      return i.addEventListener("progress", ({ data: s }) => {
        r(E(!0, parseInt(s, 10), o));
      }), () => {
        i.readyState === EventSource.OPEN && i.close();
      };
    }
    function S(e) {
      const o = [], r = Math.floor(e.size / h);
      for (let t = 0; t <= r; t++) {
        const n = t * h || 0, i = e.slice(
          n,
          Math.min(n + h, e.size),
          "application/offset+octet-stream"
        );
        o.push([n, i]);
      }
      return o;
    }
    async function b(e, o, r) {
      const { url: t, willRequestWithOptions: n } = l, { abortController: i, onabort: s } = o ?? {}, u = {
        method: "POST",
        headers: {
          uploadLength: e.size
        }
      }, a = await m(t, {
        ...n(t, u, r) ?? u,
        abortController: i,
        onabort: s
      });
      if (!g(a.response) || !a.response.length)
        throw new Error("No server id returned");
      return a.response;
    }
    async function v(e, o, r) {
      const { url: t, willRequestWithOptions: n } = l, { abortController: i, onabort: s } = o ?? {}, u = {
        method: "HEAD",
        queryString: {
          id: e
        }
      }, a = await m(t, {
        ...n(t, u, r) ?? u,
        abortController: i,
        onabort: s
      }), { uploadOffset: c } = M(a);
      if (!g(c) || !c.length)
        throw new Error("No upload offset returned");
      return parseInt(c, 10);
    }
    async function I(e, o, r, t, n) {
      const { url: i, retryDelays: s, willRequestWithOptions: u } = l, { abortController: a, onabort: c } = t ?? {};
      for (const p of [...s, void 0])
        try {
          const f = {
            method: "PATCH",
            headers: r,
            data: e,
            queryString: {
              contentType: "application/offset+octet-stream",
              id: o
            }
          };
          return await m(i, {
            ...u(i, f, n) ?? f,
            onabort: c,
            abortController: a
          }), !0;
        } catch (f) {
          if (x(p))
            await K(p);
          else
            throw f;
        }
      return !1;
    }
    async function P(e, o, { uploadName: r, uploadLength: t }, n, i) {
      const { parallelChunks: s } = l, { onprogress: u = O, onabort: a = O, abortController: c } = n ?? {};
      let p = !1;
      const f = C(
        o,
        parseInt(t, 10),
        u
      );
      let d = [];
      for (const [F, z] of e) {
        if (p)
          return;
        const T = I(
          z,
          o,
          {
            uploadOffset: F,
            uploadName: r,
            uploadLength: t
          },
          {
            abortController: c,
            onabort: () => {
              p = !0, f(), a();
            }
          },
          i
        );
        if (d.push(T), d.length < s) continue;
        await Promise.race(d);
        const D = [];
        for (const y of d)
          await y !== !0 && d.push(y);
        d = [...D];
      }
      f();
    }
    async function U(e, { abortController: o, onprogress: r, onabort: t }) {
      if (!N(e) || !W(e.file))
        return;
      const n = S(e.file), { valueKey: i } = l;
      let s = e.state[i], u = 0;
      return r(E()), s ? u = await v(
        s,
        {
          abortController: o,
          onabort: () => {
            t(), q(e, s);
          }
        },
        e
      ) : (s = await b(
        e.file,
        { abortController: o, onabort: t },
        e
      ), q(e, s)), await P(
        // get chunks that still need to be uploaded
        n.filter(([a]) => a >= u),
        // need to add them to this transfer
        s,
        // file headers
        {
          uploadName: `${e.file.name}`,
          uploadLength: `${e.file.size}`
        },
        // upload progress
        {
          onprogress: r,
          abortController: o,
          onabort: () => {
            t();
            const { resume: a } = l;
            a && q(e, s);
          }
        },
        // entry reference
        e
      ), s;
    }
    async function R(e, o) {
      const { url: r, willRequestWithOptions: t } = l, n = {
        method: "DELETE",
        queryString: {
          id: e
        }
      };
      return await m(r, t(r, n, o) ?? n), !0;
    }
    return {
      storeEntry: U,
      releaseEntry: R
    };
  }
);
export {
  _ as ChunkedUploadStore
};
