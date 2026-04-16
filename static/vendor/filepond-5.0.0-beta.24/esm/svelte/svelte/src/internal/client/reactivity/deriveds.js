import { WAS_MARKED as k, DERIVED as h, DESTROYED as D, STALE_REACTION as c, EFFECT_PRESERVED as q, DIRTY as C, REACTION_RAN as L, ERROR_VALUE as E, CLEAN as O } from "../constants.js";
import { increment_write_version as S, update_effect as P, set_active_effect as R, update_reaction as V, remove_reactions as z, active_reaction as p, active_effect as s, push_reaction_value as F, is_destroying_effect as M } from "../runtime.js";
import { equals as U, safe_equals as Y } from "./equality.js";
import { async_derived_orphan as K } from "../errors.js";
import { destroy_effect as W, destroy_effect_children as Z, async_effect as B, teardown as G, effect_tracking as H } from "./effects.js";
import { source as J, internal_set as y } from "./sources.js";
import { noop as Q, deferred as X } from "../../shared/utils.js";
import { component_context as $ } from "../context.js";
import { UNINITIALIZED as I } from "../../../constants.js";
import { current_batch as d, batch_values as A } from "./batch.js";
import { unset_context as b, increment_pending as ee } from "./async.js";
import { set_signal_status as te, update_derived_status as re } from "./status.js";
// @__NO_SIDE_EFFECTS__
function T(t) {
  var e = h | C, r = p !== null && (p.f & h) !== 0 ? (
    /** @type {Derived} */
    p
  ) : null;
  return s !== null && (s.f |= q), {
    ctx: $,
    deps: null,
    effects: null,
    equals: U,
    f: e,
    fn: t,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      I
    ),
    wv: 0,
    parent: r ?? s,
    ac: null
  };
}
// @__NO_SIDE_EFFECTS__
function he(t, e, r) {
  let m = (
    /** @type {Effect | null} */
    s
  );
  m === null && K();
  var _ = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), l = J(
    /** @type {V} */
    I
  ), j = !p, o = /* @__PURE__ */ new Map();
  return B(() => {
    var i = (
      /** @type {Effect} */
      s
    ), n = X();
    _ = n.promise;
    try {
      Promise.resolve(t()).then(n.resolve, n.reject).finally(b);
    } catch (a) {
      n.reject(a), b();
    }
    var f = (
      /** @type {Batch} */
      d
    );
    if (j) {
      if ((i.f & L) !== 0)
        var u = ee();
      if (
        /** @type {Boundary} */
        m.b.is_rendered()
      )
        o.get(f)?.reject(c), o.delete(f);
      else {
        for (const a of o.values())
          a.reject(c);
        o.clear();
      }
      o.set(f, n);
    }
    const g = (a, v = void 0) => {
      if (u) {
        var x = v === c;
        u(x);
      }
      if (!(v === c || (i.f & D) !== 0)) {
        if (f.activate(), v)
          l.f |= E, y(l, v);
        else {
          (l.f & E) !== 0 && (l.f ^= E), y(l, a);
          for (const [w, N] of o) {
            if (o.delete(w), w === f) break;
            N.reject(c);
          }
        }
        f.deactivate();
      }
    };
    n.promise.then(g, (a) => g(null, a || "unknown"));
  }), G(() => {
    for (const i of o.values())
      i.reject(c);
  }), new Promise((i) => {
    function n(f) {
      function u() {
        f === _ ? i(l) : n(_);
      }
      f.then(u, u);
    }
    n(_);
  });
}
// @__NO_SIDE_EFFECTS__
function ge(t) {
  const e = /* @__PURE__ */ T(t);
  return F(e), e;
}
// @__NO_SIDE_EFFECTS__
function we(t) {
  const e = /* @__PURE__ */ T(t);
  return e.equals = Y, e;
}
function ne(t) {
  var e = t.effects;
  if (e !== null) {
    t.effects = null;
    for (var r = 0; r < e.length; r += 1)
      W(
        /** @type {Effect} */
        e[r]
      );
  }
}
function fe(t) {
  for (var e = t.parent; e !== null; ) {
    if ((e.f & h) === 0)
      return (e.f & D) === 0 ? (
        /** @type {Effect} */
        e
      ) : null;
    e = e.parent;
  }
  return null;
}
function oe(t) {
  var e, r = s;
  R(fe(t));
  try {
    t.f &= ~k, ne(t), e = V(t);
  } finally {
    R(r);
  }
  return e;
}
function Re(t) {
  var e = t.v, r = oe(t);
  if (!t.equals(r) && (t.wv = S(), (!d?.is_fork || t.deps === null) && (t.v = r, d?.capture(t, e), t.deps === null))) {
    te(t, O);
    return;
  }
  M || (A !== null ? (H() || d?.is_fork) && A.set(t, r) : re(t));
}
function ye(t) {
  if (t.effects !== null)
    for (const e of t.effects)
      (e.teardown || e.ac) && (e.teardown?.(), e.ac?.abort(c), e.teardown = Q, e.ac = null, z(e, 0), Z(e));
}
function Ae(t) {
  if (t.effects !== null)
    for (const e of t.effects)
      e.teardown && P(e);
}
export {
  he as async_derived,
  T as derived,
  we as derived_safe_equal,
  ne as destroy_derived_effects,
  oe as execute_derived,
  ye as freeze_derived_effects,
  Ae as unfreeze_derived_effects,
  Re as update_derived,
  ge as user_derived
};
