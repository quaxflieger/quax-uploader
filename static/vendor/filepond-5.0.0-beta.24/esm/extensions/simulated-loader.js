/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createProgressEvent as y } from "../utils/xhr.js";
import { isBlobOrFile as Q, isString as F, isNumber as Y } from "../utils/test.js";
import { createExtension as j } from "./common/createExtension.js";
import { Status as s } from "../common/status.js";
import { sleep as p } from "../utils/sleep.js";
import { log as q } from "../common/console.js";
const W = j(
  "SimulatedLoader",
  {
    actionLoad: "load",
    actionAbort: "abort",
    bitrate: 1024e3,
    tickrate: 250,
    connectionDelay: 250,
    errorDelay: void 0,
    parallel: 4,
    log: !0,
    fetchFile: void 0
  },
  ({ extensionName: L, props: E, didSetProps: A }, I) => {
    const {
      setEntryExtensionStatus: n,
      getEntryExtensionStatus: U,
      createProgressHandler: T,
      removeEntries: O,
      updateEntry: g,
      pushTask: h,
      abortTasks: x,
      on: R
    } = I;
    let k;
    A(({ bitrate: t = 1024e3, tickrate: e = 250 }) => {
      k = t / 8 * (e / 1e3);
    });
    async function _(t) {
      n(t, {
        type: s.System,
        code: "LOAD_QUEUED"
      });
    }
    async function P(t) {
      const { src: e, size: c = 1024 * 1024 } = t, { log: o, connectionDelay: a, errorDelay: i } = E;
      if (n(t, {
        type: s.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      }), await p(a), i) {
        await p(i);
        const r = "Simulated error";
        throw n(t, {
          type: s.Error,
          code: "LOAD_ERROR",
          values: { error: r }
        }), o && l(["did throw load info error", t.id]), r;
      }
      o && l(["did load info", t.id]), g(t, {
        name: e.split("/").pop(),
        type: "plain/text",
        size: c
      });
    }
    async function z(t, { abortController: e }) {
      const { src: c, size: o = 1024 * 1024 } = t, {
        log: a,
        actionLoad: i,
        actionAbort: r,
        tickrate: b,
        connectionDelay: w,
        fetchFile: m,
        errorDelay: S
      } = E;
      n(t, {
        type: s.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      const d = T(t);
      if (await p(w), S) {
        await p(S);
        const u = "Simulated error";
        throw n(t, {
          type: s.Error,
          code: "LOAD_ERROR",
          values: { error: u }
        }), a && l(["did throw load data error", t.id]), u;
      }
      return await new Promise((u) => {
        let f = 0;
        const v = setInterval(async () => {
          if (e.signal.aborted || (f = Math.min(o, f + k), d(y(!0, f, o)), f < o))
            return;
          d(y(!0, o, o)), clearInterval(v);
          let D;
          m ? D = await m(t, { abortController: e, onprogress: d, onabort }) : (await p(0), D = new File(["#".repeat(o)], c.split("/").pop(), {
            type: "plain/text"
          })), g(t, {
            file: D,
            state: {
              load: !1
            },
            extension: {
              [L]: {
                status: {
                  type: s.Success,
                  code: "LOAD_COMPLETE"
                }
              }
            }
          }), a && l(["did load data", t.id]), u();
        }, b);
        e.signal.onabort = () => {
          clearInterval(v), a && l(["did abort load data", t.id]), g(t, {
            state: {
              [i]: !1,
              [r]: !1
            }
          }), queueMicrotask(() => {
            O(t);
          });
        };
      });
    }
    function B(t) {
      const e = U(t), c = Object.keys(e).length > 0;
      if (e?.type === "error" || Q(t.file))
        return;
      const { src: a, name: i, size: r } = t, { actionLoad: b, actionAbort: w, parallel: m } = E, S = t.state[b], d = t.state[w];
      if (!F(a))
        return;
      if (d) {
        x(t.id), O(t);
        return;
      }
      if (S === !1)
        return;
      if (!(F(i) && Y(r))) {
        h(t.id, P);
        return;
      }
      if (!c) {
        h(t.id, _);
        return;
      }
      h(t.id, z, { parallel: m });
    }
    function l(t) {
      q("⧗", L, "(", ...t, ")");
    }
    const M = R("updateEntry", B);
    return {
      destroy: () => {
        M();
      }
    };
  }
);
export {
  W as SimulatedLoader
};
