/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { isString as u, isNumber as f } from "./test.js";
import { numberToFloat as d } from "./number.js";
const m = {
  B: 0,
  // B
  K: 1,
  // KB
  M: 2,
  // MB
  G: 3,
  // GB
  T: 4,
  // TB
  P: 5,
  // PB
  E: 6,
  // EB
  Z: 7,
  // ZB
  Y: 8
  // YB
}, g = Object.keys(m), F = ["name", "size", "type", "lastModified"];
function E(t, e) {
  F.forEach((n) => {
    e[n] = t[n];
  });
}
function b(t, e) {
  return new File([t], e, { type: t.type, lastModified: t.lastModified });
}
function v(t) {
  return t.trim().replace(/[<>:;,"/\\|?*\x00-\x1F]/gi, "");
}
function A(t) {
  return u(t) ? /(?:\.([^.]+))?$/.exec(t)?.[0] : void 0;
}
function I(t) {
  return u(t) ? t.replace(/\.[^/.]+$/, "") : void 0;
}
const M = { plain: "txt" };
function S(t, e = {}) {
  if (u(t) && t.length) {
    const n = (t.match(/\/(?:x-)?([0-9a-z]+)(?:-compressed)?/i) || [])[1];
    if (n)
      return `.${{ ...M, ...e }[n] || n}`;
  }
}
function P(t) {
  return new File([t], t.name, { type: t.type, lastModified: t.lastModified });
}
function z(t, e) {
  return new File([t], t.name, {
    type: e.type ? e.type : t.type,
    lastModified: e.lastModified ? e.lastModified : t.lastModified
  });
}
function B(t, e, n) {
  const { type: o = t.type, lastModified: i = (/* @__PURE__ */ new Date()).getTime() } = n ?? {};
  return new File([t], e, {
    type: o,
    lastModified: i
  });
}
function _(t, e) {
  const { locale: n = void 0 } = {};
  if (f(t))
    return t;
  const o = (t.match(/[\d.,]+/) || [])[0];
  if (!o)
    throw new Error(`naturalFileSizeToBytes: Invalid natural file size ${t}`);
  const i = d(o, n), a = t.replace(o, "").trim(), r = a[1] === "i" ? 1024 : 1e3, c = m[a[0]];
  return i * Math.pow(r, c);
}
function G(t, e) {
  const { locale: n = void 0, byteUnits: o = "mega", ...i } = e || {}, a = o === "mega", r = a ? 1e3 : 1024, c = t === 0 ? 0 : Math.floor(Math.log(t) / Math.log(r));
  return `${new Intl.NumberFormat(n, {
    style: "decimal",
    maximumFractionDigits: 0,
    ...i
  }).format(t / Math.pow(r, c))} ${g[c] + (a ? "" : "i") + (c > 0 ? "B" : "")}`;
}
function $(t) {
  if (!(f(t) || !t))
    return /i/.test(t) ? "mebi" : "mega";
}
const y = (t, e) => e.every((n, o) => t[o] === n), h = (t, e) => (n) => y(n, e) && t, l = "application/", s = "image/";
[
  [s + "jpeg", [255, 216, 255]],
  [s + "png", [137, 80, 78, 71]],
  [s + "gif", [71, 73, 70]],
  [s + "tiff", [73, 73, 42, 0]],
  [s + "psd", [56, 66, 80, 83]],
  [s + "bmp", [66, 77]],
  [l + "pdf", [37, 80, 68, 70]],
  [l + "zip", [80, 75, 4, 4]],
  [l + "ogg", [79, 103, 103, 83]],
  [l + "x-rar-compressed", [82, 97, 114, 33, 26, 7]]
].map((t) => h(...t));
async function p(t, e = 64) {
  if (e <= 0)
    throw new Error("getApproximateBlobHash: hashSize needs to be a positive non zero integer");
  const n = Math.round(t.size * 0.5), o = Math.min(e, t.size), i = Math.floor(o / 2), a = Math.ceil(o / 2), r = t.slice(n - i, n + a);
  return new Uint8Array(await r.arrayBuffer()).join("");
}
async function N(t, e, n) {
  if (!t || !e)
    return !1;
  const o = await p(t, n), i = await p(e, n);
  return o === i;
}
export {
  B as blobToFile,
  G as bytesToNaturalFileSize,
  P as cloneFile,
  z as cloneFileWithOptions,
  E as copyFilePropsToObject,
  N as filesAreProbablyEqual,
  p as getApproximateBlobHash,
  A as getExtensionFromFilename,
  S as getExtensionFromMimeType,
  I as getFilenameWithoutExtension,
  $ as getFormatFromFileSize,
  _ as naturalFileSizeToBytes,
  v as sanitizeFilename,
  b as updateFilename
};
