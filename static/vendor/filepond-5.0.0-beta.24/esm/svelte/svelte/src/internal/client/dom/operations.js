import { NAMESPACE_HTML as c } from "../../../constants.js";
import { get_descriptor as r, is_extensible as o } from "../../shared/utils.js";
var _, a, u, f;
function x() {
  if (_ === void 0) {
    _ = window, a = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, n = Node.prototype, t = Text.prototype;
    u = r(n, "firstChild").get, f = r(n, "nextSibling").get, o(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), o(t) && (t.__t = void 0);
  }
}
function g(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function l(e) {
  return (
    /** @type {TemplateNode | null} */
    u.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function d(e) {
  return (
    /** @type {TemplateNode | null} */
    f.call(e)
  );
}
function m(e, n) {
  return /* @__PURE__ */ l(e);
}
function v(e, n = !1) {
  {
    var t = /* @__PURE__ */ l(e);
    return t instanceof Comment && t.data === "" ? /* @__PURE__ */ d(t) : t;
  }
}
function b(e, n = 1, t = !1) {
  let i = e;
  for (; n--; )
    i = /** @type {TemplateNode} */
    /* @__PURE__ */ d(i);
  return i;
}
function h(e) {
  e.textContent = "";
}
function y() {
  return !1;
}
function w(e, n, t) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    document.createElementNS(n ?? c, e, void 0)
  );
}
export {
  _ as _$window,
  m as child,
  h as clear_text_content,
  w as create_element,
  g as create_text,
  v as first_child,
  l as get_first_child,
  d as get_next_sibling,
  x as init_operations,
  a as is_firefox,
  y as should_defer_append,
  b as sibling
};
