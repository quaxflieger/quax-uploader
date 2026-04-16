/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as v } from "./common/createExtension.js";
import { isDataTransfer as A, isDirectoryEntry as O } from "../utils/test.js";
import { Status as n } from "../common/status.js";
import { shouldLoadWithIdleCallback as U, readEntriesFromDataTransfer as m, dataTransferToFiles as k } from "../common/readEntriesFromDataTransfer.js";
import { flattenTree as w } from "../utils/tree.js";
import { createPerceivedPerformanceProxy as y } from "../common/perceivedPerformanceProxy.js";
const M = v(
  "DataTransferLoader",
  {
    actionLoad: "load",
    actionAbort: "abort",
    mode: "flatten"
  },
  (p, u) => {
    const { props: i, didSetProps: l } = p, {
      on: E,
      removeEntries: D,
      replaceEntry: T,
      pushTask: h,
      abortTasks: S,
      setEntryExtensionStatus: a,
      getEntryExtensionStatus: b
    } = u;
    let o = null;
    l(({ perceivedPerformance: r }) => {
      r === !0 ? o = {
        minDuration: 500,
        maxDuration: 750,
        minStep: 50,
        maxStep: 150
      } : r ? o = r : o = null;
    });
    async function g(r, { abortController: c }) {
      const { mode: d } = i;
      a(r, {
        type: n.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      let s;
      try {
        if (U(r.src)) {
          const x = await (o && !document.hidden ? y(m, {
            ...o
          }) : m)(r.src, {
            abortController: c,
            onprogress: ({ loaded: e, total: f }) => {
              a(r, {
                type: n.System,
                code: "LOAD_BUSY",
                progress: e / f,
                values: {
                  processed: e,
                  total: f
                }
              });
            },
            onabort: () => D(r)
          });
          d === "flatten" && (s = w(x, "entries").filter((e) => !O(e)).map((e) => ({
            src: e,
            origin: r.origin,
            containerId: r.id
          })));
        } else
          s = (await k(r.src)).map(
            (t) => ({
              src: t,
              origin: r.origin,
              containerId: r.id
            })
          );
      } catch (t) {
        throw a(r, {
          type: n.Error,
          code: "LOAD_ERROR",
          values: { error: t }
        }), t;
      }
      a(r, {
        type: n.Success,
        code: "LOAD_COMPLETE"
      }), T(r, s);
    }
    function L(r) {
      if (b(r)?.type === "error" || !A(r.src))
        return;
      const { actionAbort: s } = i;
      if (r.state[s]) {
        S(r.id);
        return;
      }
      h(r.id, g);
    }
    const P = E("updateEntry", L);
    return {
      destroy: () => {
        P();
      }
    };
  }
);
export {
  M as DataTransferLoader
};
