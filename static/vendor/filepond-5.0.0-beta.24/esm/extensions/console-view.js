/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as I } from "./common/createExtension.js";
import { bytesToNaturalFileSize as P } from "../utils/file.js";
import { isDirectoryEntry as D, isNumber as G } from "../utils/test.js";
import { Status as u } from "../common/status.js";
import { clamp as N } from "../utils/math.js";
import { arrayRemoveFalsy as $ } from "../utils/array.js";
import { log as p, clear as R } from "../common/console.js";
import { toSpaceSeparatedString as T } from "../elements/common/string.js";
let S = 0;
const X = I(
  "ConsoleView",
  {
    clearBeforeLog: !1,
    debounce: !0
  },
  ({ props: w, extensionName: x }, C) => {
    const { on: b, insertEntries: F, updateEntry: L, removeEntries: B } = C;
    function m(e, r = /* @__PURE__ */ new WeakSet()) {
      if (e === null || typeof e != "object")
        return e;
      if (r.has(e))
        return null;
      if (r.add(e), Array.isArray(e))
        return e.map((o) => m(o, r));
      try {
        return structuredClone(e);
      } catch {
        if (/Error/.test(e.constructor.name))
          return {
            code: e.code,
            message: e.message
          };
        let t = {};
        for (const [l, a] of Object.entries(e))
          t[l] = m(a);
        return t;
      }
    }
    function O(e) {
      return m(e);
    }
    function U(e) {
      if (!G(e))
        return;
      if (e === 1 / 0)
        return "∞ busy";
      const r = N(e), o = 15, t = Math.round(r * o);
      return "█".repeat(t) + "░".repeat(o - t) + " " + Math.round(r * 100) + "%";
    }
    function k(e, r, o) {
      return !!e.status;
    }
    function d(e, r, o, t = "") {
      let l = "inherit";
      const f = $(Object.values(e.extension ?? {})).filter(k).map(({ status: n }) => {
        let E = [], s = l, h = "", c = "";
        return n.type === u.Warning && (c = "▲", s = "Orange"), n.type === u.Error && (c = "✖︎", s = "OrangeRed"), n.type === u.Success && (c = "✔", s = "YellowGreen"), n.type === u.Info && (c = "i", s = "SkyBlue"), n.type === u.System && (n.code.includes("BUSY") ? (c = "⧗", h = ` ${U(n.progress)}`) : n.code.includes("COMPLETE") ? c = "✔" : c = "•", s = "Grey"), E.push({ label: `${c} ${n.code}${h}`, color: s }), E;
      }).flat();
      let i = `%c%s %o	  %c${r}%c${o}%c${t} ${T(
        ...f.map(({ label: n }) => `%c ${n}`)
      )}`;
      i += " ".repeat(Math.max(0, 60 - i.length)) + "", p(
        ...$([
          i,
          "color:grey",
          e.id,
          { "🔍": O(e) },
          "color:grey",
          "color:" + l,
          "color:grey",
          ...f.flat().map(({ color: n }) => `color:${n}`)
        ])
      );
    }
    function A(e, r) {
      d(
        e,
        r,
        e.name ?? e?.state.src ?? "",
        // @ts-ignore
        "size" in e ? ` (${P(e.size)})` : ""
      );
    }
    function M(e, r) {
      d(e, r, e.name + "/");
    }
    function g(e, r, o) {
      e.forEach((t, l) => {
        let a = "";
        const f = l === e.length - 1;
        let i = [...o];
        if (r > 0 && (a = (f ? "└──" : "├──") + " "), D(t))
          return M(t, i.join("") + a), r > 0 && i.push(f ? "    " : "│   "), g(t.entries, r + 1, i);
        A(t, i.join("") + a);
      });
    }
    let y;
    function v(e) {
      const { debounce: r, clearBeforeLog: o } = w, t = () => {
        o && R(), (e.length > 1 || o) && p(`
 handleUpdateEntries(%o)

`, e), g(e, 0, []);
      };
      cancelAnimationFrame(y), r ? y = requestAnimationFrame(t) : t();
    }
    if (window) {
      const e = `$pond${S}`, r = window[e] = {
        insertEntries: F,
        removeEntries: B,
        updateEntry: L
      };
      p(
        `%c${x}: %cFilePond instance available for debugging at %cwindow%c.%c${e}`,
        "color:grey",
        "color:auto",
        "color:grey",
        "color:grey",
        "color:auto",
        { "🔍": r }
      ), S++;
    }
    const z = b("updateEntries", v);
    return {
      destroy: () => {
        z();
      }
    };
  }
);
export {
  X as ConsoleView
};
