/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { arrayRemoveInPlace as p } from "../utils/array.js";
import { pubsub as z } from "../utils/pubsub.js";
import { isString as J, isFunction as h } from "../utils/test.js";
const o = {
  QUEUED: 1,
  ACTIVE: 2,
  FAILED: 3,
  HALTED: 4
};
function Y(v) {
  const { log: g = void 0 } = v ?? {}, { on: C, pub: u } = z(), s = [], a = /* @__PURE__ */ new Map();
  function F(t) {
    return t.state === o.QUEUED || t.state === o.ACTIVE;
  }
  function E(t) {
    return t.state === o.QUEUED;
  }
  function Q(t) {
    return t.state === o.ACTIVE;
  }
  function L(t, n) {
    return J(t) && h(n);
  }
  function m(t, n) {
    let r = 0;
    for (let e = 0; e < n.length; e++)
      t.order >= n[e].order && (r = e + 1);
    n.splice(r, 0, t);
  }
  function B(t) {
    m(t, s);
    let n = a.get(t.group);
    n || (n = [], a.set(t.group, n)), m(t, n);
  }
  function d(t) {
    p(
      s,
      (r) => r.group === t.group && r.fn === t.fn
    );
    const n = a.get(t.group);
    n && p(n, (r) => r.fn === t.fn);
  }
  function H(t) {
    p(s, (n) => n.group === t), a.delete(t);
  }
  function f(t) {
    return a.get(t) ?? [];
  }
  function A(t, n) {
    return f(t)[0].state === n;
  }
  function q(t) {
    return f(t).filter(F).length > 0;
  }
  function V(t) {
    const n = f(t);
    for (const r of n)
      U(r);
  }
  function S(t) {
    return f(t).filter(E)[0];
  }
  function b(t, n) {
    const r = f(t);
    if (r)
      return r.find((e) => e.fn === n);
  }
  function I(t, n, r) {
    const { isSoftFailure: e = !1 } = r || {}, c = a.get(t) ?? [];
    for (const i of c)
      e && i.ignoreSoftFailure || (i.state = n);
  }
  function w() {
    return Array.from(new Set(s.map((t) => t.group)));
  }
  function N() {
    return a.keys();
  }
  function R() {
    return s.filter(E).length > 0;
  }
  function P() {
    return s.filter(Q);
  }
  function M(t) {
    return P().filter((n) => n.fn === t.fn);
  }
  function y(t) {
    return t ? t.parallel === 1 / 0 || M(t).length < t.parallel : !1;
  }
  function l() {
    queueMicrotask(D);
  }
  function D() {
    if (!R()) {
      g?.(s), u("idle");
      return;
    }
    g?.(s);
    const t = w();
    for (const n of t) {
      if (!A(n, o.QUEUED)) {
        if (A(n, o.HALTED)) {
          const e = S(n);
          if (!e || e.ignoreSoftFailure === !1 || !y(e))
            continue;
          G(e);
        }
        continue;
      }
      const r = S(n);
      y(r) && G(r);
    }
  }
  async function G(t) {
    const { group: n, fn: r, params: e, abortController: c } = t;
    t.state = o.ACTIVE;
    try {
      const i = h(e) ? e() : e, T = await r(...i, { abortController: c });
      d(t), T === !1 && I(n, o.HALTED, { isSoftFailure: !0 });
    } catch (i) {
      u("error", i), I(n, o.HALTED), t.state = o.FAILED;
    }
    q(n) || u("complete", n), l();
  }
  function U(t) {
    t.abortController.signal.aborted || t.abortController.abort();
  }
  function W(t, n, r) {
    const {
      parallel: e = 1 / 0,
      order: c = 0,
      params: i = [],
      ignoreSoftFailure: T = !1
    } = r ?? {};
    if (!L(t, n))
      return;
    const k = b(t, n);
    if (k) {
      k?.state === o.FAILED && (k.state = o.QUEUED, D());
      return;
    }
    B({
      group: t,
      fn: n,
      params: i,
      order: c,
      parallel: e,
      ignoreSoftFailure: T,
      state: o.QUEUED,
      abortController: new AbortController()
    }), l();
  }
  function j(t, n) {
    const r = b(t, n);
    r && (U(r), d(r), l());
  }
  function x(t) {
    if (!t) {
      for (const n of N())
        x(n);
      return;
    }
    V(t), H(t), u("abort", t), u("complete", t), l();
  }
  return {
    on: C,
    pushTask: W,
    abortTask: j,
    abortTasks: x
  };
}
export {
  Y as createTaskScheduler
};
