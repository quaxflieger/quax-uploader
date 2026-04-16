/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createValidatorExtension as p } from "./common/createValidatorExtension.js";
import { isString as n, isFileEntry as c, isBlobOrFile as d } from "../utils/test.js";
import { upperCaseFirstLetter as M } from "../utils/string.js";
const I = p(
  "FileMimeTypeValidator",
  {
    accept: [],
    format: (l) => l.map((o) => {
      const [r, i] = o.split("/");
      return i === "*" ? `fileMainType${M(r)}` : i.toUpperCase();
    }).join(", ")
  },
  ({ props: l, didSetProps: o }) => {
    let r = [], i = [];
    o(({ accept: e }) => {
      r = (n(e) ? e.split(",") : e).map(
        (t) => n(t) ? t.trim() : t
      ).filter((t) => n(t) ? t.length === 0 ? !1 : !t.startsWith(".") : !0), i = r.map((t) => n(t) ? t.includes("*") ? new RegExp("^" + t.split("*")[0], "i") : new RegExp("^" + t + "$", "i") : t);
    });
    function a(e) {
      const { format: t } = l, { type: f } = e.file;
      return i.some((u) => u.test(f)) ? null : {
        code: "VALIDATION_FILE_MIME_TYPE_MISMATCH",
        values: {
          accept: t(r),
          count: r.length
        }
      };
    }
    function s(e) {
      return !c(e) || !d(e.file) || i.length === 0 ? !1 : !!e.file.type;
    }
    return {
      validateEntry: a,
      canValidateEntry: s
    };
  }
);
export {
  I as FileMimeTypeValidator
};
