/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { getAsElement as l } from "../utils/dom.js";
import { isFileEntry as a } from "../utils/test.js";
import { createExtension as E } from "./common/createExtension.js";
import { debounce as d } from "../utils/debounce.js";
import { warn as c } from "../common/console.js";
const T = E(
  "TextInputStore",
  {
    element: void 0
  },
  ({ props: o, didSetProps: i }, { on: s }) => {
    let t;
    i(({ element: e }) => {
      t = l(e), t.type !== "text" && (t = void 0), (!t || t.type !== "text") && c(`TextInputStore: HTMLInputElement not found ${e}`);
    });
    function m(e) {
      const { targetElement: r } = o;
      if (!r || !e.every(a))
        return;
      const n = e.filter((p) => !Object.values(p.extension ?? {}).some((f) => f.status?.type === "error"));
      r.value = n.length ? JSON.stringify(n) : "";
    }
    const u = s("updateEntries", d(m));
    return {
      destroy: () => {
        u();
      }
    };
  }
);
export {
  T as TextInputStore
};
