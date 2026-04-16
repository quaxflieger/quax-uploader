const o = 2, t = 4, n = 8, s = 16777216, c = 16, T = 32, R = 64, F = 128, e = 512, A = 1024, C = 2048, _ = 4096, S = 8192, N = 16384, r = 32768, a = 33554432, l = 65536, D = 131072, O = 262144, I = 524288, Y = 1048576, L = 33554432, m = 65536, d = 2097152, i = 4194304, y = 8388608, b = Symbol("$state"), g = Symbol("legacy props"), B = Symbol(""), G = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), p = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
export {
  i as ASYNC,
  c as BLOCK_EFFECT,
  F as BOUNDARY_EFFECT,
  T as BRANCH_EFFECT,
  A as CLEAN,
  e as CONNECTED,
  o as DERIVED,
  N as DESTROYED,
  a as DESTROYING,
  C as DIRTY,
  D as EAGER_EFFECT,
  t as EFFECT,
  L as EFFECT_OFFSCREEN,
  I as EFFECT_PRESERVED,
  l as EFFECT_TRANSPARENT,
  y as ERROR_VALUE,
  O as HEAD_EFFECT,
  S as INERT,
  p as IS_XHTML,
  g as LEGACY_PROPS,
  B as LOADING_ATTR_SYMBOL,
  s as MANAGED_EFFECT,
  _ as MAYBE_DIRTY,
  d as REACTION_IS_UPDATING,
  r as REACTION_RAN,
  n as RENDER_EFFECT,
  R as ROOT_EFFECT,
  G as STALE_REACTION,
  b as STATE_SYMBOL,
  Y as USER_EFFECT,
  m as WAS_MARKED
};
