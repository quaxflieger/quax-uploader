/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as z } from "./common/createExtension.js";
import { naturalFileSizeToBytes as s, bytesToNaturalFileSize as u, getFormatFromFileSize as f } from "../utils/file.js";
import { flattenTree as T } from "../utils/tree.js";
import { Status as o } from "../common/status.js";
import { isBlobOrFile as E } from "../utils/test.js";
const _ = z(
  "ListSizeValidator",
  {
    minListSize: 0,
    maxListSize: 1 / 0,
    byteUnits: void 0
  },
  ({ didSetProps: c }, { on: x, setExtensionStatus: a, getEntries: L }) => {
    const i = {
      min: 0,
      max: 1 / 0
    }, n = {
      min: null,
      minUnit: null,
      max: null,
      maxUnit: null
    };
    let l = !1;
    c(({ minListSize: m, maxListSize: e, byteUnits: t }) => {
      t = t || f(e) || f(m) || "mega", i.min = s(m || 0), i.max = s(e || 1 / 0);
      const [r, d] = u(i.min, { byteUnits: t }).split(" "), [p, A] = u(i.max, { byteUnits: t }).split(" ");
      n.min = r, n.minUnit = d, n.max = p, n.maxUnit = A, l = i.min !== 0 || i.max !== 1 / 0, I(L());
    });
    function I(m) {
      if (!l)
        return;
      const e = T(m).reduce(
        // @ts-ignore
        (t, r) => t + (E(r.file) ? r.size : 0),
        0
      );
      if (e < i.min)
        return a({
          type: o.Error,
          code: "VALIDATION_INVALID",
          subcode: "VALIDATION_LIST_SIZE_UNDERFLOW",
          values: {
            minSize: n.min,
            minSizeUnit: `unit${n.minUnit}`
          }
        });
      if (e > i.max)
        return a({
          type: o.Error,
          code: "VALIDATION_INVALID",
          subcode: "VALIDATION_LIST_SIZE_OVERFLOW",
          values: {
            maxSize: n.max,
            maxSizeUnit: `unit${n.maxUnit}`
          }
        });
      a({
        type: o.System,
        code: "VALIDATION_COMPLETE"
      });
    }
    const S = x("updateEntries", I);
    return {
      destroy: () => {
        S();
      }
    };
  }
);
export {
  _ as ListSizeValidator
};
