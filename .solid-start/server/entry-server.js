import { ssrElement, escape, mergeProps, ssr, getRequestEvent, useAssets as useAssets$1, isServer, createComponent as createComponent$1, delegateEvents, ssrHydrationKey, ssrStyleProperty, ssrAttribute, Portal, ssrStyle, NoHydration, Hydration, HydrationScript, renderToString, renderToStream } from "solid-js/web";
import { sharedConfig, onCleanup, lazy as lazy$1, getOwner, runWithOwner, createMemo, useContext, createContext, untrack, createSignal, createRenderEffect, on as on$1, startTransition, resetErrorBoundaries, batch, createComponent, children, Show, createRoot, getListener, $TRACK, createResource, catchError, createEffect, onMount, Suspense, ErrorBoundary as ErrorBoundary$1 } from "solid-js";
import { provideRequestEvent } from "solid-js/web/storage";
import { promises } from "fs";
import path from "path";
import crypto$1 from "crypto";
import { PrismaClient } from "@prisma/client";
import { Readable, PassThrough } from "node:stream";
import * as XLSX from "xlsx";
const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _UNC_REGEX = /^[/\\]{2}/;
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
const normalize = function(path2) {
  if (path2.length === 0) {
    return ".";
  }
  path2 = normalizeWindowsPath(path2);
  const isUNCPath = path2.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path2);
  const trailingSeparator = path2[path2.length - 1] === "/";
  path2 = normalizeString(path2, !isPathAbsolute);
  if (path2.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path2 += "/";
  }
  if (_DRIVE_LETTER_RE.test(path2)) {
    path2 += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path2}`;
    }
    return `//${path2}`;
  }
  return isPathAbsolute && !isAbsolute(path2) ? `/${path2}` : path2;
};
const join = function(...segments) {
  let path2 = "";
  for (const seg of segments) {
    if (!seg) {
      continue;
    }
    if (path2.length > 0) {
      const pathTrailing = path2[path2.length - 1] === "/";
      const segLeading = seg[0] === "/";
      const both = pathTrailing && segLeading;
      if (both) {
        path2 += seg.slice(1);
      } else {
        path2 += pathTrailing || segLeading ? seg : `/${seg}`;
      }
    } else {
      path2 += seg;
    }
  }
  return normalize(path2);
};
function normalizeString(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path2.length; ++index) {
    if (index < path2.length) {
      char = path2[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, index)}`;
        } else {
          res = path2.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p2) {
  return _IS_ABSOLUTE_RE.test(p2);
};
const clientViteManifest = { "_components-CBjnTObI.js": { "file": "_build/assets/components-CBjnTObI.js", "name": "components", "imports": ["_routing-6H_yOrLq.js"] }, "_createAsync-DlEYwpes.js": { "file": "_build/assets/createAsync-DlEYwpes.js", "name": "createAsync", "imports": ["_routing-6H_yOrLq.js"] }, "_index-Du6FC0BF.js": { "file": "_build/assets/index-Du6FC0BF.js", "name": "index", "imports": ["_routing-6H_yOrLq.js"] }, "_routing-6H_yOrLq.js": { "file": "_build/assets/routing-6H_yOrLq.js", "name": "routing" }, "_toast-DOOkzAVQ.js": { "file": "_build/assets/toast-DOOkzAVQ.js", "name": "toast", "imports": ["_routing-6H_yOrLq.js"] }, "_utils-BadJ_olU.js": { "file": "_build/assets/utils-BadJ_olU.js", "name": "utils" }, "src/entry-client.tsx": { "file": "_build/assets/entry-client-C3kxS2uz.js", "name": "entry-client", "src": "src/entry-client.tsx", "isEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js"], "dynamicImports": ["src/routes/dashboard.tsx?pick=default&pick=$css", "src/routes/dashboard.tsx?pick=default&pick=$css", "src/routes/index.tsx?pick=default&pick=$css", "src/routes/index.tsx?pick=default&pick=$css", "src/routes/izin.tsx?pick=default&pick=$css", "src/routes/izin.tsx?pick=default&pick=$css", "src/routes/login.tsx?pick=default&pick=$css", "src/routes/login.tsx?pick=default&pick=$css", "src/routes/profil.tsx?pick=default&pick=$css", "src/routes/profil.tsx?pick=default&pick=$css", "src/routes/riwayat.tsx?pick=default&pick=$css", "src/routes/riwayat.tsx?pick=default&pick=$css", "src/routes/unauthorized.tsx?pick=default&pick=$css", "src/routes/unauthorized.tsx?pick=default&pick=$css", "src/routes/[...404].tsx?pick=default&pick=$css", "src/routes/[...404].tsx?pick=default&pick=$css", "src/routes/admin/absensi.tsx?pick=default&pick=$css", "src/routes/admin/absensi.tsx?pick=default&pick=$css", "src/routes/admin/audit-log.tsx?pick=default&pick=$css", "src/routes/admin/audit-log.tsx?pick=default&pick=$css", "src/routes/admin/batch.tsx?pick=default&pick=$css", "src/routes/admin/batch.tsx?pick=default&pick=$css", "src/routes/admin/dashboard.tsx?pick=default&pick=$css", "src/routes/admin/dashboard.tsx?pick=default&pick=$css", "src/routes/admin/divisi.tsx?pick=default&pick=$css", "src/routes/admin/divisi.tsx?pick=default&pick=$css", "src/routes/admin/izin.tsx?pick=default&pick=$css", "src/routes/admin/izin.tsx?pick=default&pick=$css", "src/routes/admin/laporan.tsx?pick=default&pick=$css", "src/routes/admin/laporan.tsx?pick=default&pick=$css", "src/routes/admin/settings.tsx?pick=default&pick=$css", "src/routes/admin/settings.tsx?pick=default&pick=$css", "src/routes/admin/users.tsx?pick=default&pick=$css", "src/routes/admin/users.tsx?pick=default&pick=$css"], "css": ["_build/assets/entry-client-Bn4mC1qU.css"] }, "src/routes/[...404].tsx?pick=default&pick=$css": { "file": "_build/assets/_...404_-CAL0PQ_U.js", "name": "_...404_", "src": "src/routes/[...404].tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_components-CBjnTObI.js"] }, "src/routes/admin/absensi.tsx?pick=default&pick=$css": { "file": "_build/assets/absensi-YFJPcoVc.js", "name": "absensi", "src": "src/routes/admin/absensi.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/audit-log.tsx?pick=default&pick=$css": { "file": "_build/assets/audit-log-BT-PPzwR.js", "name": "audit-log", "src": "src/routes/admin/audit-log.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/batch.tsx?pick=default&pick=$css": { "file": "_build/assets/batch-DAQW-D9j.js", "name": "batch", "src": "src/routes/admin/batch.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/dashboard.tsx?pick=default&pick=$css": { "file": "_build/assets/dashboard-Brj8vSQo.js", "name": "dashboard", "src": "src/routes/admin/dashboard.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js"] }, "src/routes/admin/divisi.tsx?pick=default&pick=$css": { "file": "_build/assets/divisi-ChMkdI4u.js", "name": "divisi", "src": "src/routes/admin/divisi.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/izin.tsx?pick=default&pick=$css": { "file": "_build/assets/izin-z7-KKP3Z.js", "name": "izin", "src": "src/routes/admin/izin.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/laporan.tsx?pick=default&pick=$css": { "file": "_build/assets/laporan-Dqh6XPKF.js", "name": "laporan", "src": "src/routes/admin/laporan.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/admin/settings.tsx?pick=default&pick=$css": { "file": "_build/assets/settings-DfdvFzec.js", "name": "settings", "src": "src/routes/admin/settings.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js"] }, "src/routes/admin/users.tsx?pick=default&pick=$css": { "file": "_build/assets/users-D8SrmXiR.js", "name": "users", "src": "src/routes/admin/users.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/dashboard.tsx?pick=default&pick=$css": { "file": "_build/assets/dashboard-rItNj2-o.js", "name": "dashboard", "src": "src/routes/dashboard.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js"] }, "src/routes/index.tsx?pick=default&pick=$css": { "file": "_build/assets/index-CZiZ2aMe.js", "name": "index", "src": "src/routes/index.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js"] }, "src/routes/izin.tsx?pick=default&pick=$css": { "file": "_build/assets/izin-1SVk9vb7.js", "name": "izin", "src": "src/routes/izin.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/login.tsx?pick=default&pick=$css": { "file": "_build/assets/login-DG4UFD51.js", "name": "login", "src": "src/routes/login.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js"] }, "src/routes/profil.tsx?pick=default&pick=$css": { "file": "_build/assets/profil-DreuE8je.js", "name": "profil", "src": "src/routes/profil.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_toast-DOOkzAVQ.js", "_createAsync-DlEYwpes.js"] }, "src/routes/riwayat.tsx?pick=default&pick=$css": { "file": "_build/assets/riwayat-DkNeidcC.js", "name": "riwayat", "src": "src/routes/riwayat.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js", "_utils-BadJ_olU.js"] }, "src/routes/unauthorized.tsx?pick=default&pick=$css": { "file": "_build/assets/unauthorized-DV47e32E.js", "name": "unauthorized", "src": "src/routes/unauthorized.tsx?pick=default&pick=$css", "isEntry": true, "isDynamicEntry": true, "imports": ["_routing-6H_yOrLq.js", "_index-Du6FC0BF.js", "_createAsync-DlEYwpes.js", "_components-CBjnTObI.js"] } };
function getSsrProdManifest() {
  const viteManifest = clientViteManifest;
  return {
    path(id) {
      if (id.startsWith("./")) id = id.slice(2);
      const viteManifestEntry = clientViteManifest[
        id
        /*import.meta.env.START_CLIENT_ENTRY*/
      ];
      if (!viteManifestEntry) throw new Error(`No entry found in vite manifest for '${id}'`);
      return join("/", viteManifestEntry.file);
    },
    async getAssets(id) {
      if (id.startsWith("./")) id = id.slice(2);
      return createHtmlTagsForAssets(findAssetsInViteManifest(clientViteManifest, id));
    },
    async json() {
      const json = {};
      const entryKeys = Object.keys(viteManifest).filter((id) => viteManifest[id]?.isEntry || viteManifest[id]?.isDynamicEntry).map((id) => id);
      for (const entryKey of entryKeys) {
        json[entryKey] = {
          output: join("/", viteManifest[entryKey].file),
          assets: await this.getAssets(entryKey)
        };
      }
      return json;
    }
  };
}
function createHtmlTagsForAssets(assets) {
  return assets.filter((asset) => asset.endsWith(".css") || asset.endsWith(".js") || asset.endsWith(".ts") || asset.endsWith(".mjs")).map((asset) => ({
    tag: "link",
    attrs: {
      href: "/" + asset,
      key: asset,
      ...asset.endsWith(".css") ? {
        rel: "stylesheet"
      } : {
        rel: "modulepreload"
      }
    }
  }));
}
const entryId = "./src/entry-client.tsx".slice(2);
let entryImports = void 0;
function findAssetsInViteManifest(manifest, id, assetMap2 = /* @__PURE__ */ new Map(), stack = []) {
  if (stack.includes(id)) {
    return [];
  }
  const cached = assetMap2.get(id);
  if (cached) {
    return cached;
  }
  const chunk = manifest[id];
  if (!chunk) {
    return [];
  }
  if (!entryImports) {
    entryImports = [entryId, ...manifest[entryId]?.imports ?? []];
  }
  const excludeEntryImports = id !== entryId;
  const assets = chunk.css?.filter(Boolean) || [];
  if (chunk.imports) {
    stack.push(id);
    for (let i2 = 0, l2 = chunk.imports.length; i2 < l2; i2++) {
      const importId = chunk.imports[i2];
      if (!importId || excludeEntryImports && entryImports.includes(importId)) continue;
      assets.push(...findAssetsInViteManifest(manifest, importId, assetMap2, stack));
    }
    stack.pop();
  }
  assets.push(chunk.file);
  const all = Array.from(new Set(assets));
  assetMap2.set(id, all);
  return all;
}
function getSsrManifest(target) {
  return getSsrProdManifest();
}
var _tmpl$$4 = " ";
const assetMap = {
  style: (props) => ssrElement("style", props.attrs, () => props.children, true),
  link: (props) => ssrElement("link", props.attrs, void 0, true),
  script: (props) => {
    return props.attrs.src ? ssrElement("script", mergeProps(() => props.attrs, {
      get id() {
        return props.key;
      }
    }), () => ssr(_tmpl$$4), true) : null;
  },
  noscript: (props) => ssrElement("noscript", props.attrs, () => escape(props.children), true)
};
function renderAsset(asset, nonce) {
  let {
    tag,
    attrs: {
      key,
      ...attrs
    } = {
      key: void 0
    },
    children: children2
  } = asset;
  return assetMap[tag]({
    attrs: {
      ...attrs,
      nonce
    },
    key,
    children: children2
  });
}
const REGISTRY = /* @__PURE__ */ Symbol("assetRegistry");
const NOOP = () => "";
const keyAttrs = ["href", "rel", "data-vite-dev-id"];
const getEntity = (registry, asset) => {
  let key = asset.tag;
  for (const k2 of keyAttrs) {
    if (!(k2 in asset.attrs)) continue;
    key += `[${k2}='${asset.attrs[k2]}']`;
  }
  const entity = registry[key] ??= {
    key,
    consumers: 0
  };
  return entity;
};
const useAssets = (assets, nonce) => {
  if (!assets.length) return;
  const registry = getRequestEvent().locals[REGISTRY] ??= {};
  const ssrRequestAssets = sharedConfig.context?.assets;
  const cssKeys = [];
  for (const asset of assets) {
    const entity = getEntity(registry, asset);
    const isCSSLink = asset.tag === "link" && asset.attrs.rel === "stylesheet";
    const isCSS = isCSSLink || asset.tag === "style";
    if (isCSS) {
      cssKeys.push(entity.key);
    }
    entity.consumers++;
    if (entity.consumers > 1) continue;
    useAssets$1(() => renderAsset(asset, nonce));
    entity.ssrIdx = ssrRequestAssets.length - 1;
  }
  onCleanup(() => {
    for (const key of cssKeys) {
      const entity = registry[key];
      entity.consumers--;
      if (entity.consumers != 0) {
        continue;
      }
      ssrRequestAssets.splice(entity.ssrIdx, 1, NOOP);
      delete registry[key];
    }
  });
};
const assetsById = {};
const getAssets = async (id) => {
  if (assetsById[id]) return assetsById[id];
  const manifest = getSsrManifest();
  const assets = await manifest.getAssets(id);
  assetsById[id] = assets;
  return assets;
};
const withAssets = function(fn2) {
  const wrapper = async () => {
    const mod = await fn2();
    const id = mod.id$$;
    if (!id) return mod;
    if (!mod.default) {
      console.error(`Module ${id} does not export default`);
      return {
        default: () => []
      };
    }
    const assets = await getAssets(id);
    if (!assets.length) return mod;
    return {
      default: (props) => {
        const {
          nonce
        } = getRequestEvent();
        useAssets(assets, nonce);
        return mod.default(props);
      }
    };
  };
  return wrapper;
};
const lazy = !isServer ? lazy$1 : (fn2) => lazy$1(withAssets(fn2));
function createBeforeLeave() {
  let listeners = /* @__PURE__ */ new Set();
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  let ignore = false;
  function confirm(to2, options) {
    if (ignore) return !(ignore = false);
    const e = {
      to: to2,
      options,
      defaultPrevented: false,
      preventDefault: () => e.defaultPrevented = true
    };
    for (const l2 of listeners) l2.listener({
      ...e,
      from: l2.location,
      retry: (force) => {
        force && (ignore = true);
        l2.navigate(to2, {
          ...options,
          resolve: false
        });
      }
    });
    return !e.defaultPrevented;
  }
  return {
    subscribe,
    confirm
  };
}
let depth;
function saveCurrentDepth() {
  if (!window.history.state || window.history.state._depth == null) {
    window.history.replaceState({
      ...window.history.state,
      _depth: window.history.length - 1
    }, "");
  }
  depth = window.history.state._depth;
}
if (!isServer) {
  saveCurrentDepth();
}
function keepDepth(state) {
  return {
    ...state,
    _depth: window.history.state && window.history.state._depth
  };
}
function notifyIfNotBlocked(notify, block) {
  let ignore = false;
  return () => {
    const prevDepth = depth;
    saveCurrentDepth();
    const delta = prevDepth == null ? null : depth - prevDepth;
    if (ignore) {
      ignore = false;
      return;
    }
    if (delta && block(delta)) {
      ignore = true;
      window.history.go(-delta);
    } else {
      notify();
    }
  };
}
const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
const mockBase = "http://sr";
function normalizePath(path2, omitSlash = false) {
  const s2 = path2.replace(trimPathRegex, "$1");
  return s2 ? omitSlash || /^[?#]/.test(s2) ? s2 : "/" + s2 : "";
}
function resolvePath(base, path2, from) {
  if (hasSchemeRegex.test(path2)) {
    return void 0;
  }
  const basePath = normalizePath(base);
  const fromPath = from && normalizePath(from);
  let result = "";
  if (!fromPath || path2.startsWith("/")) {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }
  return (result || "/") + normalizePath(path2, !result);
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
function joinPaths(from, to2) {
  return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to2);
}
function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    if (key in params) {
      if (Array.isArray(params[key])) params[key].push(value);
      else params[key] = [params[key], value];
    } else params[key] = value;
  });
  return params;
}
function createMatcher$1(path2, partial, matchFilters) {
  const [pattern, splat] = path2.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return (location) => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;
    if (lenDiff < 0 || lenDiff > 0 && splat === void 0 && !partial) {
      return null;
    }
    const match = {
      path: len ? "" : "/",
      params: {}
    };
    const matchFilter = (s2) => matchFilters === void 0 ? void 0 : matchFilters[s2];
    for (let i2 = 0; i2 < len; i2++) {
      const segment = segments[i2];
      const dynamic = segment[0] === ":";
      const locSegment = dynamic ? locSegments[i2] : locSegments[i2].toLowerCase();
      const key = dynamic ? segment.slice(1) : segment.toLowerCase();
      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match.params[key] = locSegment;
      } else if (dynamic || !matchSegment(locSegment, key)) {
        return null;
      }
      match.path += `/${locSegment}`;
    }
    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match.params[splat] = remainder;
      } else {
        return null;
      }
    }
    return match;
  };
}
function matchSegment(input, filter) {
  const isEqual = (s2) => s2 === input;
  if (filter === void 0) {
    return true;
  } else if (typeof filter === "string") {
    return isEqual(filter);
  } else if (typeof filter === "function") {
    return filter(input);
  } else if (Array.isArray(filter)) {
    return filter.some(isEqual);
  } else if (filter instanceof RegExp) {
    return filter.test(input);
  }
  return false;
}
function scoreRoute(route2) {
  const [pattern, splat] = route2.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === void 0 ? 0 : 1));
}
function createMemoObject(fn2) {
  const map = /* @__PURE__ */ new Map();
  const owner = getOwner();
  return new Proxy({}, {
    get(_2, property) {
      if (!map.has(property)) {
        runWithOwner(owner, () => map.set(property, createMemo(() => fn2()[property])));
      }
      return map.get(property)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    },
    ownKeys() {
      return Reflect.ownKeys(fn2());
    },
    has(_2, property) {
      return property in fn2();
    }
  });
}
function mergeSearchString(search, params) {
  const merged = new URLSearchParams(search);
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "" || value instanceof Array && !value.length) {
      merged.delete(key);
    } else {
      if (value instanceof Array) {
        merged.delete(key);
        value.forEach((v2) => {
          merged.append(key, String(v2));
        });
      } else {
        merged.set(key, String(value));
      }
    }
  });
  const s2 = merged.toString();
  return s2 ? `?${s2}` : "";
}
function expandOptionals(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match) return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map((p2) => p2 + expansion)], []);
}
const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "<A> and 'use' router primitives can be only used inside a Route.");
const useRoute = () => useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = (path2) => {
  const route2 = useRoute();
  return createMemo(() => route2.resolvePath(path2()));
};
const useHref = (to2) => {
  const router2 = useRouter();
  return createMemo(() => {
    const to_ = to2();
    return to_ !== void 0 ? router2.renderPath(to_) : to_;
  });
};
const useNavigate = () => useRouter().navigatorFactory();
const useLocation = () => useRouter().location;
const useIsRouting = () => useRouter().isRouting;
const useSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setSearchParams = (params, options) => {
    const searchString = untrack(() => mergeSearchString(location.search, params) + location.hash);
    navigate(searchString, {
      scroll: false,
      resolve: false,
      ...options
    });
  };
  return [location.query, setSearchParams];
};
function createRoutes$1(routeDef, base = "") {
  const {
    component,
    preload,
    load,
    children: children2,
    info
  } = routeDef;
  const isLeaf = !children2 || Array.isArray(children2) && !children2.length;
  const shared = {
    key: routeDef,
    component,
    preload: preload || load,
    info
  };
  return asArray(routeDef.path).reduce((acc, originalPath) => {
    for (const expandedPath of expandOptionals(originalPath)) {
      const path2 = joinPaths(base, expandedPath);
      let pattern = isLeaf ? path2 : path2.split("/*", 1)[0];
      pattern = pattern.split("/").map((s2) => {
        return s2.startsWith(":") || s2.startsWith("*") ? s2 : encodeURIComponent(s2);
      }).join("/");
      acc.push({
        ...shared,
        originalPath,
        pattern,
        matcher: createMatcher$1(pattern, !isLeaf, routeDef.matchFilters)
      });
    }
    return acc;
  }, []);
}
function createBranch(routes2, index = 0) {
  return {
    routes: routes2,
    score: scoreRoute(routes2[routes2.length - 1]) * 1e4 - index,
    matcher(location) {
      const matches = [];
      for (let i2 = routes2.length - 1; i2 >= 0; i2--) {
        const route2 = routes2[i2];
        const match = route2.matcher(location);
        if (!match) {
          return null;
        }
        matches.unshift({
          ...match,
          route: route2
        });
      }
      return matches;
    }
  };
}
function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", stack = [], branches = []) {
  const routeDefs = asArray(routeDef);
  for (let i2 = 0, len = routeDefs.length; i2 < len; i2++) {
    const def = routeDefs[i2];
    if (def && typeof def === "object") {
      if (!def.hasOwnProperty("path")) def.path = "";
      const routes2 = createRoutes$1(def, base);
      for (const route2 of routes2) {
        stack.push(route2);
        const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
        if (def.children && !isEmptyArray) {
          createBranches(def.children, route2.pattern, stack, branches);
        } else {
          const branch = createBranch([...stack], branches.length);
          branches.push(branch);
        }
        stack.pop();
      }
    }
  }
  return stack.length ? branches : branches.sort((a, b2) => b2.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i2 = 0, len = branches.length; i2 < len; i2++) {
    const match = branches[i2].matcher(location);
    if (match) {
      return match;
    }
  }
  return [];
}
function createLocation(path2, state, queryWrapper) {
  const origin = new URL(mockBase);
  const url = createMemo((prev) => {
    const path_ = path2();
    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b2) => a.href === b2.href
  });
  const pathname = createMemo(() => url().pathname);
  const search = createMemo(() => url().search, true);
  const hash = createMemo(() => url().hash);
  const key = () => "";
  const queryFn = on$1(search, () => extractSearchParams(url()));
  return {
    get pathname() {
      return pathname();
    },
    get search() {
      return search();
    },
    get hash() {
      return hash();
    },
    get state() {
      return state();
    },
    get key() {
      return key();
    },
    query: queryWrapper ? queryWrapper(queryFn) : createMemoObject(queryFn)
  };
}
let intent;
function getIntent() {
  return intent;
}
let inPreloadFn = false;
function getInPreloadFn() {
  return inPreloadFn;
}
function setInPreloadFn(value) {
  inPreloadFn = value;
}
function createRouterContext(integration, branches, getContext, options = {}) {
  const {
    signal: [source, setSource],
    utils = {}
  } = integration;
  const parsePath = utils.parsePath || ((p2) => p2);
  const renderPath = utils.renderPath || ((p2) => p2);
  const beforeLeave = utils.beforeLeave || createBeforeLeave();
  const basePath = resolvePath("", options.base || "");
  if (basePath === void 0) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (basePath && !source().value) {
    setSource({
      value: basePath,
      replace: true,
      scroll: false
    });
  }
  const [isRouting, setIsRouting] = createSignal(false);
  let lastTransitionTarget;
  const transition = (newIntent, newTarget) => {
    if (newTarget.value === reference() && newTarget.state === state()) return;
    if (lastTransitionTarget === void 0) setIsRouting(true);
    intent = newIntent;
    lastTransitionTarget = newTarget;
    startTransition(() => {
      if (lastTransitionTarget !== newTarget) return;
      setReference(lastTransitionTarget.value);
      setState(lastTransitionTarget.state);
      resetErrorBoundaries();
      if (!isServer) submissions[1]((subs) => subs.filter((s2) => s2.pending));
    }).finally(() => {
      if (lastTransitionTarget !== newTarget) return;
      batch(() => {
        intent = void 0;
        if (newIntent === "navigate") navigateEnd(lastTransitionTarget);
        setIsRouting(false);
        lastTransitionTarget = void 0;
      });
    });
  };
  const [reference, setReference] = createSignal(source().value);
  const [state, setState] = createSignal(source().state);
  const location = createLocation(reference, state, utils.queryWrapper);
  const referrers = [];
  const submissions = createSignal(isServer ? initFromFlash2() : []);
  const matches = createMemo(() => {
    if (typeof options.transformUrl === "function") {
      return getRouteMatches(branches(), options.transformUrl(location.pathname));
    }
    return getRouteMatches(branches(), location.pathname);
  });
  const buildParams = () => {
    const m2 = matches();
    const params2 = {};
    for (let i2 = 0; i2 < m2.length; i2++) {
      Object.assign(params2, m2[i2].params);
    }
    return params2;
  };
  const params = utils.paramsWrapper ? utils.paramsWrapper(buildParams, branches) : createMemoObject(buildParams);
  const baseRoute = {
    pattern: basePath,
    path: () => basePath,
    outlet: () => null,
    resolvePath(to2) {
      return resolvePath(basePath, to2);
    }
  };
  createRenderEffect(on$1(source, (source2) => transition("native", source2), {
    defer: true
  }));
  return {
    base: baseRoute,
    location,
    params,
    isRouting,
    renderPath,
    parsePath,
    navigatorFactory,
    matches,
    beforeLeave,
    preloadRoute,
    singleFlight: options.singleFlight === void 0 ? true : options.singleFlight,
    submissions
  };
  function navigateFromRoute(route2, to2, options2) {
    untrack(() => {
      if (typeof to2 === "number") {
        if (!to2) ;
        else if (utils.go) {
          utils.go(to2);
        } else {
          console.warn("Router integration does not support relative routing");
        }
        return;
      }
      const queryOnly = !to2 || to2[0] === "?";
      const {
        replace,
        resolve,
        scroll,
        state: nextState
      } = {
        replace: false,
        resolve: !queryOnly,
        scroll: true,
        ...options2
      };
      const resolvedTo = resolve ? route2.resolvePath(to2) : resolvePath(queryOnly && location.pathname || "", to2);
      if (resolvedTo === void 0) {
        throw new Error(`Path '${to2}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }
      const current = reference();
      if (resolvedTo !== current || nextState !== state()) {
        if (isServer) {
          const e = getRequestEvent();
          e && (e.response = {
            status: 302,
            headers: new Headers({
              Location: resolvedTo
            })
          });
          setSource({
            value: resolvedTo,
            replace,
            scroll,
            state: nextState
          });
        } else if (beforeLeave.confirm(resolvedTo, options2)) {
          referrers.push({
            value: current,
            replace,
            scroll,
            state: state()
          });
          transition("navigate", {
            value: resolvedTo,
            state: nextState
          });
        }
      }
    });
  }
  function navigatorFactory(route2) {
    route2 = route2 || useContext(RouteContextObj) || baseRoute;
    return (to2, options2) => navigateFromRoute(route2, to2, options2);
  }
  function navigateEnd(next) {
    const first = referrers[0];
    if (first) {
      setSource({
        ...next,
        replace: first.replace,
        scroll: first.scroll
      });
      referrers.length = 0;
    }
  }
  function preloadRoute(url, preloadData) {
    const matches2 = getRouteMatches(branches(), url.pathname);
    const prevIntent = intent;
    intent = "preload";
    for (let match in matches2) {
      const {
        route: route2,
        params: params2
      } = matches2[match];
      route2.component && route2.component.preload && route2.component.preload();
      const {
        preload
      } = route2;
      inPreloadFn = true;
      preloadData && preload && runWithOwner(getContext(), () => preload({
        params: params2,
        location: {
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          query: extractSearchParams(url),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
      inPreloadFn = false;
    }
    intent = prevIntent;
  }
  function initFromFlash2() {
    const e = getRequestEvent();
    return e && e.router && e.router.submission ? [e.router.submission] : [];
  }
}
function createRouteContext(router2, parent, outlet, match) {
  const {
    base,
    location,
    params
  } = router2;
  const {
    pattern,
    component,
    preload
  } = match().route;
  const path2 = createMemo(() => match().path);
  component && component.preload && component.preload();
  inPreloadFn = true;
  const data = preload ? preload({
    params,
    location,
    intent: intent || "initial"
  }) : void 0;
  inPreloadFn = false;
  const route2 = {
    parent,
    pattern,
    path: path2,
    outlet: () => component ? createComponent(component, {
      params,
      location,
      data,
      get children() {
        return outlet();
      }
    }) : outlet(),
    resolvePath(to2) {
      return resolvePath(base.path(), to2, path2());
    }
  };
  return route2;
}
const createRouterComponent = (router2) => (props) => {
  const {
    base
  } = props;
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), props.base || ""));
  let context;
  const routerState = createRouterContext(router2, branches, () => context, {
    base,
    singleFlight: props.singleFlight,
    transformUrl: props.transformUrl
  });
  router2.create && router2.create(routerState);
  return createComponent$1(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return createComponent$1(Root, {
        routerState,
        get root() {
          return props.root;
        },
        get preload() {
          return props.rootPreload || props.rootLoad;
        },
        get children() {
          return [(context = getOwner()) && null, createComponent$1(Routes, {
            routerState,
            get branches() {
              return branches();
            }
          })];
        }
      });
    }
  });
};
function Root(props) {
  const location = props.routerState.location;
  const params = props.routerState.params;
  const data = createMemo(() => props.preload && untrack(() => {
    setInPreloadFn(true);
    props.preload({
      params,
      location,
      intent: getIntent() || "initial"
    });
    setInPreloadFn(false);
  }));
  return createComponent$1(Show, {
    get when() {
      return props.root;
    },
    keyed: true,
    get fallback() {
      return props.children;
    },
    children: (Root2) => createComponent$1(Root2, {
      params,
      location,
      get data() {
        return data();
      },
      get children() {
        return props.children;
      }
    })
  });
}
function Routes(props) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      dataOnly(e, props.routerState, props.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = props.routerState.matches().map(({
      route: route2,
      path: path2,
      params
    }) => ({
      path: route2.originalPath,
      pattern: route2.pattern,
      match: path2,
      params,
      info: route2.info
    }))));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on$1(props.routerState.matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i2 = 0, len = nextMatches.length; i2 < len; i2++) {
      const prevMatch = prevMatches && prevMatches[i2];
      const nextMatch = nextMatches[i2];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i2] = prev[i2];
      } else {
        equal = false;
        if (disposers[i2]) {
          disposers[i2]();
        }
        createRoot((dispose) => {
          disposers[i2] = dispose;
          next[i2] = createRouteContext(props.routerState, next[i2 - 1] || props.routerState.base, createOutlet(() => routeStates()[i2 + 1]), () => {
            const routeMatches = props.routerState.matches();
            return routeMatches[i2] ?? routeMatches[0];
          });
        });
      }
    }
    disposers.splice(nextMatches.length).forEach((dispose) => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createOutlet(() => routeStates() && root)();
}
const createOutlet = (child) => {
  return () => createComponent$1(Show, {
    get when() {
      return child();
    },
    keyed: true,
    children: (child2) => createComponent$1(RouteContextObj.Provider, {
      value: child2,
      get children() {
        return child2.outlet();
      }
    })
  });
};
function dataOnly(event, routerState, branches) {
  const url = new URL(event.request.url);
  const prevMatches = getRouteMatches(branches, new URL(event.router.previousUrl || event.request.url).pathname);
  const matches = getRouteMatches(branches, url.pathname);
  for (let match = 0; match < matches.length; match++) {
    if (!prevMatches[match] || matches[match].route !== prevMatches[match].route) event.router.dataOnly = true;
    const {
      route: route2,
      params
    } = matches[match];
    route2.preload && route2.preload({
      params,
      location: routerState.location,
      intent: "preload"
    });
  }
}
function intercept([value, setValue], get, set) {
  return [value, set ? (v2) => setValue(set(v2)) : setValue];
}
function createRouter$2(config) {
  let ignore = false;
  const wrap = (value) => typeof value === "string" ? {
    value
  } : value;
  const signal = intercept(createSignal(wrap(config.get()), {
    equals: (a, b2) => a.value === b2.value && a.state === b2.state
  }), void 0, (next) => {
    !ignore && config.set(next);
    if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = true;
    return next;
  });
  config.init && onCleanup(config.init((value = config.get()) => {
    ignore = true;
    signal[1](wrap(value));
    ignore = false;
  }));
  return createRouterComponent({
    signal,
    create: config.create,
    utils: config.utils
  });
}
function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
function scrollToHash(hash, fallbackTop) {
  const el = hash && document.getElementById(hash);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}
