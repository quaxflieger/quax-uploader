/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { xhr as T, getResponseHeaderValue as v, getResponseHeaders as w, getFilenameFromResponseHeaders as Q } from "../utils/xhr.js";
import { urlToFilename as N } from "../utils/url.js";
import { isBlobOrFile as P, isString as h, isNumber as Y, isDataURL as S } from "../utils/test.js";
import { blobToFile as z, getExtensionFromMimeType as V } from "../utils/file.js";
import { createExtension as $ } from "./common/createExtension.js";
import { Status as p } from "../common/status.js";
function C(E, u, b) {
  return u;
}
const te = $(
  "URLLoader",
  {
    getBaseName: () => "Untitled",
    mimeTypeMap: void 0,
    parallel: 2,
    fetchHead: !0,
    useWebWorkers: !0,
    workersURL: void 0,
    actionLoad: "load",
    actionAbort: "abort",
    willRequestWithOptions: C
  },
  ({ extensionName: E, props: u }, b) => {
    const {
      on: D,
      removeEntries: F,
      updateEntry: L,
      pushTask: m,
      abortTask: k,
      getEntryExtensionStatus: A,
      setEntryExtensionStatus: f,
      createProgressHandler: W
    } = b;
    function R(e, t) {
      const { src: s } = e, { response: o } = t, a = w(t), i = s, n = Q(a);
      if (n)
        return n;
      if (S(i)) {
        const { getBaseName: r, mimeTypeMap: c } = u;
        return `${r(e, o)}${V(o.type, c)}`;
      }
      return N(i);
    }
    function g(e, t) {
      throw f(e, {
        type: p.Error,
        code: "LOAD_ERROR",
        values: { error: t }
      }), t;
    }
    function y(e) {
      if (h(e) && e.length)
        return !0;
      throw "FilePondEntry has invalid src property";
    }
    async function H(e) {
      f(e, {
        code: "LOAD_QUEUED",
        type: p.System,
        progress: 1 / 0
      });
    }
    async function q(e, { abortController: t }) {
      const { src: s } = e;
      f(e, {
        type: p.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      try {
        if (!y(s))
          return;
        const { useWebWorkers: o, workersURL: a, willRequestWithOptions: i } = u, n = { method: "HEAD" }, r = await T(s, {
          ...i(s, n, e) || n,
          abortController: t,
          useWebWorkers: o,
          workersURL: a
        }), { contentType: c, contentLength: l, lastModified: d } = w(r);
        L(e, {
          name: R(e, r),
          type: c,
          size: parseInt(l, 10),
          lastModified: new Date(d).getTime()
        });
      } catch (o) {
        g(e, o);
      }
    }
    async function U(e, { abortController: t }) {
      const { src: s } = e;
      f(e, {
        type: p.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      try {
        if (!y(s))
          return;
        const { useWebWorkers: o, workersURL: a, willRequestWithOptions: i } = u, n = { method: "GET" }, r = await T(s, {
          ...i(s, n, e) || n,
          responseType: "arraybuffer",
          abortController: t,
          useWebWorkers: o,
          workersURL: a,
          onprogress: W(e),
          onabort: () => {
            F(e);
          }
        }), { response: c } = r, l = v(
          "content-type",
          r.getAllResponseHeaders()
        ), d = new Blob([c], { type: l }), O = R(e, r);
        L(e, {
          file: z(d, O),
          extension: {
            [E]: {
              status: {
                type: p.Success,
                code: "LOAD_COMPLETE"
              }
            }
          }
        });
      } catch (o) {
        g(e, o);
      }
    }
    function B(e) {
      if (P(e.file))
        return;
      const t = A(e);
      if (t?.type === "error")
        return;
      const { actionLoad: s, actionAbort: o, fetchHead: a, parallel: i } = u, { src: n, name: r, size: c } = e, l = e.state[s], d = e.state[o];
      if (!h(n))
        return;
      if (d)
        return k(e.id, U);
      if (l === !1)
        return;
      const _ = h(r) && Y(c), I = a && !S(n);
      if (!_ && I) {
        m(e.id, q);
        return;
      }
      const M = t?.code === "LOAD_BUSY";
      if (!(t?.code === "LOAD_QUEUED") && !M) {
        m(e.id, H);
        return;
      }
      m(e.id, U, { parallel: i });
    }
    const x = D("updateEntry", B);
    return {
      destroy: () => {
        x();
      }
    };
  }
);
export {
  te as URLLoader
};
