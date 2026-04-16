/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createTaskScheduler as R } from "./taskScheduler.js";
import { pubsub as z } from "../utils/pubsub.js";
import { isArray as k } from "../utils/test.js";
import { arrayItemsEqual as D, arrayRemoveInPlace as G, arraySortByItemProp as H } from "../utils/array.js";
function V(c) {
  const { on: I, pub: y } = z(), a = [], { insertEntries: T, replaceEntry: A, updateEntry: v, removeEntries: j } = c, f = R({ log: void 0 }), x = {
    extension: {}
  };
  function l(n, s) {
    x.extension[n] = {
      ...g(n),
      ...s
    }, y("updateExtensionState", x.extension);
  }
  function g(n) {
    return x.extension[n] ?? {};
  }
  function C(n, s) {
    l(n, { status: s });
  }
  function O(n) {
    return x.extension[n].status;
  }
  c.on("removeEntry", ({ entry: n }) => {
    f.abortTasks(n.id);
  });
  function q(n) {
    const s = function(e, i) {
      return c.on(e, i);
    }, o = [], t = { current: void 0 };
    t.current = n({
      // events
      on: s,
      // get root extension state
      setExtensionState: r((e) => {
        l(t.current.name, e);
      }),
      getExtensionState: r(() => g(t.current.name)),
      // get root extension status
      setExtensionStatus: r(
        (e) => C(t.current.name, e)
      ),
      // @ts-ignore
      getExtensionStatus: r(() => O(t.current.name)),
      pushTask: function(e, i, u) {
        const B = E(
          t.current.name
        );
        c.findEntries(e) && f.pushTask(e, i, {
          // set order to factor of 100 so in theory there's plenty room for adding manual order
          order: B.index * 100,
          // when params is a function it is called on run task
          params: () => [c.findEntries(e)],
          // add custom options
          ...u
        });
      },
      abortTask: function(e, i) {
        f.abortTask(e, i);
      },
      abortTasks: (e) => {
        f.abortTasks(e);
      },
      setEntries: function(e) {
        c.entries = e;
      },
      getEntries: () => c.entries,
      // manipulating entry list
      insertEntries: T,
      removeEntries: j,
      replaceEntry: A,
      updateEntry: v
    });
    function r(e) {
      return (...i) => {
        if (t.current) {
          e(...i);
          return;
        }
        o.push([e, i]);
      };
    }
    return o.forEach(([e, i]) => {
      e(...i);
    }), t.current;
  }
  function S() {
    f.abortTasks(), a.map((n) => n.instance).forEach((n) => n.destroy()), a.length = 0;
  }
  const h = {
    // subscribe to events
    on: I,
    get extensions() {
      return a.map(({ factory: n }) => n);
    },
    set extensions(n) {
      if (!k(n))
        return;
      const s = n.map(
        (t) => Array.isArray(t) ? t[0] : t
      );
      if (D(s, h.extensions)) {
        for (const t of n) {
          if (!k(t))
            continue;
          const r = a.find((e) => t[0] === e.factory);
          p(r, t[1]);
        }
        return;
      }
      n.length === 0 && (d.clear(), S());
      for (const t of a)
        if (!s.includes(t.factory)) {
          t.instance.destroy(), G(a, (r) => r === t);
          continue;
        }
      for (const [t, r] of Object.entries(s)) {
        const e = parseInt(t, 10), i = a.find((u) => r === u.factory);
        if (i) {
          if (i.index = e, Array.isArray(n[e])) {
            const u = n[e][1];
            p(i, u);
          }
          continue;
        }
        if (a.push({
          index: e,
          factory: r,
          instance: q(r)
        }), Array.isArray(n[e])) {
          const u = n[e][1];
          p(a.at(-1), u);
        }
      }
      H(a, "index"), Object.entries(d.get("*") ?? []).forEach(
        ([t, r]) => {
          P(t, r);
        }
      );
      for (const [t, r] of d)
        t !== "*" && b(t, r);
      const o = a.map((t) => t.instance.name);
      y("setExtensions", { extensionNames: o }), c.entries = [...c.entries];
    },
    propagateExtensionProperty: P,
    setExtensionProperties: b,
    getExtensionProperties: M,
    // access manager state
    getState() {
      return x.extension;
    },
    // destroy FilePond instance
    destroy() {
      S();
    }
  };
  function P(n, s) {
    const o = { [n]: s }, t = W(n);
    for (const r of t)
      p(r, o);
    m("*", o);
  }
  function b(n, s) {
    const o = E(n);
    o ? p(o, s) : m(n, s);
  }
  function M(n) {
    const s = E(n);
    if (!s)
      return;
    const { instance: o } = s;
    if (o)
      return o.getProps();
  }
  function p(n, s) {
    s && (n.instance.setProps(s), m(n.instance.name, s));
  }
  function W(n) {
    return a.filter((s) => {
      const o = s.instance.getProps();
      return Object.keys(o).includes(n);
    });
  }
  function E(n) {
    return a.find((s) => s.instance.name === n);
  }
  const d = /* @__PURE__ */ new Map();
  function m(n, s) {
    d.set(n, {
      ...d.get(n),
      ...s
    });
  }
  return h;
}
export {
  V as createExtensionManager
};
