import { DIRTY as v, MAYBE_DIRTY as T, CLEAN as h, INERT as w, EFFECT as D, BLOCK_EFFECT as x, ERROR_VALUE as j, RENDER_EFFECT as z, MANAGED_EFFECT as G, REACTION_RAN as H, ROOT_EFFECT as I, BRANCH_EFFECT as F, DERIVED as N, DESTROYED as g, ASYNC as K } from "../constants.js";
import { deferred as Z, includes as J } from "../../shared/utils.js";
import { is_dirty as Y, update_effect as y, active_effect as P, active_reaction as S } from "../runtime.js";
import { effect_update_depth_exceeded as Q } from "../errors.js";
import { queue_micro_task as k } from "../dom/task.js";
import { invoke_error_boundary as W } from "../error-handling.js";
import { old_values as L } from "./sources.js";
import { unlink_effect as X } from "./effects.js";
import { defer_effect as $ } from "./utils.js";
import { UNINITIALIZED as tt } from "../../../constants.js";
import { set_signal_status as d } from "./status.js";
const p = /* @__PURE__ */ new Set();
let u = null, m = null, C = null, b = !1, E = null, R = null;
var M = 0;
let et = 1;
class A {
  // for debugging. TODO remove once async is stable
  id = et++;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<(batch: Batch) => void>}
   */
  #s = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #l = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #f = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #u = null;
  /**
   * The root effects that need to be flushed
   * @type {Effect[]}
   */
  #t = [];
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Set<Effect>}
   */
  #r = /* @__PURE__ */ new Set();
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Set<Effect>}
   */
  #e = /* @__PURE__ */ new Set();
  /**
   * A map of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`.
   * The value contains child effects that were dirty/maybe_dirty before being reset,
   * so they can be rescheduled if the branch survives.
   * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
   */
  #i = /* @__PURE__ */ new Map();
  is_fork = !1;
  #o = !1;
  #a() {
    return this.is_fork || this.#f > 0;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    this.#i.has(t) || this.#i.set(t, { d: [], m: [] });
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   */
  unskip_effect(t) {
    var e = this.#i.get(t);
    if (e) {
      this.#i.delete(t);
      for (var i of e.d)
        d(i, v), this.schedule(i);
      for (i of e.m)
        d(i, T), this.schedule(i);
    }
  }
  #h() {
    if (M++ > 1e3 && (p.delete(this), it()), !this.#a()) {
      for (const n of this.#r)
        this.#e.delete(n), d(n, v), this.schedule(n);
      for (const n of this.#e)
        d(n, T), this.schedule(n);
    }
    const t = this.#t;
    this.#t = [], this.apply();
    var e = E = [], i = [], r = R = [];
    for (const n of t)
      try {
        this.#c(n, e, i);
      } catch (l) {
        throw V(n), l;
      }
    if (u = null, r.length > 0) {
      var f = A.ensure();
      for (const n of r)
        f.schedule(n);
    }
    if (E = null, R = null, this.#a()) {
      this.#d(i), this.#d(e);
      for (const [n, l] of this.#i)
        U(n, l);
    } else {
      this.#l === 0 && p.delete(this), this.#r.clear(), this.#e.clear();
      for (const n of this.#s) n(this);
      this.#s.clear(), O(i), O(e), this.#u?.resolve();
    }
    var o = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      u
    );
    if (this.#t.length > 0) {
      const n = o ??= this;
      n.#t.push(...this.#t.filter((l) => !n.#t.includes(l)));
    }
    o !== null && (p.add(o), o.#h()), p.has(this) || this.#p();
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  #c(t, e, i) {
    t.f ^= h;
    for (var r = t.first; r !== null; ) {
      var f = r.f, o = (f & (F | I)) !== 0, n = o && (f & h) !== 0, l = n || (f & w) !== 0 || this.#i.has(r);
      if (!l && r.fn !== null) {
        o ? r.f ^= h : (f & D) !== 0 ? e.push(r) : Y(r) && ((f & x) !== 0 && this.#e.add(r), y(r));
        var a = r.first;
        if (a !== null) {
          r = a;
          continue;
        }
      }
      for (; r !== null; ) {
        var _ = r.next;
        if (_ !== null) {
          r = _;
          break;
        }
        r = r.parent;
      }
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #d(t) {
    for (var e = 0; e < t.length; e += 1)
      $(t[e], this.#r, this.#e);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} old_value
   */
  capture(t, e) {
    e !== tt && !this.previous.has(t) && this.previous.set(t, e), (t.f & j) === 0 && (this.current.set(t, t.v), m?.set(t, t.v));
  }
  activate() {
    u = this;
  }
  deactivate() {
    u = null, m = null;
  }
  flush() {
    try {
      b = !0, u = this, this.#h();
    } finally {
      M = 0, C = null, E = null, R = null, b = !1, u = null, m = null, L.clear();
    }
  }
  discard() {
    for (const t of this.#n) t(this);
    this.#n.clear();
  }
  #p() {
    for (const l of p) {
      var t = l.id < this.id, e = [];
      for (const [a, _] of this.current) {
        if (l.current.has(a))
          if (t && _ !== l.current.get(a))
            l.current.set(a, _);
          else
            continue;
        e.push(a);
      }
      if (e.length !== 0) {
        var i = [...l.current.keys()].filter((a) => !this.current.has(a));
        if (i.length > 0) {
          l.activate();
          var r = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
          for (var o of e)
            q(o, i, r, f);
          if (l.#t.length > 0) {
            l.apply();
            for (var n of l.#t)
              l.#c(n, [], []);
            l.#t = [];
          }
          l.deactivate();
        }
      }
    }
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#l += 1, t && (this.#f += 1);
  }
  /**
   * @param {boolean} blocking
   * @param {boolean} skip - whether to skip updates (because this is triggered by a stale reaction)
   */
  decrement(t, e) {
    this.#l -= 1, t && (this.#f -= 1), !(this.#o || e) && (this.#o = !0, k(() => {
      this.#o = !1, this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, e) {
    for (const i of t)
      this.#r.add(i);
    for (const i of e)
      this.#e.add(i);
    t.clear(), e.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    this.#s.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#n.add(t);
  }
  settled() {
    return (this.#u ??= Z()).promise;
  }
  static ensure() {
    if (u === null) {
      const t = u = new A();
      b || (p.add(u), k(() => {
        u === t && t.flush();
      }));
    }
    return u;
  }
  apply() {
    {
      m = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (C = t, t.b?.is_pending && (t.f & (D | z | G)) !== 0 && (t.f & H) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var e = t; e.parent !== null; ) {
      e = e.parent;
      var i = e.f;
      if (E !== null && e === P && (S === null || (S.f & N) === 0))
        return;
      if ((i & (I | F)) !== 0) {
        if ((i & h) === 0)
          return;
        e.f ^= h;
      }
    }
    this.#t.push(e);
  }
}
function it() {
  try {
    Q();
  } catch (s) {
    W(s, C);
  }
}
let c = null;
function O(s) {
  var t = s.length;
  if (t !== 0) {
    for (var e = 0; e < t; ) {
      var i = s[e++];
      if ((i.f & (g | w)) === 0 && Y(i) && (c = /* @__PURE__ */ new Set(), y(i), i.deps === null && i.first === null && i.nodes === null && i.teardown === null && i.ac === null && X(i), c?.size > 0)) {
        L.clear();
        for (const r of c) {
          if ((r.f & (g | w)) !== 0) continue;
          const f = [r];
          let o = r.parent;
          for (; o !== null; )
            c.has(o) && (c.delete(o), f.push(o)), o = o.parent;
          for (let n = f.length - 1; n >= 0; n--) {
            const l = f[n];
            (l.f & (g | w)) === 0 && y(l);
          }
        }
        c.clear();
      }
    }
    c = null;
  }
}
function q(s, t, e, i) {
  if (!e.has(s) && (e.add(s), s.reactions !== null))
    for (const r of s.reactions) {
      const f = r.f;
      (f & N) !== 0 ? q(
        /** @type {Derived} */
        r,
        t,
        e,
        i
      ) : (f & (K | x)) !== 0 && (f & v) === 0 && B(r, t, i) && (d(r, v), rt(
        /** @type {Effect} */
        r
      ));
    }
}
function B(s, t, e) {
  const i = e.get(s);
  if (i !== void 0) return i;
  if (s.deps !== null)
    for (const r of s.deps) {
      if (J.call(t, r))
        return !0;
      if ((r.f & N) !== 0 && B(
        /** @type {Derived} */
        r,
        t,
        e
      ))
        return e.set(
          /** @type {Derived} */
          r,
          !0
        ), !0;
    }
  return e.set(s, !1), !1;
}
function rt(s) {
  u.schedule(s);
}
function U(s, t) {
  if (!((s.f & F) !== 0 && (s.f & h) !== 0)) {
    (s.f & v) !== 0 ? t.d.push(s) : (s.f & T) !== 0 && t.m.push(s), d(s, h);
    for (var e = s.first; e !== null; )
      U(e, t), e = e.next;
  }
}
function V(s) {
  d(s, h);
  for (var t = s.first; t !== null; )
    V(t), t = t.next;
}
export {
  A as Batch,
  m as batch_values,
  E as collected_effects,
  u as current_batch,
  c as eager_block_effects,
  R as legacy_updates,
  rt as schedule_effect
};