function getPath(url) {
  const u2 = new URL(url);
  return u2.pathname + u2.search;
}
function StaticRouter(props) {
  let e;
  const obj = {
    value: props.url || (e = getRequestEvent()) && getPath(e.request.url) || ""
  };
  return createRouterComponent({
    signal: [() => obj, (next) => Object.assign(obj, next)]
  })(props);
}
const LocationHeader = "Location";
const PRELOAD_TIMEOUT = 5e3;
const CACHE_TIMEOUT = 18e4;
let cacheMap = /* @__PURE__ */ new Map();
if (!isServer) {
  setInterval(() => {
    const now = Date.now();
    for (let [k2, v2] of cacheMap.entries()) {
      if (!v2[4].count && now - v2[0] > CACHE_TIMEOUT) {
        cacheMap.delete(k2);
      }
    }
  }, 3e5);
}
function getCache() {
  if (!isServer) return cacheMap;
  const req = getRequestEvent();
  if (!req) throw new Error("Cannot find cache context");
  return (req.router || (req.router = {})).cache || (req.router.cache = /* @__PURE__ */ new Map());
}
function revalidate(key, force = true) {
  return startTransition(() => {
    const now = Date.now();
    cacheKeyOp(key, (entry) => {
      force && (entry[0] = 0);
      entry[4][1](now);
    });
  });
}
function cacheKeyOp(key, fn2) {
  key && !Array.isArray(key) && (key = [key]);
  for (let k2 of cacheMap.keys()) {
    if (key === void 0 || matchKey(k2, key)) fn2(cacheMap.get(k2));
  }
}
function query(fn2, name) {
  if (fn2.GET) fn2 = fn2.GET;
  const cachedFn = (...args) => {
    const cache = getCache();
    const intent2 = getIntent();
    const inPreloadFn2 = getInPreloadFn();
    const owner = getOwner();
    const navigate = owner ? useNavigate() : void 0;
    const now = Date.now();
    const key = name + hashKey(args);
    let cached = cache.get(key);
    let tracking;
    if (isServer) {
      const e = getRequestEvent();
      if (e) {
        const dataOnly2 = (e.router || (e.router = {})).dataOnly;
        if (dataOnly2) {
          const data = e && (e.router.data || (e.router.data = {}));
          if (data && key in data) return data[key];
          if (Array.isArray(dataOnly2) && !matchKey(key, dataOnly2)) {
            data[key] = void 0;
            return Promise.resolve();
          }
        }
      }
    }
    if (getListener() && !isServer) {
      tracking = true;
      onCleanup(() => cached[4].count--);
    }
    if (cached && cached[0] && (isServer || intent2 === "native" || cached[4].count || Date.now() - cached[0] < PRELOAD_TIMEOUT)) {
      if (tracking) {
        cached[4].count++;
        cached[4][0]();
      }
      if (cached[3] === "preload" && intent2 !== "preload") {
        cached[0] = now;
      }
      let res2 = cached[1];
      if (intent2 !== "preload") {
        res2 = "then" in cached[1] ? cached[1].then(handleResponse2(false), handleResponse2(true)) : handleResponse2(false)(cached[1]);
        !isServer && intent2 === "navigate" && startTransition(() => cached[4][1](cached[0]));
      }
      inPreloadFn2 && "then" in res2 && res2.catch(() => {
      });
      return res2;
    }
    let res;
    if (!isServer && sharedConfig.has && sharedConfig.has(key)) {
      res = sharedConfig.load(key);
      delete globalThis._$HY.r[key];
    } else res = fn2(...args);
    if (cached) {
      cached[0] = now;
      cached[1] = res;
      cached[3] = intent2;
      !isServer && intent2 === "navigate" && startTransition(() => cached[4][1](cached[0]));
    } else {
      cache.set(key, cached = [now, res, , intent2, createSignal(now)]);
      cached[4].count = 0;
    }
    if (tracking) {
      cached[4].count++;
      cached[4][0]();
    }
    if (isServer) {
      const e = getRequestEvent();
      if (e && e.router.dataOnly) return e.router.data[key] = res;
    }
    if (intent2 !== "preload") {
      res = "then" in res ? res.then(handleResponse2(false), handleResponse2(true)) : handleResponse2(false)(res);
    }
    inPreloadFn2 && "then" in res && res.catch(() => {
    });
    if (isServer && sharedConfig.context && sharedConfig.context.async && !sharedConfig.context.noHydrate) {
      const e = getRequestEvent();
      (!e || !e.serverOnly) && sharedConfig.context.serialize(key, res);
    }
    return res;
    function handleResponse2(error) {
      return async (v2) => {
        if (v2 instanceof Response) {
          const e = getRequestEvent();
          if (e) {
            for (const [key2, value] of v2.headers) {
              if (key2 == "set-cookie") e.response.headers.append("set-cookie", value);
              else e.response.headers.set(key2, value);
            }
          }
          const url = v2.headers.get(LocationHeader);
          if (url !== null) {
            if (navigate && url.startsWith("/")) startTransition(() => {
              navigate(url, {
                replace: true
              });
            });
            else if (!isServer) window.location.href = url;
            else if (e) e.response.status = 302;
            return;
          }
          if (v2.customBody) v2 = await v2.customBody();
        }
        if (error) throw v2;
        cached[2] = v2;
        return v2;
      };
    }
  };
  cachedFn.keyFor = (...args) => name + hashKey(args);
  cachedFn.key = name;
  return cachedFn;
}
query.get = (key) => {
  const cached = getCache().get(key);
  return cached[2];
};
query.set = (key, value) => {
  const cache = getCache();
  const now = Date.now();
  let cached = cache.get(key);
  if (cached) {
    cached[0] = now;
    cached[1] = Promise.resolve(value);
    cached[2] = value;
    cached[3] = "preload";
  } else {
    cache.set(key, cached = [now, Promise.resolve(value), value, "preload", createSignal(now)]);
    cached[4].count = 0;
  }
};
query.delete = (key) => getCache().delete(key);
query.clear = () => getCache().clear();
function matchKey(key, keys) {
  for (let k2 of keys) {
    if (k2 && key.startsWith(k2)) return true;
  }
  return false;
}
function hashKey(args) {
  return JSON.stringify(args, (_2, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
function isPlainObject(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (!(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype);
}
const actions = /* @__PURE__ */ new Map();
function useSubmissions(fn2, filter) {
  const router2 = useRouter();
  const subs = createMemo(() => router2.submissions[0]().filter((s2) => s2.url === fn2.base && true));
  return new Proxy([], {
    get(_2, property) {
      if (property === $TRACK) return subs();
      if (property === "pending") return subs().some((sub) => !sub.result);
      return subs()[property];
    },
    has(_2, property) {
      return property in subs();
    }
  });
}
function useSubmission(fn2, filter) {
  const submissions = useSubmissions(fn2);
  return new Proxy({}, {
    get(_2, property) {
      if (submissions.length === 0 && property === "clear" || property === "retry") return () => {
      };
      return submissions[submissions.length - 1]?.[property];
    }
  });
}
function action(fn2, options = {}) {
  function mutate(...variables) {
    const router2 = this.r;
    const form = this.f;
    const p2 = (router2.singleFlight && fn2.withOptions ? fn2.withOptions({
      headers: {
        "X-Single-Flight": "true"
      }
    }) : fn2)(...variables);
    const [result, setResult] = createSignal();
    let submission;
    function handler(error) {
      return async (res) => {
        const result2 = await handleResponse(res, error, router2.navigatorFactory());
        let retry = null;
        o2.onComplete?.({
          ...submission,
          result: result2?.data,
          error: result2?.error,
          pending: false,
          retry() {
            return retry = submission.retry();
          }
        });
        if (retry) return retry;
        if (!result2) return submission.clear();
        setResult(result2);
        if (result2.error && !form) throw result2.error;
        return result2.data;
      };
    }
    router2.submissions[1]((s2) => [...s2, submission = {
      input: variables,
      url,
      get result() {
        return result()?.data;
      },
      get error() {
        return result()?.error;
      },
      get pending() {
        return !result();
      },
      clear() {
        router2.submissions[1]((v2) => v2.filter((i2) => i2 !== submission));
      },
      retry() {
        setResult(void 0);
        const p3 = fn2(...variables);
        return p3.then(handler(), handler(true));
      }
    }]);
    return p2.then(handler(), handler(true));
  }
  const o2 = typeof options === "string" ? {
    name: options
  } : options;
  const url = fn2.url || o2.name && `https://action/${o2.name}` || (!isServer ? `https://action/${hashString(fn2.toString())}` : "");
  mutate.base = url;
  return toAction(mutate, url);
}
function toAction(fn2, url) {
  fn2.toString = () => {
    if (!url) throw new Error("Client Actions need explicit names if server rendered");
    return url;
  };
  fn2.with = function(...args) {
    const newFn = function(...passedArgs) {
      return fn2.call(this, ...args, ...passedArgs);
    };
    newFn.base = fn2.base;
    const uri = new URL(url, mockBase);
    uri.searchParams.set("args", hashKey(args));
    return toAction(newFn, (uri.origin === "https://action" ? uri.origin : "") + uri.pathname + uri.search);
  };
  fn2.url = url;
  if (!isServer) {
    actions.set(url, fn2);
    getOwner() && onCleanup(() => actions.delete(url));
  }
  return fn2;
}
const hashString = (s2) => s2.split("").reduce((a, b2) => (a << 5) - a + b2.charCodeAt(0) | 0, 0);
async function handleResponse(response, error, navigate) {
  let data;
  let custom;
  let keys;
  let flightKeys;
  if (response instanceof Response) {
    if (response.headers.has("X-Revalidate")) keys = response.headers.get("X-Revalidate").split(",");
    if (response.customBody) {
      data = custom = await response.customBody();
      if (response.headers.has("X-Single-Flight")) {
        data = data._$value;
        delete custom._$value;
        flightKeys = Object.keys(custom);
      }
    }
    if (response.headers.has("Location")) {
      const locationUrl = response.headers.get("Location") || "/";
      if (locationUrl.startsWith("http")) {
        window.location.href = locationUrl;
      } else {
        navigate(locationUrl);
      }
    }
  } else if (error) return {
    error: response
  };
  else data = response;
  cacheKeyOp(keys, (entry) => entry[0] = 0);
  flightKeys && flightKeys.forEach((k2) => query.set(k2, custom[k2]));
  await revalidate(keys, false);
  return data != null ? {
    data
  } : void 0;
}
function setupNativeEvents(preload = true, explicitLinks = false, actionBase = "/_server", transformUrl) {
  return (router2) => {
    const basePath = router2.base.path();
    const navigateFromRoute = router2.navigatorFactory(router2.base);
    let preloadTimeout;
    let lastElement;
    function isSvg(el) {
      return el.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function handleAnchor(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find((el) => el instanceof Node && el.nodeName.toUpperCase() === "A");
      if (!a || explicitLinks && !a.hasAttribute("link")) return;
      const svg = isSvg(a);
      const href = svg ? a.href.baseVal : a.href;
      const target = svg ? a.target.baseVal : a.target;
      if (target || !href && !a.hasAttribute("state")) return;
      const rel = (a.getAttribute("rel") || "").split(/\s+/);
      if (a.hasAttribute("download") || rel && rel.includes("external")) return;
      const url = svg ? new URL(href, document.baseURI) : new URL(href);
      if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
      return [a, url];
    }
    function handleAnchorClick(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      const to2 = router2.parsePath(url.pathname + url.search + url.hash);
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(to2, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state ? JSON.parse(state) : void 0
      });
    }
    function handleAnchorPreload(evt) {
      const res = handleAnchor(evt);
      if (!res) return;
      const [a, url] = res;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      router2.preloadRoute(url, a.getAttribute("preload") !== "false");
    }
    function handleAnchorMove(evt) {
      clearTimeout(preloadTimeout);
      const res = handleAnchor(evt);
      if (!res) return lastElement = null;
      const [a, url] = res;
      if (lastElement === a) return;
      transformUrl && (url.pathname = transformUrl(url.pathname));
      preloadTimeout = setTimeout(() => {
        router2.preloadRoute(url, a.getAttribute("preload") !== "false");
        lastElement = a;
      }, 20);
    }
    function handleFormSubmit(evt) {
      if (evt.defaultPrevented) return;
      let actionRef = evt.submitter && evt.submitter.hasAttribute("formaction") ? evt.submitter.getAttribute("formaction") : evt.target.getAttribute("action");
      if (!actionRef) return;
      if (!actionRef.startsWith("https://action/")) {
        const url = new URL(actionRef, mockBase);
        actionRef = router2.parsePath(url.pathname + url.search);
        if (!actionRef.startsWith(actionBase)) return;
      }
      if (evt.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const handler = actions.get(actionRef);
      if (handler) {
        evt.preventDefault();
        const data = new FormData(evt.target, evt.submitter);
        handler.call({
          r: router2,
          f: evt.target
        }, evt.target.enctype === "multipart/form-data" ? data : new URLSearchParams(data));
      }
    }
    delegateEvents(["click", "submit"]);
    document.addEventListener("click", handleAnchorClick);
    if (preload) {
      document.addEventListener("mousemove", handleAnchorMove, {
        passive: true
      });
      document.addEventListener("focusin", handleAnchorPreload, {
        passive: true
      });
      document.addEventListener("touchstart", handleAnchorPreload, {
        passive: true
      });
    }
    document.addEventListener("submit", handleFormSubmit);
    onCleanup(() => {
      document.removeEventListener("click", handleAnchorClick);
      if (preload) {
        document.removeEventListener("mousemove", handleAnchorMove);
        document.removeEventListener("focusin", handleAnchorPreload);
        document.removeEventListener("touchstart", handleAnchorPreload);
      }
      document.removeEventListener("submit", handleFormSubmit);
    });
  };
}
function Router(props) {
  if (isServer) return StaticRouter(props);
  const getSource = () => {
    const url = window.location.pathname.replace(/^\/+/, "/") + window.location.search;
    const state = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: url + window.location.hash,
      state
    };
  };
  const beforeLeave = createBeforeLeave();
  return createRouter$2({
    get: getSource,
    set({
      value,
      replace,
      scroll,
      state
    }) {
      if (replace) {
        window.history.replaceState(keepDepth(state), "", value);
      } else {
        window.history.pushState(state, "", value);
      }
      scrollToHash(decodeURIComponent(window.location.hash.slice(1)), scroll);
      saveCurrentDepth();
    },
    init: (notify) => bindEvent(window, "popstate", notifyIfNotBlocked(notify, (delta) => {
      if (delta) {
        return !beforeLeave.confirm(delta);
      } else {
        const s2 = getSource();
        return !beforeLeave.confirm(s2.value, {
          state: s2.state
        });
      }
    })),
    create: setupNativeEvents(props.preload, props.explicitLinks, props.actionBase, props.transformUrl),
    utils: {
      go: (delta) => window.history.go(delta),
      beforeLeave
    }
  })(props);
}
function createAsync(fn2, options) {
  let resource;
  let prev = () => !resource || resource.state === "unresolved" ? void 0 : resource.latest;
  [resource] = createResource(() => subFetch(fn2, catchError(() => untrack(prev), () => void 0)), (v2) => v2, options);
  const resultAccessor = () => resource();
  Object.defineProperty(resultAccessor, "latest", {
    get() {
      return resource.latest;
    }
  });
  return resultAccessor;
}
class MockPromise {
  static all() {
    return new MockPromise();
  }
  static allSettled() {
    return new MockPromise();
  }
  static any() {
    return new MockPromise();
  }
  static race() {
    return new MockPromise();
  }
  static reject() {
    return new MockPromise();
  }
  static resolve() {
    return new MockPromise();
  }
  catch() {
    return new MockPromise();
  }
  then() {
    return new MockPromise();
  }
  finally() {
    return new MockPromise();
  }
}
function subFetch(fn2, prev) {
  if (isServer || !sharedConfig.context) return fn2(prev);
  const ogFetch = fetch;
  const ogPromise = Promise;
  try {
    window.fetch = () => new MockPromise();
    Promise = MockPromise;
    return fn2(prev);
  } finally {
    window.fetch = ogFetch;
    Promise = ogPromise;
  }
}
function redirect$1(url, init = 302) {
  let responseInit;
  let revalidate2;
  if (typeof init === "number") {
    responseInit = {
      status: init
    };
  } else {
    ({
      revalidate: revalidate2,
      ...responseInit
    } = init);
    if (typeof responseInit.status === "undefined") {
      responseInit.status = 302;
    }
  }
  const headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  revalidate2 !== void 0 && headers.set("X-Revalidate", revalidate2.toString());
  const response = new Response(null, {
    ...responseInit,
    headers
  });
  return response;
}
const REGISTRATIONS = /* @__PURE__ */ new Map();
function registerServerFunction(id, callback) {
  REGISTRATIONS.set(id, callback);
  return callback;
}
function getServerFunction(id) {
  const fn2 = REGISTRATIONS.get(id);
  if (fn2) {
    return fn2;
  }
  throw new Error("invalid server function: " + id);
}
function createServerReference(id, fn2) {
  const registration = {
    id,
    fn: fn2
  };
  registerServerFunction(id, fn2);
  return registration;
}
function cloneServerReference({
  id,
  fn: fn2
}) {
  if (typeof fn2 !== "function") throw new Error("Export from a 'use server' module must be a function");
  let baseURL = "/";
  if (!baseURL.endsWith("/")) baseURL += "/";
  return new Proxy(fn2, {
    get(target, prop, receiver) {
      if (prop === "url") {
        return `${baseURL}_server?id=${encodeURIComponent(id)}`;
      }
      if (prop === "GET") return receiver;
      return target[prop];
    },
    apply(target, thisArg, args) {
      const ogEvt = getRequestEvent();
      if (!ogEvt) throw new Error("Cannot call server function outside of a request");
      const evt = {
        ...ogEvt
      };
      evt.locals.serverFunctionMeta = {
        id
      };
      evt.serverOnly = true;
      return provideRequestEvent(evt, () => {
        return fn2.apply(thisArg, args);
      });
    }
  });
}
const db = new PrismaClient();
const NullProtoObj = /* @__PURE__ */ (() => {
  const e = function() {
  };
  return e.prototype = /* @__PURE__ */ Object.create(null), Object.freeze(e.prototype), e;
})();
function createRouter$1() {
  return {
    root: { key: "" },
    static: new NullProtoObj()
  };
}
function scanFirstGroup(path2) {
  let i2 = 0;
  let depth2 = 0;
  for (; i2 < path2.length; i2++) {
    const c2 = path2.charCodeAt(i2);
    if (c2 === 92) i2++;
    else if (c2 === 40) depth2++;
    else if (c2 === 41 && depth2 > 0) depth2--;
    else if (c2 === 123 && depth2 === 0) break;
  }
  if (i2 >= path2.length) return;
  let j2 = i2 + 1;
  depth2 = 0;
  for (; j2 < path2.length; j2++) {
    const c2 = path2.charCodeAt(j2);
    if (c2 === 92) j2++;
    else if (c2 === 40) depth2++;
    else if (c2 === 41 && depth2 > 0) depth2--;
    else if (c2 === 125 && depth2 === 0) break;
  }
  if (j2 >= path2.length) return;
  const mod = path2[j2 + 1];
  const hasMod = mod === "?" || mod === "+" || mod === "*";
  return [
    path2.slice(0, i2),
    path2.slice(i2 + 1, j2),
    path2.slice(j2 + (hasMod ? 2 : 1)),
    hasMod ? mod : void 0
  ];
}
function expandGroupDelimiters(path2) {
  if (!path2.includes("{")) return;
  const group = scanFirstGroup(path2);
  if (!group) return;
  const [pre, body, suf, mod] = group;
  if (!mod) return [pre + body + suf];
  if (mod === "?") return [pre + body + suf, pre + suf];
  if (body.includes("/")) throw new Error("unsupported group repetition across segments");
  return [`${pre}(?:${body})${mod}${suf}`];
}
const UNNAMED_GROUP_PREFIX = "__rou3_unnamed_";
const _unnamedGroupPrefixLength = 15;
function hasSegmentWildcard(segment) {
  let depth2 = 0;
  for (let i2 = 0; i2 < segment.length; i2++) {
    const ch = segment.charCodeAt(i2);
    if (ch === 92) {
      i2++;
      continue;
    }
    if (ch === 40) {
      depth2++;
      continue;
    }
    if (ch === 41 && depth2 > 0) {
      depth2--;
      continue;
    }
    if (ch === 42 && depth2 === 0) return true;
  }
  return false;
}
function replaceSegmentWildcards(segment, unnamedStart, toGroupKey = toUnnamedGroupKey) {
  let depth2 = 0;
  let nextIndex = unnamedStart;
  let replaced = "";
  for (let i2 = 0; i2 < segment.length; i2++) {
    const ch = segment.charCodeAt(i2);
    if (ch === 92) {
      replaced += segment[i2];
      if (i2 + 1 < segment.length) replaced += segment[++i2];
      continue;
    }
    if (ch === 40) {
      depth2++;
      replaced += segment[i2];
      continue;
    }
    if (ch === 41 && depth2 > 0) {
      depth2--;
      replaced += segment[i2];
      continue;
    }
    if (ch === 42 && depth2 === 0) {
      replaced += `(?<${toGroupKey(nextIndex++)}>[^/]*)`;
      continue;
    }
    replaced += segment[i2];
  }
  return [replaced, nextIndex];
}
function toUnnamedGroupKey(index) {
  return `${UNNAMED_GROUP_PREFIX}${index}`;
}
function normalizeUnnamedGroupKey(key) {
  return key.startsWith("__rou3_unnamed_") ? key.slice(_unnamedGroupPrefixLength) : key;
}
function encodeEscapes(path2) {
  if (!path2.includes("\\")) return path2;
  return path2.replace(/\\([:(){}])/g, (_2, c2) => "�" + "ABCDE"[":(){}".indexOf(c2)]);
}
function decodeEscaped(segment) {
  if (!segment.includes("�")) return segment;
  return segment.replace(/\uFFFD([A-E])/g, (_2, c2) => c2 === "A" ? ":" : c2 === "B" ? "(" : c2 === "C" ? ")" : c2 === "D" ? "{" : "}");
}
function expandModifiers(segments) {
  for (let i2 = 0; i2 < segments.length; i2++) {
    const last = segments[i2].charCodeAt(segments[i2].length - 1);
    if (last !== 63 && last !== 43 && last !== 42) continue;
    const m2 = segments[i2].match(/^(.*:[\w-]+(?:\([^)]*\))?)([?+*])$/);
    if (!m2) continue;
    const pre = segments.slice(0, i2);
    const suf = segments.slice(i2 + 1);
    if (m2[2] === "?") return ["/" + pre.concat(m2[1]).concat(suf).join("/"), "/" + pre.concat(suf).join("/")];
    const name = m2[1].match(/:([\w-]+)/)?.[1] || "_";
    const wc = "/" + [
      ...pre,
      `**:${name}`,
      ...suf
    ].join("/");
    const without = "/" + [...pre, ...suf].join("/");
    return m2[2] === "+" ? [wc] : [wc, without];
  }
}
function splitPath(path2) {
  const s2 = path2.split("/");
  s2.shift();
  if (s2[s2.length - 1] === "") s2.pop();
  return s2;
}
function getMatchParams(segments, paramsMap) {
  const params = new NullProtoObj();
  for (const [index, name] of paramsMap) {
    const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
    if (typeof name === "string") params[name] = segment;
    else {
      const match = segment.match(name);
      if (match) for (const key in match.groups) params[normalizeUnnamedGroupKey(key)] = match.groups[key];
    }
  }
  return params;
}
function addRoute(ctx, method = "", path2, data) {
  method = method.toUpperCase();
  if (path2.charCodeAt(0) !== 47) path2 = `/${path2}`;
  const groupExpanded = expandGroupDelimiters(path2);
  if (groupExpanded) {
    for (const expandedPath of groupExpanded) addRoute(ctx, method, expandedPath, data);
    return;
  }
  path2 = encodeEscapes(path2);
  const segments = splitPath(path2);
  const expanded = expandModifiers(segments);
  if (expanded) {
    for (const p2 of expanded) addRoute(ctx, method, p2, data);
    return;
  }
  let node = ctx.root;
  let _unnamedParamIndex = 0;
  const paramsMap = [];
  const paramsRegexp = [];
  for (let i2 = 0; i2 < segments.length; i2++) {
    let segment = segments[i2];
    if (segment.startsWith("**")) {
      if (!node.wildcard) node.wildcard = { key: "**" };
      node = node.wildcard;
      paramsMap.push([
        -(i2 + 1),
        segment.split(":")[1] || "_",
        segment.length === 2
      ]);
      break;
    }
    const hasParen = segment.includes("(");
    const hasWildcard = !hasParen && hasSegmentWildcard(segment);
    if (segment === "*" || hasParen || hasWildcard || segment.includes(":")) {
      if (!node.param) node.param = { key: "*" };
      node = node.param;
      if (segment === "*") paramsMap.push([
        i2,
        String(_unnamedParamIndex++),
        true
      ]);
      else if (hasParen || hasWildcard || segment.includes(":", 1) || !/^:[\w-]+$/.test(segment)) {
        const [regexp, nextIndex] = getParamRegexp(segment, _unnamedParamIndex);
        _unnamedParamIndex = nextIndex;
        paramsRegexp[i2] = regexp;
        node.hasRegexParam = true;
        paramsMap.push([
          i2,
          regexp,
          false
        ]);
      } else paramsMap.push([
        i2,
        segment.slice(1),
        false
      ]);
      continue;
    }
    if (segment === "\\*") segment = segments[i2] = "*";
    else if (segment === "\\*\\*") segment = segments[i2] = "**";
    segment = segments[i2] = decodeEscaped(segment);
    const child = node.static?.[segment];
    if (child) node = child;
    else {
      const staticNode = { key: segment };
      if (!node.static) node.static = new NullProtoObj();
      node.static[segment] = staticNode;
      node = staticNode;
    }
  }
  const hasParams = paramsMap.length > 0;
  const methods = node.methods ??= new NullProtoObj();
  (methods[method] ??= []).push({
    data: data || null,
    paramsRegexp,
    paramsMap: hasParams ? paramsMap : void 0
  });
  if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment, unnamedStart = 0) {
  let _i = unnamedStart;
  let _s = "", _d = 0;
  for (let j2 = 0; j2 < segment.length; j2++) {
    const c2 = segment.charCodeAt(j2);
    if (c2 === 40) _d++;
    else if (c2 === 41 && _d > 0) _d--;
    else if (c2 === 92 && _d === 0 && j2 + 1 < segment.length) {
      const n2 = segment[j2 + 1];
      if (n2 !== ":" && n2 !== "(" && n2 !== "*" && n2 !== "\\") {
        _s += "￾" + n2;
        j2++;
        continue;
      }
    } else if (c2 === 46 && _d === 0) {
      _s += "\\.";
      continue;
    }
    _s += segment[j2];
  }
  [_s, _i] = replaceSegmentWildcards(_s, _i);
  const regex = _s.replace(/:([\w-]+)(?:\(([^)]*)\))?/g, (_2, id, p2) => `(?<${id}>${p2 || "[^/]+"})`).replace(/\((?![?<])/g, () => `(?<${toUnnamedGroupKey(_i++)}>`).replace(/\uFFFE(.)/g, (_2, c2) => /[.*+?^${}()|[\]\\]/.test(c2) ? `\\${c2}` : c2);
  return [new RegExp(`^${regex}$`), _i];
}
function findRoute(ctx, method = "", path2, opts) {
  if (path2.charCodeAt(path2.length - 1) === 47) path2 = path2.slice(0, -1);
  const staticNode = ctx.static[path2];
  if (staticNode && staticNode.methods) {
    const staticMatch = staticNode.methods[method] || staticNode.methods[""];
    if (staticMatch !== void 0) return staticMatch[0];
  }
  const segments = splitPath(path2);
  const match = _lookupTree(ctx.root, method, segments, 0);
  if (match === void 0) return;
  return {
    data: match.data,
    params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
  };
}
function _lookupTree(node, method, segments, index) {
  if (index === segments.length) {
    if (node.methods) {
      const match = _selectMatcher(node.methods, method, segments, node.key === "*", false);
      if (match) return match;
    }
    return node.param?.methods && _selectMatcher(node.param.methods, method, segments, true, true) || node.wildcard?.methods && _selectMatcher(node.wildcard.methods, method, segments, true, true) || void 0;
  }
  const segment = segments[index];
  if (node.static) {
    const staticChild = node.static[segment];
    if (staticChild) {
      const match = _lookupTree(staticChild, method, segments, index + 1);
      if (match) return match;
    }
  }
  if (node.param) {
    const match = _lookupTree(node.param, method, segments, index + 1);
    if (match) return match;
  }
  if (node.wildcard && node.wildcard.methods) return _selectMatcher(node.wildcard.methods, method, segments, true, false);
}
function _selectMatcher(methods, method, segments, dynamicTerminal, optionalOnly) {
  const match = methods[method] || methods[""];
  if (!match) return;
  const first = match[0];
  if (match.length === 1 && first.paramsRegexp.length === 0) {
    if (!optionalOnly) return first;
    const pMap = first.paramsMap;
    return pMap?.[pMap.length - 1]?.[2] ? first : void 0;
  }
  let best;
  let bestWeight = -1;
  for (const m2 of match) {
    const pMap = m2.paramsMap;
    const lastOptional = pMap?.[pMap.length - 1]?.[2];
    if (optionalOnly && !lastOptional) continue;
    let weight = dynamicTerminal && pMap && !lastOptional ? 1 : 0;
    const regexps = m2.paramsRegexp;
    for (let i2 = 0; i2 < regexps.length; i2++) if (regexps[i2]) {
      if (!regexps[i2].test(segments[i2])) {
        weight = -1;
        break;
      }
      weight++;
    }
    if (weight > bestWeight) {
      best = m2;
      bestWeight = weight;
    }
  }
  return best;
}
const _P = "￾";
function replaceEscapesOutsideGroups(segment) {
  let r = "", d2 = 0;
  for (let i2 = 0; i2 < segment.length; i2++) {
    const c2 = segment.charCodeAt(i2);
    if (c2 === 40) d2++;
    else if (c2 === 41 && d2 > 0) d2--;
    else if (c2 === 92 && d2 === 0 && i2 + 1 < segment.length) {
      const n2 = segment[i2 + 1];
      if (n2 !== ":" && n2 !== "(" && n2 !== "*" && n2 !== "\\") {
        r += _P + n2;
        i2++;
        continue;
      }
    }
    r += segment[i2];
  }
  return r;
}
function resolveEscapePlaceholders(str) {
  return str.replace(/\uFFFE(.)/g, (_2, c2) => /[.*+?^${}()|[\]\\]/.test(c2) ? `\\${c2}` : c2);
}
function escapeBareDots(str) {
  let r = "", d2 = 0;
  for (let i2 = 0; i2 < str.length; i2++) {
    const c2 = str.charCodeAt(i2);
    if (c2 === 92 || c2 === 65534) {
      r += str[i2] + (str[i2 + 1] || "");
      i2++;
    } else if (c2 === 40) {
      d2++;
      r += str[i2];
    } else if (c2 === 41) {
      if (d2 > 0) d2--;
      r += str[i2];
    } else if (c2 === 46 && d2 === 0) r += "\\.";
    else r += str[i2];
  }
  return r;
}
function routeToRegExp(route2 = "/") {
  const inlineOptional = inlineOptionalGroup(route2);
  if (inlineOptional) return inlineOptional;
  const groupExpanded = expandGroupDelimiters(route2);
  if (groupExpanded) {
    const sources = groupExpanded.map((expandedRoute) => routeToRegExp(expandedRoute).source.slice(1, -1));
    return new RegExp(`^(?:${sources.join("|")})$`);
  }
  return _routeToRegExp(route2);
}
function inlineOptionalGroup(route2) {
  const group = scanFirstGroup(route2);
  if (!group) return;
  const [pre, body, suf, mod] = group;
  if (mod !== "?" || suf !== "" || body === "" || scanFirstGroup(pre) || scanFirstGroup(body)) return;
  const baseSegs = routeToRegExpSegments(pre);
  const fullSegs = routeToRegExpSegments(pre + body);
  const baseLen = baseSegs.length;
  if (baseLen === 0 || fullSegs.length < baseLen) return;
  const midSegment = fullSegs.length === baseLen;
  const sharedLen = midSegment ? baseLen - 1 : baseLen;
  for (let i2 = 0; i2 < sharedLen; i2++) if (fullSegs[i2] !== baseSegs[i2]) return;
  if (midSegment) {
    const prefix = baseSegs[baseLen - 1];
    const last = fullSegs[baseLen - 1];
    if (!last.startsWith(prefix)) return;
    if (/(?:\[\^\/\]|\.)[*+]\)?$/.test(prefix)) return;
    const k2 = prefix.length;
    const inlineSegs = fullSegs.slice(0, baseLen - 1);
    inlineSegs.push(`${last.slice(0, k2)}(?:${last.slice(k2)})?`);
    return new RegExp(`^/${inlineSegs.join("/")}/?$`);
  }
  const head = fullSegs.slice(0, baseLen).join("/");
  const tail = fullSegs.slice(baseLen).join("/");
  return new RegExp(`^/${head}(?:/${tail})?/?$`);
}
function _routeToRegExp(route2) {
  return new RegExp(`^/${routeToRegExpSegments(route2).join("/")}/?$`);
}
function routeToRegExpSegments(route2) {
  const reSegments = [];
  let idCtr = 0;
  for (const segment of route2.split("/")) {
    if (!segment) continue;
    if (segment === "*") reSegments.push(`(?<${toRegExpUnnamedKey(idCtr++)}>[^/]*)`);
    else if (segment.startsWith("**")) reSegments.push(segment === "**" ? "?(?<_>.*)" : `?(?<${segment.slice(3)}>.+)`);
    else if (segment.includes(":") || /(^|[^\\])\(/.test(segment) || hasSegmentWildcard(segment)) {
      const modMatch = segment.match(/^(.*:[\w-]+(?:\([^)]*\))?)([?+*])$/);
      if (modMatch) {
        const [, base, mod] = modMatch;
        const name = base.match(/:([\w-]+)/)?.[1] || `_${idCtr++}`;
        if (mod === "?") {
          const inner = escapeBareDots(base.replace(/:([\w-]+)(?:\(([^)]*)\))?/g, (_2, id, pattern2) => `(?<${id}>${pattern2 || "[^/]+"})`));
          if (reSegments.length > 0) {
            const prevQ = reSegments.pop();
            reSegments.push(`${prevQ}(?:/${inner})?`);
          } else reSegments.push(`?${inner}?`);
          continue;
        }
        const pattern = base.match(/:(\w+)(?:\(([^)]*)\))?/)?.[2];
        if (reSegments.length > 0) {
          const prevMod = reSegments.pop();
          if (pattern) {
            const repeated = `${pattern}(?:/${pattern})*`;
            reSegments.push(mod === "+" ? `${prevMod}/(?<${name}>${repeated})` : `${prevMod}(?:/(?<${name}>${repeated}))?`);
          } else reSegments.push(mod === "+" ? `${prevMod}/(?<${name}>.+)` : `${prevMod}(?:/(?<${name}>.*))?`);
        } else if (pattern) {
          const repeated = `${pattern}(?:/${pattern})*`;
          reSegments.push(mod === "+" ? `?(?<${name}>${repeated})` : `?(?<${name}>${repeated})?`);
        } else reSegments.push(mod === "+" ? `?(?<${name}>.+)` : `?(?<${name}>.*)`);
        continue;
      }
      let dynamicSegment = replaceEscapesOutsideGroups(segment);
      [dynamicSegment, idCtr] = replaceSegmentWildcards(dynamicSegment, idCtr, toRegExpUnnamedKey);
      reSegments.push(resolveEscapePlaceholders(escapeBareDots(dynamicSegment.replace(/:([\w-]+)(?:\(([^)]*)\))?/g, (_2, id, pattern) => `(?<${id}>${pattern || "[^/]+"})`).replace(/(^|[^\\])\((?![?<])/g, (_2, p2) => `${p2}(?<${toRegExpUnnamedKey(idCtr++)}>`))));
    } else reSegments.push(segment.replace(/\\(.)/g, "$1").replace(/[.*+?^${}()|[\]]/g, "\\$&"));
  }
  return reSegments;
}
function toRegExpUnnamedKey(index) {
  return `_${index}`;
}
function lazyInherit(target, source, sourceKey) {
  for (const key of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
    if (key === "constructor") continue;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    const desc = Object.getOwnPropertyDescriptor(source, key);
    let modified = false;
    if (desc.get) {
      modified = true;
      desc.get = targetDesc?.get || function() {
        return this[sourceKey][key];
      };
    }
    if (desc.set) {
      modified = true;
      desc.set = targetDesc?.set || function(value) {
        this[sourceKey][key] = value;
      };
    }
    if (!targetDesc?.value && typeof desc.value === "function") {
      modified = true;
      desc.value = function(...args) {
        return this[sourceKey][key](...args);
      };
    }
    if (modified) Object.defineProperty(target, key, desc);
  }
}
const _needsNormRE = /(?:(?:^|\/)(?:\.|\.\.|%2e|%2e\.|\.%2e|%2e%2e)(?:\/|$))|[\\^#"<>{}`\x00-\x20\x7f-\uffff]/i;
const _searchNeedsNormRE = /[#"'<>\x00-\x20\x7f-\uffff]/;
const FastURL = /* @__PURE__ */ (() => {
  const NativeURL = globalThis.URL;
  const NativeSearchParams = globalThis.URLSearchParams;
  const FastURLSearchParams = class URLSearchParams {
    #owner;
    #params;
    constructor(owner) {
      this.#owner = owner;
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeSearchParams;
    }
    _adopt(params) {
      this.#params = params;
    }
    get _params() {
      if (!this.#params) {
        const search = this.#owner.search;
        this.#params ??= new NativeSearchParams(search);
      }
      return this.#params;
    }
    #mutable() {
      this.#owner._url;
      return this.#params;
    }
    append(name, value) {
      this.#mutable().append(name, value);
    }
    set(name, value) {
      this.#mutable().set(name, value);
    }
    delete(name, value) {
      this.#mutable().delete(name, value);
    }
    sort() {
      this.#mutable().sort();
    }
  };
  lazyInherit(FastURLSearchParams.prototype, NativeSearchParams.prototype, "_params");
  Object.setPrototypeOf(FastURLSearchParams.prototype, NativeSearchParams.prototype);
  Object.setPrototypeOf(FastURLSearchParams, NativeSearchParams);
  const FastURL2 = class URL {
    #url;
    #href;
    #protocol;
    #host;
    #pathname;
    #search;
    #searchParams;
    #pos;
    constructor(url) {
      if (typeof url === "string") {
        const isOriginForm = url[0] === "/";
        if (isOriginForm && !_searchNeedsNormRE.test(url)) this.#href = `http://localhost${url}`;
        else this.#url = new NativeURL(isOriginForm ? `http://localhost${url}` : url);
      } else if (_needsNormRE.test(url.pathname) || url.search && _searchNeedsNormRE.test(url.search)) this.#url = new NativeURL(`${url.protocol || "http:"}//${url.host || "localhost"}${url.pathname}${url.search || ""}`);
      else {
        this.#protocol = url.protocol;
        this.#host = url.host;
        this.#pathname = url.pathname;
        this.#search = url.search;
      }
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeURL;
    }
    get _url() {
      if (this.#url) return this.#url;
      this.#url = new NativeURL(this.href);
      this.#href = void 0;
      this.#protocol = void 0;
      this.#host = void 0;
      this.#pathname = void 0;
      this.#search = void 0;
      this.#pos = void 0;
      this.#searchParams?._adopt(this.#url.searchParams);
      return this.#url;
    }
    get href() {
      if (this.#url) return this.#url.href;
      if (!this.#href) this.#href = `${this.#protocol || "http:"}//${this.#host || "localhost"}${this.#pathname || "/"}${this.#search || ""}`;
      return this.#href;
    }
    #getPos() {
      if (!this.#pos) {
        const url = this.href;
        const protoIndex = url.indexOf("://");
        const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
        const qIndex = pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex);
        this.#pos = [
          protoIndex,
          pathnameIndex,
          qIndex
        ];
      }
      return this.#pos;
    }
    get pathname() {
      if (this.#url) return this.#url.pathname;
      if (this.#pathname === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.pathname;
        this.#pathname = this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex);
      }
      return this.#pathname;
    }
    get search() {
      if (this.#url) return this.#url.search;
      if (this.#search === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.search;
        const url = this.href;
        this.#search = queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex);
      }
      return this.#search;
    }
    get searchParams() {
      if (this.#searchParams) return this.#searchParams;
      if (this.#url) return this.#url.searchParams;
      return this.#searchParams = new FastURLSearchParams(this);
    }
    get protocol() {
      if (this.#url) return this.#url.protocol;
      if (this.#protocol === void 0) {
        const [protocolIndex] = this.#getPos();
        if (protocolIndex === -1) return this._url.protocol;
        const url = this.href;
        this.#protocol = url.slice(0, protocolIndex + 1);
      }
      return this.#protocol;
    }
    toString() {
      return this.href;
    }
    toJSON() {
      return this.href;
    }
  };
  lazyInherit(FastURL2.prototype, NativeURL.prototype, "_url");
  Object.setPrototypeOf(FastURL2.prototype, NativeURL.prototype);
  Object.setPrototypeOf(FastURL2, NativeURL);
  return FastURL2;
})();
const NodeResponse = /* @__PURE__ */ (() => {
  const NativeResponse = globalThis.Response;
  class NodeResponse2 {
    #body;
    #init;
    #headers;
    #response;
    constructor(body, init) {
      this.#body = body;
      this.#init = init;
    }
    static [Symbol.hasInstance](val) {
      return val instanceof NativeResponse;
    }
    static json(data, init) {
      const body = JSON.stringify(data);
      if (body === void 0) throw new TypeError("Value is not JSON serializable");
      let headers = init?.headers;
      if (!headers) headers = { "content-type": "application/json" };
      else {
        const merged = new Headers(headers);
        if (!merged.has("content-type")) merged.set("content-type", "application/json");
        headers = merged;
      }
      return new NodeResponse2(body, init ? {
        ...init,
        headers
      } : { headers });
    }
    get status() {
      return this.#response?.status || this.#init?.status || 200;
    }
    get statusText() {
      return this.#response?.statusText || this.#init?.statusText || "";
    }
    get headers() {
      if (this.#response) return this.#response.headers;
      if (this.#headers) return this.#headers;
      return this.#headers = new Headers(this.#init?.headers);
    }
    get ok() {
      if (this.#response) return this.#response.ok;
      const status = this.status;
      return status >= 200 && status < 300;
    }
    get _response() {
      if (this.#response) return this.#response;
      let body = this.#body;
      if (body && typeof body.pipe === "function" && !(body instanceof Readable)) {
        const stream = new PassThrough();
        body.pipe(stream);
        const abort = body.abort;
        if (abort) stream.once("close", () => abort());
        body = stream;
      }
      this.#response = new NativeResponse(body, this.#headers ? {
        ...this.#init,
        headers: this.#headers
      } : this.#init);
      this.#init = void 0;
      this.#headers = void 0;
      this.#body = void 0;
      return this.#response;
    }
    _toNodeResponse() {
      const status = this.status;
      const statusText = this.statusText;
      let body;
      let contentType;
      let contentLength;
      if (this.#response) body = this.#response.body;
      else if (this.#body != null) if (this.#body instanceof ReadableStream) body = this.#body;
      else if (typeof this.#body === "string") {
        body = this.#body;
        contentType = "text/plain; charset=UTF-8";
        contentLength = Buffer.byteLength(this.#body);
      } else if (this.#body instanceof ArrayBuffer) {
        body = Buffer.from(this.#body);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Uint8Array) {
        body = this.#body;
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof DataView) {
        body = Buffer.from(this.#body.buffer, this.#body.byteOffset, this.#body.byteLength);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Blob) {
        body = this.#body.stream();
        contentType = this.#body.type;
        contentLength = this.#body.size;
      } else if (typeof this.#body.pipe === "function") body = this.#body;
      else body = this._response.body;
      const headers = [];
      const initHeaders = this.#init?.headers;
      const headerEntries = this.#response?.headers || this.#headers || (initHeaders ? Array.isArray(initHeaders) ? initHeaders : initHeaders?.entries ? initHeaders.entries() : Object.entries(initHeaders) : void 0);
      let hasContentTypeHeader;
      let hasContentLength;
      if (headerEntries) for (const [key, value] of headerEntries) {
        const lowerKey = typeof key === "string" ? key.toLowerCase() : String(key);
        if (Array.isArray(value)) for (const v2 of value) headers.push(lowerKey, v2);
        else headers.push(lowerKey, value);
        if (lowerKey === "content-type") hasContentTypeHeader = true;
        else if (lowerKey === "content-length") hasContentLength = true;
      }
      if (contentType && !hasContentTypeHeader) headers.push("content-type", contentType);
      if (contentLength != null && !hasContentLength) headers.push("content-length", String(contentLength));
      this.#init = void 0;
      this.#headers = void 0;
      this.#response = void 0;
      this.#body = void 0;
      return {
        status,
        statusText,
        headers,
        body
      };
    }
  }
  lazyInherit(NodeResponse2.prototype, NativeResponse.prototype, "_response");
  Object.setPrototypeOf(NodeResponse2, NativeResponse);
  Object.setPrototypeOf(NodeResponse2.prototype, NativeResponse.prototype);
  return NodeResponse2;
})();
function stripBase(pathname, base) {
  if (pathname === base || pathname.startsWith(base + "/")) return "/" + pathname.slice(base.length).replace(/^\/+/, "");
  return pathname;
}
function decodePathname(pathname) {
  return decodeURI(pathname.includes("%25") ? pathname.replace(/%25/g, "%2525") : pathname);
}
const kEventNS = "h3.internal.event.";
const kEventRes = /* @__PURE__ */ Symbol.for(`${kEventNS}res`);
const kEventResHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.headers`);
const kEventResErrHeaders = /* @__PURE__ */ Symbol.for(`${kEventNS}res.err.headers`);
const kMalformedURL = /* @__PURE__ */ Symbol.for(`${kEventNS}malformed`);
var H3Event = class {
  app;
  req;
  url;
  context;
  static __is_event__ = true;
  constructor(req, context, app2) {
    this.context = req.context = context || req.context || new NullProtoObj();
    this.req = req;
    this.app = app2;
    const _url = req._url;
    let url = _url && _url instanceof URL ? _url : new FastURL(req.url);
    if (url.pathname.includes("%")) try {
      const pathname = decodePathname(url.pathname);
      if (pathname !== url.pathname) url = new FastURL(`${url.protocol}//${url.host}${pathname}${url.search}`);
    } catch {
      this[kMalformedURL] = true;
    }
    this.url = url;
  }
  get res() {
    return this[kEventRes] ||= new H3EventResponse();
  }
  get runtime() {
    return this.req.runtime;
  }
  waitUntil(promise) {
    this.req.waitUntil?.(promise);
  }
  toString() {
    return `[${this.req.method}] ${this.req.url}`;
  }
  toJSON() {
    return this.toString();
  }
  get node() {
    return this.req.runtime?.node;
  }
  get headers() {
    return this.req.headers;
  }
  get path() {
    return this.url.pathname + this.url.search;
  }
  get method() {
    return this.req.method;
  }
};
var H3EventResponse = class {
  status;
  statusText;
  get headers() {
    return this[kEventResHeaders] ||= new Headers();
  }
  get errHeaders() {
    return this[kEventResErrHeaders] ||= new Headers();
  }
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) return defaultStatusCode;
  if (typeof statusCode === "string") statusCode = +statusCode;
  if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) return defaultStatusCode;
  return statusCode;
}
var HTTPError = class HTTPError2 extends Error {
  get name() {
    return "HTTPError";
  }
  status;
  statusText;
  headers;
  cause;
  data;
  body;
  unhandled;
  static isError(input) {
    return input instanceof Error && input?.name === "HTTPError";
  }
  static status(status, statusText, details) {
    return new HTTPError2({
      ...details,
      statusText,
      status
    });
  }
  constructor(arg1, arg2) {
    let messageInput;
    let details;
    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else details = arg1;
    const status = sanitizeStatusCode(details?.status || details?.statusCode || details?.cause?.status || details?.cause?.statusCode, 500);
    const statusText = sanitizeStatusMessage(details?.statusText || details?.statusMessage || details?.cause?.statusText || details?.cause?.statusMessage);
    const message = messageInput || details?.message || details?.cause?.message || details?.statusText || details?.statusMessage || [
      "HTTPError",
      status,
      statusText
    ].filter(Boolean).join(" ");
    super(message, { cause: details });
    this.cause = details;
    this.status = status;
    this.statusText = statusText || void 0;
    const rawHeaders = details?.headers || details?.cause?.headers;
    this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
    this.unhandled = details?.unhandled ?? details?.cause?.unhandled ?? void 0;
    this.data = details?.data;
    this.body = details?.body;
  }
  get statusCode() {
    return this.status;
  }
  get statusMessage() {
    return this.statusText;
  }
  toJSON() {
    const unhandled = this.unhandled;
    return {
      status: this.status,
      statusText: this.statusText,
      unhandled,
      message: unhandled ? "HTTPError" : this.message,
      data: unhandled ? void 0 : this.data,
      ...unhandled ? void 0 : this.body
    };
  }
};
function isJSONSerializable(value, _type) {
  if (value === null || value === void 0) return true;
  if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
  if (typeof value.toJSON === "function") return true;
  if (Array.isArray(value)) return true;
  if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
  if (value instanceof NullProtoObj) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
const kEventDispose = /* @__PURE__ */ Symbol.for("h3.internal.event.dispose");
const kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
const kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
  if (typeof val?.then === "function") return val.then((resolvedVal) => toResponse(resolvedVal, event, config), (r) => toResponse(toError(r), event, config));
  let response;
  try {
    response = prepareResponse(val, event, config);
  } catch (error) {
    return toResponse(toError(error), event, config);
  }
  if (typeof response?.then === "function") return toResponse(response, event, config);
  const { onResponse } = config;
  if (onResponse) return Promise.resolve().then(() => onResponse(response, event)).catch((error) => {
    if (!config.silent) console.error(error);
  }).then(() => event[kEventDispose]?.observe(response, val) ?? response);
  return event[kEventDispose]?.observe(response, val) ?? response;
}
function toError(value) {
  if (value === kNotFound || value === kHandled || value instanceof Error) return value;
  if (typeof value === "number") return new HTTPError({ status: value });
  const error = new HTTPError({
    status: 500,
    unhandled: true
  });
  error.cause = value;
  return error;
}
var HTTPResponse = class {
  #headers;
  #init;
  body;
  constructor(body, init) {
    this.body = body;
    this.#init = init;
  }
  get status() {
    return this.#init?.status;
  }
  get statusText() {
    return this.#init?.statusText;
  }
  get headers() {
    return this.#headers ||= new Headers(this.#init?.headers);
  }
};
function prepareResponse(val, event, config, nested) {
  if (val === kHandled) return new NodeResponse(null);
  if (val === kNotFound) val = new HTTPError({
    status: 404,
    message: `Cannot find any route matching [${event.req.method}] ${event.url}`
  });
  if (val && val instanceof Error) {
    const isHTTPError = HTTPError.isError(val);
    const error = isHTTPError ? val : new HTTPError(val);
    if (!isHTTPError) {
      error.unhandled = true;
      if (val?.stack) error.stack = val.stack;
    }
    if (error.unhandled && !config.silent) console.error(error);
    const { onError } = config;
    const errHeaders = event[kEventRes]?.[kEventResErrHeaders];
    return onError && !nested ? Promise.resolve().then(() => onError(error, event)).catch((error2) => error2).then((newVal) => prepareResponse(newVal ?? val, event, config, true)) : errorResponse(error, config.debug, errHeaders);
  }
  const preparedRes = event[kEventRes];
  let preparedHeaders = preparedRes?.[kEventResHeaders];
  event[kEventRes] = void 0;
  if (!(val instanceof Response)) {
    const res = prepareResponseBody(val, event, config);
    const status = res.status || preparedRes?.status;
    return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
      status,
      statusText: res.statusText || preparedRes?.statusText,
      headers: res.headers && preparedHeaders ? mergeHeaders$1(res.headers, preparedHeaders) : res.headers || preparedHeaders
    });
  }
  if (val.status >= 400) preparedHeaders = preparedRes?.[kEventResErrHeaders];
  if (preparedHeaders && !nested) try {
    mergeHeaders$1(val.headers, preparedHeaders, val.headers);
  } catch {
    return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
      status: val.status,
      statusText: val.statusText,
      headers: mergeHeaders$1(val.headers, preparedHeaders)
    });
  }
  return event.req.method === "HEAD" && val.body !== null ? new NodeResponse(null, {
    status: val.status,
    statusText: val.statusText,
    headers: val.headers
  }) : val;
}
function mergeHeaders$1(base, overrides, target = new Headers(base)) {
  for (const [name, value] of overrides) if (name === "set-cookie") target.append(name, value);
  else target.set(name, value);
  return target;
}
const frozen = (name) => (...args) => {
  throw new Error(`Headers are frozen (${name} ${args.join(", ")})`);
};
var FrozenHeaders = class extends Headers {
  set = frozen("set");
  append = frozen("append");
  delete = frozen("delete");
};
const emptyHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-length": "0" });
const jsonHeaders = /* @__PURE__ */ new FrozenHeaders({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
  if (val === null || val === void 0) return {
    body: "",
    headers: emptyHeaders
  };
  const valType = typeof val;
  if (valType === "string") return { body: val };
  if (val instanceof Uint8Array) return {
    body: val,
    headers: new Headers({ "content-length": val.byteLength.toString() })
  };
  if (val instanceof HTTPResponse || val?.constructor?.name === "HTTPResponse") return val;
  if (isJSONSerializable(val, valType)) return {
    body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
    headers: jsonHeaders
  };
  if (valType === "bigint") return {
    body: val.toString(),
    headers: jsonHeaders
  };
  if (val instanceof Blob) {
    const headers = new Headers({
      "content-type": val.type,
      "content-length": val.size.toString()
    });
    let filename = val.name;
    if (filename) {
      filename = encodeURIComponent(filename);
      headers.set("content-disposition", `filename="${filename}"; filename*=UTF-8''${filename}`);
    }
    return {
      body: val.stream(),
      headers
    };
  }
  if (valType === "symbol") return { body: val.toString() };
  if (valType === "function") return { body: `${val.name}()` };
  return { body: val };
}
function nullBody(method, status) {
  return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug, errHeaders) {
  let headers = error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : new Headers(jsonHeaders);
  if (errHeaders) headers = mergeHeaders$1(headers, errHeaders);
  return new NodeResponse(JSON.stringify({
    ...error.toJSON(),
    stack: debug && error.stack ? error.stack.split("\n").map((l2) => l2.trim()) : void 0
  }, void 0, debug ? 2 : void 0), {
    status: error.status,
    statusText: error.statusText,
    headers
  });
}
function normalizeMiddleware(input, opts = {}) {
  const matcher = createMatcher(opts);
  if (!matcher && (input.length > 1 || input.constructor?.name === "AsyncFunction")) return input;
  return (event, next) => {
    if (matcher && !matcher(event)) return next();
    const res = input(event, next);
    return res === void 0 || res === kNotFound ? next() : res;
  };
}
function createMatcher(opts) {
  if (!opts.route && !opts.method && !opts.match) return;
  const routeMatcher = opts.route ? routeToRegExp(opts.route) : void 0;
  const method = opts.method?.toUpperCase();
  return function _middlewareMatcher(event) {
    if (method && event.req.method !== method) {
      if (!(method === "GET" && event.req.method === "HEAD")) return false;
    }
    if (opts.match && !opts.match(event)) return false;
    if (!routeMatcher) return true;
    const match = event.url.pathname.match(routeMatcher);
    if (!match) return false;
    if (match.groups) event.context.middlewareParams = {
      ...event.context.middlewareParams,
      ...match.groups
    };
    return true;
  };
}
function composeMiddleware(middleware2) {
  let chain = (event, handler) => handler(event);
  for (let i2 = middleware2.length - 1; i2 >= 0; i2--) {
    const fn2 = middleware2[i2];
    const inner = chain;
    chain = (event, handler) => callLayer(fn2, event, handler, inner);
  }
  return chain;
}
function composeHandler(middleware2, handler) {
  const chain = composeMiddleware(middleware2);
  return function _composedHandler(event) {
    return chain(event, handler);
  };
}
function callMiddleware(event, middleware2, handler, index = 0) {
  return index === middleware2.length ? handler(event) : callLayer(middleware2[index], event, handler, (_event, _handler) => callMiddleware(_event, middleware2, _handler, index + 1));
}
function callLayer(fn2, event, handler, inner) {
  let nextCalled;
  let nextResult;
  const next = () => {
    if (nextCalled) return nextResult;
    nextCalled = true;
    nextResult = inner(event, handler);
    return nextResult;
  };
  const ret = fn2(event, next);
  return isUnhandledResponse(ret) ? next() : typeof ret?.then === "function" ? ret.then((resolved) => isUnhandledResponse(resolved) ? next() : resolved) : ret;
}
function isUnhandledResponse(val) {
  return val === void 0 || val === kNotFound;
}
function getEventContext(event) {
  if (event.context) return event.context;
  event.req.context ??= {};
  return event.req.context;
}
function requestWithURL(req, url) {
  const cache = {
    url,
    _url: void 0
  };
  return new Proxy(req, { get(target, prop) {
    if (prop in cache) return cache[prop];
    const value = Reflect.get(target, prop);
    cache[prop] = typeof value === "function" ? value.bind(target) : value;
    return cache[prop];
  } });
}
function requestWithBaseURL(req, base) {
  const url = new URL(req.url);
  let pathname;
  try {
    pathname = decodePathname(url.pathname);
  } catch {
    pathname = url.pathname;
  }
  url.pathname = stripBase(pathname, base);
  return requestWithURL(req, url.href);
}
function toRequest(input, options) {
  if (typeof input === "string") {
    let url = input;
    if (url[0] === "/") {
      const headers = options?.headers ? new Headers(options.headers) : void 0;
      const host = headers?.get("host") || "localhost";
      url = `${(headers?.get("x-forwarded-proto") || "").split(",")[0].trim() === "https" ? "https" : "http"}://${host}${url}`;
    }
    return new Request(url, options);
  } else if (options || input instanceof URL) return new Request(input, options);
  return input;
}
function getRequestIP(event, opts = {}) {
  if (opts.xForwardedFor) {
    const _header = event.req.headers.get("x-forwarded-for");
    if (_header) {
      const xForwardedFor = _header.split(",")[0].trim();
      if (xForwardedFor) return xForwardedFor;
    }
  }
  return event.req.context?.clientAddress || event.req.ip || void 0;
}
function defineHandler(input) {
  if (typeof input === "function") return handlerWithFetch(input);
  const handler = input.handler || (input.fetch ? function _fetchHandler(event) {
    return input.fetch(event.req);
  } : NoHandler);
  return Object.assign(handlerWithFetch(input.middleware?.length ? composeHandler(input.middleware, handler) : handler), input);
}
function handlerWithFetch(handler) {
  if ("fetch" in handler) return handler;
  return Object.assign(handler, { fetch: (req) => {
    if (typeof req === "string") req = new URL(req, "http://_");
    if (req instanceof URL) req = new Request(req);
    const event = new H3Event(req);
    try {
      return Promise.resolve(toResponse(handler(event), event));
    } catch (error) {
      return Promise.resolve(toResponse(toError(error), event));
    }
  } });
}
function toEventHandler(handler) {
  if (typeof handler === "function") return handler;
  if (typeof handler?.handler === "function" && handler.constructor?.["~h3"]) return handler.handler;
  if (typeof handler?.fetch === "function") return function _fetchHandler(event) {
    return handler.fetch(event.req);
  };
}
const NoHandler = () => kNotFound;
var H3Core = class {
  static "~h3" = true;
  config;
  "~middleware";
  "~routes" = [];
  "~dispatch";
  "~composed";
  constructor(config = {}) {
    this["~middleware"] = [];
    this.config = config;
    this.fetch = this.fetch.bind(this);
    this.handler = this.handler.bind(this);
  }
  fetch(request) {
    return this["~request"](request);
  }
  handler(event) {
    const route2 = this["~findRoute"](event);
    if (route2) {
      event.context.params = route2.params;
      event.context.matchedRoute = route2.data;
    }
    return (this["~dispatch"] ??= createDispatcher(this))(event, route2);
  }
  "~request"(request, context) {
    const event = new H3Event(request, context, this);
    let handlerRes;
    try {
      if (event[kMalformedURL] && !this.config.allowMalformedURL) throw new HTTPError({
        status: 400,
        message: "Bad Request"
      });
      if (this.config.onRequest) {
        const hookRes = this.config.onRequest(event);
        handlerRes = typeof hookRes?.then === "function" ? hookRes.then(() => this.handler(event)) : this.handler(event);
      } else handlerRes = this.handler(event);
    } catch (error) {
      handlerRes = Promise.reject(error);
    }
    return toResponse(handlerRes, event, this.config);
  }
  "~findRoute"(_event) {
  }
  "~addRoute"(_route) {
    this["~routes"].push(_route);
  }
  "~getMiddleware"(_event, route2) {
    const routeMiddleware = route2?.data.middleware;
    const globalMiddleware = this["~middleware"];
    return routeMiddleware ? [...globalMiddleware, ...routeMiddleware] : globalMiddleware;
  }
};
function createDispatcher(app2) {
  if (app2["~getMiddleware"] !== H3Core.prototype["~getMiddleware"]) return (event, route2) => callMiddleware(event, app2["~getMiddleware"](event, route2), route2?.data.handler || NoHandler);
  const middleware2 = app2["~middleware"];
  if (middleware2.length === 0) return (event, route2) => routeHandler(route2)(event);
  const composed = app2["~composed"] ??= composeMiddleware(middleware2);
  return (event, route2) => composed(event, routeHandler(route2));
}
function routeHandler(route2) {
  const data = route2?.data;
  if (!data) return NoHandler;
  return data.middleware?.length ? data["~composed"] ??= composeHandler(data.middleware, data.handler) : data.handler;
}
const H3 = /* @__PURE__ */ (() => {
  class H32 extends H3Core {
    "~rou3";
    constructor(config = {}) {
      super(config);
      this["~rou3"] = createRouter$1();
      this.request = this.request.bind(this);
      config.plugins?.forEach((plugin) => plugin(this));
    }
    register(plugin) {
      plugin(this);
      return this;
    }
    request(_req, _init, context) {
      return this["~request"](toRequest(_req, _init), context);
    }
    mount(base, input) {
      if ("handler" in input) {
        if (input["~middleware"].length > 0) {
          this["~middleware"].push((event, next) => {
            const originalPathname = event.url.pathname;
            if (!originalPathname.startsWith(base) || originalPathname.length > base.length && originalPathname[base.length] !== "/") return next();
            event.url.pathname = stripBase(originalPathname, base);
            const restore = () => {
              event.url.pathname = originalPathname;
            };
            try {
              const result = (input["~composed"] ??= composeMiddleware(input["~middleware"]))(event, () => {
                restore();
                return next();
              });
              if (typeof result?.then === "function") return Promise.resolve(result).finally(restore);
              restore();
              return result;
            } catch (err) {
              restore();
              throw err;
            }
          });
          this["~dispatch"] = this["~composed"] = void 0;
        }
        for (const r of input["~routes"]) this["~addRoute"]({
          ...r,
          route: base + r.route
        });
      } else {
        const fetchHandler = "fetch" in input ? input.fetch : input;
        this.all(`${base}/**`, function _mountedMiddleware(event) {
          return fetchHandler(requestWithBaseURL(event.req, base));
        });
      }
      return this;
    }
    on(method, route2, handler, opts) {
      const _method = (method || "").toUpperCase();
      route2 = new URL(route2, "http://_").pathname;
      this["~addRoute"]({
        method: _method,
        route: route2,
        handler: toEventHandler(handler),
        middleware: opts?.middleware,
        meta: {
          ...handler.meta,
          ...opts?.meta
        }
      });
      return this;
    }
    all(route2, handler, opts) {
      return this.on("", route2, handler, opts);
    }
    "~findRoute"(_event) {
      const match = findRoute(this["~rou3"], _event.req.method, _event.url.pathname);
      if (match === void 0 && _event.req.method === "HEAD") return findRoute(this["~rou3"], "GET", _event.url.pathname);
      return match;
    }
    "~addRoute"(_route) {
      addRoute(this["~rou3"], _route.method, _route.route, _route);
      super["~addRoute"](_route);
    }
    use(arg1, arg2, arg3) {
      let route2;
      let fn2;
      let opts;
      if (typeof arg1 === "string") {
        route2 = arg1;
        fn2 = arg2;
        opts = arg3;
      } else {
        fn2 = arg1;
        opts = arg2;
      }
      if (typeof fn2 !== "function" && "handler" in fn2) return this.mount(route2 || "", fn2);
      this["~middleware"].push(normalizeMiddleware(fn2, {
        ...opts,
        route: route2
      }));
      this["~dispatch"] = this["~composed"] = void 0;
      return this;
    }
  }
  for (const method of [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
    "CONNECT",
    "TRACE",
    "QUERY"
  ]) H3Core.prototype[method.toLowerCase()] = function(route2, handler, opts) {
    return this.on(method, route2, handler, opts);
  };
  return H32;
})();
const textEncoder = /* @__PURE__ */ new TextEncoder();
const textDecoder = /* @__PURE__ */ new TextDecoder();
const base64Code = [
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  89,
  90,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  45,
  95
];
function base64Encode(data) {
  const buff = validateBinaryLike(data);
  if (globalThis.Buffer) return globalThis.Buffer.from(buff).toString("base64url");
  const bytes = [];
  let i2;
  const len = buff.length;
  for (i2 = 2; i2 < len; i2 += 3) bytes.push(base64Code[buff[i2 - 2] >> 2], base64Code[(buff[i2 - 2] & 3) << 4 | buff[i2 - 1] >> 4], base64Code[(buff[i2 - 1] & 15) << 2 | buff[i2] >> 6], base64Code[buff[i2] & 63]);
  if (i2 === len + 1) bytes.push(base64Code[buff[i2 - 2] >> 2], base64Code[(buff[i2 - 2] & 3) << 4]);
  if (i2 === len) bytes.push(base64Code[buff[i2 - 2] >> 2], base64Code[(buff[i2 - 2] & 3) << 4 | buff[i2 - 1] >> 4], base64Code[(buff[i2 - 1] & 15) << 2]);
  return String.fromCharCode(...bytes);
}
function base64Decode(b64Url) {
  if (globalThis.Buffer) return new Uint8Array(globalThis.Buffer.from(b64Url, "base64url"));
  const b64 = b64Url.replace(/-/g, "+").replace(/_/g, "/");
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i2 = 0; i2 < size; i2++) bytes[i2] = binString.charCodeAt(i2);
  return bytes;
}
function validateBinaryLike(source) {
  if (typeof source === "string") return textEncoder.encode(source);
  else if (source instanceof Uint8Array) return source;
  else if (source instanceof ArrayBuffer) return new Uint8Array(source);
  throw new TypeError(`The input must be a Uint8Array, a string, or an ArrayBuffer.`);
}
function serializeIterableValue(value) {
  switch (typeof value) {
    case "string":
      return textEncoder.encode(value);
    case "boolean":
    case "number":
    case "bigint":
    case "symbol":
      return textEncoder.encode(value.toString());
    case "object":
      if (value instanceof Uint8Array) return value;
      return textEncoder.encode(JSON.stringify(value));
  }
  return /* @__PURE__ */ new Uint8Array();
}
function coerceIterable(iterable2) {
  if (typeof iterable2 === "function") iterable2 = iterable2();
  if (Symbol.iterator in iterable2) return iterable2[Symbol.iterator]();
  if (Symbol.asyncIterator in iterable2) return iterable2[Symbol.asyncIterator]();
  return iterable2;
}
function redirect(location, status = 302, statusText) {
  return new HTTPResponse(`<html><head><meta http-equiv="refresh" content="0; url=${escapeHtml(location)}" /></head></html>`, {
    status,
    statusText: status === 301 ? "Moved Permanently" : "Found",
    headers: {
      "content-type": "text/html; charset=utf-8",
      location
    }
  });
}
async function iterable(iterable2, options) {
  const serializer = serializeIterableValue;
  const iterator = coerceIterable(iterable2);
  let first = await iterator.next();
  return new HTTPResponse(new ReadableStream({
    async pull(controller) {
      const { value, done } = first ?? await iterator.next();
      first = void 0;
      if (value !== void 0) {
        const chunk = serializer(value);
        if (chunk !== void 0) controller.enqueue(chunk);
      }
      if (done) controller.close();
    },
    cancel() {
      iterator.return?.();
    }
  }));
}
const HTML_ESCAPES = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;"
};
function escapeHtml(str) {
  return str.replace(/[&"'<>]/g, (c2) => HTML_ESCAPES[c2]);
}
const COOKIE_MAX_AGE_LIMIT = 3456e4;
function endIndex(str, min, len) {
  const index = str.indexOf(";", min);
  return index === -1 ? len : index;
}
function eqIndex(str, min, max) {
  const index = str.indexOf("=", min);
  return index < max ? index : -1;
}
function valueSlice(str, min, max) {
  if (min === max) return "";
  let start = min;
  let end = max;
  do {
    const code = str.charCodeAt(start);
    if (code !== 32 && code !== 9) break;
  } while (++start < end);
  while (end > start) {
    const code = str.charCodeAt(end - 1);
    if (code !== 32 && code !== 9) break;
    end--;
  }
  return str.slice(start, end);
}
const NullObject = /* @__PURE__ */ (() => {
  const C2 = function() {
  };
  C2.prototype = /* @__PURE__ */ Object.create(null);
  return C2;
})();
function parse(str, options) {
  const obj = new NullObject();
  const len = str.length;
  if (len < 2) return obj;
  const dec = decode;
  let index = 0;
  do {
    const eqIdx = eqIndex(str, index, len);
    if (eqIdx === -1) break;
    const endIdx = endIndex(str, index, len);
    if (eqIdx > endIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = valueSlice(str, index, eqIdx);
    const val = dec(valueSlice(str, eqIdx + 1, endIdx));
    if (obj[key] === void 0) obj[key] = val;
    index = endIdx + 1;
  } while (index < len);
  return obj;
}
function decode(str) {
  if (!str.includes("%")) return str;
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const pathValueRegExp = /^[\u0020-\u003A\u003C-\u007E]*$/;
const __toString = Object.prototype.toString;
function serialize(_a0, _a1, _a2) {
  const isObj = typeof _a0 === "object" && _a0 !== null;
  const options = isObj ? _a1 : _a2;
  const stringify = options?.stringify || JSON.stringify;
  const cookie = isObj ? _a0 : {
    ..._a2,
    name: _a0,
    value: _a1 == void 0 ? "" : typeof _a1 === "string" ? _a1 : stringify(_a1)
  };
  const enc = options?.encode || encodeURIComponent;
  if (!cookieNameRegExp.test(cookie.name)) throw new TypeError(`argument name is invalid: ${cookie.name}`);
  const value = cookie.value ? enc(cookie.value) : "";
  if (!cookieValueRegExp.test(value)) throw new TypeError(`argument val is invalid: ${cookie.value}`);
  if (!cookie.secure) {
    if (cookie.partitioned) throw new TypeError(`Partitioned cookies must have the Secure attribute`);
    if (cookie.sameSite && String(cookie.sameSite).toLowerCase() === "none") throw new TypeError(`SameSite=None cookies must have the Secure attribute`);
    if (cookie.name.length > 9 && cookie.name.charCodeAt(0) === 95 && cookie.name.charCodeAt(1) === 95) {
      const nameLower = cookie.name.toLowerCase();
      if (nameLower.startsWith("__secure-") || nameLower.startsWith("__host-")) throw new TypeError(`${cookie.name} cookies must have the Secure attribute`);
    }
  }
  if (cookie.name.length > 7 && cookie.name.charCodeAt(0) === 95 && cookie.name.charCodeAt(1) === 95 && cookie.name.toLowerCase().startsWith("__host-")) {
    if (cookie.path !== "/") throw new TypeError(`__Host- cookies must have Path=/`);
    if (cookie.domain) throw new TypeError(`__Host- cookies must not have a Domain attribute`);
  }
  let str = cookie.name + "=" + value;
  if (cookie.maxAge !== void 0) {
    if (!Number.isInteger(cookie.maxAge)) throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
    str += "; Max-Age=" + Math.max(0, Math.min(cookie.maxAge, COOKIE_MAX_AGE_LIMIT));
  }
  if (cookie.domain) {
    if (!domainValueRegExp.test(cookie.domain)) throw new TypeError(`option domain is invalid: ${cookie.domain}`);
    str += "; Domain=" + cookie.domain;
  }
  if (cookie.path) {
    if (!pathValueRegExp.test(cookie.path)) throw new TypeError(`option path is invalid: ${cookie.path}`);
    str += "; Path=" + cookie.path;
  }
  if (cookie.expires) {
    if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) throw new TypeError(`option expires is invalid: ${cookie.expires}`);
    str += "; Expires=" + cookie.expires.toUTCString();
  }
  if (cookie.httpOnly) str += "; HttpOnly";
  if (cookie.secure) str += "; Secure";
  if (cookie.partitioned) str += "; Partitioned";
  if (cookie.priority) switch (typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0) {
    case "low":
      str += "; Priority=Low";
      break;
    case "medium":
      str += "; Priority=Medium";
      break;
    case "high":
      str += "; Priority=High";
      break;
    default:
      throw new TypeError(`option priority is invalid: ${cookie.priority}`);
  }
  if (cookie.sameSite) switch (typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite) {
    case true:
    case "strict":
      str += "; SameSite=Strict";
      break;
    case "lax":
      str += "; SameSite=Lax";
      break;
    case "none":
      str += "; SameSite=None";
      break;
    default:
      throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
  }
  return str;
}
function isDate(val) {
  return __toString.call(val) === "[object Date]";
}
const maxAgeRegExp = /^-?\d+$/;
const _nullProto = /* @__PURE__ */ Object.getPrototypeOf({});
function parseSetCookie$1(str, options) {
  const len = str.length;
  let _endIdx = len;
  let eqIdx = -1;
  for (let i2 = 0; i2 < len; i2++) {
    const c2 = str.charCodeAt(i2);
    if (c2 === 59) {
      _endIdx = i2;
      break;
    }
    if (c2 === 61 && eqIdx === -1) eqIdx = i2;
  }
  if (eqIdx >= _endIdx) eqIdx = -1;
  const name = eqIdx === -1 ? "" : _trim(str, 0, eqIdx);
  if (name && name in _nullProto) return void 0;
  let value = eqIdx === -1 ? _trim(str, 0, _endIdx) : _trim(str, eqIdx + 1, _endIdx);
  if (!name && !value) return void 0;
  if (name.length + value.length > 4096) return void 0;
  value = _decode(value, options?.decode);
  const setCookie2 = {
    name,
    value
  };
  let index = _endIdx + 1;
  while (index < len) {
    let endIdx = len;
    let attrEqIdx = -1;
    for (let i2 = index; i2 < len; i2++) {
      const c2 = str.charCodeAt(i2);
      if (c2 === 59) {
        endIdx = i2;
        break;
      }
      if (c2 === 61 && attrEqIdx === -1) attrEqIdx = i2;
    }
    if (attrEqIdx >= endIdx) attrEqIdx = -1;
    const attr = attrEqIdx === -1 ? _trim(str, index, endIdx) : _trim(str, index, attrEqIdx);
    const val = attrEqIdx === -1 ? void 0 : _trim(str, attrEqIdx + 1, endIdx);
    if (val === void 0 || val.length <= 1024) switch (attr.toLowerCase()) {
      case "httponly":
        setCookie2.httpOnly = true;
        break;
      case "secure":
        setCookie2.secure = true;
        break;
      case "partitioned":
        setCookie2.partitioned = true;
        break;
      case "domain":
        if (val) setCookie2.domain = (val.charCodeAt(0) === 46 ? val.slice(1) : val).toLowerCase();
        break;
      case "path":
        setCookie2.path = val;
        break;
      case "max-age":
        if (val && maxAgeRegExp.test(val)) setCookie2.maxAge = Math.min(Number(val), COOKIE_MAX_AGE_LIMIT);
        break;
      case "expires": {
        if (!val) break;
        const date = new Date(val);
        if (Number.isFinite(date.valueOf())) {
          const maxDate = new Date(Date.now() + COOKIE_MAX_AGE_LIMIT * 1e3);
          setCookie2.expires = date > maxDate ? maxDate : date;
        }
        break;
      }
      case "priority": {
        if (!val) break;
        const priority = val.toLowerCase();
        if (priority === "low" || priority === "medium" || priority === "high") setCookie2.priority = priority;
        break;
      }
      case "samesite": {
        if (!val) break;
        const sameSite = val.toLowerCase();
        if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") setCookie2.sameSite = sameSite;
        else setCookie2.sameSite = "lax";
        break;
      }
      default: {
        const attrLower = attr.toLowerCase();
        if (attrLower && !(attrLower in _nullProto)) setCookie2[attrLower] = val;
      }
    }
    index = endIdx + 1;
  }
  return setCookie2;
}
function _trim(str, start, end) {
  if (start === end) return "";
  let s2 = start;
  let e = end;
  while (s2 < e && (str.charCodeAt(s2) === 32 || str.charCodeAt(s2) === 9)) s2++;
  while (e > s2 && (str.charCodeAt(e - 1) === 32 || str.charCodeAt(e - 1) === 9)) e--;
  return str.slice(s2, e);
}
function _decode(value, decode2) {
  if (!value.includes("%")) return value;
  try {
    return (decode2 || decodeURIComponent)(value);
  } catch {
    return value;
  }
}
const CHUNKED_COOKIE = "__chunked__";
const CHUNKS_MAX_LENGTH = 4e3;
function parseCookies(event) {
  return parse(event.req.headers.get("cookie") || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, options) {
  const { encode, stringify, ...attrs } = options ?? {};
  const newCookie = serialize({
    name,
    value,
    path: "/",
    ...attrs
  }, {
    encode,
    stringify
  });
  const currentCookies = event.res.headers.getSetCookie();
  if (currentCookies.length === 0) {
    event.res.headers.set("set-cookie", newCookie);
    return;
  }
  const namePrefix = `${name}=`;
  if (!currentCookies.some((cookie) => cookie.startsWith(namePrefix))) {
    event.res.headers.append("set-cookie", newCookie);
    return;
  }
  const newCookieKey = _getDistinctCookieKey(name, options || {});
  event.res.headers.delete("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie$1(cookie);
    if (!parsed) continue;
    if (_getDistinctCookieKey(cookie.split("=")?.[0], parsed) === newCookieKey) continue;
    event.res.headers.append("set-cookie", cookie);
  }
  event.res.headers.append("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function getChunkedCookie(event, name) {
  const cookies = parseCookies(event);
  const mainCookie = cookies[name];
  if (!mainCookie || !mainCookie.startsWith(CHUNKED_COOKIE)) return mainCookie;
  const chunksCount = getChunkedCookieCount(mainCookie);
  if (chunksCount === 0) return;
  const chunks = [];
  for (let i2 = 1; i2 <= chunksCount; i2++) {
    const chunk = cookies[chunkCookieName(name, i2)];
    if (!chunk) return;
    chunks.push(chunk);
  }
  return chunks.join("");
}
function setChunkedCookie(event, name, value, options) {
  const chunkMaxLength = options?.chunkMaxLength || CHUNKS_MAX_LENGTH;
  const chunkCount = Math.ceil(value.length / chunkMaxLength);
  if (chunkCount > MAX_CHUNKED_COOKIE_COUNT) throw new HTTPError({
    status: 500,
    message: `Cannot set chunked cookie "${name}": value needs ${chunkCount} chunks, exceeding the maximum of ${MAX_CHUNKED_COOKIE_COUNT}.`
  });
  const previousCookie = getCookie(event, name);
  if (previousCookie?.startsWith(CHUNKED_COOKIE)) {
    const previousChunkCount = getChunkedCookieCount(previousCookie);
    const newChunkCount = chunkCount <= 1 ? 0 : chunkCount;
    for (let i2 = newChunkCount + 1; i2 <= previousChunkCount; i2++) deleteCookie(event, chunkCookieName(name, i2), options);
  }
  if (chunkCount <= 1) {
    setCookie(event, name, value, options);
    return;
  }
  setCookie(event, name, `${CHUNKED_COOKIE}${chunkCount}`, options);
  for (let i2 = 1; i2 <= chunkCount; i2++) {
    const start = (i2 - 1) * chunkMaxLength;
    const end = start + chunkMaxLength;
    const chunkValue = value.slice(start, end);
    setCookie(event, chunkCookieName(name, i2), chunkValue, options);
  }
}
function deleteChunkedCookie(event, name, serializeOptions) {
  const mainCookie = getCookie(event, name);
  deleteCookie(event, name, serializeOptions);
  const chunksCount = getChunkedCookieCount(mainCookie);
  if (chunksCount >= 0) for (let i2 = 0; i2 < chunksCount; i2++) deleteCookie(event, chunkCookieName(name, i2 + 1), serializeOptions);
}
function _getDistinctCookieKey(name, options) {
  return [
    name,
    (options.domain || "").replace(/^\./, "").toLowerCase(),
    options.path || "/"
  ].join(";");
}
const MAX_CHUNKED_COOKIE_COUNT = 100;
function getChunkedCookieCount(cookie) {
  if (!cookie?.startsWith(CHUNKED_COOKIE)) return NaN;
  const count = Number.parseInt(cookie.slice(11));
  if (Number.isNaN(count) || count < 0 || count > MAX_CHUNKED_COOKIE_COUNT) return NaN;
  return count;
}
function chunkCookieName(name, chunkNumber) {
  return `${name}.${chunkNumber}`;
}
const defaults = /* @__PURE__ */ Object.freeze({
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0,
  encryption: /* @__PURE__ */ Object.freeze({
    saltBits: 256,
    algorithm: "aes-256-cbc",
    iterations: 8192,
    minPasswordlength: 32
  }),
  integrity: /* @__PURE__ */ Object.freeze({
    saltBits: 256,
    algorithm: "sha256",
    iterations: 8192,
    minPasswordlength: 32
  })
});
const algorithms = /* @__PURE__ */ Object.freeze({
  "aes-128-ctr": /* @__PURE__ */ Object.freeze({
    keyBits: 128,
    ivBits: 128,
    name: "AES-CTR"
  }),
  "aes-256-cbc": /* @__PURE__ */ Object.freeze({
    keyBits: 256,
    ivBits: 128,
    name: "AES-CBC"
  }),
  sha256: /* @__PURE__ */ Object.freeze({
    keyBits: 256,
    ivBits: 128,
    name: "SHA-256"
  })
});
const macPrefix = "Fe26.2";
async function seal(object, password, opts) {
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  if (!password) throw new Error("Empty password");
  const { id = "", encryption, integrity } = normalizePassword(password);
  if (id && !/^\w+$/.test(id)) throw new Error("Invalid password id");
  const { encrypted, key } = await encrypt(encryption, opts.encryption, JSON.stringify(object));
  const encryptedB64 = base64Encode(encrypted);
  const iv = base64Encode(key.iv);
  const expiration = opts.ttl ? now + opts.ttl : "";
  const macBaseString = `${macPrefix}*${id}*${key.salt}*${iv}*${encryptedB64}*${expiration}`;
  const mac = await hmacWithPassword(integrity, opts.integrity, macBaseString);
  return `${macBaseString}*${mac.salt}*${mac.digest}`;
}
async function unseal(sealed, password, opts) {
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  if (!password) throw new Error("Empty password");
  const parts = sealed.split("*");
  if (parts.length !== 8) throw new Error("Incorrect number of sealed components");
  const [prefix, passwordId, encryptionSalt, encryptionIv, encryptedB64, expiration, hmacSalt, hmac] = parts;
  const macBaseString = `${prefix}*${passwordId}*${encryptionSalt}*${encryptionIv}*${encryptedB64}*${expiration}`;
  if ("Fe26.2" !== prefix) throw new Error("Wrong mac prefix");
  if (expiration) {
    if (!/^\d+$/.test(expiration)) throw new Error("Invalid expiration");
    if (Number.parseInt(expiration, 10) <= now - opts.timestampSkewSec * 1e3) throw new Error("Expired seal");
  }
  let pass = "";
  const _passwordId = passwordId || "default";
  if (typeof password === "string" || password instanceof Uint8Array) pass = password;
  else if (_passwordId in password) pass = password[_passwordId];
  else throw new Error(`Cannot find password: ${_passwordId}`);
  pass = normalizePassword(pass);
  if (!fixedTimeComparison((await hmacWithPassword(pass.integrity, {
    ...opts.integrity,
    salt: hmacSalt
  }, macBaseString)).digest, hmac)) throw new Error("Bad hmac value");
  const encrypted = base64Decode(encryptedB64);
  const decryptOptions = {
    ...opts.encryption,
    salt: encryptionSalt,
    iv: base64Decode(encryptionIv)
  };
  const decrypted = await decrypt(pass.encryption, decryptOptions, encrypted);
  return decrypted ? JSON.parse(decrypted) : null;
}
async function hmacWithPassword(password, options, data) {
  const key = await generateKey(password, {
    ...options,
    hmac: true
  });
  const textBuffer = textEncoder.encode(data);
  const signed = await crypto.subtle.sign({ name: "HMAC" }, key.key, textBuffer);
  return {
    digest: base64Encode(new Uint8Array(signed)),
    salt: key.salt
  };
}
async function generateKey(password, options) {
  if (!password?.length) throw new Error("Empty password");
  if (options == null || typeof options !== "object") throw new Error("Bad options");
  if (!(options.algorithm in algorithms)) throw new Error(`Unknown algorithm: ${options.algorithm}`);
  const algorithm = algorithms[options.algorithm];
  let resultKey;
  let resultSalt;
  let resultIV;
  const hmac = options.hmac ?? false;
  const id = hmac ? {
    name: "HMAC",
    hash: algorithm.name
  } : { name: algorithm.name };
  const usage = hmac ? ["sign", "verify"] : ["encrypt", "decrypt"];
  if (typeof password === "string") {
    if (password.length < options.minPasswordlength) throw new Error(`Password string too short (min ${options.minPasswordlength} characters required)`);
    let { salt = "" } = options;
    if (!salt) {
      const { saltBits = 0 } = options;
      if (!saltBits) throw new Error("Missing salt and saltBits options");
      const randomSalt = randomBits(saltBits);
      salt = [...new Uint8Array(randomSalt)].map((x2) => x2.toString(16).padStart(2, "0")).join("");
    }
    const derivedKey = await pbkdf2(password, salt, options.iterations, algorithm.keyBits / 8, "SHA-1");
    resultKey = await crypto.subtle.importKey("raw", derivedKey, id, false, usage);
    resultSalt = salt;
  } else {
    if (password.length < algorithm.keyBits / 8) throw new Error("Key buffer (password) too small");
    resultKey = await crypto.subtle.importKey("raw", password, id, false, usage);
    resultSalt = "";
  }
  if (options.iv) resultIV = options.iv;
  else if ("ivBits" in algorithm) resultIV = randomBits(algorithm.ivBits);
  else throw new Error("Missing IV");
  return {
    key: resultKey,
    salt: resultSalt,
    iv: resultIV
  };
}
async function pbkdf2(password, salt, iterations, keyLength, hash) {
  const passwordBuffer = textEncoder.encode(password);
  const importedKey = await crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, ["deriveBits"]);
  const params = {
    name: "PBKDF2",
    hash,
    salt: textEncoder.encode(salt),
    iterations
  };
  return await crypto.subtle.deriveBits(params, importedKey, keyLength * 8);
}
async function encrypt(password, options, data) {
  const key = await generateKey(password, options);
  const encrypted = await crypto.subtle.encrypt(...getEncryptParams(options.algorithm, key, data));
  return {
    encrypted: new Uint8Array(encrypted),
    key
  };
}
async function decrypt(password, options, data) {
  const key = await generateKey(password, options);
  const decrypted = await crypto.subtle.decrypt(...getEncryptParams(options.algorithm, key, data));
  return textDecoder.decode(decrypted);
}
function getEncryptParams(algorithm, key, data) {
  return [
    algorithm === "aes-128-ctr" ? {
      name: "AES-CTR",
      counter: key.iv,
      length: 128
    } : {
      name: "AES-CBC",
      iv: key.iv
    },
    key.key,
    typeof data === "string" ? textEncoder.encode(data) : data
  ];
}
function fixedTimeComparison(a, b2) {
  let mismatch = a.length === b2.length ? 0 : 1;
  if (mismatch) b2 = a;
  for (let i2 = 0; i2 < a.length; i2 += 1) mismatch |= a.charCodeAt(i2) ^ b2.charCodeAt(i2);
  return mismatch === 0;
}
function normalizePassword(password) {
  if (typeof password === "string" || password instanceof Uint8Array) return {
    encryption: password,
    integrity: password
  };
  if ("secret" in password) return {
    id: password.id,
    encryption: password.secret,
    integrity: password.secret
  };
  return {
    id: password.id,
    encryption: password.encryption,
    integrity: password.integrity
  };
}
function randomBits(bits) {
  if (bits < 1) throw new Error("Invalid random bits count");
  return randomBytes(Math.ceil(bits / 8));
}
function randomBytes(size) {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return bytes;
}
const kGetSession = /* @__PURE__ */ Symbol.for("h3.internal.session.promise");
const kLegacySeal = /* @__PURE__ */ Symbol.for("h3.internal.session.legacy-seal");
const DEFAULT_SESSION_COOKIE = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax"
};
async function useSession$1(event, config) {
  const sessionName = config.name || "h3";
  await getSession$1(event, config);
  const sessionManager = {
    get id() {
      return getEventContext(event)?.sessions?.[sessionName]?.id;
    },
    get data() {
      return getEventContext(event).sessions?.[sessionName]?.data || {};
    },
    update: async (update) => {
      await updateSession(event, config, update);
      return sessionManager;
    },
    clear: () => {
      clearSession(event, config);
      return Promise.resolve(sessionManager);
    }
  };
  return sessionManager;
}
async function getSession$1(event, config) {
  const sessionName = config.name || "h3";
  const context = getEventContext(event);
  if (!context.sessions) context.sessions = new NullProtoObj();
  const existingSession = context.sessions[sessionName];
  if (existingSession) return existingSession[kGetSession] || existingSession;
  const session = {
    id: "",
    createdAt: 0,
    data: new NullProtoObj()
  };
  context.sessions[sessionName] = session;
  let sealedSession;
  if (config.sessionHeader !== false) {
    const headerName = typeof config.sessionHeader === "string" ? config.sessionHeader.toLowerCase() : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = event.req.headers.get(headerName);
    if (typeof headerValue === "string") sealedSession = headerValue;
  }
  let sessionFromCookie = false;
  if (!sealedSession) {
    sealedSession = getChunkedCookie(event, sessionName);
    sessionFromCookie = true;
  }
  if (sealedSession) {
    const promise = unsealSession(event, config, sealedSession).catch(() => {
    }).then(async (unsealed) => {
      const legacySeal = unsealed && unsealed[kLegacySeal];
      if (legacySeal) delete unsealed[kLegacySeal];
      Object.assign(session, unsealed);
      delete context.sessions[sessionName][kGetSession];
      if (legacySeal && sessionFromCookie) await updateSession(event, config);
      return session;
    });
    context.sessions[sessionName][kGetSession] = promise;
    await promise;
  }
  if (!session.id) {
    session.id = config.generateId?.() ?? (config.crypto || crypto).randomUUID();
    session.createdAt = Date.now();
    await updateSession(event, config);
  }
  return session;
}
async function updateSession(event, config, update) {
  const sessionName = config.name || "h3";
  const session = getEventContext(event).sessions?.[sessionName] || await getSession$1(event, config);
  if (typeof update === "function") update = update(session.data);
  if (update) Object.assign(session.data, update);
  if (config.cookie !== false && event.res) setChunkedCookie(event, sessionName, await sealSession(event, config), {
    ...DEFAULT_SESSION_COOKIE,
    expires: config.maxAge ? new Date(session.createdAt + config.maxAge * 1e3) : void 0,
    ...config.cookie
  });
  return session;
}
async function sealSession(event, config) {
  const sessionName = config.name || "h3";
  return await seal(getEventContext(event).sessions?.[sessionName] || await getSession$1(event, config), config.password, {
    ...defaults,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  });
}
async function unsealSession(_event, config, sealed) {
  const sealOptions = {
    ...defaults,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  };
  let unsealed;
  try {
    unsealed = await unseal(sealed, config.password, sealOptions);
  } catch (error) {
    if (config.legacySealFallback === false || sealOptions.integrity.iterations === 1 || !(error instanceof Error) || error.message !== "Bad hmac value") throw error;
    unsealed = await unseal(sealed, config.password, {
      ...sealOptions,
      encryption: {
        ...sealOptions.encryption,
        iterations: 1
      },
      integrity: {
        ...sealOptions.integrity,
        iterations: 1
      }
    });
    if (unsealed) unsealed[kLegacySeal] = true;
  }
  if (config.maxAge) {
    if (Date.now() - (unsealed.createdAt || Number.NEGATIVE_INFINITY) > config.maxAge * 1e3) throw new Error("Session expired!");
  }
  return unsealed;
}
function clearSession(event, config) {
  const context = getEventContext(event);
  const sessionName = config.name || "h3";
  if (context.sessions?.[sessionName]) delete context.sessions[sessionName];
  if (event.res && config.cookie !== false) deleteChunkedCookie(event, sessionName, {
    ...DEFAULT_SESSION_COOKIE,
    ...config.cookie
  });
  return Promise.resolve();
}
function getEvent() {
  return getRequestEvent().nativeEvent;
}
const HTTPEventSymbol = /* @__PURE__ */ Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || obj?.[HTTPEventSymbol] instanceof H3Event || obj?.__is_event__ === true);
}
function createWrapperFunction(h3Function) {
  return (...args) => {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const useSession = createWrapperFunction(useSession$1);
function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username harus minimal 3 karakter`;
  }
}
function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password harus minimal 6 karakter`;
  }
}
function hashPassword(password) {
  const salt = crypto$1.randomBytes(16).toString("hex");
  const hash = crypto$1.pbkdf2Sync(password, salt, 1e3, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto$1.pbkdf2Sync(password, salt, 1e3, 64, "sha512").toString("hex");
  return hash === verifyHash;
}
async function login(username, password) {
  const user = await db.user.findUnique({
    where: {
      username
    }
  });
  if (!user || !verifyPassword(password, user.password)) {
    throw new Error("Username atau password salah");
  }
  if (user.status === "NONAKTIF") {
    throw new Error("Akun Anda dinonaktifkan. Silakan hubungi admin.");
  }
  return user;
}
async function logout$1() {
  const session = await getSession();
  await session.update((d2) => {
    d2.userId = void 0;
  });
}
async function register(username, password) {
  const existingUser = await db.user.findUnique({
    where: {
      username
    }
  });
  if (existingUser) throw new Error("Username sudah terdaftar");
  const hashedPassword = hashPassword(password);
  return db.user.create({
    data: {
      username,
      password: hashedPassword,
      fullName: username,
      email: `${username}@magang.sbi.co.id`,
      role: "USER",
      isActive: true
    }
  });
}
function getSession() {
  return useSession({
    name: "sbi_session",
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace_solusibangunindonesia_cilacap_2026",
    cookie: {
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
      // 1 minggu
    }
  });
}
async function requireUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (!userId) {
    throw redirect$1("/login");
  }
  const lastActive = session.data.lastActive;
  const now = Date.now();
  const maxIdle = 5 * 60 * 60 * 1e3;
  if (lastActive && now - lastActive > maxIdle) {
    await logout$1();
    throw redirect$1("/login");
  }
  await session.update((d2) => {
    d2.lastActive = now;
  });
  const user = await db.user.findUnique({
    where: {
      id: userId
    },
    include: {
      divisi: true,
      batch: true
    }
  });
  if (!user || user.status === "NONAKTIF") {
    await logout$1();
    throw redirect$1("/login");
  }
  if (user.status === "AKTIF" && user.batch) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(user.batch.endDate);
    endDate.setHours(0, 0, 0, 0);
    if (today > endDate) {
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          status: "ALUMNI"
        }
      });
      user.status = "ALUMNI";
    }
  }
  return user;
}
async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw redirect$1("/unauthorized");
  }
  return user;
}
function parseUserAgent(ua2) {
  if (ua2 === "Unknown") return "Tidak diketahui";
  let os = "OS Tidak Diketahui";
  if (ua2.includes("Windows")) os = "Windows";
  else if (ua2.includes("Macintosh") || ua2.includes("Mac OS X")) os = "macOS";
  else if (ua2.includes("Linux") && !ua2.includes("Android")) os = "Linux";
  else if (ua2.includes("Android")) os = "Android";
  else if (ua2.includes("iPhone") || ua2.includes("iPad") || ua2.includes("iPod")) os = "iOS";
  let browser = "Browser Tidak Diketahui";
  if (ua2.includes("Firefox/")) {
    const match = ua2.match(/Firefox\/(\d+)/);
    browser = `Firefox ${match ? match[1] : ""}`;
  } else if (ua2.includes("Chrome/") && !ua2.includes("Edg/")) {
    const match = ua2.match(/Chrome\/(\d+)/);
    browser = `Chrome ${match ? match[1] : ""}`;
  } else if (ua2.includes("Safari/") && !ua2.includes("Chrome/")) {
    const match = ua2.match(/Version\/(\d+)/);
    browser = `Safari ${match ? match[1] : ""}`;
  } else if (ua2.includes("Edg/")) {
    const match = ua2.match(/Edg\/(\d+)/);
    browser = `Edge ${match ? match[1] : ""}`;
  } else if (ua2.includes("PostmanRuntime/")) {
    browser = "Postman";
  }
  return `${browser} (${os})`;
}
function isPrivateIp(ip) {
  if (!ip) return true;
  return ip === "127.0.0.1" || ip === "::1" || ip.startsWith("::ffff:127.0.0.1") || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.") || ip.startsWith("172.17.") || ip.startsWith("172.18.") || ip.startsWith("172.19.") || ip.startsWith("172.2") || ip.startsWith("172.30.") || ip.startsWith("172.31.") || ip.startsWith("fe80:");
}
async function tryGeoFetch(url, extract, timeoutMs = 4e3) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (res.ok) {
      const data = await res.json();
      return extract(data);
    }
  } catch (_2) {
  }
  return null;
}
async function getIpLocation(ip) {
  if (isPrivateIp(ip)) {
    return "Localhost";
  }
  const loc1 = await tryGeoFetch(`https://ipwho.is/${ip}`, (d2) => {
    if (!d2 || d2.success === false) return null;
    return [d2.city, d2.region, d2.country].filter(Boolean).join(", ") || null;
  });
  if (loc1) return loc1;
  const loc2 = await tryGeoFetch(`https://ipapi.co/${ip}/json/`, (d2) => {
    if (!d2 || d2.error) return null;
    return [d2.city, d2.region, d2.country_name].filter(Boolean).join(", ") || null;
  });
  if (loc2) return loc2;
  const loc3 = await tryGeoFetch(`https://ip-api.com/json/${ip}?fields=status,city,regionName,country`, (d2) => {
    if (!d2 || d2.status !== "success") return null;
    return [d2.city, d2.regionName, d2.country].filter(Boolean).join(", ") || null;
  });
  if (loc3) return loc3;
  return "Tidak diketahui";
}
function signLogEntry(data) {
  const secret = process.env.LOG_SIGNING_SECRET ?? process.env.SESSION_SECRET ?? "default_sbi_secure_audit_log_signing_key_2026";
  const hmac = crypto$1.createHmac("sha256", secret);
  const payload = [data.userId || "", data.username || "", data.action, data.details || "", data.ip, data.userAgent || "", data.createdAt.getTime().toString()].join("|");
  return hmac.update(payload).digest("hex");
}
async function logActivity(action2, details, overrideUserId) {
  try {
    const event = getRequestEvent();
    const headers = event?.request?.headers;
    const ip = headers?.get("cf-connecting-ip") || headers?.get("x-real-ip") || headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || event?.clientAddress || "127.0.0.1";
    const rawUA = event?.request?.headers?.get("user-agent") || "Unknown";
    const userAgent = parseUserAgent(rawUA);
    let userId = null;
    let username = null;
    if (overrideUserId) {
      userId = overrideUserId;
      const user = await db.user.findUnique({
        where: {
          id: overrideUserId
        }
      });
      if (user) {
        username = user.username;
      }
    } else {
      const session = await getSession();
      if (session.data.userId) {
        userId = session.data.userId;
        const user = await db.user.findUnique({
          where: {
            id: userId || void 0
          }
        });
        if (user) {
          username = user.username;
        }
      }
    }
    const createdAt = /* @__PURE__ */ new Date();
    const signature = signLogEntry({
      userId,
      username,
      action: action2,
      details,
      ip,
      userAgent,
      createdAt
    });
    const logEntry = await db.auditLog.create({
      data: {
        userId: userId || void 0,
        username: username || void 0,
        action: action2,
        details,
        ip,
        userAgent,
        signature,
        createdAt,
        location: isPrivateIp(ip) ? "Localhost" : "Memuat..."
      }
    });
    if (ip && !isPrivateIp(ip)) {
      getIpLocation(ip).then(async (loc) => {
        if (loc) {
          await db.auditLog.update({
            where: {
              id: logEntry.id
            },
            data: {
              location: loc
            }
          });
        }
      }).catch((e) => {
        console.error("Geocoding background error:", e);
      });
    }
  } catch (err) {
    console.error("Audit log error:", err);
  }
}
const server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getSession,
  hashPassword,
  logActivity,
  login,
  logout: logout$1,
  register,
  requireAdmin,
  requireUser,
  signLogEntry,
  validatePassword,
  validateUsername,
  verifyPassword
}, Symbol.toStringTag, { value: "Module" }));
const serverFn_1$2 = createServerReference("2b5ceee7-0", async function logPageAccess(pathname) {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (!userId) return;
    const titleMap = {
      "/dashboard": "dashboard",
      "/riwayat": "riwayat",
      "/izin": "izin",
      "/profil": "profil",
      "/admin/dashboard": "admin.dashboard",
      "/admin/users": "admin.users",
      "/admin/divisi": "admin.divisi",
      "/admin/batch": "admin.batch",
      "/admin/absensi": "admin.absensi",
      "/admin/izin": "admin.izin",
      "/admin/laporan": "admin.laporan",
      "/admin/settings": "admin.settings",
      "/admin/audit-log": "admin.audit-log"
    };
    const pageTitle = titleMap[pathname] || pathname.replace(/^\//, "").replace(/\//g, ".");
    await logActivity("AKSES_HALAMAN", pageTitle, userId);
  } catch (e) {
  }
});
const logPageAccess2 = cloneServerReference(serverFn_1$2);
const serverFn_2 = createServerReference("2b5ceee7-1", async () => {
  try {
    const session = await getSession();
    const userId = session.data.userId;
    if (userId === void 0) throw new Error("No user id");
    const user = await db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        divisi: true,
        batch: true
      }
    });
    if (!user || user.status === "NONAKTIF") throw new Error("User invalid");
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      divisi: user.divisi?.name ?? null,
      divisiId: user.divisiId,
      batch: user.batch ? {
        name: user.batch.name,
        startDate: user.batch.startDate,
        endDate: user.batch.endDate
      } : null,
      batchId: user.batchId,
      avatar: user.avatar,
      status: user.status
    };
  } catch {
    await logout$1();
    throw redirect$1("/login");
  }
});
const getUser = query(cloneServerReference(serverFn_2), "user");
const serverFn_3 = createServerReference("2b5ceee7-2", async (formData) => {
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);
  const event = getRequestEvent();
  const headers = event?.request?.headers;
  const ip = headers?.get("cf-connecting-ip") || headers?.get("x-real-ip") || headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || event?.clientAddress || "127.0.0.1";
  if (loginType === "login") {
    const cooldown = 2 * 60 * 1e3;
    const cutoff = new Date(Date.now() - cooldown);
    const failureCount = await db.auditLog.count({
      where: {
        action: "LOGIN_GAGAL",
        OR: [{
          details: {
            contains: `@${username}`
          }
        }, {
          ip
        }],
        createdAt: {
          gte: cutoff
        }
      }
    });
    if (failureCount >= 5) {
      return new Error("Terlalu banyak percobaan masuk yang salah. Silakan coba lagi dalam 2 menit.");
    }
  }
  try {
    const user = await (loginType !== "login" ? register(username, password) : login(username, password));
    const session = await getSession();
    await session.update((d2) => {
      d2.userId = user.id;
      d2.lastActive = Date.now();
    });
    await logActivity(loginType !== "login" ? "REGISTER" : "LOGIN", loginType !== "login" ? "register success" : "login success", user.id);
    return redirect$1(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  } catch (err) {
    if (loginType === "login") {
      await logActivity("LOGIN_GAGAL", `login failed: @${username}`);
    }
    return err;
  }
});
const loginOrRegister = action(cloneServerReference(serverFn_3));
const serverFn_4 = createServerReference("2b5ceee7-3", async () => {
  await logActivity("LOGOUT", "logout success");
  await logout$1();
  return redirect$1("/login");
});
const logout = action(cloneServerReference(serverFn_4));
const getLocalDateAsUTC = () => {
  const d2 = /* @__PURE__ */ new Date();
  return new Date(Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()));
};
const serverFn_5 = createServerReference("2b5ceee7-4", async () => {
  const user = await requireUser();
  const today = getLocalDateAsUTC();
  const record = await db.absensi.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    }
  });
  return record;
});
const getTodayAttendance = query(cloneServerReference(serverFn_5), "todayAttendance");
const getSettings = async () => {
  const filePath = path.join(process.cwd(), "settings.json");
  try {
    const data = await promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      jamMasuk: "08:00",
      toleransiMenit: 0,
      lokasiKantor: "Kantor PT. SBI Cilacap",
      jamMulaiCheckout: "16:00"
    };
  }
};
const serverFn_6 = createServerReference("2b5ceee7-5", async () => {
  await requireAdmin();
  return getSettings();
});
const getSystemSettings = query(cloneServerReference(serverFn_6), "systemSettings");
const serverFn_7 = createServerReference("2b5ceee7-6", async () => {
  await requireUser();
  return getSettings();
});
const getPublicSettings = query(cloneServerReference(serverFn_7), "publicSettings");
const serverFn_8 = createServerReference("2b5ceee7-7", async (formData) => {
  await requireAdmin();
  const jamMasuk = String(formData.get("jamMasuk") || "08:00");
  const toleransiMenit = Number(formData.get("toleransiMenit") || 0);
  const lokasiKantor = String(formData.get("lokasiKantor") || "Kantor PT. SBI Cilacap");
  const jamMulaiCheckout = String(formData.get("jamMulaiCheckout") || "16:00");
  const settings = {
    jamMasuk,
    toleransiMenit,
    lokasiKantor,
    jamMulaiCheckout
  };
  const filePath = path.join(process.cwd(), "settings.json");
  await promises.writeFile(filePath, JSON.stringify(settings, null, 2), "utf-8");
  await logActivity("UPDATE_PENGATURAN", "update settings success");
  return redirect$1("/admin/dashboard?success=settings");
});
const updateSystemSettings = action(cloneServerReference(serverFn_8));
const serverFn_9 = createServerReference("2b5ceee7-8", async () => {
  const user = await requireUser();
  if (user.status === "ALUMNI") {
    return new Error("Akun Anda sudah menjadi Alumni. Anda tidak dapat melakukan absensi.");
  }
  const now = /* @__PURE__ */ new Date();
  const today = getLocalDateAsUTC();
  const existing = await db.absensi.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    }
  });
  if (existing?.status === "IZIN") {
    return new Error("Anda tidak perlu melakukan absensi karena sedang izin hari ini.");
  }
  if (existing?.checkIn) {
    return new Error("Anda sudah Check-In hari ini.");
  }
  const settings = await getSettings();
  const [tHour, tMin] = settings.jamMasuk.split(":").map(Number);
  const startCheckInMinutes = tHour * 60 + tMin;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < startCheckInMinutes) {
    return new Error(`Check-In baru bisa dilakukan mulai jam ${settings.jamMasuk}.`);
  }
  const limitMinutes = startCheckInMinutes + Number(settings.toleransiMenit || 0);
  const status = nowMinutes > limitMinutes ? "TELAT" : "HADIR";
  const location = settings.lokasiKantor || "Kantor PT. SBI Cilacap";
  await db.absensi.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    },
    update: {
      checkIn: now,
      status
    },
    create: {
      userId: user.id,
      date: today,
      checkIn: now,
      status,
      location
    }
  });
  await logActivity("CHECK_IN", `checkin success (${status.toLowerCase()})`);
  return redirect$1("/dashboard?success=checkin");
});
const checkIn = action(cloneServerReference(serverFn_9));
const serverFn_10 = createServerReference("2b5ceee7-9", async () => {
  const user = await requireUser();
  if (user.status === "ALUMNI") {
    return new Error("Akun Anda sudah menjadi Alumni. Anda tidak dapat melakukan absensi.");
  }
  const now = /* @__PURE__ */ new Date();
  const today = getLocalDateAsUTC();
  const existing = await db.absensi.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    }
  });
  if (!existing?.checkIn) {
    return new Error("Anda belum Check-In hari ini.");
  }
  if (existing.status === "IZIN") {
    return new Error("Anda tidak perlu melakukan absensi karena sedang izin hari ini.");
  }
  if (existing.checkOut) {
    return new Error("Anda sudah Check-Out hari ini.");
  }
  const settings = await getSettings();
  const jamMulaiCheckout = settings.jamMulaiCheckout || "16:00";
  const [coHour, coMin] = jamMulaiCheckout.split(":").map(Number);
  const targetMinutes = coHour * 60 + coMin;
  const earliestCheckout = targetMinutes - 60;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (nowMinutes < earliestCheckout) {
    const ah = Math.floor(earliestCheckout / 60);
    const am = earliestCheckout % 60;
    const allowedTimeStr = `${String(ah).padStart(2, "0")}:${String(am).padStart(2, "0")}`;
    return new Error(`Check-Out hanya bisa dilakukan antara jam ${allowedTimeStr} - 23:59.`);
  }
  await db.absensi.update({
    where: {
      id: existing.id
    },
    data: {
      checkOut: now
    }
  });
  await logActivity("CHECK_OUT", "checkout success");
  return redirect$1("/dashboard?success=checkout");
});
const checkOut = action(cloneServerReference(serverFn_10));
const serverFn_11 = createServerReference("2b5ceee7-10", async () => {
  const user = await requireUser();
  return db.absensi.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      date: "desc"
    },
    take: 30
  });
});
const getAttendanceHistory = query(cloneServerReference(serverFn_11), "attendanceHistory");
const parseLocalDateAsUTC = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};
const serverFn_12 = createServerReference("2b5ceee7-11", async (formData) => {
  const user = await requireUser();
  if (user.status === "ALUMNI") {
    return new Error("Akun Anda sudah menjadi Alumni. Anda tidak dapat mengajukan izin.");
  }
  const startDate = parseLocalDateAsUTC(String(formData.get("startDate")));
  const endDate = parseLocalDateAsUTC(String(formData.get("endDate")));
  const type = String(formData.get("type"));
  const reason = String(formData.get("reason"));
  const file = formData.get("attachment");
  if (!reason || reason.length < 5) return new Error("Alasan minimal 5 karakter.");
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh setelah tanggal selesai.");
  let attachmentPath = null;
  if (file && file.size > 0 && file.name) {
    const MAX_FILE_SIZE = 500 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return new Error("Ukuran berkas lampiran maksimal 500KB.");
    }
    const extension = path.extname(file.name).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.type)) {
      return new Error("Format berkas lampiran harus berupa gambar (JPG, PNG) atau PDF.");
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${crypto$1.randomBytes(16).toString("hex")}${extension}`;
    const uploadsDir = path.join(process.cwd(), "uploads");
    await promises.mkdir(uploadsDir, {
      recursive: true
    });
    await promises.writeFile(path.join(uploadsDir, filename), buffer);
    attachmentPath = `/api/uploads?file=${filename}`;
  }
  await db.izin.create({
    data: {
      userId: user.id,
      startDate,
      endDate,
      type,
      reason,
      attachment: attachmentPath,
      status: "PENDING"
    }
  });
  await logActivity("PENGAJUAN_IZIN", `submit leave success (${type.toLowerCase()})`);
  return redirect$1("/izin?success=create");
});
const submitIzin = action(cloneServerReference(serverFn_12));
const serverFn_13 = createServerReference("2b5ceee7-12", async () => {
  const user = await requireUser();
  return db.izin.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20
  });
});
const getUserIzinList = query(cloneServerReference(serverFn_13), "userIzinList");
const serverFn_14 = createServerReference("2b5ceee7-13", async (formData) => {
  const user = await requireUser();
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");
  if (!fullName || fullName.length < 2) return new Error("Nama lengkap minimal 2 karakter.");
  if (!email || !email.includes("@")) return new Error("Email tidak valid.");
  await db.user.update({
    where: {
      id: user.id
    },
    data: {
      fullName,
      email,
      phone: phone || null
    }
  });
  return redirect$1("/profil?success=update");
});
const updateProfile = action(cloneServerReference(serverFn_14));
const serverFn_15 = createServerReference("2b5ceee7-14", async (formData) => {
  const user = await requireUser();
  const oldPassword = String(formData.get("oldPassword"));
  const newPassword = String(formData.get("newPassword"));
  const confirmPassword = String(formData.get("confirmPassword"));
  if (newPassword !== confirmPassword) {
    return new Error("Password baru dan konfirmasi password tidak cocok.");
  }
  const pwdError = validatePassword(newPassword);
  if (pwdError) return new Error(pwdError);
  const dbUser = await db.user.findUnique({
    where: {
      id: user.id
    }
  });
  const verifyPasswordImport = (await Promise.resolve().then(() => server)).verifyPassword;
  const hashPasswordImport = (await Promise.resolve().then(() => server)).hashPassword;
  if (!dbUser || !verifyPasswordImport(oldPassword, dbUser.password)) {
    return new Error("Password saat ini salah.");
  }
  await db.user.update({
    where: {
      id: user.id
    },
    data: {
      password: hashPasswordImport(newPassword)
    }
  });
  return {
    success: true
  };
});
const changePassword = action(cloneServerReference(serverFn_15));
const serverFn_16 = createServerReference("2b5ceee7-15", async () => {
  await requireAdmin();
  const today = getLocalDateAsUTC();
  const [totalUsers, totalDivisi, todayHadir, todayTelat, pendingIzin, batchAktif, batchSelesai, batchMendatang] = await Promise.all([db.user.count({
    where: {
      role: "USER",
      status: "AKTIF"
    }
  }), db.divisi.count(), db.absensi.count({
    where: {
      date: today,
      status: {
        in: ["HADIR", "TELAT"]
      }
    }
  }), db.absensi.count({
    where: {
      date: today,
      status: "TELAT"
    }
  }), db.izin.count({
    where: {
      status: "PENDING"
    }
  }), db.batchMagang.count({
    where: {
      startDate: {
        lte: today
      },
      endDate: {
        gte: today
      }
    }
  }), db.batchMagang.count({
    where: {
      endDate: {
        lt: today
      }
    }
  }), db.batchMagang.count({
    where: {
      startDate: {
        gt: today
      }
    }
  })]);
  return {
    totalUsers,
    totalDivisi,
    todayHadir,
    todayTelat,
    pendingIzin,
    batchAktif,
    batchSelesai,
    batchMendatang
  };
});
const getAdminStats = query(cloneServerReference(serverFn_16), "adminStats");
const serverFn_17 = createServerReference("2b5ceee7-16", async () => {
  await requireAdmin();
  const today = getLocalDateAsUTC();
  const totalInterns = await db.user.count({
    where: {
      role: "USER",
      status: "AKTIF"
    }
  });
  const attendanceToday = await db.absensi.groupBy({
    by: ["status"],
    where: {
      date: today
    },
    _count: {
      id: true
    }
  });
  const counts = {
    HADIR: 0,
    TELAT: 0,
    IZIN: 0,
    ALPHA: 0
  };
  let totalCheckedIn = 0;
  for (const group of attendanceToday) {
    const status = group.status;
    counts[status] = group._count.id;
    totalCheckedIn += group._count.id;
  }
  const belumAbsen = Math.max(0, totalInterns - totalCheckedIn);
  return {
    ...counts,
    belumAbsen,
    totalInterns
  };
});
const getTodayAttendanceStatus = query(cloneServerReference(serverFn_17), "todayAttendanceStatus");
const serverFn_18 = createServerReference("2b5ceee7-17", async () => {
  await requireAdmin();
  const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const getMonthLabel = (d2) => `${MONTHS_ID[d2.getMonth()]} ${d2.getFullYear()}`;
  const getWeekLabel = (d2) => {
    const t = new Date(d2.getTime());
    const day = t.getDay();
    t.setDate(t.getDate() - day + (day === 0 ? -6 : 1));
    return `${t.getDate()} ${MONTHS_ID[t.getMonth()]} ${t.getFullYear()}`;
  };
  const getYearLabel = (d2) => `${d2.getFullYear()}`;
  const users = await db.user.findMany({
    where: {
      role: "USER"
    },
    select: {
      createdAt: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  const now = /* @__PURE__ */ new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const startDate = users.length > 0 ? new Date(Math.min(users[0].createdAt.getTime(), sixMonthsAgo.getTime())) : sixMonthsAgo;
  const monthlyCounts = {};
  const weeklyCounts = {};
  const yearlyCounts = {};
  let running = 0;
  for (const u2 of users) {
    running++;
    monthlyCounts[getMonthLabel(u2.createdAt)] = running;
    weeklyCounts[getWeekLabel(u2.createdAt)] = running;
    yearlyCounts[getYearLabel(u2.createdAt)] = running;
  }
  const fillSeries = (labels, counts) => {
    let last = 0;
    return labels.map((label) => {
      if (counts[label] !== void 0) last = counts[label];
      return {
        label,
        count: last
      };
    });
  };
  const monthLabels = [];
  const mc = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (mc <= now) {
    monthLabels.push(getMonthLabel(mc));
    mc.setMonth(mc.getMonth() + 1);
  }
  const weekLabels = [];
  const wc = new Date(startDate.getTime());
  const wDay = wc.getDay();
  wc.setDate(wc.getDate() - wDay + (wDay === 0 ? -6 : 1));
  wc.setHours(0, 0, 0, 0);
  while (wc <= now) {
    weekLabels.push(getWeekLabel(wc));
    wc.setDate(wc.getDate() + 7);
  }
  const recentWeeks = weekLabels.slice(-12);
  const yearLabels = [];
  for (let y2 = startDate.getFullYear(); y2 <= now.getFullYear(); y2++) yearLabels.push(`${y2}`);
  return {
    weekly: fillSeries(recentWeeks, weeklyCounts),
    monthly: fillSeries(monthLabels, monthlyCounts),
    yearly: fillSeries(yearLabels, yearlyCounts)
  };
});
const getInternTrendData = query(cloneServerReference(serverFn_18), "internTrendData");
const serverFn_19 = createServerReference("2b5ceee7-18", async (options) => {
  await requireAdmin();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const role = options?.role ?? "";
  const status = options?.status ?? "";
  const divisiId = options?.divisiId ?? "";
  const batchId = options?.batchId ?? "";
  const skip = (page - 1) * limit;
  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (divisiId) where.divisiId = divisiId;
  if (batchId) where.batchId = batchId;
  if (search) {
    where.OR = [{
      fullName: {
        contains: search
      }
    }, {
      username: {
        contains: search
      }
    }];
  }
  const [items, total] = await Promise.all([db.user.findMany({
    where,
    include: {
      divisi: true,
      batch: true
    },
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: limit
  }), db.user.count({
    where
  })]);
  return {
    items,
    total
  };
});
const getAdminUsers = query(cloneServerReference(serverFn_19), "adminUsers");
const serverFn_20 = createServerReference("2b5ceee7-19", async (formData) => {
  await requireAdmin();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");
  const role = String(formData.get("role"));
  const divisiId = formData.get("divisiId") ? String(formData.get("divisiId")) : null;
  const batchId = formData.get("batchId") ? String(formData.get("batchId")) : null;
  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);
  const existing = await db.user.findUnique({
    where: {
      username
    }
  });
  if (existing) return new Error("Username sudah terdaftar.");
  await db.user.create({
    data: {
      username,
      password: hashPassword(password),
      fullName,
      email,
      phone: phone || null,
      role,
      divisiId,
      batchId,
      status: "AKTIF"
    }
  });
  await logActivity("BUAT_PENGGUNA", `create user success (@${username})`);
  return redirect$1("/admin/users?success=create");
});
const createUser = action(cloneServerReference(serverFn_20));
const serverFn_21 = createServerReference("2b5ceee7-20", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const fullName = String(formData.get("fullName"));
  const email = String(formData.get("email"));
  const phone = String(formData.get("phone") || "");
  const role = String(formData.get("role"));
  const divisiId = formData.get("divisiId") ? String(formData.get("divisiId")) : null;
  const batchId = formData.get("batchId") ? String(formData.get("batchId")) : null;
  const status = String(formData.get("status") || "AKTIF");
  const updatedUser = await db.user.update({
    where: {
      id
    },
    data: {
      fullName,
      email,
      phone: phone || null,
      role,
      divisiId,
      batchId,
      status
    }
  });
  await logActivity("UPDATE_PENGGUNA", `update user success (@${updatedUser.username})`);
  return redirect$1("/admin/users?success=update");
});
const updateUser = action(cloneServerReference(serverFn_21));
const serverFn_22 = createServerReference("2b5ceee7-21", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const targetUser = await db.user.findUnique({
    where: {
      id
    }
  });
  const targetUsername = targetUser ? `@${targetUser.username}` : "Pengguna";
  await db.user.delete({
    where: {
      id
    }
  });
  await logActivity("HAPUS_PENGGUNA", `delete user success (${targetUsername})`);
  return redirect$1("/admin/users?success=delete");
});
const deleteUser = action(cloneServerReference(serverFn_22));
const serverFn_23 = createServerReference("2b5ceee7-22", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const newPassword = String(formData.get("newPassword"));
  const pwdError = validatePassword(newPassword);
  if (pwdError) return new Error(pwdError);
  const targetUser = await db.user.update({
    where: {
      id
    },
    data: {
      password: hashPassword(newPassword)
    }
  });
  await logActivity("RESET_PASSWORD", `reset password success (@${targetUser.username})`);
  return {
    success: true
  };
});
const adminResetPassword = action(cloneServerReference(serverFn_23));
const serverFn_24 = createServerReference("2b5ceee7-23", async () => {
  await requireAdmin();
  return db.divisi.findMany({
    include: {
      _count: {
        select: {
          users: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
});
const getAdminDivisi = query(cloneServerReference(serverFn_24), "adminDivisi");
const serverFn_25 = createServerReference("2b5ceee7-24", async () => {
  return db.divisi.findMany({
    orderBy: {
      name: "asc"
    }
  });
});
const getAllDivisi = query(cloneServerReference(serverFn_25), "allDivisi");
const serverFn_26 = createServerReference("2b5ceee7-25", async (formData) => {
  await requireAdmin();
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");
  if (!name || name.length < 2) return new Error("Nama divisi minimal 2 karakter.");
  await db.divisi.create({
    data: {
      name,
      description: description || null
    }
  });
  await logActivity("BUAT_DIVISI", `create division success (${name})`);
  return redirect$1("/admin/divisi?success=create");
});
const createDivisi = action(cloneServerReference(serverFn_26));
const serverFn_27 = createServerReference("2b5ceee7-26", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const description = String(formData.get("description") || "");
  await db.divisi.update({
    where: {
      id
    },
    data: {
      name,
      description: description || null
    }
  });
  await logActivity("UPDATE_DIVISI", `update division success (${name})`);
  return redirect$1("/admin/divisi?success=update");
});
const updateDivisi = action(cloneServerReference(serverFn_27));
const serverFn_28 = createServerReference("2b5ceee7-27", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const targetDivisi = await db.divisi.findUnique({
    where: {
      id
    }
  });
  const divisiName = targetDivisi ? targetDivisi.name : "Divisi";
  await db.divisi.delete({
    where: {
      id
    }
  });
  await logActivity("HAPUS_DIVISI", `delete division success (${divisiName})`);
  return redirect$1("/admin/divisi?success=delete");
});
const deleteDivisi = action(cloneServerReference(serverFn_28));
const serverFn_29 = createServerReference("2b5ceee7-28", async (options) => {
  await requireAdmin();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const dateStr = options?.date ?? "";
  const status = options?.status ?? "";
  const divisiId = options?.divisiId ?? "";
  const batchId = options?.batchId ?? "";
  const skip = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const filterUtc = new Date(Date.UTC(year, month - 1, day));
    where.date = filterUtc;
  }
  if (divisiId || batchId) {
    where.user = {};
    if (divisiId) where.user.divisiId = divisiId;
    if (batchId) where.user.batchId = batchId;
  }
  if (search) {
    const searchCond = {
      OR: [{
        fullName: {
          contains: search
        }
      }, {
        username: {
          contains: search
        }
      }]
    };
    if (where.user) {
      where.user = {
        ...where.user,
        ...searchCond
      };
    } else {
      where.user = searchCond;
    }
  }
  const [items, total] = await Promise.all([db.absensi.findMany({
    where,
    include: {
      user: {
        include: {
          divisi: true
        }
      }
    },
    orderBy: {
      date: "desc"
    },
    skip,
    take: limit
  }), db.absensi.count({
    where
  })]);
  return {
    items,
    total
  };
});
const getAdminAbsensi = query(cloneServerReference(serverFn_29), "adminAbsensi");
const serverFn_30 = createServerReference("2b5ceee7-29", async (options) => {
  await requireAdmin();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search?.trim() ?? "";
  const type = options?.type ?? "";
  const status = options?.status ?? "";
  const skip = (page - 1) * limit;
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (search) {
    where.user = {
      OR: [{
        fullName: {
          contains: search
        }
      }, {
        username: {
          contains: search
        }
      }]
    };
  }
  const [items, total] = await Promise.all([db.izin.findMany({
    where,
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: limit
  }), db.izin.count({
    where
  })]);
  return {
    items,
    total
  };
});
const getAdminIzin = query(cloneServerReference(serverFn_30), "adminIzin");
const serverFn_31 = createServerReference("2b5ceee7-30", async (formData) => {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const statusAction = String(formData.get("status"));
  const izin = await db.izin.findUnique({
    where: {
      id
    }
  });
  if (!izin) return new Error("Pengajuan izin tidak ditemukan.");
  await db.izin.update({
    where: {
      id
    },
    data: {
      status: statusAction,
      approvedBy: admin.id,
      approvedAt: /* @__PURE__ */ new Date()
    }
  });
  if (statusAction === "APPROVED") {
    const start = new Date(izin.startDate);
    const end = new Date(izin.endDate);
    for (let d2 = new Date(start); d2 <= end; d2.setDate(d2.getDate() + 1)) {
      const dateOnly = new Date(d2);
      dateOnly.setHours(0, 0, 0, 0);
      await db.absensi.upsert({
        where: {
          userId_date: {
            userId: izin.userId,
            date: dateOnly
          }
        },
        update: {
          status: "IZIN",
          notes: `Izin: ${izin.type} - ${izin.reason}`
        },
        create: {
          userId: izin.userId,
          date: dateOnly,
          status: "IZIN",
          notes: `Izin: ${izin.type} - ${izin.reason}`
        }
      });
    }
  }
  const targetUser = await db.user.findUnique({
    where: {
      id: izin.userId
    }
  });
  const targetUsername = targetUser ? `@${targetUser.username}` : "Pengguna";
  const typeStr = izin.type;
  await logActivity(statusAction === "APPROVED" ? "SETUJUI_IZIN" : "TOLAK_IZIN", `${statusAction === "APPROVED" ? "approve" : "reject"} leave success (${typeStr.toLowerCase()} - ${targetUsername})`);
  return redirect$1("/admin/izin?success=update");
});
const approveIzin = action(cloneServerReference(serverFn_31));
const serverFn_32 = createServerReference("2b5ceee7-31", async (startDate, endDate) => {
  await requireAdmin();
  const where = {};
  if (startDate) where.date = {
    gte: new Date(startDate)
  };
  if (endDate) where.date = {
    ...where.date,
    lte: new Date(endDate)
  };
  return db.absensi.findMany({
    where,
    include: {
      user: {
        include: {
          divisi: true
        }
      }
    },
    orderBy: {
      date: "desc"
    }
  });
});
const getLaporan = query(cloneServerReference(serverFn_32), "laporan");
const serverFn_33 = createServerReference("2b5ceee7-32", async () => {
  await requireAdmin();
  const records = await db.absensi.findMany({
    include: {
      user: {
        include: {
          divisi: true
        }
      }
    },
    orderBy: {
      date: "desc"
    }
  });
  const header = "Nama,Username,Divisi,Tanggal,Check-In,Check-Out,Status,Catatan\n";
  const rows = records.map((r) => {
    const date = new Date(r.date).toLocaleDateString("id-ID");
    const ci = r.checkIn ? new Date(r.checkIn).toLocaleTimeString("id-ID") : "-";
    const co2 = r.checkOut ? new Date(r.checkOut).toLocaleTimeString("id-ID") : "-";
    return `"${r.user.fullName}","${r.user.username}","${r.user.divisi?.name ?? "-"}","${date}","${ci}","${co2}","${r.status}","${r.notes ?? ""}"`;
  }).join("\n");
  return header + rows;
});
query(cloneServerReference(serverFn_33), "exportCSV");
const serverFn_34 = createServerReference("2b5ceee7-33", async (options) => {
  await requireAdmin();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 15;
  const search = options?.search?.trim() ?? "";
  const actionFilter = options?.action ?? "";
  const skip = (page - 1) * limit;
  const where = {};
  if (actionFilter) {
    where.action = actionFilter;
  }
  if (search) {
    where.OR = [{
      username: {
        contains: search
      }
    }, {
      details: {
        contains: search
      }
    }, {
      ip: {
        contains: search
      }
    }, {
      location: {
        contains: search
      }
    }, {
      user: {
        fullName: {
          contains: search
        }
      }
    }];
  }
  const [items, total] = await Promise.all([db.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          fullName: true,
          username: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: limit
  }), db.auditLog.count({
    where
  })]);
  return {
    items,
    total
  };
});
const getAdminAuditLogs = query(cloneServerReference(serverFn_34), "adminAuditLogs");
const serverFn_35 = createServerReference("2b5ceee7-34", async () => {
  await requireAdmin();
  return db.batchMagang.findMany({
    include: {
      _count: {
        select: {
          users: true
        }
      }
    },
    orderBy: {
      startDate: "desc"
    }
  });
});
const getAdminBatches = query(cloneServerReference(serverFn_35), "adminBatches");
const serverFn_36 = createServerReference("2b5ceee7-35", async () => {
  return db.batchMagang.findMany({
    orderBy: {
      name: "asc"
    }
  });
});
const getAllBatches = query(cloneServerReference(serverFn_36), "allBatches");
const serverFn_37 = createServerReference("2b5ceee7-36", async (formData) => {
  await requireAdmin();
  const name = String(formData.get("name"));
  const startDateStr = String(formData.get("startDate"));
  const endDateStr = String(formData.get("endDate"));
  const description = String(formData.get("description") || "");
  if (!name || name.length < 2) return new Error("Nama batch minimal 2 karakter.");
  if (!startDateStr || !endDateStr) return new Error("Tanggal mulai dan selesai harus diisi.");
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh melebihi tanggal selesai.");
  await db.batchMagang.create({
    data: {
      name,
      startDate,
      endDate,
      description: description || null
    }
  });
  await logActivity("BUAT_BATCH", `create batch success (${name})`);
  return redirect$1("/admin/batch?success=create");
});
const createBatch = action(cloneServerReference(serverFn_37));
const serverFn_38 = createServerReference("2b5ceee7-37", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const startDateStr = String(formData.get("startDate"));
  const endDateStr = String(formData.get("endDate"));
  const description = String(formData.get("description") || "");
  if (!name || name.length < 2) return new Error("Nama batch minimal 2 karakter.");
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (startDate > endDate) return new Error("Tanggal mulai tidak boleh melebihi tanggal selesai.");
  await db.batchMagang.update({
    where: {
      id
    },
    data: {
      name,
      startDate,
      endDate,
      description: description || null
    }
  });
  await logActivity("UPDATE_BATCH", `update batch success (${name})`);
  return redirect$1("/admin/batch?success=update");
});
const updateBatch = action(cloneServerReference(serverFn_38));
const serverFn_39 = createServerReference("2b5ceee7-38", async (formData) => {
  await requireAdmin();
  const id = String(formData.get("id"));
  const target = await db.batchMagang.findUnique({
    where: {
      id
    }
  });
  await db.batchMagang.delete({
    where: {
      id
    }
  });
  await logActivity("HAPUS_BATCH", `delete batch success (${target?.name ?? "Batch"})`);
  return redirect$1("/admin/batch?success=delete");
});
const deleteBatch = action(cloneServerReference(serverFn_39));
const route$d = {
  preload: () => {
    getUser();
    getTodayAttendance();
    getAttendanceHistory();
    getPublicSettings();
  }
};
const route$c = {
  preload() {
    getUser();
  }
};
const route$b = {
  preload: () => {
    getUserIzinList();
  }
};
const route$a = {
  preload: () => {
    getUser();
  }
};
const route$9 = {
  preload: () => {
    getAttendanceHistory();
  }
};
const route$8 = {
  preload() {
    getAdminAbsensi({
      page: 1,
      limit: 10,
      search: "",
      date: "",
      status: "",
      divisiId: "",
      batchId: ""
    });
    getAllDivisi();
    getAllBatches();
  }
};
const route$7 = {
  preload() {
    getAdminAuditLogs({
      page: 1,
      limit: 15,
      search: "",
      action: ""
    });
  }
};
const route$6 = {
  preload() {
    getAdminBatches();
  }
};
const route$5 = {
  preload() {
    getAdminStats();
    getUser();
    getTodayAttendanceStatus();
    getInternTrendData();
  }
};
const route$4 = {
  preload() {
    getAdminDivisi();
  }
};
const route$3 = {
  preload() {
    getAdminIzin({
      page: 1,
      limit: 10,
      search: "",
      type: "",
      status: ""
    });
  }
};
const route$2 = {
  preload() {
    getLaporan();
    getAllDivisi();
  }
};
const route$1 = {
  preload() {
    getSystemSettings();
  }
};
const route = {
  preload() {
    getAdminUsers({
      page: 1,
      limit: 10,
      search: "",
      role: "",
      status: "",
      divisiId: ""
    });
    getAllDivisi();
    getAllBatches();
  }
};
const fileRoutes = [{ "page": true, "$component": { "src": "src\\routes\\dashboard.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/dashboard-DCwQcr_4.js"), "import": () => import("./_build/assets/dashboard-DCwQcr_4.js") }, "$$route": { "require": () => ({ "route": route$d }) }, "path": "/dashboard" }, { "page": true, "$component": { "src": "src\\routes\\index.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/index-Bker35Ea.js"), "import": () => import("./_build/assets/index-Bker35Ea.js") }, "$$route": { "require": () => ({ "route": route$c }) }, "path": "/" }, { "page": true, "$component": { "src": "src\\routes\\izin.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/izin-CEtYEBKC.js"), "import": () => import("./_build/assets/izin-CEtYEBKC.js") }, "$$route": { "require": () => ({ "route": route$b }) }, "path": "/izin" }, { "page": true, "$component": { "src": "src\\routes\\login.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/login-BSW8oJVt.js"), "import": () => import("./_build/assets/login-BSW8oJVt.js") }, "path": "/login" }, { "page": true, "$component": { "src": "src\\routes\\profil.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/profil-b3LixNAI.js"), "import": () => import("./_build/assets/profil-b3LixNAI.js") }, "$$route": { "require": () => ({ "route": route$a }) }, "path": "/profil" }, { "page": true, "$component": { "src": "src\\routes\\riwayat.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/riwayat-CNXG1ccC.js"), "import": () => import("./_build/assets/riwayat-CNXG1ccC.js") }, "$$route": { "require": () => ({ "route": route$9 }) }, "path": "/riwayat" }, { "page": true, "$component": { "src": "src\\routes\\unauthorized.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/unauthorized-DaZPqjEc.js"), "import": () => import("./_build/assets/unauthorized-DaZPqjEc.js") }, "path": "/unauthorized" }, { "page": true, "$component": { "src": "src\\routes\\[...404].tsx?pick=default&pick=$css", "build": () => import("./_build/assets/_...404_-Dad2_Sht.js"), "import": () => import("./_build/assets/_...404_-Dad2_Sht.js") }, "path": "/*404" }, { "page": true, "$component": { "src": "src\\routes\\admin\\absensi.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/absensi-_5V_52SC.js"), "import": () => import("./_build/assets/absensi-_5V_52SC.js") }, "$$route": { "require": () => ({ "route": route$8 }) }, "path": "/admin/absensi" }, { "page": true, "$component": { "src": "src\\routes\\admin\\audit-log.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/audit-log-D0JbAb8S.js"), "import": () => import("./_build/assets/audit-log-D0JbAb8S.js") }, "$$route": { "require": () => ({ "route": route$7 }) }, "path": "/admin/audit-log" }, { "page": true, "$component": { "src": "src\\routes\\admin\\batch.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/batch-BzxqEIto.js"), "import": () => import("./_build/assets/batch-BzxqEIto.js") }, "$$route": { "require": () => ({ "route": route$6 }) }, "path": "/admin/batch" }, { "page": true, "$component": { "src": "src\\routes\\admin\\dashboard.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/dashboard-B2hc0NKn.js"), "import": () => import("./_build/assets/dashboard-B2hc0NKn.js") }, "$$route": { "require": () => ({ "route": route$5 }) }, "path": "/admin/dashboard" }, { "page": true, "$component": { "src": "src\\routes\\admin\\divisi.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/divisi-DrFIyqWP.js"), "import": () => import("./_build/assets/divisi-DrFIyqWP.js") }, "$$route": { "require": () => ({ "route": route$4 }) }, "path": "/admin/divisi" }, { "page": true, "$component": { "src": "src\\routes\\admin\\izin.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/izin-DIINCEZI.js"), "import": () => import("./_build/assets/izin-DIINCEZI.js") }, "$$route": { "require": () => ({ "route": route$3 }) }, "path": "/admin/izin" }, { "page": true, "$component": { "src": "src\\routes\\admin\\laporan.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/laporan-PuTg6LmG.js"), "import": () => import("./_build/assets/laporan-PuTg6LmG.js") }, "$$route": { "require": () => ({ "route": route$2 }) }, "path": "/admin/laporan" }, { "page": true, "$component": { "src": "src\\routes\\admin\\settings.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/settings-BOM9ydIW.js"), "import": () => import("./_build/assets/settings-BOM9ydIW.js") }, "$$route": { "require": () => ({ "route": route$1 }) }, "path": "/admin/settings" }, { "page": true, "$component": { "src": "src\\routes\\admin\\users.tsx?pick=default&pick=$css", "build": () => import("./_build/assets/users-BJyhMXX6.js"), "import": () => import("./_build/assets/users-BJyhMXX6.js") }, "$$route": { "require": () => ({ "route": route }) }, "path": "/admin/users" }, { "page": false, "$GET": { "src": "src\\routes\\api\\uploads.ts?pick=GET", "build": () => import("./_build/assets/uploads-gqrTobHm.js"), "import": () => import("./_build/assets/uploads-gqrTobHm.js") }, "$HEAD": { "src": "src\\routes\\api\\uploads.ts?pick=GET", "build": () => import("./_build/assets/uploads-gqrTobHm.js"), "import": () => import("./_build/assets/uploads-gqrTobHm.js") }, "path": "/api/uploads" }, { "page": false, "$POST": { "src": "src\\routes\\api\\users\\import.ts?pick=POST", "build": () => import("./_build/assets/import-D5TA8Z0C.js"), "import": () => import("./_build/assets/import-D5TA8Z0C.js") }, "path": "/api/users/import" }, { "page": false, "$GET": { "src": "src\\routes\\api\\users\\template.ts?pick=GET", "build": () => import("./_build/assets/template-oZlhfVfk.js"), "import": () => import("./_build/assets/template-oZlhfVfk.js") }, "$HEAD": { "src": "src\\routes\\api\\users\\template.ts?pick=GET", "build": () => import("./_build/assets/template-oZlhfVfk.js"), "import": () => import("./_build/assets/template-oZlhfVfk.js") }, "path": "/api/users/template" }];
const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};
function createRouter(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p2) => options.strictTrailingSlash ? p2 : p2.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path2 in options.routes) {
      insert(ctx, normalizeTrailingSlash(path2), options.routes[path2]);
    }
  }
  return {
    ctx,
    lookup: (path2) => lookup(ctx, normalizeTrailingSlash(path2)),
    insert: (path2, data) => insert(ctx, normalizeTrailingSlash(path2), data),
    remove: (path2) => remove(ctx, normalizeTrailingSlash(path2))
  };
}
function lookup(ctx, path2) {
  const staticPathNode = ctx.staticRoutesMap[path2];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path2.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i2 = 0; i2 < sections.length; i2++) {
    const section = sections[i2];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i2).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i2;
        node = node.placeholderChildren.find((c2) => c2.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path2, data) {
  let isStaticRoute = true;
  const sections = path2.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth2, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth2, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path2] = node;
  }
  return node;
}
function remove(ctx, path2) {
  let success = false;
  const sections = path2.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}
const pageRoutes = defineRoutes(fileRoutes.filter((o2) => o2.page));
function defineRoutes(fileRoutes2) {
  function processRoute(routes2, route2, id, full) {
    const parentRoute = Object.values(routes2).find((o2) => {
      return id.startsWith(o2.id + "/");
    });
    if (!parentRoute) {
      routes2.push({
        ...route2,
        id,
        path: id.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/")
      });
      return routes2;
    }
    processRoute(parentRoute.children || (parentRoute.children = []), route2, id.slice(parentRoute.id.length));
    return routes2;
  }
  return fileRoutes2.sort((a, b2) => a.path.length - b2.path.length).reduce((prevRoutes, route2) => {
    return processRoute(prevRoutes, route2, route2.path, route2.path);
  }, []);
}
const router = createRouter({
  routes: fileRoutes.reduce((memo, route2) => {
    if (!containsHTTP(route2)) return memo;
    const path2 = route2.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (_2, m2) => `**:${m2}`).split("/").map((s2) => s2.startsWith(":") || s2.startsWith("*") ? s2 : encodeURIComponent(s2)).join("/");
    if (/:[^/]*\?/g.test(path2)) {
      throw new Error(`Optional parameters are not supported in API routes: ${path2}`);
    }
    if (memo[path2]) {
      throw new Error(`Duplicate API routes for "${path2}" found at "${memo[path2].route.path}" and "${route2.path}"`);
    }
    memo[path2] = {
      route: route2
    };
    return memo;
  }, {})
});
function containsHTTP(route2) {
  return route2["$HEAD"] || route2["$GET"] || route2["$POST"] || route2["$PUT"] || route2["$PATCH"] || route2["$DELETE"];
}
function matchAPIRoute(path2, method) {
  const match = router.lookup(path2);
  if (match && match.route) {
    const route2 = match.route;
    const handler = method === "HEAD" ? route2.$HEAD || route2.$GET : route2[`$${method}`];
    if (handler === void 0) return;
    const isPage = route2.page === true && route2.$component !== void 0;
    return {
      handler,
      params: match.params,
      isPage
    };
  }
  return void 0;
}
const components = {};
function createRoutes() {
  function createRoute(route2) {
    const component = route2.$component && (components[route2.$component.src] ??= lazy(route2.$component.import));
    return {
      ...route2,
      ...route2.$$route ? route2.$$route.require().route : void 0,
      info: {
        ...route2.$$route ? route2.$$route.require().route.info : {},
        filesystem: true
      },
      component,
      children: route2.children ? route2.children.map(createRoute) : void 0
    };
  }
  const routes2 = pageRoutes.map(createRoute);
  return routes2;
}
let routes;
const FileRoutes = isServer ? () => getRequestEvent().routes : () => routes || (routes = createRoutes());
const [toastMessage, setToastMessage] = createSignal(null);
let toastTimer;
function showToast(message, type = "error") {
  setToastMessage({
    message,
    type
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    setToastMessage(null);
  }, type === "success" ? 4e3 : 1e4);
}
var _tmpl$$3 = ["<svg", ' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'], _tmpl$2$2 = ["<button", ' class="theme-toggle" title="Ganti tema">', "</button>"], _tmpl$3 = ["<svg", ' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'], _tmpl$4 = ["<div", ' class="', '"><div class="loading-bar" style="', '"></div></div>'], _tmpl$5 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:400px;text-align:center;"><div style="margin-bottom:var(--space-4);"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:var(--space-3);"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><h3 style="margin:0 0 var(--space-2) 0;font-family:var(--font-headline);font-weight:700;font-size:1.25rem;">Konfirmasi Keluar</h3><p style="margin:0;color:var(--color-text-secondary);font-size:14px;">Apakah Anda yakin ingin keluar dari sistem?</p></div><div style="display:flex;gap:var(--space-3);justify-content:center;"><button class="btn-ghost" style="width:auto;padding:0 var(--space-4);height:40px;" type="button">Batal</button><form', ' method="post" style="margin:0;"><button class="btn-danger" style="width:auto;padding:0 var(--space-4);height:40px;" type="submit">Ya, Keluar</button></form></div></div></div>'], _tmpl$6 = ["<div", ' class="fade-in">', "</div>"], _tmpl$7 = ["<div", ' class="', '"><!--$-->', "<!--/--><!--$-->", '<!--/--><main class="app-main-content">', "</main></div>"], _tmpl$8 = ["<div", ' class="app-layout has-sidebar" style="opacity:0.6;pointer-events:none;"><aside class="app-sidebar no-print"><div class="sidebar-header" style="display:flex;justify-content:center;padding:20px;"><div class="skeleton" style="width:120px;height:35px;border-radius:var(--radius-md);"></div></div><nav class="sidebar-nav" style="display:flex;flex-direction:column;gap:15px;padding:20px;"><div class="skeleton" style="width:100%;height:40px;border-radius:8px;"></div><div class="skeleton" style="width:100%;height:40px;border-radius:8px;"></div><div class="skeleton" style="width:100%;height:40px;border-radius:8px;"></div><div class="skeleton" style="width:100%;height:40px;border-radius:8px;"></div></nav></aside><main class="app-main-content"><div style="padding:20px;display:flex;flex-direction:column;gap:20px;"><div class="skeleton" style="width:250px;height:32px;border-radius:6px;"></div><div class="skeleton" style="width:100%;height:20px;border-radius:4px;"></div><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:20px;margin-top:20px;"><div class="skeleton-card" style="height:120px;display:flex;flex-direction:column;justify-content:space-between;"><div class="skeleton" style="width:40px;height:30px;"></div><div class="skeleton" style="width:100px;height:16px;"></div></div><div class="skeleton-card" style="height:120px;display:flex;flex-direction:column;justify-content:space-between;"><div class="skeleton" style="width:40px;height:30px;"></div><div class="skeleton" style="width:100px;height:16px;"></div></div><div class="skeleton-card" style="height:120px;display:flex;flex-direction:column;justify-content:space-between;"><div class="skeleton" style="width:40px;height:30px;"></div><div class="skeleton" style="width:100px;height:16px;"></div></div></div></div></main></div>'], _tmpl$9 = ["<header", ' class="mobile-header no-print" style="justify-content:flex-start;gap:8px;"><button type="button" class="hamburger-btn" title="Menu">☰</button><span style="font-family:var(--font-headline);font-weight:700;font-size:14px;color:var(--color-text);">Absensi Magang</span></header>'], _tmpl$0 = ["<div", ' class="mobile-sidebar-backdrop no-print"></div>'], _tmpl$1 = ["<svg", ' width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="5" x2="6" y2="19"></line><polyline points="18 17 13 12 18 7"></polyline></svg>'], _tmpl$10 = ["<a", ' class="', '" href="/admin/dashboard"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg><span>Dashboard</span></a>'], _tmpl$11 = ["<a", ' class="', '" href="/admin/users"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg><span>Pengguna</span></a>'], _tmpl$12 = ["<a", ' class="', '" href="/admin/divisi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path></svg><span>Divisi</span></a>'], _tmpl$13 = ["<a", ' class="', '" href="/admin/batch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span>Batch Magang</span></a>'], _tmpl$14 = ["<a", ' class="', '" href="/admin/absensi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>Log Absensi</span></a>'], _tmpl$15 = ["<a", ' class="', '" href="/admin/izin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><span>Kelola Izin</span></a>'], _tmpl$16 = ["<a", ' class="', '" href="/admin/laporan"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg><span>Laporan</span></a>'], _tmpl$17 = ["<a", ' class="', '" href="/admin/settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span>Pengaturan Sistem</span></a>'], _tmpl$18 = ["<a", ' class="', '" href="/admin/audit-log"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span>Audit Log</span></a>'], _tmpl$19 = ["<button", ' type="button" class="', '"><div style="display:flex;align-items:center;gap:var(--space-2);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span>Profil Saya</span></div><span style="', '">▼</span></button>'], _tmpl$20 = ["<div", ' class="nav-dropdown"><a class="', '" href="/profil?tab=profile">Ubah Profil</a><a class="', '" href="/profil?tab=password">Ubah Sandi</a></div>'], _tmpl$21 = ["<a", ' class="', '" href="/dashboard"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg><span>Dashboard</span></a>'], _tmpl$22 = ["<a", ' class="', '" href="/riwayat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>Riwayat</span></a>'], _tmpl$23 = ["<a", ' class="', '" href="/izin"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg><span>Pengajuan Izin</span></a>'], _tmpl$24 = ["<aside", ' class="', '"><button type="button" class="sidebar-toggle-btn"', ">", '</button><div class="sidebar-header" style="width:100%;display:flex;align-items:center;justify-content:space-between;position:relative;"><a', ' class="sidebar-logo-link" style="display:flex;align-items:center;justify-content:center;width:100%;"><img', ' alt="Logo SIGMA" class="sidebar-logo-full" style="cursor:pointer;"><img src="/favicon.png" alt="Logo SIGMA" class="sidebar-logo-favicon" style="cursor:pointer;"></a></div><nav class="sidebar-nav"><!--$-->', "<!--/--><!--$-->", '<!--/--></nav><div class="sidebar-user" style="margin-top:auto;"><div style="display:flex;align-items:center;gap:var(--space-3);min-width:0;overflow:hidden;"><div class="user-avatar">', '</div><div class="user-info"><div class="user-name">', '</div><div class="user-role">', "</div></div></div><!--$-->", '<!--/--></div><div class="sidebar-footer"><button class="btn-logout-sidebar" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><span>Logout</span></button></div></aside>'], _tmpl$25 = ["<svg", ' width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 17 11 12 6 7"></polyline><line x1="18" y1="5" x2="18" y2="19"></line></svg>'], _tmpl$26 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--color-success);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'], _tmpl$27 = ["<div", ' style="position:fixed;top:20px;right:20px;z-index:9999;max-width:380px;width:calc(100% - 40px);animation:slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);"><div role="alert" style="', '"><div style="display:flex;align-items:center;gap:10px;flex:1;"><!--$-->', '<!--/--><span style="font-size:14px;font-weight:500;text-align:left;line-height:1.4;">', '</span></div><button type="button" style="background:transparent;border:none;font-size:20px;line-height:1;cursor:pointer;color:var(--color-text-secondary);padding:4px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:color 0.2s ease;" title="Tutup notifikasi">×</button></div></div>'], _tmpl$28 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--color-error);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'];
function ThemeToggle(props) {
  return ssr(_tmpl$2$2, ssrHydrationKey(), escape(createComponent$1(Show, {
    get when() {
      return props.theme() === "dark";
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$$3, ssrHydrationKey());
    }
  })));
}
function App$1() {
  return createComponent$1(Router, {
    root: (props) => {
      const location = useLocation();
      const navigate = useNavigate();
      const isRouting = useIsRouting();
      const [theme, setTheme] = createSignal("light");
      const [showLogoutConfirm, setShowLogoutConfirm] = createSignal(false);
      const [showProfileDropdown, setShowProfileDropdown] = createSignal(location.pathname === "/profil");
      const [mobileSidebarOpen, setMobileSidebarOpen] = createSignal(false);
      const [sidebarPinned, setSidebarPinned] = createSignal(true);
      const [sidebarHovered, setSidebarHovered] = createSignal(false);
      const [progress, setProgress] = createSignal(0);
      const [visible, setVisible] = createSignal(false);
      createEffect(() => {
        if (isRouting()) {
          setVisible(true);
          setProgress(10);
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(interval);
                return prev;
              }
              return prev + (90 - prev) * 0.15;
            });
          }, 200);
          onCleanup(() => {
            clearInterval(interval);
            setProgress(100);
            const timeout = setTimeout(() => {
              setVisible(false);
              setProgress(0);
            }, 300);
            onCleanup(() => clearTimeout(timeout));
          });
        }
      });
      onMount(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          setTheme("dark");
        } else if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.setAttribute("data-theme", "dark");
          setTheme("dark");
        }
        const savedPinned = localStorage.getItem("sidebar-pinned");
        if (savedPinned === "false") {
          setSidebarPinned(false);
        }
        document.documentElement.classList.remove("sidebar-is-collapsed");
        let timeoutId;
        const resetTimeout = () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const u2 = user();
            if (u2) {
              logout();
            }
          }, 5 * 60 * 60 * 1e3);
        };
        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach((name) => window.addEventListener(name, resetTimeout));
        resetTimeout();
        onCleanup(() => {
          events.forEach((name) => window.removeEventListener(name, resetTimeout));
          clearTimeout(timeoutId);
        });
      });
      createEffect(() => {
        if (location.pathname === "/profil") {
          setShowProfileDropdown(true);
        } else {
          setShowProfileDropdown(false);
        }
      });
      createEffect(() => {
        location.pathname;
        setMobileSidebarOpen(false);
      });
      createEffect(() => {
        const path2 = location.pathname;
        if (path2 !== "/login" && path2 !== "/unauthorized" && !is404Page()) {
          logPageAccess2(path2).catch(() => {
          });
        }
      });
      createEffect(() => {
        const titleMap = {
          "/dashboard": "Dashboard",
          "/riwayat": "Riwayat Absensi",
          "/izin": "Pengajuan Izin",
          "/profil": "Profil Saya",
          "/login": "Masuk Sistem",
          "/unauthorized": "Akses Ditolak",
          "/admin/dashboard": "Dashboard Admin",
          "/admin/users": "Kelola Pengguna",
          "/admin/divisi": "Kelola Divisi",
          "/admin/batch": "Kelola Batch Magang",
          "/admin/absensi": "Monitor Absensi",
          "/admin/izin": "Kelola Pengajuan Izin",
          "/admin/laporan": "Laporan Absensi",
          "/admin/settings": "Pengaturan Sistem",
          "/admin/audit-log": "Audit Log Aktivitas"
        };
        const path2 = location.pathname;
        const pageTitle = titleMap[path2] || "Absensi Magang";
        document.title = `${pageTitle} | SIGMA - Sistem Informasi dan Manajemen Magang`;
      });
      const isLoginPage = () => location.pathname === "/login" || location.pathname === "/unauthorized";
      const validPaths = ["/", "/dashboard", "/riwayat", "/izin", "/profil", "/login", "/unauthorized", "/admin/dashboard", "/admin/users", "/admin/divisi", "/admin/batch", "/admin/absensi", "/admin/izin", "/admin/laporan", "/admin/settings", "/admin/audit-log"];
      const is404Page = () => !validPaths.includes(location.pathname);
      const user = createAsync(() => isLoginPage() ? Promise.resolve(null) : getUser(), {
        deferStream: true
      });
      createEffect(() => {
        const u2 = user();
        const path2 = location.pathname;
        setShowLogoutConfirm(false);
        if (isLoginPage() || is404Page()) return;
        if (u2 === void 0) return;
        if (!u2) {
          navigate("/login");
        } else {
          const userPaths = ["/dashboard", "/riwayat", "/izin"];
          const isUserPath = userPaths.includes(path2);
          if (path2 === "/") {
            navigate(u2.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
          } else if (path2.startsWith("/admin") && u2.role !== "ADMIN") {
            navigate("/unauthorized");
          } else if (isUserPath && u2.role === "ADMIN") {
            navigate("/unauthorized");
          }
        }
      });
      return createComponent$1(Suspense, {
        get fallback() {
          return ssr(_tmpl$8, ssrHydrationKey());
        },
        get children() {
          return [ssr(_tmpl$4, ssrHydrationKey(), `loading-bar-container ${visible() ? "visible" : ""}`, ssrStyleProperty("width:", `${escape(progress(), true)}%`)), ssr(_tmpl$7, ssrHydrationKey(), `app-layout ${!!user() && !is404Page() ? "has-sidebar" : ""} ${sidebarPinned() ? "sidebar-pinned" : ""} ${!sidebarPinned() ? "sidebar-collapsed" : ""}`, escape(createComponent$1(Show, {
            get when() {
              return user();
            },
            children: (u2) => createComponent$1(Show, {
              get when() {
                return !is404Page();
              },
              get children() {
                return [ssr(_tmpl$9, ssrHydrationKey()), createComponent$1(Show, {
                  get when() {
                    return mobileSidebarOpen();
                  },
                  get children() {
                    return ssr(_tmpl$0, ssrHydrationKey());
                  }
                }), ssr(_tmpl$24, ssrHydrationKey(), `app-sidebar no-print ${mobileSidebarOpen() ? "open" : ""} ${sidebarHovered() && !sidebarPinned() ? "sidebar-hovered" : ""} ${!sidebarPinned() ? "collapsed" : ""} ${sidebarPinned() ? "pinned" : ""}`, ssrAttribute("title", sidebarPinned() ? "Kecilkan sidebar" : "Kunci sidebar", false), escape(createComponent$1(Show, {
                  get when() {
                    return sidebarPinned();
                  },
                  get fallback() {
                    return ssr(_tmpl$25, ssrHydrationKey());
                  },
                  get children() {
                    return ssr(_tmpl$1, ssrHydrationKey());
                  }
                })), ssrAttribute("href", u2().role === "ADMIN" ? "/admin/dashboard" : "/dashboard", false), ssrAttribute("src", theme() === "dark" ? "/logo-sigma-putih.png" : "/logo-sigma.png", false), escape(createComponent$1(Show, {
                  get when() {
                    return u2().role === "ADMIN";
                  },
                  get children() {
                    return [ssr(_tmpl$10, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`), ssr(_tmpl$11, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/users" ? "active" : ""}`), ssr(_tmpl$12, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/divisi" ? "active" : ""}`), ssr(_tmpl$13, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/batch" ? "active" : ""}`), ssr(_tmpl$14, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/absensi" ? "active" : ""}`), ssr(_tmpl$15, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/izin" ? "active" : ""}`), ssr(_tmpl$16, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/laporan" ? "active" : ""}`), ssr(_tmpl$17, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/settings" ? "active" : ""}`), ssr(_tmpl$18, ssrHydrationKey(), `nav-link ${location.pathname === "/admin/audit-log" ? "active" : ""}`), ssr(_tmpl$19, ssrHydrationKey(), `nav-link ${location.pathname === "/profil" ? "active" : ""}`, ssrStyleProperty("font-size:", "10px") + ssrStyleProperty(";transition:", "transform 0.2s") + ssrStyleProperty(";transform:", showProfileDropdown() ? "rotate(180deg)" : "rotate(0deg)")), createComponent$1(Show, {
                      get when() {
                        return showProfileDropdown();
                      },
                      get children() {
                        return ssr(_tmpl$20, ssrHydrationKey(), `nav-sub-link ${location.pathname === "/profil" && (!location.search || location.search.includes("tab=profile")) ? "active" : ""}`, `nav-sub-link ${location.pathname === "/profil" && location.search.includes("tab=password") ? "active" : ""}`);
                      }
                    })];
                  }
                })), escape(createComponent$1(Show, {
                  get when() {
                    return u2().role === "USER";
                  },
                  get children() {
                    return [ssr(_tmpl$21, ssrHydrationKey(), `nav-link ${location.pathname === "/dashboard" ? "active" : ""}`), ssr(_tmpl$22, ssrHydrationKey(), `nav-link ${location.pathname === "/riwayat" ? "active" : ""}`), ssr(_tmpl$23, ssrHydrationKey(), `nav-link ${location.pathname === "/izin" ? "active" : ""}`), ssr(_tmpl$19, ssrHydrationKey(), `nav-link ${location.pathname === "/profil" ? "active" : ""}`, ssrStyleProperty("font-size:", "10px") + ssrStyleProperty(";transition:", "transform 0.2s") + ssrStyleProperty(";transform:", showProfileDropdown() ? "rotate(180deg)" : "rotate(0deg)")), createComponent$1(Show, {
                      get when() {
                        return showProfileDropdown();
                      },
                      get children() {
                        return ssr(_tmpl$20, ssrHydrationKey(), `nav-sub-link ${location.pathname === "/profil" && (!location.search || location.search.includes("tab=profile")) ? "active" : ""}`, `nav-sub-link ${location.pathname === "/profil" && location.search.includes("tab=password") ? "active" : ""}`);
                      }
                    })];
                  }
                })), u2().fullName ? escape(u2().fullName.charAt(0).toUpperCase()) : "U", escape(u2().fullName), u2().role === "ADMIN" ? "Administrator" : escape(u2().divisi || "Anak Magang"), escape(createComponent$1(ThemeToggle, {
                  theme,
                  setTheme
                })))];
              }
            })
          })), escape(createComponent$1(Show, {
            get when() {
              return showLogoutConfirm();
            },
            get children() {
              return createComponent$1(Portal, {
                get children() {
                  return ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("action", escape(logout, true), false));
                }
              });
            }
          })), escape(createComponent$1(Show, {
            get when() {
              return location.pathname;
            },
            keyed: true,
            get children() {
              return ssr(_tmpl$6, ssrHydrationKey(), escape(props.children));
            }
          }))), createComponent$1(Show, {
            get when() {
              return toastMessage();
            },
            children: (toast) => createComponent$1(Portal, {
              get children() {
                return ssr(_tmpl$27, ssrHydrationKey(), ssrStyle(`display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; margin: 0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2); border: 2px solid ${toast().type === "success" ? "var(--color-success)" : "var(--color-error)"}; border-radius: var(--radius-md); background-color: ${toast().type === "success" ? "rgba(22, 163, 74, 0.12)" : "rgba(220, 38, 38, 0.12)"}; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);`), escape(createComponent$1(Show, {
                  get when() {
                    return toast().type === "success";
                  },
                  get fallback() {
                    return ssr(_tmpl$28, ssrHydrationKey());
                  },
                  get children() {
                    return ssr(_tmpl$26, ssrHydrationKey());
                  }
                })), escape(toast().message));
              }
            })
          })];
        }
      });
    },
    get children() {
      return createComponent$1(FileRoutes, {});
    }
  });
}
const app = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1
}, Symbol.toStringTag, { value: "Module" }));
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
createContext();
const HttpStatusCode = isServer ? (props) => {
  const event = getRequestEvent();
  event.response.status = props.code;
  event.response.statusText = props.text;
  onCleanup(() => (
    // !event.nativeEvent.handled &&
    !event.complete && (event.response.status = 200)
  ));
  return null;
} : (_props) => null;
var L = ((i2) => (i2[i2.AggregateError = 1] = "AggregateError", i2[i2.ArrowFunction = 2] = "ArrowFunction", i2[i2.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", i2[i2.ObjectAssign = 8] = "ObjectAssign", i2[i2.BigIntTypedArray = 16] = "BigIntTypedArray", i2[i2.RegExp = 32] = "RegExp", i2))(L || {});
var v$1 = Symbol.asyncIterator, dr = Symbol.hasInstance, R = Symbol.isConcatSpreadable, C$1 = Symbol.iterator, gr = Symbol.match, yr = Symbol.matchAll, Nr = Symbol.replace, br = Symbol.search, vr = Symbol.species, Cr = Symbol.split, Ar = Symbol.toPrimitive, P$1 = Symbol.toStringTag, Er = Symbol.unscopables;
var nt = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, Ce = { [v$1]: 0, [dr]: 1, [R]: 2, [C$1]: 3, [gr]: 4, [yr]: 5, [Nr]: 6, [br]: 7, [vr]: 8, [Cr]: 9, [Ar]: 10, [P$1]: 11, [Er]: 12 }, ot = { 0: v$1, 1: dr, 2: R, 3: C$1, 4: gr, 5: yr, 6: Nr, 7: br, 8: vr, 9: Cr, 10: Ar, 11: P$1, 12: Er }, at = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, o$1 = void 0, st = { 2: true, 3: false, 1: o$1, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN };
var Ae = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, it = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function c$1(e, r, t, n2, a, s2, i2, u2, l2, g2, S, d2) {
  return { t: e, i: r, s: t, c: n2, m: a, p: s2, e: i2, a: u2, f: l2, b: g2, o: S, l: d2 };
}
function B(e) {
  return c$1(2, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
var J$1 = B(2), Z = B(3), Ee = B(1), Ie = B(0), ut = B(4), lt = B(5), ct = B(6), ft = B(7);
function dn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return o$1;
  }
}
function y$1(e) {
  let r = "", t = 0, n2;
  for (let a = 0, s2 = e.length; a < s2; a++) n2 = dn(e[a]), n2 && (r += e.slice(t, a) + n2, t = a + 1);
  return t === 0 ? r = e : r += e.slice(t), r;
}
function gn(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function h$1(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, gn);
}
var U$1 = "__SEROVAL_REFS__", le$1 = "$R", Re = `self.${le$1}`;
function yn(e) {
  return e == null ? `${Re}=${Re}||[]` : `(${Re}=${Re}||{})["${y$1(e)}"]=[]`;
}
var Ir = /* @__PURE__ */ new Map(), j$1 = /* @__PURE__ */ new Map();
function Rr(e) {
  return Ir.has(e);
}
function bn(e) {
  return j$1.has(e);
}
function St(e) {
  if (Rr(e)) return Ir.get(e);
  throw new Pe(e);
}
function mt(e) {
  if (bn(e)) return j$1.get(e);
  throw new xe(e);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, U$1, { value: j$1, configurable: true, writable: false, enumerable: false }) : typeof window != "undefined" ? Object.defineProperty(window, U$1, { value: j$1, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, U$1, { value: j$1, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, U$1, { value: j$1, configurable: true, writable: false, enumerable: false });
function Te(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function vn(e) {
  let r = Ae[Te(e)];
  return e.name !== r ? { name: e.name } : e.constructor.name !== r ? { name: e.constructor.name } : {};
}
function $(e, r) {
  let t = vn(e), n2 = Object.getOwnPropertyNames(e);
  for (let a = 0, s2 = n2.length, i2; a < s2; a++) i2 = n2[a], i2 !== "name" && i2 !== "message" && (i2 === "stack" ? r & 4 && (t = t || {}, t[i2] = e[i2]) : (t = t || {}, t[i2] = e[i2]));
  return t;
}
function Oe(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function we(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return lt;
    case Number.NEGATIVE_INFINITY:
      return ct;
  }
  return e !== e ? ft : Object.is(e, -0) ? ut : c$1(0, o$1, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function X$1(e) {
  return c$1(1, o$1, y$1(e), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function he(e) {
  return c$1(3, o$1, "" + e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function dt(e) {
  return c$1(4, e, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function ze(e, r) {
  let t = r.valueOf();
  return c$1(5, e, t !== t ? "" : r.toISOString(), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function _e(e, r) {
  return c$1(6, e, o$1, y$1(r.source), r.flags, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function gt(e, r) {
  return c$1(17, e, Ce[r], o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function yt(e, r) {
  return c$1(18, e, y$1(St(r)), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function ce(e, r, t) {
  return c$1(25, e, t, y$1(r), o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function ke(e, r, t) {
  return c$1(9, e, o$1, o$1, o$1, o$1, o$1, t, o$1, o$1, Oe(r), o$1);
}
function De(e, r) {
  return c$1(21, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Fe(e, r, t) {
  return c$1(15, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.length);
}
function Be(e, r, t) {
  return c$1(16, e, o$1, r.constructor.name, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.length);
}
function Ve(e, r, t) {
  return c$1(20, e, o$1, o$1, o$1, o$1, o$1, o$1, t, r.byteOffset, o$1, r.byteLength);
}
function Me(e, r, t) {
  return c$1(13, e, Te(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Le(e, r, t) {
  return c$1(14, e, Te(r), o$1, y$1(r.message), t, o$1, o$1, o$1, o$1, o$1, o$1);
}
function Ue(e, r) {
  return c$1(7, e, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, o$1);
}
function je(e, r) {
  return c$1(28, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function Ye(e, r) {
  return c$1(30, o$1, o$1, o$1, o$1, o$1, o$1, [e, r], o$1, o$1, o$1, o$1);
}
function qe(e, r, t) {
  return c$1(31, e, o$1, o$1, o$1, o$1, o$1, t, r, o$1, o$1, o$1);
}
function We(e, r) {
  return c$1(32, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ke(e, r) {
  return c$1(33, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function Ge(e, r) {
  return c$1(34, e, o$1, o$1, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1);
}
function He(e, r, t, n2) {
  return c$1(35, e, t, o$1, o$1, o$1, o$1, r, o$1, o$1, o$1, n2);
}
var Cn = { parsing: 1, serialization: 2, deserialization: 3 };
function An(e) {
  return `Seroval Error (step: ${Cn[e]})`;
}
var En = (e, r) => An(e), fe = class extends Error {
  constructor(t, n2) {
    super(En(t));
    this.cause = n2;
  }
}, _ = class extends fe {
  constructor(r) {
    super("parsing", r);
  }
}, Je = class extends fe {
  constructor(r) {
    super("deserialization", r);
  }
};
function k(e) {
  return `Seroval Error (specific: ${e})`;
}
var x = class extends Error {
  constructor(t) {
    super(k(1));
    this.value = t;
  }
}, z = class extends Error {
  constructor(r) {
    super(k(2));
  }
}, Q$1 = class Q extends Error {
  constructor(r) {
    super(k(3));
  }
}, V = class extends Error {
  constructor(r) {
    super(k(4));
  }
}, Pe = class extends Error {
  constructor(t) {
    super(k(5));
    this.value = t;
  }
}, xe = class extends Error {
  constructor(r) {
    super(k(6));
  }
}, Ze = class extends Error {
  constructor(r) {
    super(k(7));
  }
}, O$1 = class O extends Error {
  constructor(r) {
    super(k(8));
  }
}, M$1 = class M extends Error {
  constructor(r) {
    super(k(9));
  }
};
var Y$1 = class Y {
  constructor(r, t) {
    this.value = r;
    this.replacement = t;
  }
};
var ee$1 = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((r, t) => {
    e.s = r, e.f = t;
  }), e;
}, In = (e, r) => {
  e.s(r), e.p.s = 1, e.p.v = r;
}, Rn = (e, r) => {
  e.f(r), e.p.s = 2, e.p.v = r;
}, bt = ee$1.toString(), vt = In.toString(), Ct = Rn.toString(), xr = () => {
  let e = [], r = [], t = true, n2 = false, a = 0, s2 = (l2, g2, S) => {
    for (S = 0; S < a; S++) r[S] && r[S][g2](l2);
  }, i2 = (l2, g2, S, d2) => {
    for (g2 = 0, S = e.length; g2 < S; g2++) d2 = e[g2], !t && g2 === S - 1 ? l2[n2 ? "return" : "throw"](d2) : l2.next(d2);
  }, u2 = (l2, g2) => (t && (g2 = a++, r[g2] = l2), i2(l2), () => {
    t && (r[g2] = r[a], r[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (l2) => u2(l2), next: (l2) => {
    t && (e.push(l2), s2(l2, "next"));
  }, throw: (l2) => {
    t && (e.push(l2), s2(l2, "throw"), t = false, n2 = false, r.length = 0);
  }, return: (l2) => {
    t && (e.push(l2), s2(l2, "return"), t = false, n2 = true, r.length = 0);
  } };
}, At = xr.toString(), Tr = (e) => (r) => () => {
  let t = 0, n2 = { [e]: () => n2, next: () => {
    if (t > r.d) return { done: true, value: void 0 };
    let a = t++, s2 = r.v[a];
    if (a === r.t) throw s2;
    return { done: a === r.d, value: s2 };
  } };
  return n2;
}, Et = Tr.toString(), Or = (e, r) => (t) => () => {
  let n2 = 0, a = -1, s2 = false, i2 = [], u2 = [], l2 = (S = 0, d2 = u2.length) => {
    for (; S < d2; S++) u2[S].s({ done: true, value: void 0 });
  };
  t.on({ next: (S) => {
    let d2 = u2.shift();
    d2 && d2.s({ done: false, value: S }), i2.push(S);
  }, throw: (S) => {
    let d2 = u2.shift();
    d2 && d2.f(S), l2(), a = i2.length, s2 = true, i2.push(S);
  }, return: (S) => {
    let d2 = u2.shift();
    d2 && d2.s({ done: true, value: S }), l2(), a = i2.length, i2.push(S);
  } });
  let g2 = { [e]: () => g2, next: () => {
    if (a === -1) {
      let G2 = n2++;
      if (G2 >= i2.length) {
        let tt = r();
        return u2.push(tt), tt.p;
      }
      return { done: false, value: i2[G2] };
    }
    if (n2 > a) return { done: true, value: void 0 };
    let S = n2++, d2 = i2[S];
    if (S !== a) return { done: false, value: d2 };
    if (s2) throw d2;
    return { done: true, value: d2 };
  } };
  return g2;
}, It = Or.toString(), wr = (e) => {
  let r = atob(e), t = r.length, n2 = new Uint8Array(t);
  for (let a = 0; a < t; a++) n2[a] = r.charCodeAt(a);
  return n2.buffer;
}, Rt = wr.toString();
function $e(e) {
  return "__SEROVAL_SEQUENCE__" in e;
}
function hr(e, r, t) {
  return { __SEROVAL_SEQUENCE__: true, v: e, t: r, d: t };
}
function Xe(e) {
  let r = [], t = -1, n2 = -1, a = e[C$1]();
  for (; ; ) try {
    let s2 = a.next();
    if (r.push(s2.value), s2.done) {
      n2 = r.length - 1;
      break;
    }
  } catch (s2) {
    t = r.length, r.push(s2);
  }
  return hr(r, t, n2);
}
var Pn = Tr(C$1);
function Pt(e) {
  return Pn(e);
}
var xt = {}, Tt = {};
var Ot = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, wt = { 0: "[]", 1: bt, 2: vt, 3: Ct, 4: At, 5: Rt };
function Qe(e) {
  return "__SEROVAL_STREAM__" in e;
}
function re$1() {
  return xr();
}
function er(e) {
  let r = re$1(), t = e[v$1]();
  async function n2() {
    try {
      let a = await t.next();
      a.done ? r.return(a.value) : (r.next(a.value), await n2());
    } catch (a) {
      r.throw(a);
    }
  }
  return n2().catch(() => {
  }), r;
}
var xn = Or(v$1, ee$1);
function ht(e) {
  return xn(e);
}
function me$1(e, r) {
  return { plugins: r.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (r.disabledFeatures || 0), refs: r.refs || /* @__PURE__ */ new Map(), depthLimit: r.depthLimit || 1e3 };
}
function pe(e, r) {
  e.marked.add(r);
}
function _r(e, r) {
  let t = e.refs.size;
  return e.refs.set(r, t), t;
}
function rr(e, r) {
  let t = e.refs.get(r);
  return t != null ? (pe(e, t), { type: 1, value: dt(t) }) : { type: 0, value: _r(e, r) };
}
function q$1(e, r) {
  let t = rr(e, r);
  return t.type === 1 ? t : Rr(r) ? { type: 2, value: yt(t.value, r) } : t;
}
function I(e, r) {
  let t = q$1(e, r);
  if (t.type !== 0) return t.value;
  if (r in Ce) return gt(t.value, r);
  throw new x(r);
}
function D$1(e, r) {
  let t = rr(e, Ot[r]);
  return t.type === 1 ? t.value : c$1(26, t.value, r, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1, o$1);
}
function tr(e) {
  let r = rr(e, xt);
  return r.type === 1 ? r.value : c$1(27, r.value, o$1, o$1, o$1, o$1, o$1, o$1, I(e, C$1), o$1, o$1, o$1);
}
function nr(e) {
  let r = rr(e, Tt);
  return r.type === 1 ? r.value : c$1(29, r.value, o$1, o$1, o$1, o$1, o$1, [D$1(e, 1), I(e, v$1)], o$1, o$1, o$1, o$1);
}
function or(e, r, t, n2) {
  return c$1(t ? 11 : 10, e, o$1, o$1, o$1, n2, o$1, o$1, o$1, o$1, Oe(r), o$1);
}
function ar(e, r, t, n2) {
  return c$1(8, r, o$1, o$1, o$1, o$1, { k: t, v: n2 }, o$1, D$1(e, 0), o$1, o$1, o$1);
}
function _t(e, r, t) {
  return c$1(22, r, t, o$1, o$1, o$1, o$1, o$1, D$1(e, 1), o$1, o$1, o$1);
}
function sr(e, r, t) {
  let n2 = new Uint8Array(t), a = "";
  for (let s2 = 0, i2 = n2.length; s2 < i2; s2++) a += String.fromCharCode(n2[s2]);
  return c$1(19, r, y$1(btoa(a)), o$1, o$1, o$1, o$1, o$1, D$1(e, 5), o$1, o$1, o$1);
}
var oe$1 = ((t) => (t[t.Vanilla = 1] = "Vanilla", t[t.Cross = 2] = "Cross", t))(oe$1 || {});
function ai(e) {
  return e;
}
function Ft(e, r) {
  for (let t = 0, n2 = r.length; t < n2; t++) {
    let a = r[t];
    e.has(a) || (e.add(a), a.extends && Ft(e, a.extends));
  }
}
function A$1(e) {
  if (e) {
    let r = /* @__PURE__ */ new Set();
    return Ft(r, e), [...r];
  }
}
function Bt(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Ze(e);
  }
}
function de$1(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Vt(e) {
  switch (e) {
    case v$1:
    case R:
    case P$1:
    case C$1:
      return true;
    default:
      return false;
  }
}
var qn = 1e6, Wn = 1e4, Kn = 2e4;
function Lt(e, r) {
  switch (r) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var Gn = 1e3;
function Ut(e, r) {
  var n2;
  let t = r.refs || /* @__PURE__ */ new Map();
  return "types" in t || Object.assign(t, { types: /* @__PURE__ */ new Map() }), { mode: e, plugins: r.plugins, refs: t, features: (n2 = r.features) != null ? n2 : 63 ^ (r.disabledFeatures || 0), depthLimit: r.depthLimit || Gn };
}
function Yt(e) {
  return { mode: 2, base: Ut(2, e), child: o$1 };
}
var Br = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  deserialize(r) {
    return p(this._p, this.depth, r);
  }
};
function qt(e, r) {
  if (r < 0 || !Number.isFinite(r) || !Number.isInteger(r)) throw new O$1({ t: 4, i: r });
  if (e.refs.has(r)) throw new Error("Conflicted ref id: " + r);
}
function Hn(e, r, t) {
  return qt(e.base, r), e.state.marked.has(r) && e.base.refs.set(r, t), t;
}
function Jn(e, r, t) {
  return qt(e.base, r), e.base.refs.set(r, t), t;
}
function b(e, r, t) {
  return e.mode === 1 ? Hn(e, r, t) : Jn(e, r, t);
}
function Vr(e, r, t) {
  if (Object.hasOwn(r, t)) return r[t];
  throw new O$1(e);
}
function Zn(e, r) {
  return b(e, r.i, mt(h$1(r.s)));
}
function $n(e, r, t) {
  let n2 = t.a, a = n2.length, s2 = b(e, t.i, new Array(a));
  for (let i2 = 0, u2; i2 < a; i2++) u2 = n2[i2], u2 && (s2[i2] = p(e, r, u2));
  return Lt(s2, t.o), s2;
}
function Mt(e, r, t) {
  de$1(r) ? e[r] = t : Object.defineProperty(e, r, { value: t, configurable: true, enumerable: true, writable: true });
}
function Xn(e, r, t, n2, a) {
  if (typeof n2 == "string") Mt(t, h$1(n2), p(e, r, a));
  else {
    let s2 = p(e, r, n2);
    switch (typeof s2) {
      case "string":
        Mt(t, s2, p(e, r, a));
        break;
      case "symbol":
        Vt(s2) && (t[s2] = p(e, r, a));
        break;
      default:
        throw new O$1(n2);
    }
  }
}
function Wt(e, r, t) {
  e.base.refs.types.set(r, t);
}
function ge(e, r, t, n2) {
  if (e.base.refs.types.get(t) !== n2) throw new O$1(r);
}
function Kt(e, r, t, n2) {
  let a = t.k;
  if (a.length > 0) for (let i2 = 0, u2 = t.v, l2 = a.length; i2 < l2; i2++) Xn(e, r, n2, a[i2], u2[i2]);
  return n2;
}
function Qn(e, r, t) {
  let n2 = b(e, t.i, t.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return Kt(e, r, t.p, n2), Lt(n2, t.o), n2;
}
function eo(e, r) {
  return b(e, r.i, new Date(r.s));
}
function ro(e, r) {
  if (e.base.features & 32) {
    let t = h$1(r.c);
    if (t.length > Kn) throw new O$1(r);
    return b(e, r.i, new RegExp(t, r.m));
  }
  throw new z(r);
}
function to(e, r, t) {
  let n2 = b(e, t.i, /* @__PURE__ */ new Set());
  for (let a = 0, s2 = t.a, i2 = s2.length; a < i2; a++) n2.add(p(e, r, s2[a]));
  return n2;
}
function no(e, r, t) {
  let n2 = b(e, t.i, /* @__PURE__ */ new Map());
  for (let a = 0, s2 = t.e.k, i2 = t.e.v, u2 = s2.length; a < u2; a++) n2.set(p(e, r, s2[a]), p(e, r, i2[a]));
  return n2;
}
function oo(e, r) {
  if (r.s.length > qn) throw new O$1(r);
  return b(e, r.i, wr(h$1(r.s)));
}
function ao(e, r, t) {
  var u2;
  let n2 = Bt(t.c), a = p(e, r, t.f), s2 = (u2 = t.b) != null ? u2 : 0;
  if (s2 < 0 || s2 > a.byteLength) throw new O$1(t);
  return b(e, t.i, new n2(a, s2, t.l));
}
function so(e, r, t) {
  var i2;
  let n2 = p(e, r, t.f), a = (i2 = t.b) != null ? i2 : 0;
  if (a < 0 || a > n2.byteLength) throw new O$1(t);
  return b(e, t.i, new DataView(n2, a, t.l));
}
function Gt(e, r, t, n2) {
  if (t.p) {
    let a = Kt(e, r, t.p, {});
    Object.defineProperties(n2, Object.getOwnPropertyDescriptors(a));
  }
  return n2;
}
function io(e, r, t) {
  let n2 = b(e, t.i, new AggregateError([], h$1(t.m)));
  return Gt(e, r, t, n2);
}
function uo(e, r, t) {
  let n2 = Vr(t, it, t.s), a = b(e, t.i, new n2(h$1(t.m)));
  return Gt(e, r, t, a);
}
function lo(e, r, t) {
  let n2 = ee$1(), a = b(e, t.i, n2.p), s2 = p(e, r, t.f);
  return t.s ? n2.s(s2) : n2.f(s2), a;
}
function co(e, r, t) {
  return b(e, t.i, Object(p(e, r, t.f)));
}
function fo(e, r, t) {
  let n2 = e.base.plugins;
  if (n2) {
    let a = h$1(t.c);
    for (let s2 = 0, i2 = n2.length; s2 < i2; s2++) {
      let u2 = n2[s2];
      if (u2.tag === a) return b(e, t.i, u2.deserialize(t.s, new Br(e, r), { id: t.i }));
    }
  }
  throw new Q$1(t.c);
}
function So(e, r) {
  let t = b(e, r.i, b(e, r.s, ee$1()).p);
  return Wt(e, r.s, 22), t;
}
function mo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return ge(e, t, t.i, 22), n2.s(p(e, r, t.a[1])), o$1;
  throw new V("Promise");
}
function po(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return ge(e, t, t.i, 22), n2.f(p(e, r, t.a[1])), o$1;
  throw new V("Promise");
}
function go(e, r, t) {
  p(e, r, t.a[0]);
  let n2 = p(e, r, t.a[1]);
  return Pt(n2);
}
function yo(e, r, t) {
  p(e, r, t.a[0]);
  let n2 = p(e, r, t.a[1]);
  return ht(n2);
}
function No(e, r, t) {
  let n2 = b(e, t.i, re$1());
  Wt(e, t.i, 31);
  let a = t.a, s2 = a.length;
  if (s2) for (let i2 = 0; i2 < s2; i2++) p(e, r, a[i2]);
  return n2;
}
function bo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return ge(e, t, t.i, 31), n2.next(p(e, r, t.f)), o$1;
  throw new V("Stream");
}
function vo(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return ge(e, t, t.i, 31), n2.throw(p(e, r, t.f)), o$1;
  throw new V("Stream");
}
function Co(e, r, t) {
  let n2 = e.base.refs.get(t.i);
  if (n2) return ge(e, t, t.i, 31), n2.return(p(e, r, t.f)), o$1;
  throw new V("Stream");
}
function Ao(e, r, t) {
  return p(e, r, t.f), o$1;
}
function Eo(e, r, t) {
  return p(e, r, t.a[1]), o$1;
}
function Io(e, r, t) {
  let n2 = b(e, t.i, hr([], t.s, t.l));
  for (let a = 0, s2 = t.a.length; a < s2; a++) n2.v[a] = p(e, r, t.a[a]);
  return n2;
}
function p(e, r, t) {
  if (r > e.base.depthLimit) throw new M$1(e.base.depthLimit);
  switch (r += 1, t.t) {
    case 2:
      return Vr(t, st, t.s);
    case 0:
      return Number(t.s);
    case 1:
      return h$1(String(t.s));
    case 3:
      if (String(t.s).length > Wn) throw new O$1(t);
      return BigInt(t.s);
    case 4:
      return e.base.refs.get(t.i);
    case 18:
      return Zn(e, t);
    case 9:
      return $n(e, r, t);
    case 10:
    case 11:
      return Qn(e, r, t);
    case 5:
      return eo(e, t);
    case 6:
      return ro(e, t);
    case 7:
      return to(e, r, t);
    case 8:
      return no(e, r, t);
    case 19:
      return oo(e, t);
    case 16:
    case 15:
      return ao(e, r, t);
    case 20:
      return so(e, r, t);
    case 14:
      return io(e, r, t);
    case 13:
      return uo(e, r, t);
    case 12:
      return lo(e, r, t);
    case 17:
      return Vr(t, ot, t.s);
    case 21:
      return co(e, r, t);
    case 25:
      return fo(e, r, t);
    case 22:
      return So(e, t);
    case 23:
      return mo(e, r, t);
    case 24:
      return po(e, r, t);
    case 28:
      return go(e, r, t);
    case 30:
      return yo(e, r, t);
    case 31:
      return No(e, r, t);
    case 32:
      return bo(e, r, t);
    case 33:
      return vo(e, r, t);
    case 34:
      return Co(e, r, t);
    case 27:
      return Ao(e, r, t);
    case 29:
      return Eo(e, r, t);
    case 35:
      return Io(e, r, t);
    default:
      throw new z(t);
  }
}
function ir(e, r) {
  try {
    return p(e, 0, r);
  } catch (t) {
    throw new Je(t);
  }
}
var Ro = () => T, Po = Ro.toString(), Ht = /=>/.test(Po);
function ur(e, r) {
  return Ht ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function Jt(e, r) {
  return Ht ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var Xt = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", Zt = Xt.length, Qt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", $t = Qt.length;
function Mr(e) {
  let r = e % Zt, t = Xt[r];
  for (e = (e - r) / Zt; e > 0; ) r = e % $t, t += Qt[r], e = (e - r) / $t;
  return t;
}
var xo = /^[$A-Z_][0-9A-Z_$]*$/i;
function Lr(e) {
  let r = e[0];
  return (r === "$" || r === "_" || r >= "A" && r <= "Z" || r >= "a" && r <= "z") && xo.test(e);
}
function Ne(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
    case 4:
      return "Object.defineProperty(" + e.s + ',"__proto__",{value:' + e.k + ",configurable:!0,enumerable:!0,writable:!0})";
  }
}
function To(e) {
  let r = [], t = e[0];
  for (let n2 = 1, a = e.length, s2, i2 = t; n2 < a; n2++) s2 = e[n2], s2.t === 0 && s2.v === i2.v ? t = { t: 0, s: s2.s, k: o$1, v: Ne(t) } : s2.t === 2 && s2.s === i2.s ? t = { t: 2, s: Ne(t), k: s2.k, v: s2.v } : s2.t === 1 && s2.s === i2.s ? t = { t: 1, s: Ne(t), k: o$1, v: s2.v } : s2.t === 3 && s2.s === i2.s ? t = { t: 3, s: Ne(t), k: s2.k, v: o$1 } : (r.push(t), t = s2), i2 = s2;
  return r.push(t), r;
}
function sn(e) {
  if (e.length) {
    let r = "", t = To(e);
    for (let n2 = 0, a = t.length; n2 < a; n2++) r += Ne(t[n2]) + ",";
    return r;
  }
  return o$1;
}
var Oo = "Object.create(null)", wo = "new Set", ho = "new Map", zo = "Promise.resolve", _o = "Promise.reject", ko = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: o$1 };
function un(e, r) {
  return { mode: e, plugins: r.plugins, features: r.features, marked: new Set(r.markedRefs), stack: [], flags: [], assignments: [] };
}
function cr(e) {
  return { mode: 2, base: un(2, e), state: e, child: o$1 };
}
var Ur = class {
  constructor(r) {
    this._p = r;
  }
  serialize(r) {
    return f$1(this._p, r);
  }
};
function Fo(e, r) {
  let t = e.valid.get(r);
  t == null && (t = e.valid.size, e.valid.set(r, t));
  let n2 = e.vars[t];
  return n2 == null && (n2 = Mr(t), e.vars[t] = n2), n2;
}
function Bo(e) {
  return le$1 + "[" + e + "]";
}
function m$1(e, r) {
  return e.mode === 1 ? Fo(e.state, r) : Bo(r);
}
function w$1(e, r) {
  e.marked.add(r);
}
function jr(e, r) {
  return e.marked.has(r);
}
function qr(e, r, t) {
  r !== 0 && (w$1(e.base, t), e.base.flags.push({ type: r, value: m$1(e, t) }));
}
function Vo(e) {
  let r = "";
  for (let t = 0, n2 = e.flags, a = n2.length; t < a; t++) {
    let s2 = n2[t];
    r += ko[s2.type] + "(" + s2.value + "),";
  }
  return r;
}
function ln(e) {
  let r = sn(e.assignments), t = Vo(e);
  return r ? t ? r + t : r : t;
}
function Wr(e, r, t) {
  e.assignments.push({ t: 0, s: r, k: o$1, v: t });
}
function Mo(e, r, t) {
  e.base.assignments.push({ t: 1, s: m$1(e, r), k: o$1, v: t });
}
function ye$1(e, r, t, n2) {
  e.base.assignments.push({ t: 2, s: m$1(e, r), k: t, v: n2 });
}
function en(e, r, t) {
  e.base.assignments.push({ t: 3, s: m$1(e, r), k: t, v: o$1 });
}
function be(e, r, t, n2) {
  Wr(e.base, m$1(e, r) + "[" + t + "]", n2);
}
function Yr(e, r, t, n2) {
  if (!de$1(t)) {
    e.base.assignments.push({ t: 4, s: m$1(e, r), k: n2, v: o$1 });
    return;
  }
  Wr(e.base, m$1(e, r) + "." + t, n2);
}
function Lo(e, r, t, n2) {
  Wr(e.base, m$1(e, r) + ".v[" + t + "]", n2);
}
function F$1(e, r) {
  return r.t === 4 && e.stack.includes(r.i);
}
function ae$1(e, r, t) {
  return e.mode === 1 && !jr(e.base, r) ? t : m$1(e, r) + "=" + t;
}
function Uo(e) {
  return U$1 + '.get("' + e.s + '")';
}
function rn(e, r, t, n2) {
  return t ? F$1(e.base, t) ? (w$1(e.base, r), be(e, r, n2, m$1(e, t.i)), "") : f$1(e, t) : "";
}
function jo(e, r) {
  let t = r.i, n2 = r.a, a = n2.length;
  if (a > 0) {
    e.base.stack.push(t);
    let s2 = rn(e, t, n2[0], 0), i2 = s2 === "";
    for (let u2 = 1, l2; u2 < a; u2++) l2 = rn(e, t, n2[u2], u2), s2 += "," + l2, i2 = l2 === "";
    return e.base.stack.pop(), qr(e, r.o, r.i), "[" + s2 + (i2 ? ",]" : "]");
  }
  return "[]";
}
function tn(e, r, t, n2) {
  if (typeof t == "string") {
    let a = Number(t), s2 = a >= 0 && a.toString() === t || Lr(t);
    if (F$1(e.base, n2)) {
      let i2 = m$1(e, n2.i);
      return w$1(e.base, r.i), s2 && a !== a ? Yr(e, r.i, t, i2) : be(e, r.i, s2 ? t : '"' + t + '"', i2), "";
    }
    return de$1(t) ? (s2 ? t : '"' + t + '"') + ":" + f$1(e, n2) : '["' + t + '"]:' + f$1(e, n2);
  }
  return "[" + f$1(e, t) + "]:" + f$1(e, n2);
}
function cn(e, r, t) {
  let n2 = t.k, a = n2.length;
  if (a > 0) {
    let s2 = t.v;
    e.base.stack.push(r.i);
    let i2 = tn(e, r, n2[0], s2[0]);
    for (let u2 = 1, l2 = i2; u2 < a; u2++) l2 = tn(e, r, n2[u2], s2[u2]), i2 += (l2 && i2 && ",") + l2;
    return e.base.stack.pop(), "{" + i2 + "}";
  }
  return "{}";
}
function Yo(e, r) {
  return qr(e, r.o, r.i), cn(e, r, r.p);
}
function qo(e, r, t, n2) {
  let a = cn(e, r, t);
  return a !== "{}" ? "Object.assign(" + n2 + "," + a + ")" : n2;
}
function Wo(e, r, t, n2, a) {
  let s2 = e.base, i2 = f$1(e, a), u2 = Number(n2), l2 = u2 >= 0 && u2.toString() === n2 || Lr(n2);
  if (F$1(s2, a)) l2 && u2 !== u2 ? Yr(e, r.i, n2, i2) : be(e, r.i, l2 ? n2 : '"' + n2 + '"', i2);
  else {
    let g2 = s2.assignments;
    s2.assignments = t, l2 && u2 !== u2 ? Yr(e, r.i, n2, i2) : be(e, r.i, l2 ? n2 : '"' + n2 + '"', i2), s2.assignments = g2;
  }
}
function Ko(e, r, t, n2, a) {
  if (typeof n2 == "string") Wo(e, r, t, n2, a);
  else {
    let s2 = e.base, i2 = s2.stack;
    s2.stack = [];
    let u2 = f$1(e, a);
    s2.stack = i2;
    let l2 = s2.assignments;
    s2.assignments = t, be(e, r.i, f$1(e, n2), u2), s2.assignments = l2;
  }
}
function Go(e, r, t) {
  let n2 = t.k, a = n2.length;
  if (a > 0) {
    let s2 = [], i2 = t.v;
    e.base.stack.push(r.i);
    for (let u2 = 0; u2 < a; u2++) Ko(e, r, s2, n2[u2], i2[u2]);
    return e.base.stack.pop(), sn(s2);
  }
  return o$1;
}
function Kr(e, r, t) {
  if (r.p) {
    let n2 = e.base;
    if (n2.features & 8) t = qo(e, r, r.p, t);
    else {
      w$1(n2, r.i);
      let a = Go(e, r, r.p);
      if (a) return "(" + ae$1(e, r.i, t) + "," + a + m$1(e, r.i) + ")";
    }
  }
  return t;
}
function Ho(e, r) {
  return qr(e, r.o, r.i), Kr(e, r, Oo);
}
function Jo(e) {
  return 'new Date("' + e.s + '")';
}
function Zo(e, r) {
  if (e.base.features & 32) return "/" + h$1(r.c) + "/" + r.m;
  throw new z(r);
}
function nn(e, r, t) {
  let n2 = e.base;
  return F$1(n2, t) ? (w$1(n2, r), Mo(e, r, m$1(e, t.i)), "") : f$1(e, t);
}
function $o(e, r) {
  let t = wo, n2 = r.a, a = n2.length, s2 = r.i;
  if (a > 0) {
    e.base.stack.push(s2);
    let i2 = nn(e, s2, n2[0]);
    for (let u2 = 1, l2 = i2; u2 < a; u2++) l2 = nn(e, s2, n2[u2]), i2 += (l2 && i2 && ",") + l2;
    e.base.stack.pop(), i2 && (t += "([" + i2 + "])");
  }
  return t;
}
function on(e, r, t, n2, a) {
  let s2 = e.base;
  if (F$1(s2, t)) {
    let i2 = m$1(e, t.i);
    if (w$1(s2, r), F$1(s2, n2)) {
      let l2 = m$1(e, n2.i);
      return ye$1(e, r, i2, l2), "";
    }
    if (n2.t !== 4 && n2.i != null && jr(s2, n2.i)) {
      let l2 = "(" + f$1(e, n2) + ",[" + a + "," + a + "])";
      return ye$1(e, r, i2, m$1(e, n2.i)), en(e, r, a), l2;
    }
    let u2 = s2.stack;
    return s2.stack = [], ye$1(e, r, i2, f$1(e, n2)), s2.stack = u2, "";
  }
  if (F$1(s2, n2)) {
    let i2 = m$1(e, n2.i);
    if (w$1(s2, r), t.t !== 4 && t.i != null && jr(s2, t.i)) {
      let l2 = "(" + f$1(e, t) + ",[" + a + "," + a + "])";
      return ye$1(e, r, m$1(e, t.i), i2), en(e, r, a), l2;
    }
    let u2 = s2.stack;
    return s2.stack = [], ye$1(e, r, f$1(e, t), i2), s2.stack = u2, "";
  }
  return "[" + f$1(e, t) + "," + f$1(e, n2) + "]";
}
function Xo(e, r) {
  let t = ho, n2 = r.e.k, a = n2.length, s2 = r.i, i2 = r.f, u2 = m$1(e, i2.i), l2 = e.base;
  if (a > 0) {
    let g2 = r.e.v;
    l2.stack.push(s2);
    let S = on(e, s2, n2[0], g2[0], u2);
    for (let d2 = 1, G2 = S; d2 < a; d2++) G2 = on(e, s2, n2[d2], g2[d2], u2), S += (G2 && S && ",") + G2;
    l2.stack.pop(), S && (t += "([" + S + "])");
  }
  return i2.t === 26 && (w$1(l2, i2.i), t = "(" + f$1(e, i2) + "," + t + ")"), t;
}
function Qo(e, r) {
  return W(e, r.f) + '("' + r.s + '")';
}
function ea(e, r) {
  return "new " + r.c + "(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ra(e, r) {
  return "new DataView(" + f$1(e, r.f) + "," + r.b + "," + r.l + ")";
}
function ta(e, r) {
  let t = r.i;
  e.base.stack.push(t);
  let n2 = Kr(e, r, 'new AggregateError([],"' + r.m + '")');
  return e.base.stack.pop(), n2;
}
function na(e, r) {
  return Kr(e, r, "new " + Ae[r.s] + '("' + r.m + '")');
}
function oa(e, r) {
  let t, n2 = r.f, a = r.i, s2 = r.s ? zo : _o, i2 = e.base;
  if (F$1(i2, n2)) {
    let u2 = m$1(e, n2.i);
    t = s2 + (r.s ? "().then(" + ur([], u2) + ")" : "().catch(" + Jt([], "throw " + u2) + ")");
  } else {
    i2.stack.push(a);
    let u2 = f$1(e, n2);
    i2.stack.pop(), t = s2 + "(" + u2 + ")";
  }
  return t;
}
function aa(e, r) {
  return "Object(" + f$1(e, r.f) + ")";
}
function W(e, r) {
  let t = f$1(e, r);
  return r.t === 4 ? t : "(" + t + ")";
}
function sa(e, r) {
  if (e.mode === 1) throw new z(r);
  return "(" + ae$1(e, r.s, W(e, r.f) + "()") + ").p";
}
function ia(e, r) {
  if (e.mode === 1) throw new z(r);
  return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function ua(e, r) {
  if (e.mode === 1) throw new z(r);
  return W(e, r.a[0]) + "(" + m$1(e, r.i) + "," + f$1(e, r.a[1]) + ")";
}
function la(e, r) {
  let t = e.base.plugins;
  if (t) for (let n2 = 0, a = t.length; n2 < a; n2++) {
    let s2 = t[n2];
    if (s2.tag === r.c) return e.child == null && (e.child = new Ur(e)), s2.serialize(r.s, e.child, { id: r.i });
  }
  throw new Q$1(r.c);
}
function ca(e, r) {
  let t = "", n2 = false;
  return r.f.t !== 4 && (w$1(e.base, r.f.i), t = "(" + f$1(e, r.f) + ",", n2 = true), t += ae$1(e, r.i, "(" + Et + ")(" + m$1(e, r.f.i) + ")"), n2 && (t += ")"), t;
}
function fa(e, r) {
  return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function Sa(e, r) {
  let t = r.a[0], n2 = r.a[1], a = e.base, s2 = "";
  t.t !== 4 && (w$1(a, t.i), s2 += "(" + f$1(e, t)), n2.t !== 4 && (w$1(a, n2.i), s2 += (s2 ? "," : "(") + f$1(e, n2)), s2 && (s2 += ",");
  let i2 = ae$1(e, r.i, "(" + It + ")(" + m$1(e, n2.i) + "," + m$1(e, t.i) + ")");
  return s2 ? s2 + i2 + ")" : i2;
}
function ma(e, r) {
  return W(e, r.a[0]) + "(" + f$1(e, r.a[1]) + ")";
}
function pa(e, r) {
  let t = ae$1(e, r.i, W(e, r.f) + "()"), n2 = r.a.length;
  if (n2) {
    let a = f$1(e, r.a[0]);
    for (let s2 = 1; s2 < n2; s2++) a += "," + f$1(e, r.a[s2]);
    return "(" + t + "," + a + "," + m$1(e, r.i) + ")";
  }
  return t;
}
function da(e, r) {
  return m$1(e, r.i) + ".next(" + f$1(e, r.f) + ")";
}
function ga(e, r) {
  return m$1(e, r.i) + ".throw(" + f$1(e, r.f) + ")";
}
function ya(e, r) {
  return m$1(e, r.i) + ".return(" + f$1(e, r.f) + ")";
}
function an(e, r, t, n2) {
  let a = e.base;
  return F$1(a, n2) ? (w$1(a, r), Lo(e, r, t, m$1(e, n2.i)), "") : f$1(e, n2);
}
function Na(e, r) {
  let t = r.a, n2 = t.length, a = r.i;
  if (n2 > 0) {
    e.base.stack.push(a);
    let s2 = an(e, a, 0, t[0]);
    for (let i2 = 1, u2 = s2; i2 < n2; i2++) u2 = an(e, a, i2, t[i2]), s2 += (u2 && s2 && ",") + u2;
    if (e.base.stack.pop(), s2) return "{__SEROVAL_SEQUENCE__:!0,v:[" + s2 + "],t:" + r.s + ",d:" + r.l + "}";
  }
  return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function ba(e, r) {
  switch (r.t) {
    case 17:
      return nt[r.s];
    case 18:
      return Uo(r);
    case 9:
      return jo(e, r);
    case 10:
      return Yo(e, r);
    case 11:
      return Ho(e, r);
    case 5:
      return Jo(r);
    case 6:
      return Zo(e, r);
    case 7:
      return $o(e, r);
    case 8:
      return Xo(e, r);
    case 19:
      return Qo(e, r);
    case 16:
    case 15:
      return ea(e, r);
    case 20:
      return ra(e, r);
    case 14:
      return ta(e, r);
    case 13:
      return na(e, r);
    case 12:
      return oa(e, r);
    case 21:
      return aa(e, r);
    case 22:
      return sa(e, r);
    case 25:
      return la(e, r);
    case 26:
      return wt[r.s];
    case 35:
      return Na(e, r);
    default:
      throw new z(r);
  }
}
function f$1(e, r) {
  switch (r.t) {
    case 2:
      return at[r.s];
    case 0:
      return "" + r.s;
    case 1:
      return '"' + r.s + '"';
    case 3:
      return r.s + "n";
    case 4:
      return m$1(e, r.i);
    case 23:
      return ia(e, r);
    case 24:
      return ua(e, r);
    case 27:
      return ca(e, r);
    case 28:
      return fa(e, r);
    case 29:
      return Sa(e, r);
    case 30:
      return ma(e, r);
    case 31:
      return pa(e, r);
    case 32:
      return da(e, r);
    case 33:
      return ga(e, r);
    case 34:
      return ya(e, r);
    default:
      return ae$1(e, r.i, ba(e, r));
  }
}
function Sr(e, r) {
  let t = f$1(e, r), n2 = r.i;
  if (n2 == null) return t;
  let a = ln(e.base), s2 = m$1(e, n2), i2 = e.state.scopeId, u2 = i2 == null ? "" : le$1, l2 = a ? "(" + t + "," + a + s2 + ")" : t;
  if (u2 === "") return r.t === 10 && !a ? "(" + l2 + ")" : l2;
  let g2 = i2 == null ? "()" : "(" + le$1 + '["' + y$1(i2) + '"])';
  return "(" + ur([u2], l2) + ")" + g2;
}
var Hr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return E$1(this._p, this.depth, r);
  }
}, Jr = class {
  constructor(r, t) {
    this._p = r;
    this.depth = t;
  }
  parse(r) {
    return E$1(this._p, this.depth, r);
  }
  parseWithError(r) {
    return K$1(this._p, this.depth, r);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    et(this._p);
  }
  popPendingState() {
    ve(this._p);
  }
  onParse(r) {
    se$1(this._p, r);
  }
  onError(r) {
    Xr(this._p, r);
  }
  addCleanup(r) {
    this._p.state.cleanups.push(r);
  }
};
function va(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone, cleanups: [] };
}
function Zr(e) {
  return { type: 2, base: me$1(2, e), state: va(e) };
}
function Ca(e, r, t) {
  let n2 = [];
  for (let a = 0, s2 = t.length; a < s2; a++) a in t ? n2[a] = E$1(e, r, t[a]) : n2[a] = 0;
  return n2;
}
function Aa(e, r, t, n2) {
  return ke(t, n2, Ca(e, r, n2));
}
function $r(e, r, t) {
  let n2 = Object.entries(t), a = [], s2 = [];
  for (let i2 = 0, u2 = n2.length; i2 < u2; i2++) a.push(y$1(n2[i2][0])), s2.push(E$1(e, r, n2[i2][1]));
  return C$1 in t && (a.push(I(e.base, C$1)), s2.push(je(tr(e.base), E$1(e, r, Xe(t))))), v$1 in t && (a.push(I(e.base, v$1)), s2.push(Ye(nr(e.base), E$1(e, r, e.type === 1 ? re$1() : er(t))))), P$1 in t && (a.push(I(e.base, P$1)), s2.push(X$1(t[P$1]))), R in t && (a.push(I(e.base, R)), s2.push(t[R] ? J$1 : Z)), { k: a, v: s2 };
}
function Gr(e, r, t, n2, a) {
  return or(t, n2, a, $r(e, r, n2));
}
function Ea(e, r, t, n2) {
  return De(t, E$1(e, r, n2.valueOf()));
}
function Ia(e, r, t, n2) {
  return Fe(t, n2, E$1(e, r, n2.buffer));
}
function Ra(e, r, t, n2) {
  return Be(t, n2, E$1(e, r, n2.buffer));
}
function Pa(e, r, t, n2) {
  return Ve(t, n2, E$1(e, r, n2.buffer));
}
function fn(e, r, t, n2) {
  let a = $(n2, e.base.features);
  return Me(t, n2, a ? $r(e, r, a) : o$1);
}
function xa(e, r, t, n2) {
  let a = $(n2, e.base.features);
  return Le(t, n2, a ? $r(e, r, a) : o$1);
}
function Ta(e, r, t, n2) {
  let a = [], s2 = [];
  for (let [i2, u2] of n2.entries()) a.push(E$1(e, r, i2)), s2.push(E$1(e, r, u2));
  return ar(e.base, t, a, s2);
}
function Oa(e, r, t, n2) {
  let a = [];
  for (let s2 of n2.keys()) a.push(E$1(e, r, s2));
  return Ue(t, a);
}
function wa(e, r, t, n2) {
  let a = qe(t, D$1(e.base, 4), []);
  return e.type === 1 || (et(e), n2.on({ next: (s2) => {
    if (e.state.alive) {
      let i2 = K$1(e, r, s2);
      i2 && se$1(e, We(t, i2));
    }
  }, throw: (s2) => {
    if (e.state.alive) {
      let i2 = K$1(e, r, s2);
      i2 && se$1(e, Ke(t, i2));
    }
    ve(e);
  }, return: (s2) => {
    if (e.state.alive) {
      let i2 = K$1(e, r, s2);
      i2 && se$1(e, Ge(t, i2));
    }
    ve(e);
  } })), a;
}
function ha(e, r, t) {
  if (this.state.alive) {
    let n2 = K$1(this, r, t);
    n2 && se$1(this, c$1(23, e, o$1, o$1, o$1, o$1, o$1, [D$1(this.base, 2), n2], o$1, o$1, o$1, o$1)), ve(this);
  }
}
function za(e, r, t) {
  if (this.state.alive) {
    let n2 = K$1(this, r, t);
    n2 && se$1(this, c$1(24, e, o$1, o$1, o$1, o$1, o$1, [D$1(this.base, 3), n2], o$1, o$1, o$1, o$1));
  }
  ve(this);
}
function _a(e, r, t, n2) {
  let a = _r(e.base, {});
  return e.type === 2 && (et(e), n2.then(ha.bind(e, a, r), za.bind(e, a, r))), _t(e.base, t, a);
}
function ka(e, r, t, n2, a) {
  for (let s2 = 0, i2 = a.length; s2 < i2; s2++) {
    let u2 = a[s2];
    if (u2.parse.sync && u2.test(n2)) return ce(t, u2.tag, u2.parse.sync(n2, new Hr(e, r), { id: t }));
  }
  return o$1;
}
function Da(e, r, t, n2, a) {
  for (let s2 = 0, i2 = a.length; s2 < i2; s2++) {
    let u2 = a[s2];
    if (u2.parse.stream && u2.test(n2)) return ce(t, u2.tag, u2.parse.stream(n2, new Jr(e, r), { id: t }));
  }
  return o$1;
}
function Sn(e, r, t, n2) {
  let a = e.base.plugins;
  return a ? e.type === 1 ? ka(e, r, t, n2, a) : Da(e, r, t, n2, a) : o$1;
}
function Fa(e, r, t, n2) {
  let a = [];
  for (let s2 = 0, i2 = n2.v.length; s2 < i2; s2++) a[s2] = E$1(e, r, n2.v[s2]);
  return He(t, a, n2.t, n2.d);
}
function Ba(e, r, t, n2, a) {
  switch (a) {
    case Object:
      return Gr(e, r, t, n2, false);
    case o$1:
      return Gr(e, r, t, n2, true);
    case Date:
      return ze(t, n2);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return fn(e, r, t, n2);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return Ea(e, r, t, n2);
    case ArrayBuffer:
      return sr(e.base, t, n2);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return Ia(e, r, t, n2);
    case DataView:
      return Pa(e, r, t, n2);
    case Map:
      return Ta(e, r, t, n2);
    case Set:
      return Oa(e, r, t, n2);
  }
  if (a === Promise || n2 instanceof Promise) return _a(e, r, t, n2);
  let s2 = e.base.features;
  if (s2 & 32 && a === RegExp) return _e(t, n2);
  if (s2 & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return Ra(e, r, t, n2);
  }
  if (s2 & 1 && typeof AggregateError != "undefined" && (a === AggregateError || n2 instanceof AggregateError)) return xa(e, r, t, n2);
  if (n2 instanceof Error) return fn(e, r, t, n2);
  if (C$1 in n2 || v$1 in n2) return Gr(e, r, t, n2, !!a);
  throw new x(n2);
}
function Va(e, r, t, n2) {
  if (Array.isArray(n2)) return Aa(e, r, t, n2);
  if (Qe(n2)) return wa(e, r, t, n2);
  if ($e(n2)) return Fa(e, r, t, n2);
  let a = n2.constructor;
  if (a === Y$1) return E$1(e, r, n2.replacement);
  let s2 = Sn(e, r, t, n2);
  return s2 || Ba(e, r, t, n2, a);
}
function Ma(e, r, t) {
  let n2 = q$1(e.base, t);
  if (n2.type !== 0) return n2.value;
  let a = Sn(e, r, n2.value, t);
  if (a) return a;
  throw new x(t);
}
function E$1(e, r, t) {
  if (r >= e.base.depthLimit) throw new M$1(e.base.depthLimit);
  switch (typeof t) {
    case "boolean":
      return t ? J$1 : Z;
    case "undefined":
      return Ee;
    case "string":
      return X$1(t);
    case "number":
      return we(t);
    case "bigint":
      return he(t);
    case "object": {
      if (t) {
        let n2 = q$1(e.base, t);
        return n2.type === 0 ? Va(e, r + 1, n2.value, t) : n2.value;
      }
      return Ie;
    }
    case "symbol":
      return I(e.base, t);
    case "function":
      return Ma(e, r, t);
    default:
      throw new x(t);
  }
}
function se$1(e, r) {
  e.state.initial ? e.state.buffer.push(r) : Qr(e, r, false);
}
function Xr(e, r) {
  if (e.state.onError) e.state.onError(r);
  else throw r instanceof _ ? r : new _(r);
}
function mn(e) {
  e.state.onDone && e.state.onDone();
  for (let r = 0, t = e.state.cleanups.length; r < t; r++) e.state.cleanups[r]();
}
function Qr(e, r, t) {
  try {
    e.state.onParse(r, t);
  } catch (n2) {
    Xr(e, n2);
  }
}
function et(e) {
  e.state.pending++;
}
function ve(e) {
  --e.state.pending <= 0 && mn(e);
}
function K$1(e, r, t) {
  try {
    return E$1(e, r, t);
  } catch (n2) {
    return Xr(e, n2), o$1;
  }
}
function rt(e, r) {
  let t = K$1(e, 0, r);
  t && (Qr(e, t, true), e.state.initial = false, La(e, e.state), e.state.pending <= 0 && mr(e));
}
function La(e, r) {
  for (let t = 0, n2 = r.buffer.length; t < n2; t++) Qr(e, r.buffer[t], false);
}
function mr(e) {
  e.state.alive && (mn(e), e.state.alive = false);
}
function pn(e, r) {
  let t = A$1(r.plugins), n2 = Zr({ plugins: t, refs: r.refs, disabledFeatures: r.disabledFeatures, onParse(a, s2) {
    let i2 = cr({ plugins: t, features: n2.base.features, scopeId: r.scopeId, markedRefs: n2.base.marked }), u2;
    try {
      u2 = Sr(i2, a);
    } catch (l2) {
      r.onError && r.onError(l2);
      return;
    }
    r.onSerialize(u2, s2);
  }, onError: r.onError, onDone: r.onDone });
  return rt(n2, e), mr.bind(null, n2);
}
function cu(e, r) {
  let t = A$1(r.plugins), n2 = Zr({ plugins: t, refs: r.refs, disabledFeatures: r.disabledFeatures, depthLimit: r.depthLimit, onParse: r.onParse, onError: r.onError, onDone: r.onDone });
  return rt(n2, e), mr.bind(null, n2);
}
function fu(e, r) {
  let t = A$1(r.plugins), n2 = Yt({ plugins: t, refs: r.refs, features: r.features, disabledFeatures: r.disabledFeatures, depthLimit: r.depthLimit });
  return ir(n2, e);
}
var u = (e) => {
  let r = new AbortController(), a = r.abort.bind(r);
  return e.then(a, a), r;
};
function D(e) {
  e(this.reason);
}
function F(e) {
  this.addEventListener("abort", D.bind(this, e), { once: true });
}
function g(e) {
  return new Promise(F.bind(e));
}
var n = {}, A = ai({ tag: "seroval-plugins/web/AbortControllerFactoryPlugin", test(e) {
  return e === n;
}, parse: { sync() {
  return n;
}, async async() {
  return await Promise.resolve(n);
}, stream() {
  return n;
} }, serialize() {
  return u.toString();
}, deserialize() {
  return u;
} }), C = ai({ tag: "seroval-plugins/web/AbortSignal", extends: [A], test(e) {
  return typeof AbortSignal == "undefined" ? false : e instanceof AbortSignal;
}, parse: { sync(e, r) {
  return e.aborted ? { reason: r.parse(e.reason) } : {};
}, async async(e, r) {
  if (e.aborted) return { reason: await r.parse(e.reason) };
  let a = await g(e);
  return { reason: await r.parse(a) };
}, stream(e, r) {
  if (e.aborted) return { reason: r.parse(e.reason) };
  let a = g(e);
  return { factory: r.parse(n), controller: r.parse(a) };
} }, serialize(e, r) {
  return e.reason ? "AbortSignal.abort(" + r.serialize(e.reason) + ")" : e.controller && e.factory ? "(" + r.serialize(e.factory) + ")(" + r.serialize(e.controller) + ").signal" : "(new AbortController).signal";
}, deserialize(e, r) {
  return e.reason ? AbortSignal.abort(r.deserialize(e.reason)) : e.controller ? u(r.deserialize(e.controller)).signal : new AbortController().signal;
} }), O2 = C;
function d(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var U = ai({ tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent == "undefined" ? false : e instanceof CustomEvent;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(d(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(d(e)) };
} }, serialize(e, r) {
  return "new CustomEvent(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new CustomEvent(r.deserialize(e.type), r.deserialize(e.options));
} }), M2 = U;
var q = ai({ tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException == "undefined" ? false : e instanceof DOMException;
}, parse: { sync(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
}, async async(e, r) {
  return { name: await r.parse(e.name), message: await r.parse(e.message) };
}, stream(e, r) {
  return { name: r.parse(e.name), message: r.parse(e.message) };
} }, serialize(e, r) {
  return "new DOMException(" + r.serialize(e.message) + "," + r.serialize(e.name) + ")";
}, deserialize(e, r) {
  return new DOMException(r.deserialize(e.message), r.deserialize(e.name));
} }), H = q;
function f(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Y2 = ai({ tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event == "undefined" ? false : e instanceof Event;
}, parse: { sync(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
}, async async(e, r) {
  return { type: await r.parse(e.type), options: await r.parse(f(e)) };
}, stream(e, r) {
  return { type: r.parse(e.type), options: r.parse(f(e)) };
} }, serialize(e, r) {
  return "new Event(" + r.serialize(e.type) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Event(r.deserialize(e.type), r.deserialize(e.options));
} }), j = Y2;
var G = ai({ tag: "seroval-plugins/web/File", test(e) {
  return typeof File == "undefined" ? false : e instanceof File;
}, parse: { async async(e, r) {
  return { name: await r.parse(e.name), options: await r.parse({ type: e.type, lastModified: e.lastModified }), buffer: await r.parse(await e.arrayBuffer()) };
} }, serialize(e, r) {
  return "new File([" + r.serialize(e.buffer) + "]," + r.serialize(e.name) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new File([r.deserialize(e.buffer)], r.deserialize(e.name), r.deserialize(e.options));
} }), m = G;
function y(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var s = {}, v = (e, r = new FormData(), a = 0, t = e.length, p2) => {
  for (; a < t; a++) p2 = e[a], r.append(p2[0], p2[1]);
  return r;
}, J = ai({ tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === s;
}, parse: { sync() {
  return s;
}, async async() {
  return await Promise.resolve(s);
}, stream() {
  return s;
} }, serialize() {
  return v.toString();
}, deserialize() {
  return s;
} }), K = ai({ tag: "seroval-plugins/web/FormData", extends: [m, J], test(e) {
  return typeof FormData == "undefined" ? false : e instanceof FormData;
}, parse: { sync(e, r) {
  return { factory: r.parse(s), entries: r.parse(y(e)) };
}, async async(e, r) {
  return { factory: await r.parse(s), entries: await r.parse(y(e)) };
}, stream(e, r) {
  return { factory: r.parse(s), entries: r.parse(y(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.entries) + ")";
}, deserialize(e, r) {
  return v(r.deserialize(e.entries));
} }), Q2 = K;
function c(e) {
  let r = [];
  return e.forEach((a, t) => {
    r.push([t, a]);
  }), r;
}
var X = ai({ tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers == "undefined" ? false : e instanceof Headers;
}, parse: { sync(e, r) {
  return { value: r.parse(c(e)) };
}, async async(e, r) {
  return { value: await r.parse(c(e)) };
}, stream(e, r) {
  return { value: r.parse(c(e)) };
} }, serialize(e, r) {
  return "new Headers(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new Headers(r.deserialize(e.value));
} }), i = X;
var o = {}, P = (e) => new ReadableStream({ start: (r) => {
  e.on({ next: (a) => {
    try {
      r.enqueue(a);
    } catch (t) {
    }
  }, throw: (a) => {
    r.error(a);
  }, return: () => {
    try {
      r.close();
    } catch (a) {
    }
  } });
} }), ee = ai({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === o;
}, parse: { sync() {
  return o;
}, async async() {
  return await Promise.resolve(o);
}, stream() {
  return o;
} }, serialize() {
  return P.toString();
}, deserialize() {
  return o;
} });
async function N(e, r) {
  try {
    let a = await r.read();
    a.done ? (e.return(a.value), r.releaseLock()) : (e.next(a.value), await N(e, r));
  } catch (a) {
    e.throw(a);
  }
}
function re(e) {
  e.cancel().catch(() => {
  }), e.releaseLock();
}
function w(e) {
  let r = re$1(), a = e.getReader(), t = re.bind(null, a);
  return N(r, a).catch(t), [r, t];
}
var ae = ai({ tag: "seroval/plugins/web/ReadableStream", extends: [ee], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(o), stream: r.parse(re$1()) };
}, async async(e, r) {
  return { factory: await r.parse(o), stream: await r.parse(w(e)[0]) };
}, stream(e, r) {
  let [a, t] = w(e);
  return r.addCleanup(t), { factory: r.parse(o), stream: r.parse(a) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return P(a);
} }), l = ae;
function h(e, r) {
  return { body: r, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var se = ai({ tag: "seroval-plugins/web/Request", extends: [l, i], test(e) {
  return typeof Request == "undefined" ? false : e instanceof Request;
}, parse: { async async(e, r) {
  return { url: await r.parse(e.url), options: await r.parse(h(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, r) {
  return { url: r.parse(e.url), options: r.parse(h(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, r) {
  return "new Request(" + r.serialize(e.url) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Request(r.deserialize(e.url), r.deserialize(e.options));
} }), oe = se;
function E(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var ie = ai({ tag: "seroval-plugins/web/Response", extends: [l, i], test(e) {
  return typeof Response == "undefined" ? false : e instanceof Response;
}, parse: { async async(e, r) {
  return { body: await r.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await r.parse(E(e)) };
}, stream(e, r) {
  return { body: r.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: r.parse(E(e)) };
} }, serialize(e, r) {
  return "new Response(" + r.serialize(e.body) + "," + r.serialize(e.options) + ")";
}, deserialize(e, r) {
  return new Response(r.deserialize(e.body), r.deserialize(e.options));
} }), le = ie;
var ue = ai({ tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL == "undefined" ? false : e instanceof URL;
}, parse: { sync(e, r) {
  return { value: r.parse(e.href) };
}, async async(e, r) {
  return { value: await r.parse(e.href) };
}, stream(e, r) {
  return { value: r.parse(e.href) };
} }, serialize(e, r) {
  return "new URL(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URL(r.deserialize(e.value));
} }), de = ue;
var me = ai({ tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams == "undefined" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, r) {
  return { value: r.parse(e.toString()) };
}, async async(e, r) {
  return { value: await r.parse(e.toString()) };
}, stream(e, r) {
  return { value: r.parse(e.toString()) };
} }, serialize(e, r) {
  return "new URLSearchParams(" + r.serialize(e.value) + ")";
}, deserialize(e, r) {
  return new URLSearchParams(r.deserialize(e.value));
} }), ye = me;
const DEFAULT_PLUGINS = [O2, M2, H, j, Q2, i, l, oe, le, ye, de];
const MAX_SERIALIZATION_DEPTH_LIMIT = 64;
const DISABLED_FEATURES = L.RegExp;
function createChunk(data) {
  const encodeData = new TextEncoder().encode(data);
  const bytes = encodeData.length;
  const baseHex = bytes.toString(16);
  const totalHex = "00000000".substring(0, 8 - baseHex.length) + baseHex;
  const head = new TextEncoder().encode(`;0x${totalHex};`);
  const chunk = new Uint8Array(12 + bytes);
  chunk.set(head);
  chunk.set(encodeData, 12);
  return chunk;
}
function serializeToJSStream(id, value) {
  return new ReadableStream({
    start(controller) {
      pn(value, {
        scopeId: id,
        plugins: DEFAULT_PLUGINS,
        onSerialize(data, initial) {
          controller.enqueue(createChunk(initial ? `(${yn(id)},${data})` : data));
        },
        onDone() {
          controller.close();
        },
        onError(error) {
          controller.error(error);
        }
      });
    }
  });
}
function serializeToJSONStream(value) {
  return new ReadableStream({
    start(controller) {
      cu(value, {
        disabledFeatures: DISABLED_FEATURES,
        depthLimit: MAX_SERIALIZATION_DEPTH_LIMIT,
        plugins: DEFAULT_PLUGINS,
        onParse(node) {
          controller.enqueue(createChunk(JSON.stringify(node)));
        },
        onDone() {
          controller.close();
        },
        onError(error) {
          controller.error(error);
        }
      });
    }
  });
}
class SerovalChunkReader {
  reader;
  buffer;
  done;
  constructor(stream) {
    this.reader = stream.getReader();
    this.buffer = new Uint8Array(0);
    this.done = false;
  }
  async readChunk() {
    const chunk = await this.reader.read();
    if (!chunk.done) {
      const newBuffer = new Uint8Array(this.buffer.length + chunk.value.length);
      newBuffer.set(this.buffer);
      newBuffer.set(chunk.value, this.buffer.length);
      this.buffer = newBuffer;
    } else {
      this.done = true;
    }
  }
  async next() {
    if (this.buffer.length === 0) {
      if (this.done) {
        return {
          done: true,
          value: void 0
        };
      }
      await this.readChunk();
      return await this.next();
    }
    const head = new TextDecoder().decode(this.buffer.subarray(1, 11));
    const bytes = Number.parseInt(head, 16);
    if (Number.isNaN(bytes)) {
      throw new Error("Malformed server function stream.");
    }
    while (bytes > this.buffer.length - 12) {
      if (this.done) {
        throw new Error("Malformed server function stream.");
      }
      await this.readChunk();
    }
    const partial = new TextDecoder().decode(this.buffer.subarray(12, 12 + bytes));
    this.buffer = this.buffer.subarray(12 + bytes);
    return {
      done: false,
      value: partial
    };
  }
  async drain(interpret) {
    while (true) {
      const result = await this.next();
      if (result.done) {
        break;
      } else {
        interpret(result.value);
      }
    }
  }
}
async function deserializeFromJSONString(json) {
  const blob = new Response(json);
  return await deserializeJSONStream(blob);
}
async function deserializeJSONStream(response) {
  if (!response.body) {
    throw new Error("missing body");
  }
  const reader = new SerovalChunkReader(response.body);
  const result = await reader.next();
  if (!result.done) {
    let interpretChunk = function(chunk) {
      const value = fu(JSON.parse(chunk), {
        refs,
        disabledFeatures: DISABLED_FEATURES,
        depthLimit: MAX_SERIALIZATION_DEPTH_LIMIT,
        plugins: DEFAULT_PLUGINS
      });
      return value;
    };
    const refs = /* @__PURE__ */ new Map();
    void reader.drain(interpretChunk);
    return interpretChunk(result.value);
  }
  return void 0;
}
const BODY_FORMAT_KEY = "X-Start-Type";
const BODY_FORMAL_FILE = "__START__";
var BodyFormat;
(function(BodyFormat2) {
  BodyFormat2["Seroval"] = "0";
  BodyFormat2["String"] = "1";
  BodyFormat2["FormData"] = "2";
  BodyFormat2["URLSearchParams"] = "3";
  BodyFormat2["Blob"] = "4";
  BodyFormat2["File"] = "5";
  BodyFormat2["ArrayBuffer"] = "6";
  BodyFormat2["Uint8Array"] = "7";
})(BodyFormat || (BodyFormat = {}));
function getHeadersAndBody(body) {
  switch (true) {
    case typeof body === "string":
      return {
        headers: {
          "Content-Type": "text/plain",
          [BODY_FORMAT_KEY]: BodyFormat.String
        },
        body
      };
    case body instanceof FormData:
      return {
        headers: {
          [BODY_FORMAT_KEY]: BodyFormat.FormData
        },
        body
      };
    case body instanceof URLSearchParams:
      return {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          [BODY_FORMAT_KEY]: BodyFormat.URLSearchParams
        },
        body
      };
    case body instanceof File: {
      const formData = new FormData();
      formData.append(BODY_FORMAL_FILE, body, body.name);
      return {
        headers: {
          [BODY_FORMAT_KEY]: BodyFormat.File
        },
        body: formData
      };
    }
    case body instanceof Blob:
      return {
        headers: {
          [BODY_FORMAT_KEY]: BodyFormat.Blob
        },
        body
      };
    case body instanceof ArrayBuffer:
      return {
        headers: {
          [BODY_FORMAT_KEY]: BodyFormat.ArrayBuffer
        },
        body
      };
    case body instanceof Uint8Array:
      return {
        headers: {
          [BODY_FORMAT_KEY]: BodyFormat.Uint8Array
        },
        body: new Uint8Array(body)
      };
    default:
      return void 0;
  }
}
async function extractBody(instance, client, source) {
  const contentType = source.headers.get("content-type");
  const startType = source.headers.get(BODY_FORMAT_KEY);
  const clone = source.clone();
  switch (true) {
    case startType === BodyFormat.Seroval:
      return await deserializeJSONStream(clone);
    case startType === BodyFormat.String:
      return await clone.text();
    case startType === BodyFormat.File: {
      const formData = await clone.formData();
      return formData.get(BODY_FORMAL_FILE);
    }
    case startType === BodyFormat.FormData:
    case contentType?.startsWith("multipart/form-data"):
      return await clone.formData();
    case startType === BodyFormat.URLSearchParams:
    case contentType?.startsWith("application/x-www-form-urlencoded"):
      return new URLSearchParams(await clone.text());
    case startType === BodyFormat.Blob:
      return await clone.blob();
    case startType === BodyFormat.ArrayBuffer:
      return await clone.arrayBuffer();
    case startType === BodyFormat.Uint8Array:
      return new Uint8Array(await clone.arrayBuffer());
  }
  return void 0;
}
var _tmpl$$2 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], _tmpl$2$1 = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const ErrorBoundary = (props) => {
  const message = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary$1, {
    fallback: (error) => {
      console.error(error);
      return [ssr(_tmpl$$2, ssrHydrationKey(), escape(message)), createComponent$1(HttpStatusCode, {
        code: 500
      })];
    },
    get children() {
      return props.children;
    }
  });
};
const TopErrorBoundary = (props) => {
  let isError = false;
  const res = catchError(() => props.children, (err) => {
    console.error(err);
    isError = !!err;
  });
  return isError ? [ssr(_tmpl$2$1, ssrHydrationKey()), createComponent$1(HttpStatusCode, {
    code: 500
  })] : res;
};
const PatchVirtualDevStyles = (props) => {
};
var _tmpl$$1 = ["<script", ' type="module"', " async", "><\/script>"];
const docType = ssr("<!DOCTYPE html>");
function StartServer(props) {
  const context = getRequestEvent();
  const nonce = context.nonce;
  useAssets(context.assets, nonce);
  return createComponent$1(NoHydration, {
    get children() {
      return [docType, createComponent$1(TopErrorBoundary, {
        get children() {
          return createComponent$1(props.document, {
            get assets() {
              return createComponent$1(HydrationScript, {});
            },
            get scripts() {
              return [createComponent$1(PatchVirtualDevStyles, {
                nonce
              }), ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("nonce", escape(nonce, true), false), ssrAttribute("src", escape(getSsrManifest().path("./src/entry-client.tsx"), true), false))];
            },
            get children() {
              return createComponent$1(Hydration, {
                get children() {
                  return createComponent$1(ErrorBoundary, {
                    get children() {
                      return createComponent$1(App$1, {});
                    }
                  });
                }
              });
            }
          });
        }
      })];
    }
  });
}
const FETCH_EVENT_CONTEXT = "solidFetchEvent";
function createFetchEvent(event) {
  return {
    request: event.req,
    response: event.res,
    clientAddress: getRequestIP(event),
    locals: {},
    nativeEvent: event
  };
}
function getFetchEvent(h3Event) {
  if (!h3Event.context[FETCH_EVENT_CONTEXT]) {
    const fetchEvent = createFetchEvent(h3Event);
    h3Event.context[FETCH_EVENT_CONTEXT] = fetchEvent;
  }
  return h3Event.context[FETCH_EVENT_CONTEXT];
}
function mergeResponseHeaders(h3Event, headers) {
  for (const [key, value] of headers.entries()) {
    h3Event.res.headers.append(key, value);
  }
}
const decorateHandler = (fn2) => (event) => provideRequestEvent(getFetchEvent(event), () => fn2(event));
const decorateMiddleware = (fn2) => (event, next) => provideRequestEvent(getFetchEvent(event), () => fn2(event, next));
const middleware = {};
function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
const serverFn_1$1 = createServerReference("a9620366-0", async function GET({
  request
}) {
  const [divisiList, batchList] = await Promise.all([db.divisi.findMany({
    orderBy: {
      name: "asc"
    }
  }), db.batchMagang.findMany({
    orderBy: {
      name: "asc"
    }
  })]);
  const headers = ["username", "password", "fullName", "email", "phone", "role", "divisi", "batch"];
  const example = ["budi123", "rahasia123", "Budi Santoso", "budi@email.com", "'081234567890", "USER", divisiList[0]?.name || "IT", batchList[0]?.name || "Batch 1"];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = headers.map(() => ({
    wch: 22
  }));
  const refData = [["Daftar Divisi", "Daftar Batch", "", "PETUNJUK PENGISIAN"], ...Array.from({
    length: Math.max(divisiList.length, batchList.length)
  }, (_2, i2) => [divisiList[i2]?.name || "", batchList[i2]?.name || "", "", i2 === 0 ? "[PERINGATAN] JANGAN UBAH baris 1 (header) di sheet Template!" : ""])];
  const instructions = ["[PERINGATAN] JANGAN UBAH baris 1 (header) di sheet Template!", "[PETUNJUK] Tambahkan data pengguna mulai dari baris 2 ke bawah.", "[PETUNJUK] Kolom wajib: username, password, fullName, email.", "[PETUNJUK] Kolom opsional: phone, role (USER/ADMIN), divisi, batch.", "[PETUNJUK] Nilai divisi & batch harus sesuai daftar di kolom A & B.", "[PETUNJUK] Contoh data sudah tersedia di baris 2, boleh ditimpa.", "[PERINGATAN] JANGAN UBAH nama sheet 'Template'."];
  while (refData.length < instructions.length + 1) {
    refData.push(["", "", "", ""]);
  }
  for (let i2 = 0; i2 < instructions.length; i2++) {
    refData[i2 + 1][3] = instructions[i2];
  }
  const wsRef = XLSX.utils.aoa_to_sheet(refData);
  wsRef["!cols"] = [{
    wch: 30
  }, {
    wch: 30
  }, {
    wch: 3
  }, {
    wch: 55
  }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.utils.book_append_sheet(wb, wsRef, "Referensi");
  const buf = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx"
  });
  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Template_Import_Pengguna.xlsx"'
    }
  });
});
cloneServerReference(serverFn_1$1);
const serverFn_1 = createServerReference("b7db7114-0", async function POST({
  request
}) {
  try {
    await requireAdmin();
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Akses ditolak. Anda bukan admin."
    }), {
      status: 403,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({
        error: "File tidak valid atau kosong."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (file.size > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({
        error: "Ukuran file maksimal 2MB."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const bytes = await file.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(bytes), {
      type: "array"
    });
    if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
      return new Response(JSON.stringify({
        error: "Format Excel tidak valid atau kosong."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      return new Response(JSON.stringify({
        error: "Sheet pertama tidak ditemukan dalam file."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const rows = XLSX.utils.sheet_to_json(sheet);
    if (rows.length === 0) {
      return new Response(JSON.stringify({
        error: "Template kosong, tidak ada data."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const [divisiList, batchList, existingUsers] = await Promise.all([db.divisi.findMany(), db.batchMagang.findMany(), db.user.findMany({
      select: {
        username: true,
        email: true
      }
    })]);
    const divisiMap = new Map(divisiList.map((d2) => [d2.name.toLowerCase().trim(), d2.id]));
    const batchMap = new Map(batchList.map((b2) => [b2.name.toLowerCase().trim(), b2.id]));
    const usedUsernames = new Set(existingUsers.map((u2) => u2.username.toLowerCase()));
    const usedEmails = new Set(existingUsers.map((u2) => u2.email.toLowerCase()));
    const errors = [];
    let successCount = 0;
    const batchUsernames = /* @__PURE__ */ new Set();
    const batchEmails = /* @__PURE__ */ new Set();
    for (let i2 = 0; i2 < rows.length; i2++) {
      const r = rows[i2];
      const rowNum = i2 + 2;
      const username = String(r.username || "").trim();
      const password = String(r.password || "").trim();
      const fullName = String(r.fullName || "").trim();
      const email = String(r.email || "").trim();
      const phone = String(r.phone || "").trim();
      const role = String(r.role || "USER").trim().toUpperCase();
      const divisiName = String(r.divisi || "").trim();
      const batchName = String(r.batch || "").trim();
      if (!username || !password || !fullName || !email) {
        errors.push({
          row: rowNum,
          username: username || "(kosong)",
          error: "username, password, fullName, dan email wajib diisi."
        });
        continue;
      }
      const ue2 = validateUsername(username);
      if (ue2) {
        errors.push({
          row: rowNum,
          username,
          error: ue2
        });
        continue;
      }
      const pe2 = validatePassword(password);
      if (pe2) {
        errors.push({
          row: rowNum,
          username,
          error: pe2
        });
        continue;
      }
      if (!["USER", "ADMIN"].includes(role)) {
        errors.push({
          row: rowNum,
          username,
          error: `Role "${r.role}" tidak valid. Gunakan USER atau ADMIN.`
        });
        continue;
      }
      const uLower = username.toLowerCase();
      const eLower = email.toLowerCase();
      if (usedUsernames.has(uLower) || batchUsernames.has(uLower)) {
        errors.push({
          row: rowNum,
          username,
          error: "Username sudah terdaftar."
        });
        continue;
      }
      if (usedEmails.has(eLower) || batchEmails.has(eLower)) {
        errors.push({
          row: rowNum,
          username,
          error: "Email sudah terdaftar."
        });
        continue;
      }
      let divisiId = null;
      if (divisiName) {
        divisiId = divisiMap.get(divisiName.toLowerCase()) ?? null;
        if (!divisiId) {
          errors.push({
            row: rowNum,
            username,
            error: `Divisi "${divisiName}" tidak ditemukan.`
          });
          continue;
        }
      }
      let batchId = null;
      if (batchName) {
        batchId = batchMap.get(batchName.toLowerCase()) ?? null;
        if (!batchId) {
          errors.push({
            row: rowNum,
            username,
            error: `Batch "${batchName}" tidak ditemukan.`
          });
          continue;
        }
      }
      try {
        await db.user.create({
          data: {
            username,
            password: hashPassword(password),
            fullName,
            email,
            phone: phone || null,
            role,
            divisiId,
            batchId,
            status: "AKTIF"
          }
        });
        batchUsernames.add(uLower);
        batchEmails.add(eLower);
        successCount++;
      } catch (e) {
        errors.push({
          row: rowNum,
          username,
          error: e.message || "Gagal menyimpan."
        });
      }
    }
    if (successCount > 0) {
      await logActivity("BUAT_PENGGUNA", `bulk create ${successCount}/${rows.length} users`);
    }
    return new Response(JSON.stringify({
      total: rows.length,
      successCount,
      errors
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message || "Gagal mengimpor data."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
cloneServerReference(serverFn_1);
const validRedirectStatuses = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function getExpectedRedirectStatus(response) {
  if (response.status && validRedirectStatuses.has(response.status)) {
    return response.status;
  }
  return 302;
}
async function handleServerFunction(h3Event) {
  const event = getFetchEvent(h3Event);
  const request = event.request;
  const serverReference = request.headers.get("X-Server-Id");
  const instance = request.headers.get("X-Server-Instance");
  const singleFlight = request.headers.has("X-Single-Flight");
  const url = new URL(request.url);
  let functionId;
  if (serverReference) {
    [functionId] = serverReference.split("#");
  } else {
    functionId = url.searchParams.get("id");
    if (!functionId) {
      return process.env.NODE_ENV === "development" ? new Response("Server function not found", {
        status: 404
      }) : new Response(null, {
        status: 404
      });
    }
  }
  const serverFunction = getServerFunction(functionId);
  let parsed = [];
  if (!instance || request.method === "GET") {
    const args = url.searchParams.get("args");
    if (args) {
      const result = await deserializeFromJSONString(args);
      for (const arg of result) {
        parsed.push(arg);
      }
    }
  }
  if (request.method === "POST" && request.body !== null) {
    const bodyFormat = request.headers.get(BODY_FORMAT_KEY);
    const decoded = await extractBody("", false, request.clone());
    if (bodyFormat === BodyFormat.Seroval) {
      parsed = decoded;
    } else {
      parsed.push(decoded);
    }
  }
  try {
    let result = await provideRequestEvent(event, async () => {
      sharedConfig.context = {
        event
      };
      event.locals.serverFunctionMeta = {
        id: functionId
      };
      return serverFunction(...parsed);
    });
    if (singleFlight && instance) {
      result = await handleSingleFlight(event, result);
    }
    if (result instanceof Response) {
      if (result.headers && result.headers.has("X-Content-Raw")) return result;
      if (instance) {
        if (result.headers) mergeResponseHeaders(h3Event, result.headers);
        if (result.status && (result.status < 300 || result.status >= 400)) h3Event.res.status = result.status;
        if (result.customBody) {
          result = await result.customBody();
        } else if (result.body == null) result = null;
      }
    }
    if (!instance) return handleNoJS(result, request, parsed);
    const body = getHeadersAndBody(result);
    if (body) {
      return new Response(body.body, {
        headers: body.headers
      });
    }
    h3Event.res.headers.set(BODY_FORMAT_KEY, BodyFormat.Seroval);
    if (false) ;
    return serializeToJSONStream(result);
  } catch (x2) {
    if (x2 instanceof Response) {
      if (singleFlight && instance) {
        x2 = await handleSingleFlight(event, x2);
      }
      if (x2.headers) mergeResponseHeaders(h3Event, x2.headers);
      if (x2.status && (!instance || x2.status < 300 || x2.status >= 400)) h3Event.res.status = x2.status;
      if (x2.customBody) {
        x2 = await x2.customBody();
      } else if (x2.body == null) x2 = null;
      h3Event.res.headers.set("X-Error", "true");
    } else if (instance) {
      const error = x2 instanceof Error ? x2.message : typeof x2 === "string" ? x2 : "true";
      h3Event.res.headers.set("X-Error", toHeaderValue(error));
    } else {
      x2 = handleNoJS(x2, request, parsed, true);
    }
    if (instance) {
      const body = getHeadersAndBody(x2);
      if (body) {
        const headers = new Headers(body.headers);
        const errorHeader = h3Event.res.headers.get("X-Error");
        if (errorHeader !== null) {
          headers.set("X-Error", errorHeader);
        }
        return new Response(body.body, {
          headers
        });
      }
      h3Event.res.headers.set(BODY_FORMAT_KEY, BodyFormat.Seroval);
      return serializeToJSONStream(x2);
    }
    return x2;
  }
}
function toHeaderValue(value) {
  const stripped = value.replace(/[\r\n]+/g, "");
  try {
    return /[^\x00-\xFF]/.test(stripped) ? encodeURIComponent(stripped) : stripped;
  } catch {
    return "true";
  }
}
function handleNoJS(result, request, parsed, thrown) {
  const url = new URL(request.url);
  const isError = result instanceof Error;
  let statusCode = 302;
  let headers;
  if (result instanceof Response) {
    headers = new Headers(result.headers);
    if (result.headers.has("Location")) {
      headers.set(`Location`, new URL(result.headers.get("Location"), url.origin + "/").toString());
      statusCode = getExpectedRedirectStatus(result);
    }
  } else headers = new Headers({
    Location: new URL(request.headers.get("referer")).toString()
  });
  if (result) {
    headers.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({
      url: url.pathname + url.search,
      result: isError ? result.message : result,
      thrown,
      error: isError,
      input: [...parsed.slice(0, -1), [...parsed[parsed.length - 1].entries()]]
    }))}; Secure; HttpOnly;`);
  }
  return new Response(null, {
    status: statusCode,
    headers
  });
}
let App;
function createSingleFlightHeaders(sourceEvent) {
  const headers = new Headers(sourceEvent.request.headers);
  const cookies = parseCookies(sourceEvent.nativeEvent);
  const SetCookies = sourceEvent.response.headers.getSetCookie();
  headers.delete("cookie");
  SetCookies.forEach((cookie) => {
    if (!cookie) return;
    const {
      maxAge,
      expires,
      name,
      value
    } = parseSetCookie(cookie);
    if (maxAge != null && maxAge <= 0) {
      delete cookies[name];
      return;
    }
    if (expires != null && expires.getTime() <= Date.now()) {
      delete cookies[name];
      return;
    }
    cookies[name] = value;
  });
  Object.entries(cookies).forEach(([key, value]) => {
    headers.append("cookie", `${key}=${value}`);
  });
  return headers;
}
async function handleSingleFlight(sourceEvent, result) {
  let revalidate2;
  let url = new URL(sourceEvent.request.headers.get("referer")).toString();
  if (result instanceof Response) {
    if (result.headers.has("X-Revalidate")) revalidate2 = result.headers.get("X-Revalidate").split(",");
    if (result.headers.has("Location")) url = new URL(result.headers.get("Location"), new URL(sourceEvent.request.url).origin + "/").toString();
  }
  const event = {
    ...sourceEvent
  };
  event.request = new Request(url, {
    headers: createSingleFlightHeaders(sourceEvent)
  });
  return await provideRequestEvent(event, async () => {
    await createPageEvent(event);
    App || (App = (await Promise.resolve().then(() => app)).default);
    event.router.dataOnly = revalidate2 || true;
    event.router.previousUrl = sourceEvent.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = event;
        App();
      });
    } catch (e) {
      console.log(e);
    }
    const body = event.router.data;
    if (!body) return result;
    let containsKey = false;
    for (const key in body) {
      if (body[key] === void 0) delete body[key];
      else containsKey = true;
    }
    if (!containsKey) return result;
    if (!(result instanceof Response)) {
      body["_$value"] = result;
      result = new Response(null, {
        status: 200
      });
    } else if (result.customBody) {
      body["_$value"] = result.customBody();
    }
    result.customBody = () => body;
    result.headers.set("X-Single-Flight", "true");
    return result;
  });
}
function toWebReadableStream(stream) {
  const encoder = new TextEncoder();
  let active = true;
  return new ReadableStream({
    start(controller) {
      stream.pipe({
        write(payload) {
          if (!active) return;
          controller.enqueue(encoder.encode(payload));
        },
        end() {
          if (!active) return;
          active = false;
          controller.close();
        }
      });
    },
    cancel() {
      active = false;
    }
  });
}
function stripPathBase(path2, base) {
  return path2;
}
const SERVER_FN_BASE = "/_server";
function createBaseHandler(createPageEvent2, fn2, options = {}, routerLoad) {
  const handler = defineHandler({
    middleware: middleware.length ? middleware.map(decorateMiddleware) : void 0,
    handler: decorateHandler(async (e) => {
      const event = getRequestEvent();
      const url = new URL(event.request.url);
      const pathname = stripBaseUrl(url.pathname);
      if (pathname.startsWith(SERVER_FN_BASE)) {
        return await handleServerFunction(e);
      }
      const match = matchAPIRoute(pathname, event.request.method);
      if (match) {
        const mod = await match.handler.import();
        const fn22 = event.request.method === "HEAD" ? mod["HEAD"] || mod["GET"] : mod[event.request.method];
        if (typeof fn22 === "function") {
          event.params = match.params || {};
          sharedConfig.context = {
            event
          };
          const res = await fn22(event);
          if (res !== void 0) {
            return res;
          }
          if (event.request.method !== "GET") {
            throw new Error(`API handler for ${event.request.method} "${event.request.url}" did not return a response.`);
          }
          if (!match.isPage) return;
        }
      }
      const context = await createPageEvent2(event);
      const resolvedOptions = typeof options === "function" ? await options(context) : {
        ...options
      };
      const mode = resolvedOptions.mode || "stream";
      if (resolvedOptions.nonce) context.nonce = resolvedOptions.nonce;
      if (mode === "sync" || false) {
        const html = renderToString(() => {
          sharedConfig.context.event = context;
          return fn2(context);
        }, resolvedOptions);
        context.complete = true;
        if (context.response && context.response.headers.get("Location")) {
          const status = getExpectedRedirectStatus(context.response);
          return redirect(context.response.headers.get("Location"), status);
        }
        event.response.headers.set("content-type", "text/html");
        return html;
      }
      if (resolvedOptions.onCompleteAll) {
        const og = resolvedOptions.onCompleteAll;
        resolvedOptions.onCompleteAll = (options2) => {
          handleStreamCompleteRedirect(context)(options2);
          og(options2);
        };
      } else resolvedOptions.onCompleteAll = handleStreamCompleteRedirect(context);
      if (resolvedOptions.onCompleteShell) {
        const og = resolvedOptions.onCompleteShell;
        resolvedOptions.onCompleteShell = (options2) => {
          handleShellCompleteRedirect(context, e)();
          og(options2);
        };
      } else resolvedOptions.onCompleteShell = handleShellCompleteRedirect(context, e);
      const _stream = renderToStream(() => {
        sharedConfig.context.event = context;
        return fn2(context);
      }, resolvedOptions);
      const stream = _stream;
      if (context.response && context.response.headers.get("Location")) {
        const status = getExpectedRedirectStatus(context.response);
        return redirect(context.response.headers.get("Location"), status);
      }
      if (mode === "async") return await stream;
      return iterable(toWebReadableStream(stream));
    })
  });
  const app2 = new H3();
  app2.use(handler);
  return app2;
}
function createHandler(fn2, options = {}, routerLoad) {
  return createBaseHandler(createPageEvent, fn2, options);
}
async function createPageEvent(ctx) {
  ctx.response.headers.set("Content-Type", "text/html");
  const manifest = getSsrManifest();
  const mergedCSS = await manifest.getAssets("style.css");
  const assets = [
    ...mergedCSS,
    ...await manifest.getAssets("./src/entry-client.tsx"),
    ...await manifest.getAssets("D:\\CODING\\solid-sbimagang\\src\\app.tsx")
    // ...(import.meta.env.START_ISLANDS
    //   ? (await serverManifest.inputs[serverManifest.handler]!.assets()).filter(
    //       s => (s as any).attrs.rel !== "modulepreload"
    //     )
    //   : [])
  ];
  const pageEvent = Object.assign(ctx, {
    assets,
    router: {
      submission: initFromFlash(ctx)
    },
    routes: createRoutes(),
    // prevUrl: prevPath || "",
    // mutation: mutation,
    // $type: FETCH_EVENT,
    complete: false,
    $islands: /* @__PURE__ */ new Set()
  });
  return pageEvent;
}
function initFromFlash(ctx) {
  const flash = getCookie(ctx.nativeEvent, "flash");
  if (!flash) return;
  try {
    const param = JSON.parse(flash);
    if (!param || !param.result) return;
    const input = [...param.input.slice(0, -1), new Map(param.input[param.input.length - 1])];
    const result = param.error ? new Error(param.result) : param.result;
    return {
      input,
      url: param.url,
      pending: false,
      result: param.thrown ? void 0 : result,
      error: param.thrown ? result : void 0
    };
  } catch (e) {
    console.error(e);
  } finally {
    setCookie(ctx.nativeEvent, "flash", "", {
      maxAge: 0
    });
  }
}
function handleShellCompleteRedirect(context, e) {
  return () => {
    if (context.response && context.response.headers.get("Location")) {
      const status = getExpectedRedirectStatus(context.response);
      e.res.status = status;
      e.res.headers.set("Location", context.response.headers.get("Location"));
    }
  };
}
function handleStreamCompleteRedirect(context) {
  return ({
    write
  }) => {
    context.complete = true;
    const to2 = context.response && context.response.headers.get("Location");
    to2 && write(`<script>window.location=${JSON.stringify(to2).replace(/</g, "\\u003c")}<\/script>`);
  };
}
function stripBaseUrl(path2) {
  return stripPathBase(path2);
}
var _tmpl$ = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><link rel="icon" type="image/png" href="/favicon.png"><link rel="canonical" href="', '"><meta name="google-site-verification" content="google83bfb21f7d7ec635"><meta name="description" content="Sistem Informasi dan Manajemen Magang. Mempermudah pencatatan kehadiran, pengajuan izin, dan rekap laporan."><meta name="robots" content="index, follow"><meta name="author" content="SIGMA"><meta name="theme-color" content="#E11D48"><meta name="google" content="notranslate"><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description" content="Aplikasi pemantauan absensi harian dan perizinan anak magang."><meta property="og:image"', '><meta property="og:image:type" content="image/png"><meta property="og:url" content="', '"><meta property="og:site_name" content="Absensi Magang"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description" content="Aplikasi pemantauan absensi harian dan perizinan anak magang."><meta name="twitter:image"', '><script type="application/ld+json">', '<\/script><script>\n              (function() {\n                var saved = localStorage.getItem("theme");\n                if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {\n                  document.documentElement.setAttribute("data-theme", "dark");\n                }\n                var savedPinned = localStorage.getItem("sidebar-pinned");\n                if (savedPinned === "false") {\n                  document.documentElement.classList.add("sidebar-is-collapsed");\n                }\n              })();\n            <\/script>', "</head>"], _tmpl$2 = ["<html", ' lang="id">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const entryServer = createHandler(() => createComponent$1(StartServer, {
  document: ({
    assets,
    children: children2,
    scripts
  }) => {
    const event = getRequestEvent();
    const host = event ? event.request.headers.get("host") || "SIGMA.aulky.app" : "SIGMA.aulky.app";
    const protocol = event && (event.request.headers.get("x-forwarded-proto") === "https" || event.request.headers.get("x-forwarded-protocol") === "https") ? "https" : "http";
    const origin = `${protocol}://${host}`;
    const requestUrl = event ? new URL(event.request.url, origin) : null;
    const path2 = requestUrl ? requestUrl.pathname : "/";
    const logoUrl = `${origin}/logo-sigma-seo.png`;
    const titleMap = {
      "/dashboard": "Dashboard",
      "/riwayat": "Riwayat Absensi",
      "/izin": "Pengajuan Izin",
      "/profil": "Profil Saya",
      "/login": "Masuk Sistem",
      "/unauthorized": "Akses Ditolak",
      "/admin/dashboard": "Dashboard Admin",
      "/admin/users": "Kelola Pengguna",
      "/admin/divisi": "Kelola Divisi",
      "/admin/absensi": "Monitor Absensi",
      "/admin/izin": "Kelola Pengajuan Izin",
      "/admin/laporan": "Laporan Absensi",
      "/admin/settings": "Pengaturan Sistem",
      "/admin/audit-log": "Audit Log Aktivitas"
    };
    const pageTitle = titleMap[path2] || "Absensi Magang";
    const fullTitle = `${pageTitle} | SIGMA - Sistem Informasi dan Manajemen Magang`;
    return ssr(_tmpl$2, ssrHydrationKey(), createComponent$1(NoHydration, {
      get children() {
        return ssr(_tmpl$, escape(fullTitle), `${escape(origin, true)}${escape(path2, true)}`, ssrAttribute("content", escape(fullTitle, true), false), ssrAttribute("content", escape(logoUrl, true), false), `${escape(origin, true)}${escape(path2, true)}`, ssrAttribute("content", escape(fullTitle, true), false), ssrAttribute("content", escape(logoUrl, true), false), `
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "${fullTitle}",
                "url": "${origin}${path2}",
                "logo": "${logoUrl}",
                "description": "Sistem absensi harian dan perizinan anak magang.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All"
              }
            `, escape(assets));
      }
    }), escape(children2), escape(scripts));
  }
}));
export {
  deleteBatch as A,
  getAdminBatches as B,
  getAdminStats as C,
  getTodayAttendanceStatus as D,
  getInternTrendData as E,
  createDivisi as F,
  updateDivisi as G,
  deleteDivisi as H,
  getAdminDivisi as I,
  approveIzin as J,
  getAdminIzin as K,
  getLaporan as L,
  updateSystemSettings as M,
  getSystemSettings as N,
  createUser as O,
  updateUser as P,
  deleteUser as Q,
  adminResetPassword as R,
  getAdminUsers as S,
  cloneServerReference as T,
  createServerReference as U,
  requireAdmin as V,
  db as W,
  validateUsername as X,
  validatePassword as Y,
  hashPassword as Z,
  logActivity as _,
  useSearchParams as a,
  checkOut as b,
  createAsync as c,
  checkIn as d,
  entryServer as default,
  getPublicSettings as e,
  getTodayAttendance as f,
  getUser as g,
  getAttendanceHistory as h,
  submitIzin as i,
  getUserIzinList as j,
  updateProfile as k,
  loginOrRegister as l,
  changePassword as m,
  useNavigate as n,
  useResolvedPath as o,
  useHref as p,
  useLocation as q,
  normalizePath as r,
  showToast as s,
  getAllDivisi as t,
  useSubmission as u,
  getAllBatches as v,
  getAdminAbsensi as w,
  getAdminAuditLogs as x,
  createBatch as y,
  updateBatch as z
};
//# sourceMappingURL=entry-server.js.map
