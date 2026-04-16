/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createStoreExtension as s } from "./common/createStoreExtension.js";
import { thread as m, createThreadWorker as c } from "../utils/thread.js";
import { isFileEntry as f } from "../utils/test.js";
import { readFile as d } from "../workers/readFile.js";
const k = s(
  "DataURLStore",
  {
    workersURL: void 0
  },
  ({ props: t }) => {
    async function e(r, { abortController: o, onprogress: a, onabort: i }) {
      const { workersURL: n } = t;
      return f(r) ? (await m(c(n, d), [r.file], {
        abortController: o,
        onprogress: a,
        onabort: i
      })).dataURL : void 0;
    }
    return {
      storeEntry: e
    };
  }
);
export {
  k as DataURLStore
};
