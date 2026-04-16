import { increment_write_version as B, is_dirty as O, update_effect as Y, push_reaction_value as b, active_reaction as _, untracking as x, current_sources as E, is_destroying_effect as y, active_effect as u, untracked_writes as d, set_untracked_writes as I } from "../runtime.js";
import { equals as M, safe_equals as S } from "./equality.js";
import { DERIVED as m, DIRTY as o, WAS_MARKED as C, CONNECTED as K, MAYBE_DIRTY as F, CLEAN as T, EAGER_EFFECT as k, BLOCK_EFFECT as A, ASYNC as L, BRANCH_EFFECT as z, ROOT_EFFECT as G } from "../constants.js";
import { state_unsafe_mutation as H } from "../errors.js";
import { includes as V } from "../../shared/utils.js";
import { proxy as W } from "../proxy.js";
import { Batch as j, batch_values as R, schedule_effect as J, legacy_updates as P, eager_block_effects as h } from "./batch.js";
import { is_runes as Q } from "../context.js";
import { execute_derived as U } from "./deriveds.js";
import { update_derived_status as X, set_signal_status as D } from "./status.js";
let c = /* @__PURE__ */ new Set();
const w = /* @__PURE__ */ new Map();
let g = !1;
function N(e, t) {
  var f = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: M,
    rv: 0,
    wv: 0
  };
  return f;
}
// @__NO_SIDE_EFFECTS__
function oe(e, t) {
  const f = N(e);
  return b(f), f;
}
// @__NO_SIDE_EFFECTS__
function ce(e, t = !1, f = !0) {
  const r = N(e);
  return t || (r.equals = S), r;
}
function Z(e, t, f = !1) {
  _ !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!x || (_.f & k) !== 0) && Q() && (_.f & (m | A | L | k)) !== 0 && (E === null || !V.call(E, e)) && H();
  let r = f ? W(t) : t;
  return $(e, r, P);
}
function $(e, t, f = null) {
  if (!e.equals(t)) {
    var r = e.v;
    y ? w.set(e, t) : w.set(e, r), e.v = t;
    var a = j.ensure();
    if (a.capture(e, r), (e.f & m) !== 0) {
      const n = (
        /** @type {Derived} */
        e
      );
      (e.f & o) !== 0 && U(n), R === null && X(n);
    }
    e.wv = B(), q(e, o, f), u !== null && (u.f & T) !== 0 && (u.f & (z | G)) === 0 && (d === null ? I([e]) : d.push(e)), !a.is_fork && c.size > 0 && !g && ee();
  }
  return t;
}
function ee() {
  g = !1;
  for (const e of c)
    (e.f & T) !== 0 && D(e, F), O(e) && Y(e);
  c.clear();
}
function me(e) {
  Z(e, e.v + 1);
}
function q(e, t, f) {
  var r = e.reactions;
  if (r !== null)
    for (var a = r.length, n = 0; n < a; n++) {
      var i = r[n], s = i.f, v = (s & o) === 0;
      if (v && D(i, t), (s & m) !== 0) {
        var p = (
          /** @type {Derived} */
          i
        );
        R?.delete(p), (s & C) === 0 && (s & K && (i.f |= C), q(p, F, f));
      } else if (v) {
        var l = (
          /** @type {Effect} */
          i
        );
        (s & A) !== 0 && h !== null && h.add(l), f !== null ? f.push(l) : J(l);
      }
    }
}
export {
  c as eager_effects,
  ee as flush_eager_effects,
  me as increment,
  $ as internal_set,
  ce as mutable_source,
  w as old_values,
  Z as set,
  N as source,
  oe as state
};
