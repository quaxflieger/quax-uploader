/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createValidatorExtension as S } from "./common/createValidatorExtension.js";
import { isFileEntry as z, isBlobOrFile as E } from "../utils/test.js";
import { naturalFileSizeToBytes as m, bytesToNaturalFileSize as l, getFormatFromFileSize as r } from "../utils/file.js";
const V = S(
  "FileSizeValidator",
  {
    minSize: 0,
    maxSize: 1 / 0,
    byteUnits: void 0
  },
  ({ didSetProps: o }) => {
    const t = {
      min: 0,
      max: 1 / 0
    }, i = {
      min: null,
      minUnit: null,
      max: null,
      maxUnit: null
    };
    o(({ minSize: n, maxSize: a, byteUnits: e }) => {
      e = e || r(a) || r(n) || "mega", t.min = m(n), t.max = m(a);
      const [s, F] = l(t.min, { byteUnits: e }).split(" "), [c, f] = l(t.max, { byteUnits: e }).split(" ");
      i.min = s, i.minUnit = F, i.max = c, i.maxUnit = f;
    });
    function u(n) {
      const { size: a } = n.file;
      return a < t.min ? {
        code: "VALIDATION_FILE_SIZE_UNDERFLOW",
        values: {
          minSize: i.min,
          minSizeUnit: `unit${i.minUnit}`
        }
      } : a > t.max ? {
        code: "VALIDATION_FILE_SIZE_OVERFLOW",
        values: {
          maxSize: i.max,
          maxSizeUnit: `unit${i.maxUnit}`
        }
      } : null;
    }
    function x(n) {
      return z(n) && E(n.file);
    }
    return {
      validateEntry: u,
      canValidateEntry: x
    };
  }
);
export {
  V as FileSizeValidator
};
