/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { lowerCaseFirstLetter as V, upperCaseFirstLetter as d } from "../../utils/string.js";
import { arrayRemoveFalsy as j } from "../../utils/array.js";
import { isString as h, isNullOrUndefined as m, isObject as x } from "../../utils/test.js";
import { createDefaultIcon as L } from "./html.js";
import { hasOwnProp as v } from "../../utils/object.js";
import { cache as S } from "../../utils/cache.js";
function $(...t) {
  return j(t).join(" ") || void 0;
}
function w(t) {
  return V(
    `${t.split("_").map((e) => d(e.toLowerCase())).join("")}`
  );
}
function F(t, e) {
  return p(t.substring(2, t.length - 2), e);
}
function p(t, e) {
  const n = t.split(".");
  for (const r of n)
    if (e = e[r], m(e))
      return "";
  return e;
}
function l(t, e, n = {}) {
  if (h(t)) {
    if (!e)
      return t;
    const c = Array.from(t.matchAll(/\{{[\.a-z]+\}}/gi));
    if (!c.length)
      return t;
    for (const { 0: s } of c) {
      const i = F(s, e);
      let u = n[i] ?? i;
      if (x(u) && i.startsWith("unit")) {
        const a = s.substring(2, s.length - 6);
        u = l(
          {
            template: "{{v}}",
            variables: {
              v: {
                context: a,
                // @ts-ignore
                map: u
              }
            }
          },
          e,
          n
        );
      }
      t = t.replace(s, u);
    }
    return l(t, e, n);
  }
  const { variables: r, template: f } = t, o = Object.entries(r).reduce((c, [s, i]) => {
    let u, a;
    "context" in i && h(i.context) ? (u = i.context, a = i.map) : (u = s, a = i);
    const y = p(u, e), g = m(a[y]) ? a.else : a[y];
    return c.replace(`{{${s}}}`, `${g}`);
  }, f);
  return l(o, e, n);
}
function A(t, e, n = "") {
  return h(t) ? e[t] ?? t : n;
}
function C({ code: t, subcode: e, values: n }, r) {
  const o = S(w, [e ?? t]), c = !m(r[o]);
  if (c)
    return c ? l(r[o], n, r) : void 0;
}
function D({ type: t }, e, n) {
  const r = t, f = !m(n[r]), o = !m(e[r]);
  if (!(!f || !o))
    return L(n[r], {
      // Should also have title
      title: e[r]
    });
}
function O(t, e, n) {
  const r = Object.keys(e);
  if (!r.some((o) => v(t, o)))
    return t;
  const f = {
    ...t
  };
  for (const o of r) {
    if (t[o] === void 0) continue;
    const c = e[o], s = t[o];
    f[o] = n[c][s] ?? s;
  }
  return f;
}
export {
  p as getObjectValueByString,
  A as getValueByKeyFromData,
  w as statusCodeToLocaleKey,
  D as statusToIcon,
  C as statusToLabel,
  l as stringReplaceVariables,
  $ as toSpaceSeparatedString,
  O as withResources
};
