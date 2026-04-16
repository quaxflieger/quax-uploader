/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import E from "./functionToBlob.js";
import { arrayRemoveInPlace as T } from "./array.js";
import { requestIdleCallback as M } from "./poly.js";
import { createObjectURL as O } from "./objectURL.js";
import { isString as I } from "./test.js";
const U = (o) => `function () {self.onmessage = function (message) {(${o.toString()}).apply(null, message.data.concat([function (err, response, transferList = []) {const message = { content: response, error: err };return self.postMessage(message, transferList);},{onprogress: function({ lengthComputable, loaded, total }) {self.postMessage({ type: 'progress', content: { lengthComputable, loaded, total }, error: null })}}]))}}`, a = [], n = [], A = 5e3;
function B(o, l) {
  return o ? `${o}/${l.fileName}Worker.js` : l;
}
function K(o, l, S = {}) {
  return new Promise((k, u) => {
    const v = navigator.hardwareConcurrency, p = ({ fn: s, args: h, options: y, promise: w }) => {
      const {
        abortController: g = new AbortController(),
        transferList: C = [],
        onabort: m,
        onprogress: R
      } = y, W = !I(s), f = W ? s.toString() : s;
      let e = a.find((r) => r.fnStr === f && !r.busy);
      if (!e) {
        if (a.filter((t) => t.busy).length >= v) {
          const t = {
            fn: s,
            fnStr: f,
            args: h,
            options: y,
            promise: { resolve: k, reject: u }
          };
          n.push(t), g.signal.onabort = () => {
            T(n, (c) => c === t), m && m();
          };
          return;
        }
        const r = W ? O(E(U(s))) : f, i = new window.Worker(r);
        i.addEventListener("error", u), e = {
          busy: !1,
          fnStr: f,
          url: r,
          worker: i,
          terminationTimeout: void 0,
          terminate: () => {
            clearTimeout(e.terminationTimeout), e.worker.terminate(), i.addEventListener("error", u), r.startsWith("blob:") && URL.revokeObjectURL(r), T(
              a,
              (t) => t === e
            ), n.length && p(n.shift());
          }
        }, a.find((t) => t.busy === !1)?.terminate(), a.push(e);
      }
      e.busy = !0, clearTimeout(e.terminationTimeout), e.worker.onmessage = function(r) {
        const { type: i, content: b, error: t } = r.data;
        if (i === "progress")
          return R && R(b);
        clearTimeout(e.terminationTimeout), e.terminationTimeout = setTimeout(() => {
          e.terminate();
        }, A), t ? w.reject(t) : w.resolve(b);
        const c = n.filter((d) => d.fnStr === e.fnStr);
        if (!c.length) {
          e.busy = !1;
          return;
        }
        const L = c.shift();
        T(n, (d) => d === L), M(() => {
          e.busy = !1, p(L);
        });
      }, e.worker.postMessage(h, C), g && (g.signal.onabort = () => {
        e.terminate(), m && m();
      });
    };
    p({ fn: o, args: l, options: S, promise: { resolve: k, reject: u } });
  });
}
export {
  B as createThreadWorker,
  K as thread
};
