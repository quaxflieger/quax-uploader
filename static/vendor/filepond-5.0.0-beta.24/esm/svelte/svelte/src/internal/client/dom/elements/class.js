import { to_class as g } from "../../../shared/attributes.js";
function A(i, a, f, b, t, r) {
  var o = i.__className;
  if (o !== f || o === void 0) {
    var l = g(f, b, r);
    l == null ? i.removeAttribute("class") : a ? i.className = l : i.setAttribute("class", l), i.__className = f;
  } else if (r && t !== r)
    for (var u in r) {
      var N = !!r[u];
      (t == null || N !== !!t[u]) && i.classList.toggle(u, N);
    }
  return r;
}
export {
  A as set_class
};
