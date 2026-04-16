import { is_function as I, noop as _ } from "../../../shared/utils.js";
import { effect as L } from "../../reactivity/effects.js";
import { active_effect as S, untrack as x } from "../../runtime.js";
import { loop as B } from "../../loop.js";
import { should_intro as M } from "../../render.js";
import { TRANSITION_GLOBAL as j } from "../../../../constants.js";
import { EFFECT_TRANSPARENT as q, BLOCK_EFFECT as G, REACTION_RAN as K } from "../../constants.js";
import { queue_micro_task as P } from "../task.js";
import { without_reactive_context as k } from "./bindings/shared.js";
function E(t, r) {
  k(() => {
    t.dispatchEvent(new CustomEvent(r));
  });
}
function U(t) {
  if (t === "float") return "cssFloat";
  if (t === "offset") return "cssOffset";
  if (t.startsWith("--")) return t;
  const r = t.split("-");
  return r.length === 1 ? r[0] : r[0] + r.slice(1).map(
    /** @param {any} word */
    (o) => o[0].toUpperCase() + o.slice(1)
  ).join("");
}
function R(t) {
  const r = {}, o = t.split(";");
  for (const i of o) {
    const [f, u] = i.split(":");
    if (!f || u === void 0) break;
    const e = U(f.trim());
    r[e] = u.trim();
  }
  return r;
}
const W = (t) => t;
function $(t, r, o, i) {
  var f = (t & j) !== 0, u = "both", e, h = r.inert, T = r.style.overflow, n, s;
  function p() {
    return k(() => e ??= o()(r, i?.() ?? /** @type {P} */
    {}, {
      direction: u
    }));
  }
  var d = {
    is_global: f,
    in() {
      r.inert = h, n = g(r, p(), s, 1, () => {
        E(r, "introend"), n?.abort(), n = e = void 0, r.style.overflow = T;
      });
    },
    out(c) {
      r.inert = !0, s = g(r, p(), n, 0, () => {
        E(r, "outroend"), c?.();
      });
    },
    stop: () => {
      n?.abort(), s?.abort();
    }
  }, m = (
    /** @type {Effect & { nodes: EffectNodes }} */
    S
  );
  if ((m.nodes.t ??= []).push(d), M) {
    var v = f;
    if (!v) {
      for (var a = (
        /** @type {Effect | null} */
        m.parent
      ); a && (a.f & q) !== 0; )
        for (; (a = a.parent) && (a.f & G) === 0; )
          ;
      v = !a || (a.f & K) !== 0;
    }
    v && L(() => {
      x(() => d.in());
    });
  }
}
function g(t, r, o, i, f) {
  var u = i === 1;
  if (I(r)) {
    var e, h = !1;
    return P(() => {
      if (!h) {
        var c = r({ direction: u ? "in" : "out" });
        e = g(t, c, o, i, f);
      }
    }), {
      abort: () => {
        h = !0, e?.abort();
      },
      deactivate: () => e.deactivate(),
      reset: () => e.reset(),
      t: () => e.t()
    };
  }
  if (o?.deactivate(), !r?.duration && !r?.delay)
    return E(t, u ? "introstart" : "outrostart"), f(), {
      abort: _,
      deactivate: _,
      reset: _,
      t: () => i
    };
  const { delay: T = 0, css: n, tick: s, easing: p = W } = r;
  var d = [];
  if (u && o === void 0 && (s && s(0, 1), n)) {
    var m = R(n(0, 1));
    d.push(m, m);
  }
  var v = () => 1 - i, a = t.animate(d, { duration: T, fill: "forwards" });
  return a.onfinish = () => {
    a.cancel(), E(t, u ? "introstart" : "outrostart");
    var c = o?.t() ?? 1 - i;
    o?.abort();
    var y = i - c, l = (
      /** @type {number} */
      r.duration * Math.abs(y)
    ), A = [];
    if (l > 0) {
      var C = !1;
      if (n)
        for (var N = Math.ceil(l / 16.666666666666668), b = 0; b <= N; b += 1) {
          var F = c + y * p(b / N), O = R(n(F, 1 - F));
          A.push(O), C ||= O.overflow === "hidden";
        }
      C && (t.style.overflow = "hidden"), v = () => {
        var w = (
          /** @type {number} */
          /** @type {globalThis.Animation} */
          a.currentTime
        );
        return c + y * p(w / l);
      }, s && B(() => {
        if (a.playState !== "running") return !1;
        var w = v();
        return s(w, 1 - w), !0;
      });
    }
    a = t.animate(A, { duration: l, fill: "forwards" }), a.onfinish = () => {
      v = () => i, s?.(i, 1 - i), f();
    };
  }, {
    abort: () => {
      a && (a.cancel(), a.effect = null, a.onfinish = _);
    },
    deactivate: () => {
      f = _;
    },
    reset: () => {
      i === 0 && s?.(1, 0);
    },
    t: () => v()
  };
}
export {
  $ as transition
};
