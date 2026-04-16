/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createStoreExtension as k } from "./common/createStoreExtension.js";
import { isFileEntry as P, isFile as U } from "../utils/test.js";
import { getUniqueId as z } from "../utils/string.js";
import { createProgressEvent as I } from "../utils/xhr.js";
import { log as h } from "../common/console.js";
import { sleep as g } from "../utils/sleep.js";
import { noop as y } from "../utils/placeholder.js";
const H = k(
  "SimulatedStore",
  {
    bitrate: 1024e3,
    tickrate: 250,
    connectionDelay: 250,
    fetchStoredFile: void 0,
    log: !0
  },
  ({ extensionName: S, props: d, didSetProps: w }) => {
    let p;
    w(({ bitrate: e = 1024e3, tickrate: t = 250 }) => {
      p = e / 8 * (t / 1e3);
    });
    const a = /* @__PURE__ */ new Map();
    async function v(e, { abortController: t, onprogress: n, onabort: o }) {
      if (!P(e) || !U(e.file))
        return;
      let r;
      t.signal.onabort = () => {
        clearInterval(r), o();
      };
      const { log: s, connectionDelay: f, tickrate: m, onstore: b = y } = d;
      if (await g(f), t.signal.aborted)
        return;
      const u = e.size;
      return await new Promise((x, D) => {
        let l = 0;
        r = setInterval(() => {
          if (!t.signal.aborted) {
            l = Math.min(u, l + p);
            try {
              b(l / u);
            } catch (c) {
              s && i(["error during store operation"]), clearInterval(r), D(c);
              return;
            }
            if (n(I(!0, l, u)), l === u) {
              const c = z();
              a.set(c, e), s && i(["did store", c]), clearInterval(r), x(c);
            }
          }
        }, m);
      });
    }
    async function E(e, t, n) {
      const {
        log: o,
        connectionDelay: r,
        fetchStoredFile: s = () => new File(["Simulated"], "Untitled.txt", { type: "plain/text" }),
        onrestore: f = y
      } = d;
      await g(r);
      try {
        f();
      } catch (m) {
        throw o && i(["error during restore operation"]), m;
      }
      return a.has(e) ? (o && i(["did restore", e]), a.get(e)) : await s(e, t, n);
    }
    async function F(e) {
      const { log: t, connectionDelay: n, onrelease: o = y } = d;
      await g(n);
      try {
        o();
      } catch (r) {
        throw t && i(["error during release operation"]), r;
      }
      return a.delete(e), t && i(["did release", e]), !0;
    }
    function i(e) {
      h("⛃", S, "(", ...e, ")"), Array.from(a).forEach(([t, n], o, r) => {
        h(" ", o < r.length - 1 ? "├─" : "└─", t, n);
      });
    }
    return {
      storeEntry: v,
      restoreEntry: E,
      releaseEntry: F
    };
  }
);
export {
  H as SimulatedStore
};
