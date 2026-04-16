/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { arrayRemoveFalsy as g } from "../utils/array.js";
import { noop as f } from "../utils/placeholder.js";
import { isFileSystemDirectoryEntry as d, isFunction as y, isFileSystemFileEntry as p } from "../utils/test.js";
import { eachTree as A, mapTreeAsync as E } from "../utils/tree.js";
import { idleCallbackPromise as T } from "../utils/window.js";
async function L(e, t) {
  const { onprogress: i = f, onabort: o = f, abortController: n } = t ?? {}, { items: r } = e ?? {};
  if (!r)
    return [];
  let a = !1, s = 0, c = 0;
  const w = u(r), m = await h(w, t);
  if (n?.signal.aborted) {
    o();
    return;
  }
  return A(m, (l) => {
    y(l) && s++;
  }), i({ loaded: c, total: s }), await E(
    m,
    async (l) => {
      if (y(l)) {
        if (n?.signal.aborted) {
          a || o(), a = !0;
          return;
        }
        const b = await l();
        return c++, i({ loaded: c, total: s }), b;
      }
      return l;
    },
    "entries"
  );
}
async function h(e, t) {
  const { abortController: i, onabort: o = f } = t ?? {};
  let n = [];
  for (const r of e) {
    if (!r)
      continue;
    if (i?.signal.aborted)
      return o(), [];
    let a;
    if (d(r))
      a = {
        name: r.name,
        path: r.fullPath,
        entries: await h(await D(r), t)
      };
    else if (p(r))
      a = async () => {
        const s = await I(r);
        return s.path = r.fullPath, s;
      };
    else
      continue;
    n.push(a);
  }
  return n;
}
function u(e) {
  return Array.from(e).map(C);
}
function P(e) {
  return Array.from(e).map(k);
}
function C(e) {
  return e.webkitGetAsEntry();
}
function k(e) {
  return e.getAsFile();
}
async function D(e) {
  const t = e.createReader(), i = [];
  for (; ; ) {
    const o = await new Promise((n, r) => {
      t.readEntries(n, r);
    });
    if (!o.length)
      break;
    for (const n of o)
      i.push(n);
  }
  return i;
}
async function I(e) {
  return await T(), F(e);
}
async function F(e) {
  return new Promise((t) => e.file(t));
}
function O(e) {
  const t = u(e.items);
  return t.some(d) || t.length > 10;
}
async function W(e) {
  let t = u(e.items);
  if (g(t).length === 0)
    return P(e.items);
  const i = [], o = [];
  for (const n of t)
    p(n) && o.push(F(n));
  return i.push(...await Promise.all(o)), i;
}
export {
  u as dataTransferItemsToEntries,
  P as dataTransferItemsToFiles,
  W as dataTransferToFiles,
  C as getAsEntry,
  k as getAsFile,
  D as readDirectory,
  L as readEntriesFromDataTransfer,
  O as shouldLoadWithIdleCallback
};
