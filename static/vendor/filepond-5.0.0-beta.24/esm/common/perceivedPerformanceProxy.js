/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { randomNumberBetween as f } from "../utils/math.js";
function p(u, l, a) {
  return new Promise((d) => {
    let m, c = f(a.minDuration, a.maxDuration);
    const i = Date.now(), r = !0, e = 1;
    let o = 0;
    l.signal.onabort = () => {
      clearTimeout(m);
    }, u({ lengthComputable: r, loaded: o, total: e });
    const P = () => {
      if (l.signal.aborted)
        return;
      const s = Date.now() - i;
      let t = f(a.minStep, a.maxStep);
      if (s + t > c && (t = s + t - c), o = s / c * e, u({
        lengthComputable: r,
        loaded: Math.min(o, e),
        total: e
      }), o >= e)
        return d();
      m = setTimeout(P, t);
    };
    P();
  });
}
function g(u, l) {
  return async function(a, {
    onprogress: d,
    onabort: m,
    abortController: c
  }) {
    const i = new AbortController();
    let r, e;
    function o() {
      if (!e || !r)
        return;
      const t = r.loaded / r.total, n = e.loaded / e.total;
      if (t < n)
        return d({ ...r, lengthComputable: !0 });
      d(e);
    }
    const P = p(
      (t) => {
        const n = l?.total || e?.total || 100;
        r = {
          lengthComputable: !0,
          loaded: Math.round(t.loaded * n),
          total: n
        }, o();
      },
      // if we abort we abort simulation as well
      i,
      l
    ), s = u(a, {
      onprogress: (t) => {
        e = t, o();
      },
      onabort: () => {
        i.abort(), m();
      },
      abortController: c
    });
    return new Promise((t, n) => {
      Promise.all([s, P]).then((b) => {
        t(b[0]);
      }).catch((b) => {
        i.abort(), n(b);
      });
    });
  };
}
export {
  g as createPerceivedPerformanceProxy
};
