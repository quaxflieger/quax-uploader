/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { debounce as m } from "../utils/debounce.js";
import { createExtension as f } from "./common/createExtension.js";
import { getAsElement as E, setFileInputFilesFromEntries as a } from "../utils/dom.js";
import { isFileEntry as d } from "../utils/test.js";
import { warn as c } from "../common/console.js";
const U = f(
  "FileInputStore",
  {
    element: void 0,
    // the event fired on the element when it's updated, defaults to 'update'
    elementUpdateEvent: void 0
  },
  ({ props: r, didSetProps: o }, { on: i }) => {
    let e;
    o(({ element: t }) => {
      e = E(t), e?.type !== "file" && (e = null), t && (!e || e.type !== "file") && c(`FileInputStore: HTMLInputElement not found ${t}`);
    });
    function p(t) {
      if (!e || !t.every(d))
        return;
      const { elementUpdateEvent: l } = r;
      a(
        e,
        // @ts-ignore we know these are file entries
        t.filter((n) => n.extension ? !Object.values(n.extension).some((s) => s.status?.type === "error") : !0),
        {
          customEventType: l
        }
      );
    }
    const u = i("updateEntries", m(p));
    return {
      destroy: () => {
        u();
      }
    };
  }
);
export {
  U as FileInputStore
};
