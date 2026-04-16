/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createTransformExtension as x } from "./common/createTransformExtension.js";
import { isString as m } from "../utils/test.js";
import { getFilenameWithoutExtension as F, getExtensionFromFilename as p, updateFilename as y, sanitizeFilename as h } from "../utils/file.js";
const H = x(
  "FileNameTransform",
  {
    actionTransform: "renameFile",
    sanitizeName: h,
    renameEntry: (t, i) => {
    }
  },
  ({ props: t, extensionName: i }) => {
    async function c(n) {
      const { renameEntry: f, sanitizeName: l, actionTransform: o } = t, { name: a = "" } = n, N = F(a), E = p(a), r = [...n.extension[i].history ?? []], s = (m(n.state[o]) ? n.state[o] : null) || await f(n, {
        basename: N,
        extension: E,
        history: [...r]
      });
      if (!m(s))
        return;
      const e = l(s);
      if (!e.length || e === n.file.name)
        return;
      const u = [...r, n.file.name];
      return {
        file: y(n.file, e),
        history: u
      };
    }
    return {
      transformEntry: c
    };
  }
);
export {
  H as FileNameTransform
};
