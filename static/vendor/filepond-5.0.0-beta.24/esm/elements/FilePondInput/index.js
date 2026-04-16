/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtensionManager as P } from "../../core/extensionManager.js";
import { createEntryTree as B } from "../../core/entryTree.js";
import { setBooleanAttribute as l, setStringAttribute as o, getAttribute as h, getFileSizeAttributeValue as p, createStyleSheet as T, h as f, setAttributes as D, getAttributeFromElements as E, addListener as M, dispatchCustomEvent as g } from "../../utils/dom.js";
import { isFileEntry as k, isNumber as w, isString as c, isFile as b, isObject as y, isDataTransfer as I, isDirectoryEntry as R, isBlobOrFile as _, isCanvas as q } from "../../utils/test.js";
import { stringReplaceVariables as u, statusToLabel as j, statusCodeToLocaleKey as U } from "../common/string.js";
import { toCamelCase as K } from "../../utils/string.js";
import { debounce as x } from "../../utils/debounce.js";
import { copyFilePropsToObject as V } from "../../utils/file.js";
import { Status as N } from "../../common/status.js";
import { HTMLElementSafe as $ } from "../../common/ssr.js";
import { getFilenameFromURL as G } from "../../utils/url.js";
import { arrayRemoveFalsy as S } from "../../utils/array.js";
import H from "./index.css.js";
function J(r) {
  const { beforeInsertEntries: t } = r || {};
  return B({
    // allows limiting the total entries added
    beforeInsertEntries: t,
    // formats the entry so all entries in the dataset follow the same data structure
    beforeOnboardEntry(e) {
      return z(e) ? O(e) : !1;
    },
    // makes modifications to the props the entry is updated with
    beforeUpdateEntryWithProps(e, i, s) {
      if (k(e) && s && V(i.file, i), i.extension) {
        const d = Object.values(
          i.extension
        );
        for (const { status: a } of d)
          a && (a.values = a.values ?? null, a.progress = w(a.progress) ? a.progress : null);
      }
    }
  });
}
const F = [
  // customError
  "customError",
  // if accept is mismatched
  "typeMismatch",
  // some min range exceeded
  "rangeUnderflow",
  // some max range exceeded
  "rangeOverflow",
  // if is required and value is missing
  "valueMissing"
];
function W(r) {
  return c(r) || _(r) || q(r) || I(r);
}
function z(r) {
  if (c(r) || k(r)) {
    const t = c(r) ? G(r) ?? "" : r.name ?? (b(r?.src) ? r.src.name : "");
    return ![
      /\.git/,
      /thumbs\.db/,
      /\.DS_Store/,
      /desktop\.ini/,
      /^__MACOSX/,
      /node_modules/
    ].find((e) => e.test(t));
  }
  return !0;
}
function O(r) {
  const t = W(r) ? { src: r } : { ...r };
  if (t.state = y(t.state) ? t.state : {}, t.extension = y(t.extension) ? t.extension : {}, t.origin = t.origin ?? "api", t.containerId = t.containerId ?? null, I(t.src))
    return t;
  if (t.path = t.path ?? t.src?.path ?? null, R(t)) {
    const { entries: i } = t;
    return t.entries = i.filter(z).map(O), t;
  }
  const e = t;
  return e.file = e.file ?? void 0, b(e.src) && (e.file = e.src), b(e.file) && V(e.file, e), e;
}
function X(r) {
  return r.some((t) => Object.values(t.extension ?? {}).some(({ status: e }) => e ? w(e.progress) : !1));
}
function Q(r) {
  return r.some((t) => Object.values(t.extension ?? {}).some(({ status: e }) => e ? e.type === "error" : !1));
}
function Y(r, t) {
  const e = Array.isArray(t) ? t : [t], i = new FormData();
  for (const s of e) {
    if (b(s)) {
      i.append(r, s, s.name);
      continue;
    }
    i.append(r, y(s) ? JSON.stringify(s) : `${s}`);
  }
  return i;
}
const Z = ["required", "name", "id"], v = ["disabled", "accept", "capture", "webkitdirectory"], A = ["disabled", "required", "webkitdirectory"];
class mt extends $ {
  /** FilePond element shadowRoot */
  #u;
  /** Div element that wraps styleable children */
  #n;
  /** FilePond element slot */
  #a;
  /** This Has a reference to the element form internals */
  #r;
  /** Source input */
  #o;
  /** Browse button */
  #s;
  /** FilePond extension manager reference */
  #i;
  /** FilePond core instance reference */
  #t;
  /** Locale object reference */
  #e = void 0;
  /** Key to use for the browse button label */
  #c = "browse";
  /** Holds Names of extensions we've currently set up proxies for */
  #m = [];
  /**
   * Holds default entries as set by developer to .entries, we use this so we can reset to initial
   * state when reset is clicked
   */
  #p = null;
  /** Holds references to event subscriptions so we can more easily unsub */
  #h = [];
  //#region getters and setters for <file-pond> custom element attributes
  /** Returns a reference to the shadow root element */
  get _root() {
    return this.#n;
  }
  /** Returns a reference to the slot element */
  get _slot() {
    return this.#a;
  }
  /** Attributes being observed for changes */
  static get observedAttributes() {
    return [
      "animations",
      "value",
      "readonly",
      "required",
      "webkitdirectory",
      "capture",
      "accept",
      "nobrowse",
      //
      // apart from 'max-files' these are convenience attributes for validation extensions
      //
      "min-files",
      "max-files",
      "min-size",
      "max-size",
      "min-list-size",
      "max-list-size"
      //
      // the root doesn't have the 'multiple' attribute it uses 'min-files' / 'max-files'
      //
      //
      // changes to 'disabled' attribute are handled by `formDisabledCallback`
      //
    ];
  }
  /** Called when attributes are changed, added, removed, or replaced */
  attributeChangedCallback(t, e, i) {
    if (t === "value") {
      this.value = `${i}`;
      return;
    }
    this.#f(t, i), this.#b(t, i), this.#g(t, i);
  }
  /** Syncs attribute to internal element state */
  #f(t, e) {
    if (t === "nobrowse") {
      c(e) ? this.#s.remove() : this.#a.prepend(this.#s);
      return;
    }
    if (t === "max-files") {
      const i = parseInt(e, 10);
      this.#t.entries.length > i && (this.#t.entries = this.#t.entries.toSpliced(i)), this.#o.multiple = i > 1, this.#l(), this.checkValidity();
      return;
    }
  }
  /** Syncs file-pond interaction attributes (attributes that impact file system file selection UX) to source input attributes */
  #b(t, e) {
    if (v.includes(t)) {
      if (A.includes(t)) {
        l(this.#o, t, e === !0 || e === "");
        return;
      }
      o(this.#o, t, e);
    }
  }
  /** Looks up the extension(s) linked to this attribute and assigns the matched props */
  #g(t, e) {
    const i = K(t);
    e = A.includes(t) && e === "" ? !0 : e, this.#i.propagateExtensionProperty(i, e);
  }
  /** Disable the field and sets the disabled attribute */
  set disabled(t) {
    l(this, "disabled", t);
  }
  /** Gets the field disabled state */
  get disabled() {
    return !!h(this, "disabled");
  }
  /** Set the field webkitdirectory state */
  set webkitdirectory(t) {
    l(this, "webkitdirectory", t);
  }
  /** Gets the field webkitdirectory state */
  get webkitdirectory() {
    return !!h(this, "webkitdirectory");
  }
  /** Toggle the field multiple state */
  set multiple(t) {
    t && this.maxFiles === 1 && (this.maxFiles = 1 / 0), !t && this.maxFiles !== 1 && (this.maxFiles = 1);
  }
  /** Gets the field multiple state */
  get multiple() {
    return this.maxFiles !== 1;
  }
  /**
   * Set field as readonly. Only for situations where FilePond has initial files and those files
   * should be posted. The `readonly` attribute isn't supported on a file input element as it
   * cannot have an initial value.
   */
  set readOnly(t) {
    l(this, "readonly", t);
  }
  /** Gets the field readonly state */
  get readOnly() {
    return !!h(this, "readonly");
  }
  /** Set field as required */
  set required(t) {
    l(this, "required", t);
  }
  /** Gets the field required state */
  get required() {
    return !!h(this, "required");
  }
  /** Accepted files setter https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept */
  set accept(t) {
    o(this, "accept", t);
  }
  /** Returns the current value of accept */
  get accept() {
    return h(this, "accept");
  }
  /** Setting to toggle animations */
  set animations(t) {
    o(this, "animations", t);
  }
  /** Returns the current animation mode */
  get animations() {
    return h(this, "animations") ?? "auto";
  }
  /** Toggle browse button */
  set noBrowse(t) {
    t ? l(this, "nobrowse", !0) : l(this, "nobrowse", !1);
  }
  /** Returns the current browse button state */
  get noBrowse() {
    return !this.#s.parentNode;
  }
  /** Min file size setter, accepts a number of bytes or a natural filesize string like 1MB */
  set minSize(t) {
    o(this, "min-size", t);
  }
  /** Returns the currently set min file size */
  get minSize() {
    return p(this, "min-size");
  }
  /** Max file size setter, accepts a number of bytes or a natural filesize string like 1MB */
  set maxSize(t) {
    o(this, "max-size", t);
  }
  /** Returns the currently set max file size */
  get maxSize() {
    return p(this, "max-size");
  }
  /** Min total file size setter, accepta a number of bytes or a natural filesize string like 1MB */
  set minListSize(t) {
    o(this, "min-list-size", t);
  }
  /** Returns the currently set min total file size */
  get minListSize() {
    return p(this, "min-list-size");
  }
  /** Max total file size setter, accepts a number of bytes or a natural filesize string like 1MB */
  set maxListSize(t) {
    o(this, "max-list-size", t);
  }
  /** Returns the currently set max total file size */
  get maxListSize() {
    return p(this, "max-list-size");
  }
  /** Min total entries setter, an integer, defaults to `0` */
  set minFiles(t) {
    o(this, "min-files", t);
  }
  /** Returns the currently set min total entries */
  get minFiles() {
    return parseInt(this.getAttribute("min-files") ?? "0", 10);
  }
  /** Max total entries setter, an integer, defaults to `Infinity` */
  set maxFiles(t) {
    t === 1 / 0 ? this.removeAttribute("max-files") : o(this, "max-files", t);
  }
  /** Returns the currently set max total entries */
  get maxFiles() {
    const t = this.getAttribute("max-files");
    return t ? parseInt(t, 10) : 1 / 0;
  }
  //#endregion
  //#region Element properties
  /** Set the current entries */
  set entries(t) {
    this.#t.entries = t;
  }
  /** Returns a `structuredClone` of the current entries array */
  get entries() {
    return this.#t.entries;
  }
  /** Sets the locale */
  set locale(t) {
    this.#e = t, this.#i.propagateExtensionProperty("locale", t), this.#l(), this.checkValidity();
  }
  /** Returns the current locale object, so it's easier to extend */
  get locale() {
    return this.#e;
  }
  /** Sets custom extensions to load */
  set extensions(t) {
    this.#i.extensions = t;
  }
  /** Update worker url */
  set workersURL(t) {
    this.#i.propagateExtensionProperty("workersURL", t);
  }
  //#endregion
  //#region Element methods
  /** Browse files */
  browse() {
    this.noBrowse || (this.#s.focus({ preventScroll: !0 }), this.#o.click());
  }
  /** Listen for events */
  on(t, e) {
    return this.#t.on(t, e);
  }
  /** Add/Insert entries in the entry tree */
  insertEntries(t, e) {
    return this.#t.insertEntries(t, e);
  }
  /** Find entries in the entry tree */
  findEntries(...t) {
    return this.#t.findEntries(...t);
  }
  /** Find entries in the entry tree */
  removeEntries(...t) {
    return this.#t.removeEntries(...t);
  }
  /** Sorts the entry tree using the passed sorting function */
  sortEntries(t) {
    this.#t.sortEntries(t);
  }
  /** Update an entry */
  updateEntry(t, ...e) {
    this.#t.updateEntry(t, ...e);
  }
  /** Update an entry state */
  updateEntryState(t, ...e) {
    this.#t.updateEntry(t, {
      state: e
    });
  }
  moveEntry(t, e) {
    return this.#t.moveEntry(t, e);
  }
  replaceEntry(t, ...e) {
    return this.#t.replaceEntry(t, ...e);
  }
  //#endregion
  /** Called when the custom element is created */
  constructor(t) {
    super();
    const { styles: e = [] } = t || {};
    this.#u = this.attachShadow({ mode: "open", delegatesFocus: !0 }), this.#u.adoptedStyleSheets = [H, ...e].map(T), this.#n = f("div"), this.#n.tabIndex = -1, this.#u.append(this.#n), this.#a = f("slot"), this.#n.append(this.#a), this.#o = f("input", {
      type: "file",
      "aria-hidden": !0,
      hidden: !0,
      multiple: !0,
      tabIndex: -1
    }), this.#n.prepend(this.#o), this.#s = f("button", {
      type: "button",
      part: "browse-button"
    }), this.#n.prepend(this.#s), this.#r = this.attachInternals(), this.#t = J({
      // handles one or multiple files state
      beforeInsertEntries: (i, s) => this.maxFiles < 1 / 0 && s.length + i.length > this.maxFiles ? i.toSpliced(this.maxFiles - s.length) : i
    }), this.#i = P(this.#t), this.#i.on("setExtensions", ({ extensionNames: i }) => {
      this.#m.filter((s) => !i.includes(s)).forEach((s) => {
        delete this[s];
      }), i.forEach((s) => {
        Object.defineProperty(this, s, {
          // getter / setter
          set(d) {
            this.#i.setExtensionProperties(s, d);
          },
          get() {
            return this.#i.getExtensionProperties(s);
          },
          // so we can delete this proxy later
          configurable: !0
        });
      }), this.#m = i, this.checkValidity();
    }), this.#t.on("updateEntries", (i) => {
      this.locale && this.#l();
    });
  }
  setBrowseButtonLabelKey(t) {
    this.#c = t, this.#l();
  }
  #l() {
    const t = this.#t.entries.length, e = {
      multiple: `${this.multiple}`,
      //
      name: t === 1 ? this.#t.entries[0].name || "untitled" : null,
      count: t,
      //
      maxFiles: this.maxFiles,
      maxFilesUnit: "unitFiles"
    };
    if (this.#e) {
      const i = t === 0 ? "ariaNoEntries" : t === 1 ? "ariaSingleEntry" : "ariaMultipleEntries";
      D(this.#s, {
        // aria label is always base browse button
        "aria-label": u(this.#e.browse, e, this.#e),
        // aria description is always base browse button
        "aria-description": S([
          u(this.#e[i], e, this.#e),
          this.#e.ariaRequired,
          this.validationMessage
        ]).join(", ")
      });
    }
    this.#s.innerHTML = u(
      this.#e ? this.#e[this.#c] : this.#c,
      e,
      this.#e
    );
  }
  #y() {
    const t = this.#a.assignedElements({ flatten: !0 }).filter((i) => i.matches('input[type="file"]')), e = [...Z, ...v];
    for (const i of e) {
      const s = E(i, ...t, this);
      s !== void 0 && (this[i] = s);
    }
    t.length && (this.multiple = !!E("multiple", ...t)), t.forEach((i) => i.remove());
  }
  /** Called each time the element is added to the document */
  connectedCallback() {
    this.#y();
    const t = (e) => {
      this.#r.setFormValue(
        e.length > 0 ? Y(this.name ?? "filepond", e) : null
      ), this.checkValidity(), g(this, "change");
    };
    this.#i.setExtensionProperties("FileInputSource", {
      element: this.#o,
      resetFilesOnAdd: !0
    }), this.#i.setExtensionProperties("ValueCallbackStore", {
      required: this.required,
      onChange: t
    }), this.#E(), this.#h.push(
      M(this, "click", (e) => {
        const i = e.composedPath()[0];
        i !== this && i !== this.#s && !this.#s.contains(i) || (e.stopPropagation(), e.preventDefault(), this.browse());
      }),
      // fire update events
      this.#t.on("updateEntries", () => {
        g(this, "update");
      })
    ), g(this, "connected");
  }
  /** Called each time the element is removed from the document. */
  disconnectedCallback() {
    this.#h.forEach((t) => t()), this.#h = [];
  }
  //#region Form integration and validation
  /** This makes the element associateable with its parent form */
  static formAssociated = !0;
  /** Sets the current field name */
  set name(t) {
    o(this, "name", t);
  }
  /** Returns the current field name */
  get name() {
    return this.getAttribute("name") ?? void 0;
  }
  /** Proxy for Element internals `form` getter */
  get form() {
    return this.#r.form ?? void 0;
  }
  /**
   * Sets/Updates the value of the the entry manager
   *
   * Will also remember this value for when form is reset
   */
  set value(t) {
    let e = [];
    c(t) && (e = t.split(",").map((i) => i.trim()).map((i) => ({
      src: i
    }))), this.#p = e, this.entries = e;
  }
  /** Proxy for `entries` getter */
  get value() {
    return this.entries;
  }
  /** Sets up the field for validation */
  #E() {
    this.#h.push(
      this.#t.on(
        "updateEntries",
        x(() => this.checkValidity())
      ),
      this.#i.on(
        "updateExtensionState",
        x(() => this.checkValidity())
      )
    ), this.checkValidity();
  }
  /** Validates the current state of the field */
  checkValidity() {
    const { validationInvalidBusy: t = "", validationInvalidState: e = "" } = this.#e || {};
    if (X(this.entries)) {
      if (this.#r.validity.customError === !0)
        return;
      this.#d({ customError: !0 }, u(t));
      return;
    }
    const i = {
      // add generic item state, for when an extension doesn't set a generic state on the extension manager (this allows for more extension specific error messages like "not all items have been stored")
      ...Q(this.entries) ? {
        FilePondItemValidator: {
          status: {
            type: "error",
            code: "VALIDATION_INVALID_ENTRIES",
            meta: null,
            values: []
          }
        }
      } : {},
      // overwrite with specific extension states
      ...this.#i.getState()
    }, s = {};
    for (const { status: n } of Object.values(i)) {
      if (!n || n.type !== N.Error)
        continue;
      const { flag: m = "customError" } = n?.meta ?? {}, C = this.#e ? j(
        {
          ...n,
          values: {
            // error state values
            ...n.values,
            // append input state
            multiple: this.multiple
          }
        },
        this.#e
      ) : U(n.code);
      s[m] = C ?? u(e);
    }
    if (Object.keys(s).length === 0)
      return this.#d();
    const a = S(F.map((n) => s[n])).at(
      0
    ), L = F.reduce(
      (n, m) => (n[m] = !!s[m], n),
      {}
    );
    return this.#d(L, a);
  }
  /** Sets the validity state on the element internals. Returns `true` if valid, `false` if invalid */
  #d(t, e) {
    let i = !0;
    return t ? (this.#r.setValidity(t, e, this.#n), i = !1) : this.#r.setValidity({}), this.#l(), i;
  }
  /** Proxy for element internals `reportValidity()` method */
  reportValidity() {
    this.#r.reportValidity();
  }
  /** Proxy for element internals `validity` getter */
  get validity() {
    return this.#r.validity;
  }
  /** Proxy for element internals `validationMessage` getter */
  get validationMessage() {
    return this.#r.validationMessage;
  }
  /** Called when element or parent element (for example a `<fieldset>`) is set to disabled */
  formDisabledCallback(t) {
    this.#i.propagateExtensionProperty("disabled", t), this.#o.disabled = t, this.#s.disabled = t;
  }
  /**
   * Called when user resets form. Resets field to initial state. The initial state is either
   * empty or set to what the developer has set to the `.entries` prop. This tries to mimic the
   * workings of `setAttribute` on default form fields.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset
   */
  formResetCallback() {
    this.entries = this.#p ?? [];
  }
  /** Called when user returns to form with back button */
  formStateRestoreCallback(t, e) {
  }
  //#endregion
}
export {
  mt as FilePondInputElement,
  J as createFilePondEntryTree
};
