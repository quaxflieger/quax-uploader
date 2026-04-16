/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { Status as n } from "../common/status.js";
import { createExtension as L } from "./common/createExtension.js";
const T = L(
  "ListCountValidator",
  {
    minFiles: 0,
    maxFiles: 1 / 0
  },
  ({ props: l, didSetProps: a }, { on: u, setExtensionStatus: e }) => {
    let r = !1;
    a(({ minFiles: i, maxFiles: t }) => {
      r = i !== 0 || t !== 1 / 0;
    });
    function m(i) {
      if (!r)
        return;
      const t = i.length, { minFiles: s, maxFiles: o } = l;
      if (t < s)
        return e({
          type: n.Error,
          code: "VALIDATION_LIST_ENTRY_COUNT_UNDERFLOW",
          values: { minFiles: s, minFilesUnit: "unitFiles" }
        });
      if (t > o)
        return e({
          type: n.Error,
          code: "VALIDATION_LIST_ENTRY_COUNT_OVERFLOW",
          values: { maxFiles: o, maxFilesUnit: "unitFiles" }
        });
      e({
        type: n.System,
        code: "VALIDATION_COMPLETE"
      });
    }
    const E = u("updateEntries", m);
    return {
      destroy: () => {
        E();
      }
    };
  }
);
export {
  T as ListCountValidator
};
