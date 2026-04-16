/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createStoreExtension as i } from "./common/createStoreExtension.js";
import { createProgressEvent as n } from "../utils/xhr.js";
import { isFileEntry as c, isFile as s } from "../utils/test.js";
import { createObjectURL as f, revokeObjectURL as m } from "../utils/objectURL.js";
const E = i(
  "ObjectURLStore",
  {},
  () => {
    async function r(e, { onprogress: o }) {
      if (!(!c(e) || !s(e.file)))
        return o(n(!1)), f(e.file);
    }
    async function t(e) {
      m(e);
    }
    return {
      storeEntry: r,
      releaseEntry: t
    };
  }
);
export {
  E as ObjectURLStore
};
