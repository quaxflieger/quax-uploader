/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as Y } from "./createExtension.js";
import { isFileEntry as j, isBlobOrFile as q, isFile as M, isNullOrUndefined as L, isFunction as O } from "../../utils/test.js";
import { cloneFile as z, cloneFileWithOptions as G } from "../../utils/file.js";
import { Status as e } from "../../common/status.js";
function X(u, P, k) {
  return Y(
    u,
    {
      // default action props
      actionTransform: "transform",
      actionLoad: "load",
      shouldTransform: void 0,
      parallel: 1,
      filterEntry: (R) => !0,
      ...P
    },
    (R, y) => {
      const { props: f } = R, {
        on: F,
        updateEntry: c,
        pushTask: d,
        abortTask: N,
        abortTasks: g,
        setEntryExtensionStatus: m,
        getEntryExtensionState: p,
        setEntryExtensionState: w,
        createProgressHandler: h
      } = y, {
        transformEntry: x = () => null,
        canTransformEntry: U = (t) => j(t) && q(t.file),
        prepareTransformEntry: A = void 0
      } = k(R, y);
      async function D(t, { abortController: s }) {
        const { actionTransform: o, actionLoad: n, shouldTransform: r } = f;
        if (O(A)) {
          m(t, {
            type: e.System,
            code: "TRANSFORM_PREPARE",
            progress: 1 / 0
          });
          try {
            await A(t, {
              abortController: s,
              onprogress: h(t)
            });
          } catch (T) {
            m(t, {
              type: e.Error,
              code: "TRANSFORM_PREPARE_ERROR",
              values: { error: T }
            });
            return;
          }
          m(t, {
            type: e.System,
            code: "TRANSFORM_PREPARE_COMPLETE"
          });
        }
        m(t, {
          type: e.System,
          code: "TRANSFORM_BUSY",
          progress: 1 / 0
        });
        let a;
        try {
          a = await x(t, {
            abortController: s,
            onprogress: h(t)
          });
        } catch (T) {
          if (m(t, {
            type: e.Error,
            code: "TRANSFORM_ERROR",
            values: { error: T }
          }), O(r))
            throw T;
          return;
        }
        const l = {
          [o]: O(r) ? !1 : null
        };
        if (!a) {
          c(t, {
            state: l,
            extension: {
              [u]: {
                status: {
                  type: e.System,
                  code: "TRANSFORM_CANCEL"
                }
              }
            }
          });
          return;
        }
        let { file: i, history: S } = M(a) ? { file: a } : a;
        i.lastModified <= t.file.lastModified && (i = G(i, {
          lastModified: i.lastModified + 1
        }));
        const { input: E } = p(t);
        c(
          // current entry
          t,
          // transformed file props
          {
            file: i
          },
          // programmatically updated props
          {
            // we don't transform again
            state: {
              ...l,
              [n]: null
            },
            // did edit Entry
            extension: {
              [u]: {
                // the input file used
                input: E ?? t.file,
                // data for this edit
                history: S,
                // update status
                status: {
                  type: e.System,
                  code: "TRANSFORM_COMPLETE"
                }
              }
            }
          }
        );
      }
      async function I(t) {
        const { actionTransform: s } = f, { input: o } = p(t);
        g(t.id), c(
          // current entry
          t,
          // reset to original file
          {
            file: z(o)
          },
          // reset all changes
          {
            state: {
              [s]: null
            },
            extension: {
              [u]: {
                input: null,
                history: [],
                status: {
                  type: e.System,
                  code: "TRANSFORM_IDLE"
                }
              }
            }
          }
        );
      }
      async function b(t) {
        const { actionTransform: s, shouldTransform: o } = f;
        if (!o)
          return;
        const { input: n } = p(t);
        if (n)
          return;
        const r = await o(t);
        c(t, {
          state: {
            [s]: r
          }
        });
      }
      async function _(t) {
        const { actionTransform: s, filterEntry: o } = f;
        let n = await U(t);
        n && (n = await o(t)), w(t, {
          canTransform: n,
          actions: n ? [s] : [],
          status: {
            type: e.System,
            code: "TRANSFORM_IDLE"
          }
        });
      }
      async function v(t) {
        const { actionLoad: s } = f;
        c(t, {
          state: {
            [s]: !0
          }
        });
      }
      async function C(t) {
        const { actionTransform: s, shouldTransform: o } = f, { file: n } = t;
        if (!M(n))
          return;
        const r = L(t.state[s]) ? null : t.state[s], { canTransform: a, input: l } = p(t);
        a !== null && (l && n.lastModified >= l.lastModified || (N(t.id, _), c(t, {
          state: {
            // when `shouldTransform` is set we don't accept `false` for transform action
            [s]: o && r === !1 ? null : r
          },
          extension: {
            [u]: {
              // the action string that triggers this transform extension
              actions: a ? [s] : [],
              // null means undetermined if we can activate
              canTransform: null,
              // reset last transform date
              input: null,
              // now idle
              status: {
                type: e.System,
                code: "TRANSFORM_LIMBO"
              }
            }
          }
        })));
      }
      async function B(t) {
        const { actionTransform: s, actionLoad: o, parallel: n, shouldTransform: r } = f, { canTransform: a = null, input: l } = p(t), i = t.state[s], S = t.state[o], E = !L(i) && i !== !1;
        if (a === !1)
          return;
        if (E && S === null && !M(t.file)) {
          d(t.id, v);
          return;
        }
        if (a === null) {
          d(t.id, _);
          return;
        }
        if (i === null && r) {
          d(t.id, b);
          return;
        }
        if (i === !1 && !!l && !r) {
          d(t.id, I, { parallel: n });
          return;
        }
        if (E && a) {
          d(t.id, D, { parallel: n });
          return;
        }
      }
      const H = F("updateEntryData", C), W = F("updateEntry", B);
      return {
        destroy() {
          W(), H();
        }
      };
    }
  );
}
export {
  X as createTransformExtension
};
