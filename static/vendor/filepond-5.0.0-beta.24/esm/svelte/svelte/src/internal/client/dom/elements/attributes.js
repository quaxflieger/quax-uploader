import { LOADING_ATTR_SYMBOL as j, IS_XHTML as I } from "../../constants.js";
import { NAMESPACE_HTML as V, ATTACHMENT_KEY as Y, UNINITIALIZED as B } from "../../../../constants.js";
import { set_active_reaction as C, set_active_effect as M, active_reaction as D, active_effect as z, get as K } from "../../runtime.js";
import { get_prototype_of as X, get_descriptors as Z } from "../../../shared/utils.js";
import { managed as q, destroy_effect as P, branch as F, effect as J } from "../../reactivity/effects.js";
import { flatten as Q } from "../../reactivity/async.js";
import { delegated as W, delegate as x, create_event as tt } from "./events.js";
import { autofocus as et } from "./misc.js";
import { is_capture_event as it, normalize_attribute as st, can_delegate_event as rt } from "../../../../utils.js";
import { attach as ot } from "./attachments.js";
import { clsx as ft } from "../../../shared/attributes.js";
import { set_class as at } from "./class.js";
import { set_style as ct } from "./style.js";
import { select_option as R, init_select as ut } from "./bindings/select.js";
const g = Symbol("class"), A = Symbol("style"), G = Symbol("is custom element"), H = Symbol("is html"), lt = I ? "option" : "OPTION", nt = I ? "select" : "SELECT", _t = I ? "progress" : "PROGRESS";
function kt(t, i) {
  var e = T(t);
  e.value === (e.value = // treat null and undefined the same for the initial value
  i ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  t.value === i && (i !== 0 || t.nodeName !== _t) || (t.value = i ?? "");
}
function wt(t, i) {
  var e = T(t);
  e.checked !== (e.checked = // treat null and undefined the same for the initial value
  i ?? void 0) && (t.checked = i);
}
function vt(t, i) {
  i ? t.hasAttribute("selected") || t.setAttribute("selected", "") : t.removeAttribute("selected");
}
function L(t, i, e, l) {
  var u = T(t);
  u[i] !== (u[i] = e) && (i === "loading" && (t[j] = e), e == null ? t.removeAttribute(i) : typeof e != "string" && k(t).includes(i) ? t[i] = e : t.setAttribute(i, e));
}
function Ct(t, i, e) {
  var l = D, u = z;
  C(null), M(null);
  try {
    // `style` should use `set_attribute` rather than the setter
    i !== "style" && // Don't compute setters for custom elements while they aren't registered yet,
    // because during their upgrade/instantiation they might add more setters.
    // Instead, fall back to a simple "an object, then set as property" heuristic.
    (O.has(t.getAttribute("is") || t.nodeName) || // customElements may not be available in browser extension contexts
    !customElements || customElements.get(t.getAttribute("is") || t.nodeName.toLowerCase()) ? k(t).includes(i) : e && typeof e == "object") ? t[i] = e : L(t, i, e == null ? e : String(e));
  } finally {
    C(l), M(u);
  }
}
function dt(t, i, e, l, u = !1, S = !1) {
  var n = T(t), b = n[G], N = !n[H], f = i || {}, v = t.nodeName === lt;
  for (var y in i)
    y in e || (e[y] = null);
  e.class ? e.class = ft(e.class) : e[g] && (e.class = null), e[A] && (e.style ??= null);
  var m = k(t);
  for (const r in e) {
    let o = e[r];
    if (v && r === "value" && o == null) {
      t.value = t.__value = "", f[r] = o;
      continue;
    }
    if (r === "class") {
      var E = t.namespaceURI === "http://www.w3.org/1999/xhtml";
      at(t, E, o, l, i?.[g], e[g]), f[r] = o, f[g] = e[g];
      continue;
    }
    if (r === "style") {
      ct(t, o, i?.[A], e[A]), f[r] = o, f[A] = e[A];
      continue;
    }
    var _ = f[r];
    if (!(o === _ && !(o === void 0 && t.hasAttribute(r)))) {
      f[r] = o;
      var h = r[0] + r[1];
      if (h !== "_$")
        if (h === "on") {
          const c = {}, p = "_$" + r;
          let a = r.slice(2);
          var d = rt(a);
          if (it(a) && (a = a.slice(0, -7), c.capture = !0), !d && _) {
            if (o != null) continue;
            t.removeEventListener(a, f[p], c), f[p] = null;
          }
          if (d)
            W(a, t, o), x([a]);
          else if (o != null) {
            let U = function($) {
              f[r].call(this, $);
            };
            f[p] = tt(a, t, U, c);
          }
        } else if (r === "style")
          L(t, r, o);
        else if (r === "autofocus")
          et(
            /** @type {HTMLElement} */
            t,
            !!o
          );
        else if (!b && (r === "__value" || r === "value" && o != null))
          t.value = t.__value = o;
        else if (r === "selected" && v)
          vt(
            /** @type {HTMLOptionElement} */
            t,
            o
          );
        else {
          var s = r;
          N || (s = st(s));
          var w = s === "defaultValue" || s === "defaultChecked";
          if (o == null && !b && !w)
            if (n[r] = null, s === "value" || s === "checked") {
              let c = (
                /** @type {HTMLInputElement} */
                t
              );
              const p = i === void 0;
              if (s === "value") {
                let a = c.defaultValue;
                c.removeAttribute(s), c.defaultValue = a, c.value = c.__value = p ? a : null;
              } else {
                let a = c.defaultChecked;
                c.removeAttribute(s), c.defaultChecked = a, c.checked = p ? a : !1;
              }
            } else
              t.removeAttribute(r);
          else w || m.includes(s) && (b || typeof o != "string") ? (t[s] = o, s in n && (n[s] = B)) : typeof o != "function" && L(t, s, o);
        }
    }
  }
  return f;
}
function Mt(t, i, e = [], l = [], u = [], S, n = !1, b = !1) {
  Q(u, e, l, (N) => {
    var f = void 0, v = {}, y = t.nodeName === nt, m = !1;
    if (q(() => {
      var _ = i(...N.map(K)), h = dt(
        t,
        f,
        _,
        S,
        n,
        b
      );
      m && y && "value" in _ && R(
        /** @type {HTMLSelectElement} */
        t,
        _.value
      );
      for (let s of Object.getOwnPropertySymbols(v))
        _[s] || P(v[s]);
      for (let s of Object.getOwnPropertySymbols(_)) {
        var d = _[s];
        s.description === Y && (!f || d !== f[s]) && (v[s] && P(v[s]), v[s] = F(() => ot(t, () => d))), h[s] = d;
      }
      f = h;
    }), y) {
      var E = (
        /** @type {HTMLSelectElement} */
        t
      );
      J(() => {
        R(
          E,
          /** @type {Record<string | symbol, any>} */
          f.value,
          !0
        ), ut(E);
      });
    }
    m = !0;
  });
}
function T(t) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    t.__attributes ??= {
      [G]: t.nodeName.includes("-"),
      [H]: t.namespaceURI === V
    }
  );
}
var O = /* @__PURE__ */ new Map();
function k(t) {
  var i = t.getAttribute("is") || t.nodeName, e = O.get(i);
  if (e) return e;
  O.set(i, e = []);
  for (var l, u = t, S = Element.prototype; S !== u; ) {
    l = Z(u);
    for (var n in l)
      l[n].set && e.push(n);
    u = X(u);
  }
  return e;
}
export {
  g as CLASS,
  A as STYLE,
  Mt as attribute_effect,
  L as set_attribute,
  wt as set_checked,
  Ct as set_custom_element_data,
  vt as set_selected,
  kt as set_value
};
