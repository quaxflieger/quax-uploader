/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as v } from "./common/createExtension.js";
import { isFile as b, isCanvas as g } from "../utils/test.js";
import { canvasToBlob as F } from "../utils/canvasToBlob.js";
import { Status as s } from "../common/status.js";
import { blobToFile as h } from "../utils/file.js";
import { getFilename as C, getExtension as L, getBasename as S } from "../common/entry.js";
const R = v(
  "CanvasLoader",
  {
    parallel: 1,
    type: void 0,
    quality: void 0,
    mimeTypeMap: void 0,
    getBasename: S,
    getExtension: L,
    getFilename: C
  },
  ({ props: o }, c) => {
    const { on: l, updateEntry: m, pushTask: p, setEntryExtensionStatus: a, getEntryExtensionStatus: u } = c;
    async function d(t) {
      a(t, {
        type: s.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      try {
        const { type: e, quality: n, getFilename: r } = o, i = await F(t.src, {
          type: e,
          quality: n
        }), y = h(i, r(t, i, o));
        m(t, { file: y });
      } catch (e) {
        throw a(t, {
          type: s.Error,
          code: "LOAD_ERROR",
          values: { error: e }
        }), e;
      }
      a(t, {
        type: s.Success,
        code: "LOAD_COMPLETE"
      });
    }
    function E(t) {
      const { parallel: e } = o;
      u(t)?.type === "error" || b(t.file) || !g(t.src) || p(t.id, d, { parallel: e });
    }
    const f = l("updateEntry", E);
    return {
      destroy: () => {
        f();
      }
    };
  }
);
export {
  R as CanvasLoader
};
