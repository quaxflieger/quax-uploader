/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as P } from "./common/createExtension.js";
import { COMPONENT_PROPS as R } from "../elements/FilePondEntryList/index.js";
import { addListener as T } from "../utils/dom.js";
const L = R.reduce((n, s) => (n[s] = void 0, n), {}), U = P(
  "EntryListView",
  {
    // props available on this element
    ...L,
    // element reference
    element: void 0
  },
  (n, s) => {
    const { didSetProps: l } = n, {
      on: o,
      getEntries: u,
      setEntries: d,
      pushTask: y,
      abortTask: b,
      insertEntries: m,
      removeEntries: p,
      updateEntry: f,
      getEntryExtensionState: k,
      setEntryExtensionState: C
    } = s;
    let t, r;
    l(
      ({ element: e, ...h }) => {
        e && (t = e, Object.assign(t, {
          ...h
        }), i(), r?.(), r = T(t, "connected", () => {
          i();
        }));
      }
    );
    function i() {
      t.setSetEntriesCallback(d), t.setInsertEntriesCallback(m), t.setRemoveEntriesCallback(p), t.setUpdateEntryCallback(f), t.setSetEntryExtensionStateCallback(C), t.setGetEntryExtensionStateCallback(k), t.setPushTaskCallback(y), t.setAbortTaskCallback(b), t.onSetEntries(u());
    }
    function S(e) {
      t?.onRemoveEntry(e);
    }
    function v(e) {
      t?.onInsertEntry(e);
    }
    function x(e) {
      t?.onSetEntries(e);
    }
    const a = o("insertEntry", v), E = o("removeEntry", S), c = o("updateEntries", x);
    return {
      destroy() {
        r && r(), c && c(), a && a(), E && E();
      }
    };
  }
);
export {
  U as EntryListView
};
