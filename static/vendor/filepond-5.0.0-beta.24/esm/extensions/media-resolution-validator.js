/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createValidatorExtension as M } from "./common/createValidatorExtension.js";
import { isFileEntry as D, isFile as g, isImageFile as x, isVideoFile as H } from "../utils/test.js";
import { getMediaSize as V } from "../utils/media.js";
const v = M(
  "MediaResolutionValidator",
  {
    toNaturalResolution: (m) => `${Math.round(m / 1e6)}`
  },
  ({ props: m, didSetProps: O }, { updateEntry: N }) => {
    let _ = !1, E = !1, c = !1;
    O(
      ({
        minWidth: i = 1,
        maxWidth: R = 1 / 0,
        minHeight: o = 1,
        maxHeight: t = 1 / 0,
        minResolution: n = 1,
        maxResolution: e = 1 / 0
      }) => {
        _ = i > 0 || R < 1 / 0, E = o > 0 || t < 1 / 0, c = n > 0 || e < 1 / 0;
      }
    );
    async function T(i) {
      if (!D(i) || !g(i.file))
        return null;
      const { file: R } = i;
      if (!_ && !E && !c)
        return null;
      const o = await V(R);
      if (o === null)
        return {
          code: "VALIDATION_MEDIA_SIZE_UNAVAILABLE"
        };
      N(i, {
        meta: {
          size: o
        }
      });
      const { width: t, height: n } = o, {
        minWidth: e,
        maxWidth: a,
        minHeight: l,
        maxHeight: s,
        minResolution: u,
        maxResolution: I,
        toNaturalResolution: f
      } = m;
      if (_ && (t < e || t > a)) {
        const r = t < e, A = t > a;
        if (e > 1 && a < 1 / 0)
          return {
            code: "VALIDATION_MEDIA_WIDTH_RANGE_MISMATCH",
            values: {
              minWidth: e,
              minWidthUnit: "unitPixels",
              maxWidth: a,
              maxWidthUnit: "unitPixels"
            }
          };
        if (r)
          return {
            code: "VALIDATION_MEDIA_WIDTH_UNDERFLOW",
            values: { minWidth: e, minWidthUnit: "unitPixels" }
          };
        if (A)
          return {
            code: "VALIDATION_MEDIA_WIDTH_OVERFLOW",
            values: { maxWidth: a, maxWidthUnit: "unitPixels" }
          };
      }
      if (E && (n < l || n > s)) {
        const r = n < l, A = n > s;
        if (l > 1 && s < 1 / 0)
          return {
            code: "VALIDATION_MEDIA_HEIGHT_RANGE_MISMATCH",
            values: {
              minHeight: l,
              minHeightUnit: "unitPixels",
              maxHeight: s,
              maxHeightUnit: "unitPixels"
            }
          };
        if (r)
          return {
            code: "VALIDATION_MEDIA_HEIGHT_UNDERFLOW",
            values: { minHeight: l, minHeightUnit: "unitPixels" }
          };
        if (A)
          return {
            code: "VALIDATION_MEDIA_HEIGHT_OVERFLOW",
            values: { maxHeight: s, maxHeightUnit: "unitPixels" }
          };
      }
      const d = t * n;
      if (c && (d < u || d > I)) {
        const r = d < u, A = d > I;
        if (u > 1 && I < 1 / 0)
          return {
            code: "VALIDATION_MEDIA_RESOLUTION_RANGE_MISMATCH",
            values: {
              minResolution: f(u),
              maxResolution: f(I)
            }
          };
        if (r)
          return {
            code: "VALIDATION_MEDIA_RESOLUTION_UNDERFLOW",
            values: { minResolution: f(u) }
          };
        if (A)
          return {
            code: "VALIDATION_MEDIA_RESOLUTION_OVERFLOW",
            values: { maxResolution: f(I) }
          };
      }
      return null;
    }
    function h(i) {
      return D(i) && (x(i.file) || H(i.file));
    }
    return {
      validateEntry: T,
      canValidateEntry: h
    };
  }
);
export {
  v as MediaResolutionValidator
};
