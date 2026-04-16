/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createStoreExtension as D } from "./common/createStoreExtension.js";
import { blobToFile as H } from "../utils/file.js";
import { isFileEntry as W, isFile as E } from "../utils/test.js";
import { xhr as l, getResponseHeaders as d, getFilenameFromResponseHeaders as w } from "../utils/xhr.js";
const v = D(
  "FormPostStore",
  {
    url: "",
    name: "entry",
    fetchHead: !0,
    willRequestWithOptions: (i, c, p) => c
  },
  ({ props: i }, c) => {
    const { updateEntry: p } = c;
    function F(e) {
      const t = d(e), n = w(t);
      if (n)
        return n;
    }
    async function O(e, { abortController: t, onprogress: n, onabort: r }) {
      const { url: o, valueKey: s, willRequestWithOptions: m } = i;
      if (!W(e) || !E(e.file))
        return;
      if (E(e.file) && e.state[s] != null)
        return e.state[s];
      const { name: u } = i, a = {
        method: "POST",
        formData: [[u, e.file, e.file.name]]
      };
      return (await l(o, {
        ...m(o, a, e) ?? a,
        abortController: t,
        onprogress: n,
        onabort: r
      })).response;
    }
    async function g(e, t, { onprogress: n, onabort: r, abortController: o }) {
      const { url: s, fetchHead: m, willRequestWithOptions: u } = i;
      if (m) {
        const q = {
          method: "HEAD",
          queryString: {
            id: e
          }
        }, h = await l(s, {
          ...u(s, q, t) ?? q
        }), { contentType: S, contentLength: T, lastModified: b } = d(h);
        p(t, {
          name: F(h),
          type: S,
          size: parseInt(T, 10),
          lastModified: new Date(b).getTime()
        });
      }
      const a = {
        method: "GET",
        queryString: {
          id: e
        }
      }, f = await l(s, {
        ...u(s, a, t) ?? a,
        responseType: "blob",
        abortController: o,
        onprogress: n,
        onabort: r
      }), { response: R } = f;
      return H(
        R,
        // use entry name if defined
        t.name || // else read from response headers
        w(d(f)) || // else fall back
        "untitled"
      );
    }
    async function y(e, t) {
      const { url: n, willRequestWithOptions: r } = i, o = {
        method: "DELETE",
        queryString: {
          id: e
        }
      };
      return await l(n, r(n, o, t) ?? o), !0;
    }
    return {
      storeEntry: O,
      restoreEntry: g,
      releaseEntry: y
    };
  }
);
export {
  v as FormPostStore
};
