import { BOUNDARY_EFFECT as m, EFFECT_TRANSPARENT as E, EFFECT_PRESERVED as F } from "../../constants.js";
import { set_component_context as g, component_context as x } from "../../context.js";
import { handle_error as R, invoke_error_boundary as a } from "../../error-handling.js";
import { block as S, branch as h, pause_effect as _, move_effect as T, destroy_effect as u } from "../../reactivity/effects.js";
import { active_effect as c, set_active_effect as v, set_active_reaction as y, active_reaction as w, get as D } from "../../runtime.js";
import { svelte_boundary_reset_noop as k } from "../../warnings.js";
import { create_text as A } from "../operations.js";
import { queue_micro_task as l } from "../task.js";
import { svelte_boundary_reset_onerror as B } from "../../errors.js";
import { current_batch as b, Batch as C } from "../../reactivity/batch.js";
import { internal_set as N, source as q } from "../../reactivity/sources.js";
import { createSubscriber as P } from "../../../../reactivity/create-subscriber.js";
import { defer_effect as j } from "../../reactivity/utils.js";
var O = E | F;
function Z(p, t, e, r) {
  new U(p, t, e, r);
}
class U {
  /** @type {Boundary | null} */
  parent;
  is_pending = !1;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #r;
  /** @type {TemplateNode | null} */
  #y = null;
  /** @type {BoundaryProps} */
  #s;
  /** @type {((anchor: Node) => void)} */
  #a;
  /** @type {Effect} */
  #t;
  /** @type {Effect | null} */
  #n = null;
  /** @type {Effect | null} */
  #e = null;
  /** @type {Effect | null} */
  #i = null;
  /** @type {DocumentFragment | null} */
  #h = null;
  #c = 0;
  #f = 0;
  #_ = !1;
  /** @type {Set<Effect>} */
  #p = /* @__PURE__ */ new Set();
  /** @type {Set<Effect>} */
  #d = /* @__PURE__ */ new Set();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #o = null;
  #v = P(() => (this.#o = q(this.#c), () => {
    this.#o = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, e, r, o) {
    this.#r = t, this.#s = e, this.#a = (s) => {
      var f = (
        /** @type {Effect} */
        c
      );
      f.b = this, f.f |= m, r(s);
    }, this.parent = /** @type {Effect} */
    c.b, this.transform_error = o ?? this.parent?.transform_error ?? ((s) => s), this.#t = S(() => {
      this.#m();
    }, O);
  }
  #b() {
    try {
      this.#n = h(() => this.#a(this.#r));
    } catch (t) {
      this.error(t);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #E(t) {
    const e = this.#s.failed;
    e && (this.#i = h(() => {
      e(
        this.#r,
        () => t,
        () => () => {
        }
      );
    }));
  }
  #F() {
    const t = this.#s.pending;
    t && (this.is_pending = !0, this.#e = h(() => t(this.#r)), l(() => {
      var e = this.#h = document.createDocumentFragment(), r = A();
      e.append(r), this.#n = this.#l(() => h(() => this.#a(r))), this.#f === 0 && (this.#r.before(e), this.#h = null, _(
        /** @type {Effect} */
        this.#e,
        () => {
          this.#e = null;
        }
      ), this.#u(
        /** @type {Batch} */
        b
      ));
    }));
  }
  #m() {
    try {
      if (this.is_pending = this.has_pending_snippet(), this.#f = 0, this.#c = 0, this.#n = h(() => {
        this.#a(this.#r);
      }), this.#f > 0) {
        var t = this.#h = document.createDocumentFragment();
        T(this.#n, t);
        const e = (
          /** @type {(anchor: Node) => void} */
          this.#s.pending
        );
        this.#e = h(() => e(this.#r));
      } else
        this.#u(
          /** @type {Batch} */
          b
        );
    } catch (e) {
      this.error(e);
    }
  }
  /**
   * @param {Batch} batch
   */
  #u(t) {
    this.is_pending = !1, t.transfer_effects(this.#p, this.#d);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    j(t, this.#p, this.#d);
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#s.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #l(t) {
    var e = c, r = w, o = x;
    v(this.#t), y(this.#t), g(this.#t.ctx);
    try {
      return C.ensure(), t();
    } catch (s) {
      return R(s), null;
    } finally {
      v(e), y(r), g(o);
    }
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  #g(t, e) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#g(t, e);
      return;
    }
    this.#f += t, this.#f === 0 && (this.#u(e), this.#e && _(this.#e, () => {
      this.#e = null;
    }), this.#h && (this.#r.before(this.#h), this.#h = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, e) {
    this.#g(t, e), this.#c += t, !(!this.#o || this.#_) && (this.#_ = !0, l(() => {
      this.#_ = !1, this.#o && N(this.#o, this.#c);
    }));
  }
  get_effect_pending() {
    return this.#v(), D(
      /** @type {Source<number>} */
      this.#o
    );
  }
  /** @param {unknown} error */
  error(t) {
    var e = this.#s.onerror;
    let r = this.#s.failed;
    if (!e && !r)
      throw t;
    this.#n && (u(this.#n), this.#n = null), this.#e && (u(this.#e), this.#e = null), this.#i && (u(this.#i), this.#i = null);
    var o = !1, s = !1;
    const f = () => {
      if (o) {
        k();
        return;
      }
      o = !0, s && B(), this.#i !== null && _(this.#i, () => {
        this.#i = null;
      }), this.#l(() => {
        this.#m();
      });
    }, d = (n) => {
      try {
        s = !0, e?.(n, f), s = !1;
      } catch (i) {
        a(i, this.#t && this.#t.parent);
      }
      r && (this.#i = this.#l(() => {
        try {
          return h(() => {
            var i = (
              /** @type {Effect} */
              c
            );
            i.b = this, i.f |= m, r(
              this.#r,
              () => n,
              () => f
            );
          });
        } catch (i) {
          return a(
            i,
            /** @type {Effect} */
            this.#t.parent
          ), null;
        }
      }));
    };
    l(() => {
      var n;
      try {
        n = this.transform_error(t);
      } catch (i) {
        a(i, this.#t && this.#t.parent);
        return;
      }
      n !== null && typeof n == "object" && typeof /** @type {any} */
      n.then == "function" ? n.then(
        d,
        /** @param {unknown} e */
        (i) => a(i, this.#t && this.#t.parent)
      ) : d(n);
    });
  }
}
export {
  U as Boundary,
  Z as boundary
};
