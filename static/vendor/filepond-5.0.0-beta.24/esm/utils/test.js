/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
function e(t, n = !0) {
  let r = null;
  return () => n && !l() ? !1 : (r === null && (r = t()), r);
}
function p(t) {
  return t === void 0;
}
function d(t) {
  return t == null;
}
function c(t) {
  return typeof t == "string";
}
function g(t) {
  return typeof t == "number";
}
function b(t) {
  return typeof t == "boolean";
}
function m(t) {
  return typeof t == "function";
}
function F(t) {
  return t instanceof HTMLElement;
}
function A(t) {
  let n;
  try {
    n = new URL(t);
  } catch {
    return !1;
  }
  return n.protocol === "http:" || n.protocol === "https:";
}
function E(t) {
  return t instanceof RegExp;
}
function o(t) {
  return Object.getPrototypeOf(t) === Object.prototype;
}
function O(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
function D(t) {
  return t && typeof t == "object";
}
function s(t) {
  return Array.isArray(t);
}
function h(t) {
  return c(t) && /data:/.test(t);
}
function j(t) {
  return t instanceof HTMLCanvasElement;
}
function u(t) {
  return t instanceof Blob;
}
function w(t) {
  return t instanceof Blob && !f(t);
}
function f(t) {
  return t instanceof File;
}
function a(t) {
  return t instanceof DataTransfer;
}
function B(t) {
  return !!(u(t) && /video/.test(t.type));
}
function T(t) {
  return !!(u(t) && /image/.test(t.type));
}
function x(t) {
  return a(t.src);
}
function L(t) {
  return !!(t && o(t) && !s(t.entries));
}
function R(t) {
  return !!(t && o(t) && s(t.entries));
}
function P(t) {
  return t?.isDirectory;
}
function S(t) {
  return t?.isFile;
}
function l() {
  return i === null && (i = typeof window < "u" && typeof window.document < "u"), i;
}
let i = null;
const U = e(() => /^((?!chrome|android).)*(safari|iphone|ipad)/i.test(navigator.userAgent)), M = e(() => /Firefox/.test(navigator.userAgent)), C = e(() => /iPhone|iPad|iPod/.test(navigator.userAgent) || y() && navigator.maxTouchPoints >= 1), y = e(() => {
  const { platform: t } = "userAgentData" in navigator ? navigator.userAgentData : navigator;
  return /^mac/i.test(t);
});
export {
  e as createTest,
  s as isArray,
  w as isBlob,
  u as isBlobOrFile,
  b as isBoolean,
  l as isBrowser,
  j as isCanvas,
  a as isDataTransfer,
  x as isDataTransferEntry,
  h as isDataURL,
  R as isDirectoryEntry,
  F as isElement,
  f as isFile,
  L as isFileEntry,
  P as isFileSystemDirectoryEntry,
  S as isFileSystemFileEntry,
  M as isFirefox,
  m as isFunction,
  C as isIOS,
  T as isImageFile,
  y as isMac,
  d as isNullOrUndefined,
  g as isNumber,
  O as isObject,
  o as isObjectLiteral,
  D as isObjectOrArray,
  E as isRegExp,
  U as isSafari,
  c as isString,
  A as isURL,
  p as isUndefined,
  B as isVideoFile
};
