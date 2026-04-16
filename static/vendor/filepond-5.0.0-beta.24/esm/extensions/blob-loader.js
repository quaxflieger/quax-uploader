/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as u } from "./common/createExtension.js";
import { isBlob as b, isFile as F } from "../utils/test.js";
import { blobToFile as g } from "../utils/file.js";
import { Status as i } from "../common/status.js";
import { getFilename as B, getExtension as L, getBasename as h } from "../common/entry.js";
const D = u(
  "BlobLoader",
  {
    mimeTypeMap: void 0,
    getBasename: h,
    getExtension: L,
    getFilename: B
  },
  ({ props: s }, { on: a, updateEntry: c, pushTask: l, setEntryExtensionStatus: t, getEntryExtensionStatus: m }) => {
    function n(o) {
      t(o, {
        type: i.System,
        code: "LOAD_BUSY",
        progress: 1 / 0
      });
      const r = o.src;
      try {
        const { getFilename: e } = s, f = g(r, e(o, r, s));
        c(o, { file: f });
      } catch (e) {
        throw t(o, {
          type: i.Error,
          code: "LOAD_ERROR",
          values: { error: e }
        }), e;
      }
      t(o, {
        type: i.Success,
        code: "LOAD_COMPLETE"
      });
    }
    function d(o) {
      m(o)?.type === "error" || !b(o.src) || F(o.file) || l(o.id, n);
    }
    const p = a("updateEntry", d);
    return {
      destroy: () => {
        p();
      }
    };
  }
);
export {
  D as BlobLoader
};
