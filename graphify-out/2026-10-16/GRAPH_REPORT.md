# Graph Report - flurer-web-loader-plugin  (2026-10-16)

## Corpus Check
- 23 files · ~27,653 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 212 nodes · 542 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14cd7596`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- icons.tsx
- ContextOrbitDeck.tsx
- compilerOptions
- package.json
- utils.ts
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- index.tsx
- types.ts
- invoke
- addHistoryItem
- openInWebviewWindow

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 20 edges
2. `getDomain()` - 18 edges
3. `getModifierKey()` - 12 edges
4. `invoke()` - 12 edges
5. `Tab` - 11 edges
6. `WebViewport()` - 11 edges
7. `SettingsPanel()` - 11 edges
8. `routeTab()` - 10 edges
9. `compilerOptions` - 10 edges
10. `openInWebviewWindow()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.12
Nodes (35): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial() (+27 more)

### Community 1 - "ContextOrbitDeck.tsx"
Cohesion: 0.22
Nodes (18): ContextOrbitDeck(), ContextOrbitDeckProps, GripIcon(), MatrixIcon(), PinIcon(), classifyHeuristic(), downloadAndSetupLayaOffline(), getLayaOfflineMetadata() (+10 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.12
Nodes (12): addUserRestrictedDomain(), COMMON_DOMAIN_SHORTCUTS, DOCKED_WEBVIEW_PREFIX, getUserRestrictedDomains(), hideDockedWebview, isKnownFrameRestricted(), KNOWN_FRAME_RESTRICTED_DOMAINS, Platform (+4 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.15
Nodes (21): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), clearLayaOfflineStorage(), getEffectiveThemeStyles(), getSavedThemeConfig() (+13 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.19
Nodes (17): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel(), DEFAULT_WORKSPACES (+9 more)

### Community 12 - "types.ts"
Cohesion: 0.18
Nodes (14): QuickTabSwitcher(), QuickTabSwitcherProps, TabBar(), TabBarProps, MainPanelProps, NavDesignMode, OrbitLayoutMode, ProjectWorkspace (+6 more)

### Community 13 - "invoke"
Cohesion: 0.19
Nodes (13): WebViewport(), closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview(), getCurrentWindowLabel(), getIframeEmbedUrl(), hideAllDockedWebviews() (+5 more)

### Community 14 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 15 - "openInWebviewWindow"
Cohesion: 0.50
Nodes (5): getDomainSlug(), getPlatform(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

## Knowledge Gaps
- **56 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `ContextOrbitDeck.tsx` to `icons.tsx`, `utils.ts`, `index.tsx`, `types.ts`, `invoke`, `addHistoryItem`, `openInWebviewWindow`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `icons.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `HistoryItem` connect `icons.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1173054587688734 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._