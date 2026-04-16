/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { onMount as p, onDestroy as E } from "../../../../../svelte/svelte/src/index-client.js";
import { user_effect as w } from "../../../../../svelte/svelte/src/internal/client/reactivity/effects.js";
import { push as G, pop as J } from "../../../../../svelte/svelte/src/internal/client/context.js";
import { get as e } from "../../../../../svelte/svelte/src/internal/client/runtime.js";
import { state as f, set as n } from "../../../../../svelte/svelte/src/internal/client/reactivity/sources.js";
import { from_html as K, append as N } from "../../../../../svelte/svelte/src/internal/client/dom/template.js";
import { user_derived as v } from "../../../../../svelte/svelte/src/internal/client/reactivity/deriveds.js";
import { bind_this as V } from "../../../../../svelte/svelte/src/internal/client/dom/elements/bindings/this.js";
import { prop as m } from "../../../../../svelte/svelte/src/internal/client/reactivity/props.js";
import { isFirefox as X } from "../../../../../utils/test.js";
import { createObjectURL as Y } from "../../../../../utils/objectURL.js";
import { getImageSize as Z } from "../../../../../utils/media.js";
import { getAppContext as $ } from "../../../contexts/appContext.js";
import { getBitmapCacheItem as ee, setBitmapCacheItem as z } from "./BitmapRendererCache.js";
import { thread as te, createThreadWorker as ie } from "../../../../../utils/thread.js";
import { transformImage as re } from "../../../../../workers/transformImage.js";
var ae = K('<canvas width="0" height="0"></canvas>');
function Re(B, t) {
  G(t, !0);
  let k = m(t, "taskIgnoreSoftFailure", 3, !1), g = m(t, "maximumPixels", 3, 1024 * 1024), D = m(t, "resizeQuality", 3, "medium"), O = m(t, "workersURL", 3, void 0), T = m(t, "oninit", 3, void 0), R = m(t, "onload", 3, void 0), W = m(t, "onrender", 3, void 0), y = m(t, "onerror", 3, void 0);
  const j = () => Y(t.file), x = () => t.file.type !== "image/svg+xml", { size: l, canvas: c } = ee(t.file) ?? {};
  let r = l?.width, a = l?.height, S = f(!!l), b = f(!!l), I = f(!!c), u = f(!1);
  w(() => {
    e(u) && W()?.({ didRestore: !!c });
  });
  const { pushTask: C, abortTask: L } = $();
  let d = f(void 0), i = f(void 0);
  const q = v(() => !!e(i)), P = v(() => e(q) && !e(S)), Q = v(() => e(q) && e(b) && !e(I));
  async function A(o, { abortController: h }) {
    n(I, !0);
    try {
      const s = await te(
        ie(O(), re),
        [
          t.file,
          null,
          {
            resizeWidth: r,
            resizeHeight: a,
            resizeQuality: D(),
            imageOrientation: "from-image"
          }
        ],
        { abortController: h }
      );
      e(i).width = r, e(i).height = a, e(i).getContext("bitmaprenderer")?.transferFromImageBitmap(s), z(t.file, { size: { width: r, height: a }, canvas: e(i) }), n(u, !0);
    } catch (s) {
      y()?.(s);
    }
  }
  async function H() {
    n(I, !0), n(d, new Image()), e(d).src = j(), await e(d).decode(), e(i).width = r, e(i).height = a, e(i).getContext("2d")?.drawImage(e(d), 0, 0, r, a), z(t.file, { size: { width: r, height: a }, canvas: e(i) }), n(u, !0);
  }
  const F = X() || !x() ? H : A;
  async function M() {
    n(S, !0);
    let o;
    try {
      o = await Z(t.file);
    } catch (_) {
      throw y()?.(_), _;
    }
    let h = 1;
    const s = o.width * o.height;
    g() && (s > g() || !x()) && (h = Math.sqrt(g()) / Math.sqrt(s)), r = Math.floor(o.width * h), a = Math.floor(o.height * h), R()?.({ width: r, height: a }), e(i).width = r, e(i).height = a, z(t.file, { size: { width: r, height: a }, canvas: null }), n(b, !0);
  }
  w(() => {
    e(P) && C(t.taskId, M, { parallel: 1, ignoreSoftFailure: k() });
  }), w(() => {
    e(Q) && C(t.taskId, F, { parallel: 1, ignoreSoftFailure: k() });
  }), p(() => {
    T()?.(), l && (R()?.({ width: r, height: a }), c && (e(i).replaceWith(c), n(u, !0)));
  }), E(() => {
    L(t.taskId, M), L(t.taskId, F), e(d) && URL.revokeObjectURL(e(d).src);
  });
  var U = ae();
  V(U, (o) => n(i, o), () => e(i)), N(B, U), J();
}
export {
  Re as default
};
