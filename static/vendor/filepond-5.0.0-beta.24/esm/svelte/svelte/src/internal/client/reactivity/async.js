import { DESTROYED as s } from "../constants.js";
import { set_component_context as h, component_context as y } from "../context.js";
import { invoke_error_boundary as v } from "../error-handling.js";
import { active_effect as f, set_active_effect as g, set_active_reaction as b, active_reaction as D } from "../runtime.js";
import { current_batch as u } from "./batch.js";
import { derived as E, async_derived as P } from "./deriveds.js";
function z(t, r, n, o) {
  const a = E;
  var i = t.filter((e) => !e.settled);
  if (n.length === 0 && i.length === 0) {
    o(r.map(a));
    return;
  }
  var c = (
    /** @type {Effect} */
    f
  ), m = O(), p = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((e) => e.promise)) : null;
  function l(e) {
    m();
    try {
      o(e);
    } catch (k) {
      (c.f & s) === 0 && v(k, c);
    }
    d();
  }
  if (n.length === 0) {
    p.then(() => l(r.map(a)));
    return;
  }
  var x = R();
  function _() {
    Promise.all(n.map((e) => P(e))).then((e) => l([...r.map(a), ...e])).catch((e) => v(e, c)).finally(() => x());
  }
  p ? p.then(() => {
    m(), _(), d();
  }) : _();
}
function O() {
  var t = (
    /** @type {Effect} */
    f
  ), r = D, n = y, o = (
    /** @type {Batch} */
    u
  );
  return function(i = !0) {
    g(t), b(r), h(n), i && (t.f & s) === 0 && (o?.activate(), o?.apply());
  };
}
function d(t = !0) {
  g(null), b(null), h(null), t && u?.deactivate();
}
function R() {
  var t = (
    /** @type {Boundary} */
    /** @type {Effect} */
    f.b
  ), r = (
    /** @type {Batch} */
    u
  ), n = t.is_rendered();
  return t.update_pending_count(1, r), r.increment(n), (o = !1) => {
    t.update_pending_count(-1, r), r.decrement(n, o);
  };
}
export {
  O as capture,
  z as flatten,
  R as increment_pending,
  d as unset_context
};
