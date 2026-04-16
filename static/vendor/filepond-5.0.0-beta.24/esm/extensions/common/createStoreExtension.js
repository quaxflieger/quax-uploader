/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as at } from "./createExtension.js";
import { isNullOrUndefined as f, isFile as y, isFileEntry as nt, isBlob as ct } from "../../utils/test.js";
import { Status as a } from "../../common/status.js";
import { debounce as rt } from "../../utils/debounce.js";
import { createPerceivedPerformanceProxy as ut } from "../../common/perceivedPerformanceProxy.js";
function mt(E, B, K) {
  return at(
    E,
    {
      perceivedPerformance: null,
      parallel: 4,
      actionStore: "store",
      actionLoad: "load",
      actionAbort: "abort",
      valueKey: "value",
      ...B
    },
    (P, U) => {
      const { props: d, didSetProps: k } = P, {
        on: _,
        setExtensionStatus: g,
        updateEntry: l,
        removeEntries: I,
        pushTask: S,
        abortTask: Y,
        getEntryExtensionState: D,
        getEntryExtensionStatus: h,
        setEntryExtensionStatus: u,
        createProgressHandler: L
      } = U;
      let p = null;
      k(({ perceivedPerformance: t }) => {
        t === !0 ? p = {
          minDuration: 1e3,
          maxDuration: 1500,
          minStep: 50,
          maxStep: 250
        } : t ? p = t : p = null;
      });
      const { restoreEntry: O, storeEntry: C, releaseEntry: v } = K(P, U) ?? {};
      async function M(t, { abortController: o }) {
        u(t, {
          type: a.System,
          code: "STORE_BUSY",
          progress: 1 / 0
        });
        try {
          const s = p && !document.hidden ? ut(C, {
            ...p,
            total: t.size
          }) : C, { actionStore: n, actionAbort: i, valueKey: c } = d, r = await s(t, {
            onprogress: L(t),
            onabort: () => {
              l(t, {
                state: {
                  // don't abort again
                  [i]: !1,
                  // need to halt store action or will keep storing
                  [n]: null,
                  // reset storage key
                  [c]: null
                },
                extension: {
                  [E]: {
                    status: {
                      type: a.System,
                      code: "STORE_ABORT"
                    }
                  }
                }
              });
            },
            abortController: o
          });
          f(r) || l(t, {
            state: {
              [c]: r
            },
            extension: {
              [E]: {
                status: {
                  type: a.Success,
                  code: "STORE_COMPLETE"
                }
              }
            }
          });
        } catch (e) {
          throw u(t, {
            type: a.Error,
            code: "STORE_ERROR",
            values: { error: e }
          }), e;
        }
      }
      async function Q(t, { abortController: o }) {
        if (!O)
          return;
        u(t, {
          type: a.System,
          code: "RESTORE_BUSY",
          progress: 1 / 0
        });
        const { valueKey: e } = d, s = t.state[e];
        try {
          let n = await O(s, t, {
            onprogress: L(t),
            abortController: o,
            onabort: () => {
              u(t, {
                type: a.System,
                code: "RESTORE_ABORT"
              });
            }
          });
          l(t, {
            // if response is a blob we need BlobLoader to load the source
            src: ct(n) ? n : t.src,
            // if response is a file we can skip straight to file
            file: y(n) ? n : null,
            // new state
            state: {
              // remember storage key
              [e]: s
            },
            extension: {
              [E]: {
                // need to re-evaluate if we can store this file
                canStore: !0,
                // done!
                status: {
                  type: a.System,
                  code: "RESTORE_COMPLETE"
                }
              }
            }
          });
        } catch (n) {
          throw u(t, {
            type: a.Error,
            code: "RESTORE_ERROR",
            values: { error: n }
          }), n;
        }
      }
      async function w(t, { abortController: o }) {
        const { valueKey: e, actionLoad: s, actionStore: n, shouldStore: i } = d;
        try {
          const c = t.state[e];
          if (f(c))
            return;
          u(t, {
            type: a.System,
            code: "RELEASE_BUSY",
            progress: 1 / 0
          });
          let r = !1;
          if (i) {
            const R = t.state[n] === !1;
            r = await i(t) && R;
          }
          if (O && !y(t.file) && !r) {
            let R = await O(c, t, {
              onprogress: L(t),
              abortController: o,
              onabort: () => {
                u(t, {
                  type: a.System,
                  code: "RELEASE_ABORT"
                });
              }
            });
            l(t, {
              file: R
            });
          }
          v ? await v(c, t, {
            abortController: o,
            onabort: () => {
              u(t, {
                type: a.System,
                code: "RELEASE_ABORT"
              });
            }
          }) !== !1 && l(t, {
            state: {
              [e]: null,
              [s]: null
            },
            extension: {
              [E]: {
                canStore: !0,
                status: {
                  type: a.System,
                  code: "RELEASE_COMPLETE"
                }
              }
            }
          }) : l(t, {
            state: {
              [e]: null,
              [s]: null
            },
            extension: {
              [E]: {
                status: {
                  type: a.System,
                  code: "RELEASE_COMPLETE"
                }
              }
            }
          }), r && I(t);
        } catch (c) {
          throw u(t, {
            type: a.Error,
            code: "RELEASE_ERROR",
            values: { error: c }
          }), c;
        }
      }
      async function F(t) {
        const { valueKey: o } = d;
        if (!v)
          return;
        const e = t.state[o], s = !f(e), i = h(t)?.code !== "RESTORE_ERROR";
        if (!(!s || !i))
          try {
            await v(e, t);
          } catch {
          }
      }
      async function z(t) {
        const o = h(t), { valueKey: e, actionStore: s, actionLoad: n, actionAbort: i } = d, c = t.state[e] ?? null, r = f(t.state[s]) ? null : t.state[s];
        if (f(c)) {
          l(t, {
            state: {
              [e]: c,
              [s]: r
            },
            extension: {
              [E]: {
                // so we can match on extension actions
                actions: [s, n, i],
                // null means undetermined if we can activate, will trigger new test
                canStore: null,
                // awaiting new test
                status: {
                  type: a.System,
                  code: "STORE_LIMBO"
                }
              }
            }
          });
          return;
        }
        if (o.code !== "RESTORE_COMPLETE") {
          if (r !== !1 && o.code === "STORE_COMPLETE") {
            S(t.id, w), u(t, {
              type: a.System,
              code: "STORE_IDLE"
            });
            return;
          }
          l(t, {
            state: {
              [e]: c,
              [s]: r
            },
            extension: {
              [E]: {
                canStore: !0,
                status: {
                  type: a.Success,
                  code: "STORE_COMPLETE"
                }
              }
            }
          });
        }
      }
      async function G(t) {
        const { valueKey: o } = d, e = t.state[o], { canStore: s } = D(t);
        e && (s || u(t, {
          type: a.Success,
          code: "STORE_COMPLETE"
        }));
      }
      async function H(t) {
        const { valueKey: o } = d, e = t.state[o], s = nt(t) && y(t.file);
        l(t, {
          state: {
            [o]: e ?? null
          },
          extension: {
            [E]: {
              canStore: s,
              status: {
                type: a.System,
                code: s ? "STORE_READY" : "STORE_IDLE"
              }
            }
          }
        });
      }
      async function V(t) {
        const { actionStore: o, shouldStore: e } = d;
        if (!e)
          return;
        const s = await e(t);
        l(t, {
          state: {
            [o]: s
          }
        });
      }
      async function W(t) {
        u(t, {
          code: "STORE_QUEUED",
          type: a.System,
          progress: 1 / 0
        });
      }
      async function j(t) {
        const { valueKey: o, parallel: e, actionLoad: s, actionStore: n, actionAbort: i, shouldStore: c } = d, r = t.state[n], R = t.state[s], x = t.state[i], N = t.state[o], A = h(t), { canStore: T = null } = D(t), m = !f(N);
        if (T === null) {
          S(t.id, H);
          return;
        }
        if (r === null && c) {
          if (x === !1) {
            I(t);
            return;
          }
          S(t.id, V);
          return;
        }
        const tt = !f(O);
        if (m && !y(t.file) && tt && R === !0) {
          S(t.id, Q, { parallel: e });
          return;
        }
        if (m && r === !1) {
          S(t.id, w);
          return;
        }
        if (T === !1) {
          S(t.id, G);
          return;
        }
        const et = !m && T, b = A?.code === "STORE_BUSY";
        if (et && (r === !0 && x === !0)) {
          Y(t.id, M), b || l(t, {
            state: {
              [i]: !1,
              [n]: null
            },
            extension: {
              [E]: {
                status: {
                  type: a.System,
                  code: "STORE_READY"
                }
              }
            }
          });
          return;
        }
        const st = A?.code === "STORE_QUEUED", ot = A?.code === "STORE_ERROR";
        if (!m && !st && !ot && !b && r === !0 && T) {
          S(t.id, W);
          return;
        }
        if (!m && !b && r === !0 && T) {
          S(t.id, M, {
            parallel: e
          });
          return;
        }
      }
      function q(t) {
        const { valueKey: o } = d;
        if (o) {
          for (const e of t)
            if (f(e.state[o]))
              return g({
                type: a.Error,
                code: "STORE_AWAITING_COMPLETION",
                meta: { flag: "customError" }
              });
          g({
            type: a.System,
            code: "VALIDATION_COMPLETE"
          });
        }
      }
      const J = _("updateEntryData", z), X = _("updateEntry", j), Z = _("removeEntries", F), $ = _("updateEntries", rt(q));
      return {
        destroy() {
          J(), X(), $(), Z();
        }
      };
    }
  );
}
export {
  mt as createStoreExtension
};
