/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { toKebabCase as P, toCamelCase as b } from "./string.js";
import { toURL as F } from "./url.js";
import { noop as d } from "./placeholder.js";
import { thread as U, createThreadWorker as y } from "./thread.js";
import { arrayRemoveFalsy as E } from "./array.js";
import { httpRequest as h } from "../workers/httpRequest.js";
function j(t, r) {
  const {
    method: e,
    queryString: n,
    headers: s,
    data: o,
    formData: m,
    responseType: g,
    withCredentials: R,
    timeout: w,
    useWebWorkers: C = !1,
    workersURL: H,
    abortController: q,
    onprogress: v = d,
    onabort: L = d
  } = r ?? {}, p = {
    url: W(t, n),
    responseType: g,
    method: e,
    headers: Object.entries(s ?? {}).map(([a, i]) => [
      P(a),
      `${i}`
    ]),
    data: o,
    formData: m,
    timeout: w,
    withCredentials: R
  }, l = { abortController: q, onprogress: v, onabort: L };
  function f(a) {
    return new Promise((i, u) => {
      a.then((c) => {
        i({
          getAllResponseHeaders: () => c.responseHeaders,
          response: c.response
        });
      }).catch(u);
    });
  }
  return f(
    C ? (
      // @ts-ignore fix types
      U(y(H, h), [p], l)
    ) : new Promise(
      (a, i) => (
        // httpRequest()
        h(
          p,
          (u, c) => {
            if (u) {
              i(new Error(u));
              return;
            }
            a(c);
          },
          l
        )
      )
    )
  );
}
function W(t, r = {}) {
  const e = F(t);
  return Object.entries(r).forEach(
    ([n, s]) => e.searchParams.append(n, `${s}`)
  ), `${e}`;
}
function I(t, r, e) {
  return new ProgressEvent("progress", {
    lengthComputable: t || !1,
    loaded: t ? r && e === 1 ? r * 100 : r : 0,
    total: t ? e === 1 ? 100 : e : 0
  });
}
function K(t) {
  return t ? E(
    t.getAllResponseHeaders().split(`
`).map((e) => {
      const n = e.match(/(^.*?):/) || [], [s, o] = n;
      if (!s)
        return;
      const m = e.replace(s, "").trim();
      return [o, m];
    })
  ).reduce(
    (e, n) => {
      const [s, o] = n;
      return e[b(s)] = o, e;
    },
    {}
  ) : {};
}
function S(t) {
  const { contentDisposition: r } = t;
  return !r || !r.length ? null : $(r);
}
function $(t) {
  if (!t.toLowerCase().startsWith("attachment"))
    return null;
  const r = t.split(/filename=|filename\*=.+''/i).splice(1).map((e) => e.trim().replace(/^["']|[;"']{0,2}$/g, "")).filter((e) => e.length);
  return r.length ? decodeURI(r[r.length - 1]) : null;
}
function V(t, r) {
  const e = r.toLowerCase().split(`
`).find((n) => n.includes(t));
  return e ? e.split(":")[1].trim() : void 0;
}
export {
  I as createProgressEvent,
  $ as getFilenameFromContentDispositionHeader,
  S as getFilenameFromResponseHeaders,
  V as getResponseHeaderValue,
  K as getResponseHeaders,
  j as xhr
};
