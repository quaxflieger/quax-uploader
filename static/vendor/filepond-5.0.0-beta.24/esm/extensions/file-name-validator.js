/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createValidatorExtension as c } from "./common/createValidatorExtension.js";
import { isFileEntry as o, isFile as f, isFunction as m, isBlobOrFile as u } from "../utils/test.js";
import { getFilenameWithoutExtension as d } from "../utils/file.js";
import { warn as E } from "../common/console.js";
const V = c(
  "FileNameValidator",
  {},
  ({ props: i }) => {
    const { test: r } = i;
    r || E("FileNameValidator: 'test' is a required property");
    function a(t) {
      const { test: e } = i;
      if (!o(t))
        return null;
      const { name: n } = f(t.file) ? t.file : t;
      if (n === void 0)
        return {
          code: "VALIDATION_FILE_NAME_MISSING"
        };
      const s = d(n);
      return e(s) ? null : {
        code: "VALIDATION_FILE_NAME_MISMATCH"
      };
    }
    function l(t) {
      const { test: e } = i;
      return !m(e) || !o(t) ? !1 : !!(u(t.file) && t.file?.name);
    }
    return {
      validateEntry: a,
      canValidateEntry: l
    };
  }
);
export {
  V as FileNameValidator
};
