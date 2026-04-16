/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { FilePondInputElement as A } from "../FilePondInput/index.js";
import { FilePondEntryListElement as E, getDefaultSpringOptions as h, getDefaultEntryAnimationOriginMap as x, getDefaultEntryAnimationProps as L } from "../FilePondEntryList/index.js";
import { FilePondDropAreaElement as w } from "../FilePondDropArea/index.js";
import { FilePondDropIndicatorElement as D } from "../FilePondDropIndicator/index.js";
import { FileInputSource as P } from "../../extensions/file-input-source.js";
import { DataTransferLoader as S } from "../../extensions/data-transfer-loader.js";
import { ValueCallbackStore as C } from "../../extensions/value-callback-store.js";
import { FileExtensionValidator as I } from "../../extensions/file-extension-validator.js";
import { FileMimeTypeValidator as k } from "../../extensions/file-mime-type-validator.js";
import { EntryListView as F } from "../../extensions/entry-list-view.js";
import { hasDefinedTag as O, defineCustomElements as v, defineCustomElement as _, setBooleanAttribute as l, h as c, addListener as d, dispatchCustomEvent as b } from "../../utils/dom.js";
import { isArray as y, isString as g } from "../../utils/test.js";
import { assets as V } from "../../assets/index.js";
import j from "./index.css.js";
import { createFilePondEntryList as T } from "../../templates/entry.js";
import { toCamelParts as B } from "../../utils/string.js";
import { arrayInsertAtIndex as R } from "../../utils/array.js";
import { warn as N } from "../../common/console.js";
function f(o) {
  return (y(o) ? o[0] : o).name;
}
function $(o) {
  return y(o) ? o[2] : void 0;
}
function M(o = []) {
  const t = { name: "Transform" };
  let e = [
    P,
    S,
    I,
    k,
    // the default extension set doesn't have a Transform extension, so we create a slot so we can auto insert transform extensions there, the slot is removed when we return the extension set
    t,
    F,
    C
  ];
  for (const r of o) {
    let i = f(r), n = e.findIndex((u) => f(u) === i);
    if (n > -1) {
      e[n] = r;
      continue;
    }
    let p, s = 1, a = $(r);
    if (a ? (s = a.before ? 0 : 1, p = a.before || a.after) : p = B(i).pop(), n = e.findLastIndex(
      (u) => f(u).endsWith(p)
    ), n === -1) {
      N(
        `No valid insertion index found for extension "${i}", make sure its name ends with an extension types: "Source", "Loader", "Validator", "Transform", or "Store".`
      );
      continue;
    }
    e = R(
      e,
      n + s,
      r
    );
  }
  return e.filter((r) => r !== t);
}
const q = ["springDefaults", "animations"];
let m;
class K extends A {
  // Child components
  #t = {};
  /** Holds reference to attribution link element */
  #e;
  /** Holds references to event subscriptions so we can more easily unsub */
  #r = [];
  /** Pass spring and animaton config to children */
  set springDefaults(t) {
    Object.values(this.#t).forEach((e) => {
      e.springDefaults = t;
    });
  }
  set animations(t) {
    Object.values(this.#t).forEach((e) => {
      e.animations = t;
    });
  }
  /** Wraps `createFilePondExtensionSet` so we always set the default extension set */
  set extensions(t) {
    super.extensions = M(t);
  }
  /** Set to false to hide credits */
  static get observedAttributes() {
    return [...super.observedAttributes, "noattribution", "nodrop"];
  }
  attributeChangedCallback(t, e, r) {
    if (t === "noattribution") {
      this.noAttribution = g(r);
      return;
    }
    if (t === "nodrop") {
      this.noDrop = g(r);
      return;
    }
    super.attributeChangedCallback(t, e, r);
  }
  /** Set to `true` to remove drop area */
  set noDrop(t) {
    l(this, "nodrop", t), t ? (this.#t.dropArea.remove(), this.#t.dropIndicator.remove(), Object.assign(this, {
      EntryListView: {
        drop: !1
      }
    })) : (this._root.prepend(this.#t.dropArea, this.#t.dropIndicator), Object.assign(this, {
      EntryListView: {
        drop: !0
      }
    })), this.setBrowseButtonLabelKey(t ? "browse" : "browseAndDrop");
  }
  /** Returns current nodrop state */
  get noDrop() {
    return this.hasAttribute("nodrop");
  }
  /** Set to `true` to remove the attribution link */
  set noAttribution(t) {
    t ? (l(this, "noattribution", !0), this.#e.remove()) : (l(this, "noattribution", !1), this._root.append(this.#e));
  }
  /** Returns current noattribution state */
  get noAttribution() {
    return !this.#e?.parentNode;
  }
  constructor() {
    super({
      styles: [j]
    }), this.setBrowseButtonLabelKey("browseAndDrop");
    const t = c("file-pond-entry-list", {
      part: "entry-list"
    }), e = c("file-pond-drop-area", {
      part: "drop-area"
    }), r = c("file-pond-drop-indicator", {
      part: "drop-indicator"
    });
    this.#t = {
      entryList: t,
      dropArea: e,
      dropIndicator: r
    };
    const i = /* @__PURE__ */ new Set(["dragging", "virtualized", "selected", "checked"]);
    function n(s) {
      if (!s || i.has(s))
        return;
      const a = Array.from(i.add(s)).join(",");
      t.setAttribute("exportparts", a.replace(/ /g, ","));
    }
    const p = m?.EntryListView?.template || T();
    Object.assign(this, {
      // add items view
      extensions: this.extensions,
      // show progress indicator for data transfers
      DataTransferLoader: {
        perceivedPerformance: !0
      },
      // set up items view extension
      EntryListView: {
        // the element that the item list will be appended to
        element: this.#t.entryList,
        // the root element to use for dragging and dropping components, defaults to the list itself
        dropRoot: this.#t.dropArea,
        // assets to use
        assets: V,
        // the nodes to render
        template: p,
        // called before rendering a node, allows dynamically modifying a node or adding nodes
        beforeRenderNode(s) {
          return n(s.props?.part || s.attrs?.part), s;
        },
        // animations
        entryAnimationProps: L(),
        entryAnimationOriginMap: x(),
        springDefaults: h()
      }
    }), this.springDefaults = h(), q.forEach((s) => {
      this[s] = t[s];
    }), this.#e = z({
      caption: "Powered by FilePond"
    }), Object.assign(this, m);
  }
  connectedCallback() {
    super.connectedCallback();
    const { dropArea: t, dropIndicator: e, entryList: r } = this.#t;
    this.hasAttribute("nodrop") || this._root.prepend(t, e), this._root.append(r), this.hasAttribute("noattribution") || this._root.append(this.#e), this.#r.push(
      // route clicks on drop area to browse button
      d(t, "click", () => {
        this.browse();
      }),
      // did compute target rect
      d(t, "computerect", (i) => {
        if (!i.detail)
          return;
        const n = i.detail;
        b(this, "computerect", { detail: n });
      }),
      // did update visual rect
      d(t, "updaterect", (i) => {
        if (!i.detail)
          return;
        const n = i.detail;
        this._root.style.setProperty("--width", n.width), this._root.style.setProperty("--height", n.height), b(this, "updaterect", { detail: n });
      }),
      // link up placeholder position with drop indicator
      d(r, "updateplaceholder", (i) => {
        e.indicatorRect = i.detail;
      }),
      // these two listeners toggle the dragging attribute to the file-pond element, we do this so we can move the file-pond element that is being interacted with to the front, so the dragged item also renders on top. Additionally they prevent interaction with slot content and attribution link while dragging
      d(r, "dragentrystart", () => {
        l(this, "dragging", !0), this._slot.inert = !0, this.#e.inert = !0;
      }),
      d(r, "dragentryend", () => {
        l(this, "dragging", !1), this._slot.inert = !1, this.#e.inert = !1;
      })
    );
  }
  /** Called each time the element is removed from the document. */
  disconnectedCallback() {
    super.disconnectedCallback(), Object.values(this.#t).forEach((t) => t.remove()), this.#e.remove(), this.#r.forEach((t) => t()), this.#r = [];
  }
}
function z(o) {
  const { caption: t = "" } = o || {};
  return c("a", {
    textContent: t,
    href: "https://filepond.com",
    target: "_tab",
    rel: "noopener noreferrer nofollow",
    part: "attribution-link",
    tabindex: "-1"
  });
}
function pt(o) {
  const t = "file-pond";
  return m = o, O(t) || (v({
    [`${t}-entry-list`]: E,
    [`${t}-drop-area`]: w,
    [`${t}-drop-indicator`]: D
  }), _(t, K)), Array.from(document.querySelectorAll(t));
}
export {
  K as FilePondElement,
  M as createFilePondExtensionSet,
  pt as defineFilePond
};
