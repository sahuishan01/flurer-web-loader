# Graph Report - flurer-web-loader-plugin  (2026-10-15)

## Corpus Check
- 22 files · ~24,339 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 511 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e6a67d1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextOrbitDeck.tsx
- smartRouter.ts
- compilerOptions
- package.json
- utils.ts
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- WebViewport.tsx
- types.ts

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 19 edges
2. `getDomain()` - 18 edges
3. `invoke()` - 12 edges
4. `Tab` - 11 edges
5. `SettingsPanel()` - 11 edges
6. `WebViewport()` - 10 edges
7. `getModifierKey()` - 10 edges
8. `routeTab()` - 10 edges
9. `compilerOptions` - 10 edges
10. `openInWebviewWindow()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `WebViewport()` --calls--> `closeTabWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `createOrShowDockedWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `hideAllDockedWebviews()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "ContextOrbitDeck.tsx"
Cohesion: 0.14
Nodes (32): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, TabBar(), TabBarProps, ArrowLeftIcon(), ArrowRightIcon() (+24 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.35
Nodes (11): ContextOrbitDeck(), classifyHeuristic(), DEFAULT_WORKSPACES, getLayaOfflineMetadata(), isLayaOfflineDownloaded(), RouteDecision, routeTab(), routeViaLayaOffline() (+3 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.08
Nodes (43): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel() (+35 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.15
Nodes (21): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), TrashIcon(), clearLayaOfflineStorage(), downloadAndSetupLayaOffline() (+13 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "WebViewport.tsx"
Cohesion: 0.18
Nodes (15): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewport(), WebViewportProps, HistoryIcon() (+7 more)

### Community 12 - "types.ts"
Cohesion: 0.22
Nodes (10): ContextOrbitDeckProps, MainPanelProps, NavDesignMode, OrbitLayoutMode, ProjectWorkspace, SavedTabRecord, SettingsPanelProps, SmartRouterConfig (+2 more)

## Knowledge Gaps
- **54 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `smartRouter.ts` to `ContextOrbitDeck.tsx`, `WebViewport.tsx`, `utils.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextOrbitDeck.tsx` to `WebViewport.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextOrbitDeck.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13940256045519203 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08489795918367347 - nodes in this community are weakly interconnected._