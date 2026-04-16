/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as s } from "./common/createExtension.js";
import { addListener as n } from "../utils/dom.js";
const p = s(
  "DragDropSource",
  {
    shouldHandleDrop: () => !0
  },
  ({ didSetProps: o }, { insertEntries: a }) => {
    let r, t;
    return o(({ shouldHandleDrop: d }) => {
      const i = (e) => e.preventDefault(), m = async (e) => {
        !e.dataTransfer || !e.target || e.target.type === "file" || d(e) && (e.preventDefault(), a({
          src: e.dataTransfer,
          origin: "drop"
        }));
      };
      r && r(), t && t(), r = n(document.documentElement, "drop", m), t = n(
        document.documentElement,
        "dragover",
        i
      );
    }), {
      destroy: () => {
        r && r(), t && t();
      }
    };
  }
);
export {
  p as DragDropSource
};
