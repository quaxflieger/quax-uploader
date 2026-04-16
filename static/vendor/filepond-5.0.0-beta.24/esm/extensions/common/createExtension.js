/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { warn as x } from "../../common/console.js";
import { copyDescriptors as h, isObjectValuesEqual as v } from "../../utils/object.js";
import { isString as k, isObject as q } from "../../utils/test.js";
function I(r, l, d) {
  const i = (u) => {
    (!k(r) || !r) && x("Extension name missing or invalid");
    function c(t) {
      return t.extension?.[r] ?? {};
    }
    function f(t, n) {
      u.updateEntry(t, {
        extension: {
          [r]: n
        }
      });
    }
    function a(t, n) {
      f(t, { status: n });
    }
    function s(t) {
      return c(t).status ?? {};
    }
    function g(t) {
      const n = s(t), { type: b, code: P } = n ?? s(t);
      return ({ lengthComputable: j, loaded: m, total: O }) => {
        a(t, {
          type: b,
          code: P,
          progress: j ? m / O : 1 / 0
        });
      };
    }
    let e = { ...l }, p = [];
    function y(t) {
      p.push(t), t(o());
    }
    const E = d(
      // instance
      {
        // reference to current props so extension always has latest values
        props: e,
        // called when props updated (when setProps called and on init)
        didSetProps: y,
        // return name of this extension
        extensionName: r
      },
      {
        // merge extension manager with extension api
        ...u,
        getEntryExtensionState: c,
        setEntryExtensionState: f,
        setEntryExtensionStatus: a,
        getEntryExtensionStatus: s,
        createProgressHandler: g
      }
    );
    function S(t) {
      q(t) && (v(t, e) || (Object.assign(e, t), p.forEach((n) => n(o()))));
    }
    function o() {
      return { ...e };
    }
    return h(E, {
      setProps: S,
      getProps: o,
      get name() {
        return r;
      },
      destroy() {
        E.destroy();
      }
    });
  };
  return Object.defineProperty(i, "name", { value: r, writable: !1 }), i;
}
export {
  I as createExtension
};
