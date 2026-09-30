# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 19 files · ~12,729 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 155 nodes · 336 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71476691`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WebViewport.tsx
- getModifierKey
- compilerOptions
- package.json
- index.tsx
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- utils.ts
- openInWebviewWindow
- addHistoryItem
- getDomain

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 14 edges
2. `getDomain()` - 10 edges
3. `compilerOptions` - 10 edges
4. `WebViewport()` - 9 edges
5. `invoke()` - 9 edges
6. `openInWebviewWindow()` - 9 edges
7. `Tab` - 8 edges
8. `SettingsPanel()` - 7 edges
9. `Bookmark` - 7 edges
10. `HistoryItem` - 7 edges

## Surprising Connections (you probably didn't know these)
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `WebViewport()` --calls--> `closeDockedWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `createDockedWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `updateDockedWebviewBounds()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.13
Nodes (30): NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, TabBarProps, WebViewportProps (+22 more)

### Community 1 - "getModifierKey"
Cohesion: 0.40
Nodes (6): NavigationBar(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.21
Nodes (14): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel(), MainPanelProps (+6 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.19
Nodes (17): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES, PresetDef (+9 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.17
Nodes (14): CHROME_DESKTOP_USER_AGENT, closeDockedWebview(), createDockedWebview(), DEFAULT_DESKTOP_USER_AGENT, DOCKED_WEBVIEW_PREFIX, hideDockedWebview(), invoke(), KNOWN_FRAME_RESTRICTED_DOMAINS (+6 more)

### Community 12 - "openInWebviewWindow"
Cohesion: 0.67
Nodes (4): getDomainSlug(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

### Community 13 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 14 - "getDomain"
Cohesion: 0.83
Nodes (4): WebViewport(), getDomain(), getIframeEmbedUrl(), isKnownFrameRestricted()

## Knowledge Gaps
- **48 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `WebViewport.tsx` to `utils.ts`, `index.tsx`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `HistoryItem` connect `WebViewport.tsx` to `utils.ts`, `index.tsx`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WebViewport.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13363363363363365 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._