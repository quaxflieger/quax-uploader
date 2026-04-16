/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
function t(e) {
  return URL.createObjectURL(e);
}
function c(e) {
  URL.revokeObjectURL(e);
}
export {
  t as createObjectURL,
  c as revokeObjectURL
};
