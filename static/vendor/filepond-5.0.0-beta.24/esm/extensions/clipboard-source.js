/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { addListener as c } from "../utils/dom.js";
import { createExtension as p } from "./common/createExtension.js";
const f = p(
  "ClipboardSource",
  {
    shouldHandlePaste: () => !0
  },
  ({ didSetProps: o }, i) => {
    const { insertEntries: a } = i;
    let e;
    return o(({ shouldHandlePaste: n }) => {
      const s = (t) => {
        if (!t.clipboardData || !n(t))
          return;
        const { items: d, files: r } = t.clipboardData;
        (!r || !r.length) && ![...d].some((l) => l.kind === "file") || (t.preventDefault(), t.stopPropagation(), a({
          src: t.clipboardData,
          origin: "clipboard"
        }));
      };
      e && e(), e = c(document.documentElement, "paste", s);
    }), {
      destroy: () => {
        e && e();
      }
    };
  }
);
export {
  f as ClipboardSource
};
