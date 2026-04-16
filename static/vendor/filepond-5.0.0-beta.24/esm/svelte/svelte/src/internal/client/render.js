import { init_operations as E, create_text as L } from "./dom/operations.js";
import { array_from as V } from "../shared/utils.js";
import { component_root as j } from "./reactivity/effects.js";
import { push as k, component_context as x, pop as z } from "./context.js";
import { boundary as N } from "./dom/blocks/boundary.js";
import { all_registered_events as P, root_event_handles as $, handle_event_propagation as y } from "./dom/elements/events.js";
import { is_passive_event as S } from "../../utils.js";
let _ = !0;
function I(e) {
  _ = e;
}
function J(e, r) {
  var n = r == null ? "" : typeof r == "object" ? `${r}` : r;
  n !== (e.__t ??= e.nodeValue) && (e.__t = n, e.nodeValue = `${n}`);
}
function K(e, r) {
  return W(e, r);
}
const s = /* @__PURE__ */ new Map();
function W(e, { target: r, anchor: n, props: h = {}, events: c, context: g, intro: M = !0, transformError: b }) {
  E();
  var p = void 0, C = j(() => {
    var a = n ?? r.appendChild(L());
    N(
      /** @type {TemplateNode} */
      a,
      {
        pending: () => {
        }
      },
      (i) => {
        k({});
        var o = (
          /** @type {ComponentContext} */
          x
        );
        g && (o.c = g), c && (h._$events = c), _ = M, p = e(i, h) || {}, _ = !0, z();
      },
      b
    );
    var l = /* @__PURE__ */ new Set(), u = (i) => {
      for (var o = 0; o < i.length; o++) {
        var t = i[o];
        if (!l.has(t)) {
          l.add(t);
          var f = S(t);
          for (const m of [r, document]) {
            var d = s.get(m);
            d === void 0 && (d = /* @__PURE__ */ new Map(), s.set(m, d));
            var w = d.get(t);
            w === void 0 ? (m.addEventListener(t, y, { passive: f }), d.set(t, 1)) : d.set(t, w + 1);
          }
        }
      }
    };
    return u(V(P)), $.add(u), () => {
      for (var i of l)
        for (const f of [r, document]) {
          var o = (
            /** @type {Map<string, number>} */
            s.get(f)
          ), t = (
            /** @type {number} */
            o.get(i)
          );
          --t == 0 ? (f.removeEventListener(i, y), o.delete(i), o.size === 0 && s.delete(f)) : o.set(i, t);
        }
      $.delete(u), a !== n && a.parentNode?.removeChild(a);
    };
  });
  return v.set(p, C), p;
}
let v = /* @__PURE__ */ new WeakMap();
function O(e, r) {
  const n = v.get(e);
  return n ? (v.delete(e), n(r)) : Promise.resolve();
}
export {
  K as mount,
  I as set_should_intro,
  J as set_text,
  _ as should_intro,
  O as unmount
};
