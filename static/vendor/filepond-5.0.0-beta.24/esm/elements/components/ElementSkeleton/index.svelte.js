/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { onDestroy as I } from "../../../svelte/svelte/src/index-client.js";
import { user_effect as p, template_effect as O } from "../../../svelte/svelte/src/internal/client/reactivity/effects.js";
import { pop as T, push as F } from "../../../svelte/svelte/src/internal/client/context.js";
import { get as e } from "../../../svelte/svelte/src/internal/client/runtime.js";
import { child as L, sibling as R } from "../../../svelte/svelte/src/internal/client/dom/operations.js";
import { state as f, set as r } from "../../../svelte/svelte/src/internal/client/reactivity/sources.js";
import { from_html as b, append as g } from "../../../svelte/svelte/src/internal/client/dom/template.js";
import { if_block as W } from "../../../svelte/svelte/src/internal/client/dom/blocks/if.js";
import { snippet as w } from "../../../svelte/svelte/src/internal/client/dom/blocks/snippet.js";
import { attach as D } from "../../../svelte/svelte/src/internal/client/dom/elements/attachments.js";
import { clsx as K } from "../../../svelte/svelte/src/internal/shared/attributes.js";
import { set_class as M } from "../../../svelte/svelte/src/internal/client/dom/elements/class.js";
import { set_style as P } from "../../../svelte/svelte/src/internal/client/dom/elements/style.js";
import { bind_this as j } from "../../../svelte/svelte/src/internal/client/dom/elements/bindings/this.js";
import { prop as c } from "../../../svelte/svelte/src/internal/client/reactivity/props.js";
import { removeAttributes as q } from "../../../utils/dom.js";
import { transitions as B } from "../../attachments/transitions.js";
import { getSkeletonInstanceIndex as G } from "./index.js";
var H = b("<skeleton-pane></skeleton-pane>", 2), J = b("<element-skeleton><!><!></element-skeleton>", 2);
function de(N, i) {
  F(i, !0);
  let S = c(i, "class", 3, void 0), x = c(i, "isWaiting", 3, !0), u = c(i, "isFrozen", 3, !1);
  const z = G();
  let o = f(void 0), a = f(!0), s = f("active");
  const m = new MutationObserver(([t]) => {
    h(e(o)) && (r(s, "ready"), m.disconnect());
  });
  let v = !1;
  p(() => {
    v || (h(e(o)) ? (r(a, !1), r(s, "ready")) : m.observe(e(o), { childList: !0 }), v = !0);
  }), p(() => {
    !x() && !u() && (r(a, !1), r(s, "ready")), u() && r(s, "frozen");
  });
  function h(t) {
    return Array.from(t.childNodes).filter((n) => n.nodeType === 3 ? n.textContent.length > 0 : n.nodeType === 1 && n.nodeName !== "SKELETON-PANE").length > 0;
  }
  const A = ["ready", "active", "frozen"];
  p(() => {
    q(e(o), A), e(o).setAttribute(e(s), "");
  });
  let _ = f(!1);
  I(() => {
    m.disconnect();
  });
  var l = J();
  let k;
  var y = L(l);
  w(y, () => i.children);
  var E = R(y);
  {
    var C = (t) => {
      var d = H();
      D(d, () => B({
        opacity: {
          end: (n) => {
            n === "0" && r(_, !0);
          }
        }
      })), g(t, d);
    };
    W(E, (t) => {
      e(a) && !e(_) && t(C);
    });
  }
  j(l, (t) => r(o, t), () => e(o)), O(() => {
    M(l, 1, K(S())), k = P(l, "", k, { "--skeleton-offset": z });
  }), g(N, l), T();
}
export {
  de as default
};
