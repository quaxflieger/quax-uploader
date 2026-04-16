import { to_style as a } from "../../../shared/attributes.js";
function p(r, l = {}, f, i) {
  for (var t in f) {
    var o = f[t];
    l[t] !== o && (f[t] == null ? r.style.removeProperty(t) : r.style.setProperty(t, o, i));
  }
}
function u(r, l, f, i) {
  var t = r.__style;
  if (t !== l) {
    var o = a(l, i);
    o == null ? r.removeAttribute("style") : r.style.cssText = o, r.__style = l;
  } else i && (Array.isArray(i) ? (p(r, f?.[0], i[0]), p(r, f?.[1], i[1], "important")) : p(r, f, i));
  return i;
}
export {
  u as set_style
};
