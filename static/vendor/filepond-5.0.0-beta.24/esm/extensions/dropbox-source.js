/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import { createExtension as v } from "./common/createExtension.js";
import { h as c, getAsElement as h, addListener as k } from "../utils/dom.js";
const j = v(
  "DropboxSource",
  {
    script: "https://www.dropbox.com/static/api/2/dropins.js",
    appKey: void 0,
    target: void 0,
    buttonLabel: "Browse Dropbox",
    dropboxOptions: void 0
  },
  ({ didSetProps: d }, { insertEntries: l }) => {
    let e, p, r;
    return d(({ script: u, appKey: b, target: a, buttonLabel: m, dropboxOptions: x }) => {
      let s;
      e || (e = c("script", {
        type: "text/javascript",
        src: u,
        id: "dropboxjs",
        "data-app-key": b,
        onload: () => {
          s = window.Dropbox;
        }
      }), document.head.append(e));
      function f(o) {
        return {
          src: o.link,
          name: o.name,
          origin: "remote"
        };
      }
      function w(o) {
        let i = !1;
        return s.choose({
          // add custom options
          ...x,
          // user submitted dialog selection
          success: (y) => {
            i || o(y.map(f));
          },
          // user closed dialog
          cancel: () => {
            i || o([]);
          },
          // need direct link to download the file
          linkType: "direct"
        }), {
          abort: () => i = !0
        };
      }
      let n;
      function D() {
        n && n.abort(), n = w(l);
      }
      const t = h(a) || c("button", {
        textContent: m
      });
      p = k(t, "click", D), !t.parentNode && document.body.append(t), a || (r = t);
    }), {
      destroy: () => {
        p(), r && r.remove();
      }
    };
  }
);
export {
  j as DropboxSource
};
