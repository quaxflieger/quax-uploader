import { PROPS_IS_UPDATED as y, PROPS_IS_BINDABLE as A, PROPS_IS_IMMUTABLE as D, PROPS_IS_LAZY_INITIAL as E } from "../../../constants.js";
import { get_descriptor as P, is_function as c } from "../../shared/utils.js";
import { set as R } from "./sources.js";
import { derived as L, derived_safe_equal as T } from "./deriveds.js";
import { get as m, is_destroying_effect as B, active_effect as Y, untrack as j } from "../runtime.js";
import { props_invalid_value as K } from "../errors.js";
import { DESTROYED as M, STATE_SYMBOL as g, LEGACY_PROPS as w } from "../constants.js";
import { proxy as N } from "../proxy.js";
import { capture_store_binding as U } from "./store.js";
const $ = {
  get(e, r) {
    if (!e.exclude.includes(r))
      return e.props[r];
  },
  set(e, r) {
    return !1;
  },
  getOwnPropertyDescriptor(e, r) {
    if (!e.exclude.includes(r) && r in e.props)
      return {
        enumerable: !0,
        configurable: !0,
        value: e.props[r]
      };
  },
  has(e, r) {
    return e.exclude.includes(r) ? !1 : r in e.props;
  },
  ownKeys(e) {
    return Reflect.ownKeys(e.props).filter((r) => !e.exclude.includes(r));
  }
};
// @__NO_SIDE_EFFECTS__
function W(e, r, t) {
  return new Proxy(
    { props: e, exclude: r },
    $
  );
}
const q = {
  get(e, r) {
    let t = e.props.length;
    for (; t--; ) {
      let n = e.props[t];
      if (c(n) && (n = n()), typeof n == "object" && n !== null && r in n) return n[r];
    }
  },
  set(e, r, t) {
    let n = e.props.length;
    for (; n--; ) {
      let i = e.props[n];
      c(i) && (i = i());
      const u = P(i, r);
      if (u && u.set)
        return u.set(t), !0;
    }
    return !1;
  },
  getOwnPropertyDescriptor(e, r) {
    let t = e.props.length;
    for (; t--; ) {
      let n = e.props[t];
      if (c(n) && (n = n()), typeof n == "object" && n !== null && r in n) {
        const i = P(n, r);
        return i && !i.configurable && (i.configurable = !0), i;
      }
    }
  },
  has(e, r) {
    if (r === g || r === w) return !1;
    for (let t of e.props)
      if (c(t) && (t = t()), t != null && r in t) return !0;
    return !1;
  },
  ownKeys(e) {
    const r = [];
    for (let t of e.props)
      if (c(t) && (t = t()), !!t) {
        for (const n in t)
          r.includes(n) || r.push(n);
        for (const n of Object.getOwnPropertySymbols(t))
          r.includes(n) || r.push(n);
      }
    return r;
  }
};
function X(...e) {
  return new Proxy({ props: e }, q);
}
function k(e, r, t, n) {
  var i = (t & A) !== 0, u = (t & E) !== 0, a = (
    /** @type {V} */
    n
  ), _ = !0, h = () => (_ && (_ = !1, a = u ? j(
    /** @type {() => V} */
    n
  ) : (
    /** @type {V} */
    n
  )), a);
  let o;
  if (i) {
    var O = g in e || w in e;
    o = P(e, r)?.set ?? (O && r in e ? (f) => e[r] = f : void 0);
  }
  var s, S = !1;
  i ? [s, S] = U(() => (
    /** @type {V} */
    e[r]
  )) : s = /** @type {V} */
  e[r], s === void 0 && n !== void 0 && (s = h(), o && (K(), o(s)));
  var l;
  if (l = () => {
    var f = (
      /** @type {V} */
      e[r]
    );
    return f === void 0 ? h() : (_ = !0, f);
  }, (t & y) === 0)
    return l;
  if (o) {
    var I = e._$legacy;
    return (
      /** @type {() => V} */
      function(f, d) {
        return arguments.length > 0 ? ((!d || I || S) && o(d ? l() : f), f) : l();
      }
    );
  }
  var v = !1, p = ((t & D) !== 0 ? L : T)(() => (v = !1, l()));
  i && m(p);
  var x = (
    /** @type {Effect} */
    Y
  );
  return (
    /** @type {() => V} */
    function(f, d) {
      if (arguments.length > 0) {
        const b = d ? m(p) : i ? N(f) : f;
        return R(p, b), v = !0, a !== void 0 && (a = b), f;
      }
      return B && v || (x.f & M) !== 0 ? p.v : m(p);
    }
  );
}
export {
  k as prop,
  W as rest_props,
  X as spread_props
};
