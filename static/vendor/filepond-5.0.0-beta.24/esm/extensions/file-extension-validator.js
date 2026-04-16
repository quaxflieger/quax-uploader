/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createValidatorExtension as u } from "./common/createValidatorExtension.js";
import { isString as d, isFileEntry as l, isFile as a, isBlobOrFile as E } from "../utils/test.js";
import { getExtensionFromFilename as p } from "../utils/file.js";
const A = u(
  "FileExtensionValidator",
  {
    accept: [],
    format: (n) => n.map((o) => o.substring(1)).join(", ").toUpperCase()
  },
  ({ props: n, didSetProps: o }) => {
    let i = [];
    o(({ accept: t }) => {
      i = d(t) ? t.split(",").map((e) => e.trim()).filter((e) => e.startsWith(".")) : t;
    });
    function s(t) {
      const { format: e } = n;
      if (!l(t) || !a(t.file))
        return null;
      const { name: r } = t.file;
      if (r === void 0)
        return {
          code: "VALIDATION_FILE_NAME_MISSING"
        };
      const f = p(r);
      return i.some((c) => c === f) ? null : {
        code: "VALIDATION_FILE_EXTENSION_MISMATCH",
        values: { accept: e(i), count: i.length }
      };
    }
    function m(t) {
      return !l(t) || !a(t.file) ? !1 : !!(E(t.file) && t.file?.name) && i.length > 0;
    }
    return {
      validateEntry: s,
      canValidateEntry: m
    };
  }
);
export {
  A as FileExtensionValidator
};
