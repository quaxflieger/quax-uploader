/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { noop as y } from "../utils/placeholder.js";
import { isFileEntry as E, isFile as V } from "../utils/test.js";
import { createExtension as v } from "./common/createExtension.js";
import { arrayRemoveFalsy as g, arrayItemsEqual as I } from "../utils/array.js";
import { Status as u } from "../common/status.js";
import { debounce as T } from "../utils/debounce.js";
const q = v(
  "ValueCallbackStore",
  {
    // if the value is required or not
    required: !1,
    // need to know the value key
    valueKey: "value",
    // custom function to convert entry to value for formdata
    entryToValue: void 0,
    // called when formdata object changed
    onChange: y
  },
  ({ props: o, didSetProps: i }, { on: s, getEntries: f, setExtensionStatus: l }) => {
    let t = [];
    i(() => {
      n(f());
    });
    function m(e) {
      const { valueKey: r } = o;
      if (Object.hasOwn(e.state, r))
        return e.state[r];
      if (!(!E(e) || !V(e.file)))
        return e.file;
    }
    function n(e) {
      const { required: r, onChange: p, entryToValue: d = m } = o, a = g(e.map(d));
      t.length && I(t, a) || (t = a, r && !a.length ? l({
        type: u.Error,
        code: "VALIDATION_INVALID_EMPTY",
        meta: { flag: "valueMissing" }
      }) : l({
        type: u.System,
        code: "VALIDATION_COMPLETE"
      }), p(a));
    }
    const c = s("updateEntries", T(n));
    return {
      destroy: () => {
        t.length = 0, c();
      }
    };
  }
);
export {
  q as ValueCallbackStore
};
