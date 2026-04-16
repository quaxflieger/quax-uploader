import Q from "../../../../esm-env/false.js";
import { includes as N, index_of as X } from "../shared/utils.js";
import { destroy_block_effect_children as $, destroy_effect_children as d, execute_effect_teardown as rr, effect_tracking as fr } from "./reactivity/effects.js";
import { CONNECTED as m, REACTION_RAN as U, ERROR_VALUE as F, DERIVED as A, DIRTY as g, MAYBE_DIRTY as Y, DESTROYED as V, CLEAN as O, BLOCK_EFFECT as tr, MANAGED_EFFECT as er, BRANCH_EFFECT as lr, ROOT_EFFECT as ur, REACTION_IS_UPDATING as y, WAS_MARKED as z, STALE_REACTION as nr } from "./constants.js";
import { old_values as C } from "./reactivity/sources.js";
import { update_derived as G, unfreeze_derived_effects as K, freeze_derived_effects as _r, execute_derived as sr } from "./reactivity/deriveds.js";
import { tracing_mode_flag as or } from "../flags/index.js";
import { UNINITIALIZED as ir } from "../../constants.js";
import { set_component_context as M, is_runes as ar, component_context as vr } from "./context.js";
import { batch_values as b, current_batch as pr, schedule_effect as cr } from "./reactivity/batch.js";
import { handle_error as mr } from "./error-handling.js";
import { without_reactive_context as hr } from "./dom/elements/bindings/shared.js";
import { set_signal_status as k, update_derived_status as Er } from "./reactivity/status.js";
let D = !1, L = !1;
function Lr(r) {
  L = r;
}
let _ = null, c = !1;
function Sr(r) {
  _ = r;
}
let T = null;
function Yr(r) {
  T = r;
}
let p = null;
function Br(r) {
  _ !== null && (p === null ? p = [r] : p.push(r));
}
let s = null, i = 0, v = null;
function Mr(r) {
  v = r;
}
let H = 1, E = 0, I = E;
function Ur(r) {
  I = r;
}
function Vr() {
  return ++H;
}
function P(r) {
  var f = r.f;
  if ((f & g) !== 0)
    return !0;
  if (f & A && (r.f &= ~z), (f & Y) !== 0) {
    for (var e = (
      /** @type {Value[]} */
      r.deps
    ), u = e.length, l = 0; l < u; l++) {
      var t = e[l];
      if (P(
        /** @type {Derived} */
        t
      ) && G(
        /** @type {Derived} */
        t
      ), t.wv > r.wv)
        return !0;
    }
    (f & m) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    b === null && k(r, O);
  }
  return !1;
}
function W(r, f, e = !0) {
  var u = r.reactions;
  if (u !== null && !(p !== null && N.call(p, r)))
    for (var l = 0; l < u.length; l++) {
      var t = u[l];
      (t.f & A) !== 0 ? W(
        /** @type {Derived} */
        t,
        f,
        !1
      ) : f === t && (e ? k(t, g) : (t.f & O) !== 0 && k(t, Y), cr(
        /** @type {Effect} */
        t
      ));
    }
}
function Ar(r) {
  var f = s, e = i, u = v, l = _, t = p, n = vr, R = c, w = I, x = r.f;
  s = /** @type {null | Value[]} */
  null, i = 0, v = null, _ = (x & (lr | ur)) === 0 ? r : null, p = null, M(r.ctx), c = !1, I = ++E, r.ac !== null && (hr(() => {
    r.ac.abort(nr);
  }), r.ac = null);
  try {
    r.f |= y;
    var q = (
      /** @type {Function} */
      r.fn
    ), J = q();
    r.f |= U;
    var a = r.deps, B = pr?.is_fork;
    if (s !== null) {
      var o;
      if (B || S(r, i), a !== null && i > 0)
        for (a.length = i + s.length, o = 0; o < s.length; o++)
          a[i + o] = s[o];
      else
        r.deps = a = s;
      if (fr() && (r.f & m) !== 0)
        for (o = i; o < a.length; o++)
          (a[o].reactions ??= []).push(r);
    } else !B && a !== null && i < a.length && (S(r, i), a.length = i);
    if (ar() && v !== null && !c && a !== null && (r.f & (A | Y | g)) === 0)
      for (o = 0; o < /** @type {Source[]} */
      v.length; o++)
        W(
          v[o],
          /** @type {Effect} */
          r
        );
    if (l !== null && l !== r) {
      if (E++, l.deps !== null)
        for (let h = 0; h < e; h += 1)
          l.deps[h].rv = E;
      if (f !== null)
        for (const h of f)
          h.rv = E;
      v !== null && (u === null ? u = v : u.push(.../** @type {Source[]} */
      v));
    }
    return (r.f & F) !== 0 && (r.f ^= F), J;
  } catch (h) {
    return mr(h);
  } finally {
    r.f ^= y, s = f, i = e, v = u, _ = l, p = t, M(n), c = R, I = w;
  }
}
function Tr(r, f) {
  let e = f.reactions;
  if (e !== null) {
    var u = X.call(e, r);
    if (u !== -1) {
      var l = e.length - 1;
      l === 0 ? e = f.reactions = null : (e[u] = e[l], e.pop());
    }
  }
  if (e === null && (f.f & A) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (s === null || !N.call(s, f))) {
    var t = (
      /** @type {Derived} */
      f
    );
    (t.f & m) !== 0 && (t.f ^= m, t.f &= ~z), Er(t), _r(t), S(t, 0);
  }
}
function S(r, f) {
  var e = r.deps;
  if (e !== null)
    for (var u = f; u < e.length; u++)
      Tr(r, e[u]);
}
function zr(r) {
  var f = r.f;
  if ((f & V) === 0) {
    k(r, O);
    var e = T, u = D;
    T = r, D = !0;
    try {
      (f & (tr | er)) !== 0 ? $(r) : d(r), rr(r);
      var l = Ar(r);
      r.teardown = typeof l == "function" ? l : null, r.wv = H;
      var t;
      Q && or && (r.f & g) !== 0 && r.deps;
    } finally {
      D = u, T = e;
    }
  }
}
function Gr(r) {
  var f = r.f, e = (f & A) !== 0;
  if (_ !== null && !c) {
    var u = T !== null && (T.f & V) !== 0;
    if (!u && (p === null || !N.call(p, r))) {
      var l = _.deps;
      if ((_.f & y) !== 0)
        r.rv < E && (r.rv = E, s === null && l !== null && l[i] === r ? i++ : s === null ? s = [r] : s.push(r));
      else {
        (_.deps ??= []).push(r);
        var t = r.reactions;
        t === null ? r.reactions = [_] : N.call(t, _) || t.push(_);
      }
    }
  }
  if (L && C.has(r))
    return C.get(r);
  if (e) {
    var n = (
      /** @type {Derived} */
      r
    );
    if (L) {
      var R = n.v;
      return ((n.f & O) === 0 && n.reactions !== null || j(n)) && (R = sr(n)), C.set(n, R), R;
    }
    var w = (n.f & m) === 0 && !c && _ !== null && (D || (_.f & m) !== 0), x = (n.f & U) === 0;
    P(n) && (w && (n.f |= m), G(n)), w && !x && (K(n), Z(n));
  }
  if (b?.has(r))
    return b.get(r);
  if ((r.f & F) !== 0)
    throw r.v;
  return r.v;
}
function Z(r) {
  if (r.f |= m, r.deps !== null)
    for (const f of r.deps)
      (f.reactions ??= []).push(r), (f.f & A) !== 0 && (f.f & m) === 0 && (K(
        /** @type {Derived} */
        f
      ), Z(
        /** @type {Derived} */
        f
      ));
}
function j(r) {
  if (r.v === ir) return !0;
  if (r.deps === null) return !1;
  for (const f of r.deps)
    if (C.has(f) || (f.f & A) !== 0 && j(
      /** @type {Derived} */
      f
    ))
      return !0;
  return !1;
}
function Kr(r) {
  var f = c;
  try {
    return c = !0, r();
  } finally {
    c = f;
  }
}
export {
  T as active_effect,
  _ as active_reaction,
  p as current_sources,
  Gr as get,
  Vr as increment_write_version,
  L as is_destroying_effect,
  P as is_dirty,
  Br as push_reaction_value,
  S as remove_reactions,
  Yr as set_active_effect,
  Sr as set_active_reaction,
  Lr as set_is_destroying_effect,
  Mr as set_untracked_writes,
  Ur as set_update_version,
  Kr as untrack,
  v as untracked_writes,
  c as untracking,
  zr as update_effect,
  Ar as update_reaction,
  I as update_version,
  H as write_version
};
