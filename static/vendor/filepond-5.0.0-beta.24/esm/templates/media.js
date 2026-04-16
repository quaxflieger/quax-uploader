/*!
* FilePond v5.0.0-beta.24
* Copyright (c) 2017-2026 Pqina B.V.
* Released under the MIT License
* https://filepond.com
*/
import "../elements/FilePondEntryList/components/MediaVideo/index.js";
import { createEntryMatcher as S, createButton as c, hasExtensionWithStatusCode as l, createSpringPane as m, whenEntryIs as y, whenEntryHasAction as b, whenEntryNotHasStatus as h, getExtensionByAction as M, hasExtensionWithStatusType as T, hasExtensionWithProp as O } from "./helpers.js";
import "../elements/components/RangeInput/index.js";
import { supportsRequestFullscreen as A } from "../utils/support.js";
import { toTime as v } from "../utils/date.js";
import { nodeTree as s } from "../elements/common/nodeTree.js";
import { boolToAttributeValue as u } from "../utils/dom.js";
import "../elements/FilePondEntryList/components/MediaTimeIndicator/index.js";
import "../elements/FilePondEntryList/components/EntryActivityIndicator/index.js";
import "../elements/FilePondEntryList/components/MediaImage/index.js";
import o from "../elements/components/SpringElement/index.svelte.js";
import "../elements/components/ElementPane/index.js";
import P from "../elements/FilePondEntryList/components/EntryActivityIndicator/index.svelte.js";
import F from "../elements/FilePondEntryList/components/MediaImage/index.svelte.js";
import I from "../elements/FilePondEntryList/components/MediaVideo/index.svelte.js";
import _ from "../elements/components/RangeInput/index.svelte.js";
import B from "../elements/FilePondEntryList/components/MediaTimeIndicator/index.svelte.js";
import U from "../elements/components/ElementPane/index.svelte.js";
function f(e) {
  const { action: t = "editMedia" } = e ?? {};
  return {
    key: "button-media-edit",
    component: P,
    props: ({ id: n, entry: r }, { updateEntryState: i }) => ({
      buttonPart: "media-button",
      states: [
        {
          // waiting for transform
          codes: [
            "TRANSFORM_IDLE",
            "TRANSFORM_CANCEL",
            "TRANSFORM_COMPLETE",
            "TRANSFORM_BUSY"
          ],
          button: c("button-transform-activate", {
            icon: "mediaEdit",
            disabled: l(r, [
              "STORE_QUEUED",
              "STORE_BUSY",
              "TRANSFORM_BUSY"
            ]),
            onclick: () => i?.(n, { [t]: !0 })
          })
        },
        {
          codes: ["TRANSFORM_PREPARE"],
          progress: !0,
          button: c("button-transform-abort", {
            icon: "abort",
            disabled: l(r, [
              "STORE_QUEUED",
              "STORE_BUSY",
              "TRANSFORM_BUSY"
            ]),
            onclick: () => i(n, {
              [t]: null
            })
          })
        }
      ]
    })
  };
}
function k(e) {
  const { action: t = "editMedia" } = e ?? {};
  return c("button-media-reset", {
    props: ({ id: n, entry: r }, { updateEntryState: i }) => ({
      part: "media-button",
      disabled: l(r, [
        "STORE_QUEUED",
        "STORE_BUSY",
        "TRANSFORM_PREPARE",
        "TRANSFORM_BUSY"
      ]) || !M(r, t)?.input,
      icon: "mediaReset",
      label: "reset",
      title: "reset",
      onclick: () => i?.(n, { [t]: !1 })
    })
  });
}
function E(e) {
  return {
    key: e,
    component: U,
    spring: ({ visualRect: t }) => ({
      opacity: {
        value: t.height > 0 ? 1 : 0,
        config: {
          stiffness: 0.02,
          damping: 0.85,
          precision: 0.1
        }
      }
    }),
    props: ({ visualRect: t, opacity: n }) => ({
      part: "media-pane",
      class: "media-pane",
      width: t.width,
      height: t.height,
      opacity: n
    })
  };
}
function C(e) {
  const { objectFit: t = void 0 } = e ?? {};
  return {
    key: "entry-image-spring",
    component: o,
    props: {
      class: "entry-media",
      part: "entry-media"
    },
    children: [
      {
        key: "entry-image",
        component: F,
        props: e
      },
      {
        if: {
          test: () => t === "contain",
          then: E("entry-image-pane")
        }
      },
      m({
        key: "entry-image-overlay",
        class: "media-overlay",
        part: "media-overlay"
      })
    ]
  };
}
function g({ entry: e }) {
  const { media: t, video: n } = e.extension.EntryListView || {};
  return {
    media: t,
    video: n
  };
}
function N(e) {
  const { objectFit: t = void 0 } = e ?? {};
  return {
    key: "entry-video-spring",
    component: o,
    props: {
      class: "entry-media",
      part: "entry-media"
    },
    children: [
      {
        key: "entry-video",
        component: I,
        props: e
      },
      {
        if: {
          test: () => t === "contain",
          then: E("entry-video-pane")
        }
      },
      m({
        key: "entry-video-overlay",
        class: "media-overlay",
        part: "media-overlay"
      })
    ]
  };
}
function w(e) {
  const { key: t, justifyContent: n } = e || {}, r = "media-control-group" + (n ? ` justify-content-${n}` : "");
  return s({
    key: t,
    component: o,
    props: {
      subtag: "element-stack",
      class: r
    },
    children: [
      m({
        key: "media-control-group-background",
        class: "media-control-pane"
      })
    ]
  });
}
function p(e) {
  const { key: t } = e || {};
  return s({
    key: t,
    component: o,
    props: {
      subtag: "element-stack",
      class: "media-control"
    },
    children: [
      m({
        key: "media-control-background",
        class: "media-control-pane"
      })
    ]
  });
}
function R(e) {
  const { key: t = "media-controls", justifyContent: n } = e || {}, r = "entry-media-controls" + (n ? ` justify-content-${n}` : "");
  return s({
    if: {
      // don't render media controls if in error state
      test: ({ entry: i }) => {
        const { media: a } = g({ entry: i });
        return a && a.isReady && !T(i, ["error"]);
      },
      then: {
        key: t,
        tag: "element-stack",
        context: g,
        attrs: ({ media: i, video: a }) => ({
          class: r,
          part: "media-controls",
          "data-media-is-visible": u(i?.isVisible),
          "data-media-is-playing": u(a?.isPlaying)
        })
      }
    }
  });
}
function x() {
  return {
    key: "toggle-playback-spring",
    component: o,
    props: {
      class: "toggle-playback"
    },
    children: c("toggle-playback", ({ video: e }) => ({
      part: "media-button",
      icon: e?.isPaused ? "mediaPlay" : "mediaPause"
    }))
  };
}
function V() {
  return {
    key: "toggle-audio-spring",
    component: o,
    props: {
      class: "toggle-audio"
    },
    children: c("toggle-audio", ({ video: e }) => ({
      part: "media-button",
      icon: e?.isMute ? "mediaSilent" : e?.isMuted ? "mediaUnmute" : "mediaMute",
      disabled: e?.isMute
    }))
  };
}
function ae() {
  return {
    // only added when fullscreen is supported
    if: {
      test: A,
      then: {
        key: "toggle-fullscreen-spring",
        component: o,
        props: {
          class: "toggle-fullscreen"
        },
        children: c("toggle-fullscreen", {
          part: "media-button",
          icon: "mediaFullscreen"
        })
      }
    }
  };
}
function L() {
  return {
    key: "media-scrubber-spring",
    component: o,
    props: {
      class: "media-scrubber"
    },
    children: [
      {
        key: "media-scrubber",
        component: _,
        props: ({ video: e }) => ({
          part: "media-scrubber",
          step: e?.framesPerSecond,
          value: e?.time,
          min: 0,
          max: e?.duration
        })
      }
    ]
  };
}
function ce() {
  return {
    key: "media-scrubber-title",
    tag: "time",
    context: ({ hoverValue: e }) => ({
      time: v(e)
    }),
    attrs: ({ time: e }) => ({
      datetime: e
    }),
    children: "{{time}}"
  };
}
function j() {
  return {
    key: "media-time-indicator-spring",
    component: o,
    props: {
      class: "media-time-indicator"
    },
    children: {
      key: "media-time-indicator",
      component: B,
      props: ({ video: e }) => ({
        timeISO: e?.timeISO,
        timeLabel: e?.timeLabel,
        durationISO: e?.durationISO,
        durationLabel: e?.durationLabel
      })
    }
  };
}
const Y = S("image");
function se(e, t) {
  const { enableEdit: n = !0, enableReset: r = !0, ...i } = t ?? {}, a = n || r;
  return s(e).find("entry").append(
    y((d) => Y(d) || O(d, "poster")).append(
      C(i),
      a && b("editMedia").append(
        R({ justifyContent: "end" }).append(
          r && p().append(k()),
          n && p().append(f())
        )
      )
    )
  ), e;
}
function de(e, t) {
  const { enableEdit: n = !0, enableReset: r = !0, ...i } = t ?? {}, a = n || r;
  return s(e).update("entry", (d) => {
    d.routes = {
      "toggle-playback:click": "entry-video.togglePlayback",
      "toggle-audio:click": "entry-video.toggleAudio",
      "toggle-fullscreen:click": "entry-video.toggleFullscreen",
      "media-scrubber:input": "entry-video.setCurrentTime"
    };
  }).append(
    y("video").append(
      N(i),
      h("error").append(
        R().append(
          w({ key: "video-controls" }).append(
            x(),
            L(),
            j(),
            V()
          ),
          a && b("editMedia").append(
            r && p().append(k()),
            n && p().append(f())
          )
        )
      )
    )
  ), e;
}
export {
  se as appendEntryImageView,
  de as appendEntryVideoView,
  f as createEditMediaButton,
  C as createImageView,
  p as createMediaControl,
  w as createMediaControlGroup,
  R as createMediaControls,
  L as createMediaScrubber,
  ce as createMediaScrubberTitle,
  j as createMediaTimeIndicator,
  k as createResetMediaButton,
  V as createToggleAudioButton,
  ae as createToggleFullscreenButton,
  x as createTogglePlaybackButton,
  N as createVideoView
};
