/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
function g({
  url: l,
  method: s = "GET",
  formData: a,
  data: p,
  headers: i = [],
  timeout: d = 0,
  withCredentials: f = !1,
  responseType: c = "text"
}, u, { abortController: E = new AbortController(), onprogress: T, onabort: h }) {
  function n() {
    u(e.status + " (" + e.statusText + ")");
  }
  function q() {
    const t = {
      response: e.response,
      responseHeaders: e.getAllResponseHeaders()
    };
    u(null, t, typeof t.response != "string" ? [t.response] : void 0);
  }
  function H(t) {
    const o = new FormData();
    return t.filter(Boolean).forEach((R) => {
      o.append(...R);
    }), o;
  }
  const e = new XMLHttpRequest();
  e.responseType = c, E.signal.onabort = () => {
    e.abort();
  };
  const r = p || (a ? H(a) : null);
  (r ? e.upload : e).onprogress = T, e.onload = () => {
    e.status >= 200 && e.status < 300 ? q() : n();
  }, e.onerror = n, e.ontimeout = n, e.onabort = h, e.open(r && (s === "GET" || s === "HEAD") ? "POST" : s, l), e.withCredentials = f, e.timeout = d, i.forEach(([t, o]) => e.setRequestHeader(t, o)), e.send(r);
}
g.fileName = "httpRequest";
export {
  g as httpRequest
};
