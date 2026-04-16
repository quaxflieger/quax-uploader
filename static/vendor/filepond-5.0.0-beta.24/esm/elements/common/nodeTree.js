/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { arrayRemoveFalsy as m, arrayInsertAtIndex as p, arrayWrap as a } from "../../utils/array.js";
import { isArray as c, isFunction as y } from "../../utils/test.js";
import { hasOwnProp as d } from "../../utils/object.js";
function u(n) {
  function t(r) {
    if (n) {
      const i = h(n, r, (f) => f);
      return u(i);
    }
    return u(void 0);
  }
  return {
    unwrap() {
      return n;
    },
    find: t,
    remove(r) {
      return n ? (h(n, r, (i, f) => {
        const o = f.indexOf(i);
        return f.splice(o, 1), i;
      }), u(n)) : u(void 0);
    },
    replace(r, ...i) {
      if (!n)
        return u(void 0);
      const f = i.map(e);
      return h(n, r, (o, l) => {
        const g = l.indexOf(o);
        return l.splice(g, 1, ...f), o;
      }), u(n);
    },
    update(r, i) {
      if (!n)
        return u(void 0);
      const f = t(r);
      return !f || !e(f) ? u(void 0) : (i(e(f)), f);
    },
    append(...r) {
      if (n) {
        let i = N(n);
        s(n, i, m(r));
      }
      return u(n);
    },
    prepend(...r) {
      return u(n ? s(n, 0, r) : void 0);
    },
    insert(r, ...i) {
      return u(n ? s(n, r, i) : void 0);
    }
  };
}
function e(n) {
  return y(n.unwrap) ? n.unwrap() : n;
}
function N(n) {
  if (c(n))
    return n.length;
  if (c(n.children))
    return n.children.length;
  if (n.if) {
    if (c(n.if.then))
      return n.if.then.length;
    if (c(n.if.then.children))
      return n.if.then.children.length;
  }
  return 0;
}
function s(n, t, r) {
  const i = r.map(e);
  return c(n) ? n.splice(t, 0, ...i) : w(n) ? Object.keys(n.if.then).length ? n.if.then.children ? c(n.if.then.children) && (n.if.then.children = p(
    // @ts-ignore
    n.if.then.children,
    t,
    ...i
  )) : n.if.then.children = i : n.if.then = i : n.children ? c(n.children) && (n.children = p(n.children, t, ...i)) : n.children = i, i;
}
function h(n, t, r) {
  if (!c(n))
    return n.key === t ? n : void 0;
  const i = [];
  for (const f of n) {
    if (f.key === t)
      return r(f, n);
    const o = v(f);
    o.length && i.push(o);
  }
  for (const f of i) {
    const o = h(f, t, r);
    if (o)
      return o;
  }
}
function v(n) {
  return w(n) ? m([n.if.then, n.elseif?.then, n.else]) : x(n) && n.item ? a(n.item) : n.children ? a(n.children) : [];
}
function w(n) {
  return !!(n && d(n, "if"));
}
function A(n) {
  return !!n;
}
function x(n) {
  return !!(n && d(n, "component"));
}
function I(n) {
  return !!(n && !d(n, "component"));
}
export {
  x as isComponentNode,
  I as isElementNode,
  w as isSwitchNode,
  A as isTemplateNode,
  u as nodeTree
};
