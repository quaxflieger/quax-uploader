import { set_active_reaction as C, remove_reactions as I, active_reaction as s, untracking as k, active_effect as E, is_destroying_effect as g, update_effect as Y, get as B, set_is_destroying_effect as x } from "../runtime.js";
import { BRANCH_EFFECT as _, ROOT_EFFECT as p, HEAD_EFFECT as L, DESTROYING as R, DESTROYED as P, REACTION_RAN as G, CLEAN as A, INERT as a, EFFECT as m, EFFECT_PRESERVED as v, BLOCK_EFFECT as h, EFFECT_TRANSPARENT as d, DERIVED as H, RENDER_EFFECT as T, MANAGED_EFFECT as V, DIRTY as D, CONNECTED as K, ASYNC as M, USER_EFFECT as U, STALE_REACTION as j } from "../constants.js";
import { effect_orphan as q, effect_in_unowned_derived as z, effect_in_teardown as J } from "../errors.js";
import { get_next_sibling as b } from "../dom/operations.js";
import { component_context as O } from "../context.js";
import { collected_effects as N, Batch as w } from "./batch.js";
import { flatten as Q } from "./async.js";
import { without_reactive_context as W } from "../dom/elements/bindings/shared.js";
import { set_signal_status as F } from "./status.js";
function X(n) {
  E === null && (s === null && q(), z()), g && J();
}
function Z(n, t) {
  var r = t.last;
  r === null ? t.last = t.first = n : (r.next = n, n.prev = r, t.last = n);
}
function o(n, t) {
  var r = E;
  r !== null && (r.f & a) !== 0 && (n |= a);
  var e = {
    ctx: O,
    deps: null,
    nodes: null,
    f: n | D | K,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  }, l = e;
  if ((n & m) !== 0)
    N !== null ? N.push(e) : w.ensure().schedule(e);
  else if (t !== null) {
    try {
      Y(e);
    } catch (u) {
      throw f(e), u;
    }
    l.deps === null && l.teardown === null && l.nodes === null && l.first === l.last && // either `null`, or a singular child
    (l.f & v) === 0 && (l = l.first, (n & h) !== 0 && (n & d) !== 0 && l !== null && (l.f |= d));
  }
  if (l !== null && (l.parent = r, r !== null && Z(l, r), s !== null && (s.f & H) !== 0 && (n & p) === 0)) {
    var i = (
      /** @type {Derived} */
      s
    );
    (i.effects ??= []).push(l);
  }
  return e;
}
function En() {
  return s !== null && !k;
}
function pn(n) {
  const t = o(T, null);
  return F(t, A), t.teardown = n, t;
}
function mn(n) {
  X();
  var t = (
    /** @type {Effect} */
    E.f
  ), r = !s && (t & _) !== 0 && (t & G) === 0;
  if (r) {
    var e = (
      /** @type {ComponentContext} */
      O
    );
    (e.e ??= []).push(n);
  } else
    return $(n);
}
function $(n) {
  return o(m | U, n);
}
function hn(n) {
  w.ensure();
  const t = o(p | v, n);
  return (r = {}) => new Promise((e) => {
    r.outro ? ln(t, () => {
      f(t), e(void 0);
    }) : (f(t), e(void 0));
  });
}
function Tn(n) {
  return o(m, n);
}
function wn(n) {
  return o(M | v, n);
}
function Fn(n, t = 0) {
  return o(T | t, n);
}
function Cn(n, t = [], r = [], e = []) {
  Q(e, t, r, (l) => {
    o(T, () => n(...l.map(B)));
  });
}
function xn(n, t = 0) {
  var r = o(h | t, n);
  return r;
}
function Rn(n, t = 0) {
  var r = o(V | t, n);
  return r;
}
function Nn(n) {
  return o(_ | v, n);
}
function nn(n) {
  var t = n.teardown;
  if (t !== null) {
    const r = g, e = s;
    x(!0), C(null);
    try {
      t.call(null);
    } finally {
      x(r), C(e);
    }
  }
}
function rn(n, t = !1) {
  var r = n.first;
  for (n.first = n.last = null; r !== null; ) {
    const l = r.ac;
    l !== null && W(() => {
      l.abort(j);
    });
    var e = r.next;
    (r.f & p) !== 0 ? r.parent = null : f(r, t), r = e;
  }
}
function gn(n) {
  for (var t = n.first; t !== null; ) {
    var r = t.next;
    (t.f & _) === 0 && f(t), t = r;
  }
}
function f(n, t = !0) {
  var r = !1;
  (t || (n.f & L) !== 0) && n.nodes !== null && n.nodes.end !== null && (tn(
    n.nodes.start,
    /** @type {TemplateNode} */
    n.nodes.end
  ), r = !0), F(n, R), rn(n, t && !r), I(n, 0);
  var e = n.nodes && n.nodes.t;
  if (e !== null)
    for (const i of e)
      i.stop();
  nn(n), n.f ^= R, n.f |= P;
  var l = n.parent;
  l !== null && l.first !== null && en(n), n.next = n.prev = n.teardown = n.ctx = n.deps = n.fn = n.nodes = n.ac = null;
}
function tn(n, t) {
  for (; n !== null; ) {
    var r = n === t ? null : b(n);
    n.remove(), n = r;
  }
}
function en(n) {
  var t = n.parent, r = n.prev, e = n.next;
  r !== null && (r.next = e), e !== null && (e.prev = r), t !== null && (t.first === n && (t.first = e), t.last === n && (t.last = r));
}
function ln(n, t, r = !0) {
  var e = [];
  S(n, e, !0);
  var l = () => {
    r && f(n), t && t();
  }, i = e.length;
  if (i > 0) {
    var u = () => --i || l();
    for (var c of e)
      c.out(u);
  } else
    l();
}
function S(n, t, r) {
  if ((n.f & a) === 0) {
    n.f ^= a;
    var e = n.nodes && n.nodes.t;
    if (e !== null)
      for (const c of e)
        (c.is_global || r) && t.push(c);
    for (var l = n.first; l !== null; ) {
      var i = l.next, u = (l.f & d) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (l.f & _) !== 0 && (n.f & h) !== 0;
      S(l, t, u ? r : !1), l = i;
    }
  }
}
function An(n) {
  y(n, !0);
}
function y(n, t) {
  if ((n.f & a) !== 0) {
    n.f ^= a, (n.f & A) === 0 && (F(n, D), w.ensure().schedule(n));
    for (var r = n.first; r !== null; ) {
      var e = r.next, l = (r.f & d) !== 0 || (r.f & _) !== 0;
      y(r, l ? t : !1), r = e;
    }
    var i = n.nodes && n.nodes.t;
    if (i !== null)
      for (const u of i)
        (u.is_global || t) && u.in();
  }
}
function Dn(n, t) {
  if (n.nodes)
    for (var r = n.nodes.start, e = n.nodes.end; r !== null; ) {
      var l = r === e ? null : b(r);
      t.append(r), r = l;
    }
}
export {
  wn as async_effect,
  xn as block,
  Nn as branch,
  hn as component_root,
  $ as create_user_effect,
  gn as destroy_block_effect_children,
  f as destroy_effect,
  rn as destroy_effect_children,
  Tn as effect,
  En as effect_tracking,
  nn as execute_effect_teardown,
  Rn as managed,
  Dn as move_effect,
  ln as pause_effect,
  tn as remove_effect_dom,
  Fn as render_effect,
  An as resume_effect,
  pn as teardown,
  Cn as template_effect,
  en as unlink_effect,
  mn as user_effect,
  X as validate_effect
};
