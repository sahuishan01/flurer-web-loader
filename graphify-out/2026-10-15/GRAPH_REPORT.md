# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 22 files · ~23,864 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 193 nodes · 498 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `69801c68`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextOrbitDeck.tsx
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
- types.ts

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 18 edges
2. `getDomain()` - 18 edges
3. `Tab` - 11 edges
4. `SettingsPanel()` - 11 edges
5. `getModifierKey()` - 10 edges
6. `routeTab()` - 10 edges
7. `compilerOptions` - 10 edges
8. `WebViewport()` - 9 edges
9. `invoke()` - 9 edges
10. `openInWebviewWindow()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `WebBrowserPanel()` --calls--> `clearHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `closeDockedWebview()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `openInExternalBrowser()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "ContextOrbitDeck.tsx"
Cohesion: 0.13
Nodes (33): ContextCapsuleBarProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), TabBarProps, ArrowLeftIcon() (+25 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.16
Nodes (27): ContextOrbitDeck(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs] (+19 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.15
Nodes (21): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), clearLayaOfflineStorage(), downloadAndSetupLayaOffline(), isLayaOfflineDownloaded() (+13 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.12
Nodes (31): ContextCapsuleBar(), NavigationBar(), QuickDialProps, TabBar(), WebViewport(), WebViewportProps, Bookmark, HistoryItem (+23 more)

### Community 12 - "types.ts"
Cohesion: 0.17
Nodes (14): ContextOrbitDeckProps, DEFAULT_WORKSPACES, getLayaOfflineMetadata(), RouteDecision, MainPanelProps, NavDesignMode, OrbitLayoutMode, ProjectWorkspace (+6 more)

## Knowledge Gaps
- **51 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `index.tsx` to `ContextOrbitDeck.tsx`, `utils.ts`, `types.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextOrbitDeck.tsx` to `utils.ts`, `types.ts`, `index.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextOrbitDeck.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12560975609756098 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11746031746031746 - nodes in this community are weakly interconnected._