# Graph Report - flurer-web-loader-plugin  (2026-10-16)

## Corpus Check
- 23 files · ~28,036 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 214 nodes · 553 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9926033`
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

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 21 edges
2. `getDomain()` - 18 edges
3. `Tab` - 13 edges
4. `getModifierKey()` - 12 edges
5. `invoke()` - 12 edges
6. `ProjectWorkspace` - 12 edges
7. `WebViewport()` - 11 edges
8. `SettingsPanel()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.13
Nodes (31): ContextCapsuleBar(), NavigationBar(), DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), TabBar(), ArrowLeftIcon() (+23 more)

### Community 1 - "ContextOrbitDeck.tsx"
Cohesion: 0.20
Nodes (20): ContextOrbitDeck(), ContextOrbitDeckProps, GripIcon(), MatrixIcon(), PinIcon(), classifyHeuristic(), DEFAULT_WORKSPACES, downloadAndSetupLayaOffline() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.09
Nodes (33): QuickDialProps, WebViewport(), WebViewportProps, Bookmark, HistoryItem, addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview() (+25 more)

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
Cohesion: 0.15
Nodes (23): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel() (+15 more)

### Community 12 - "types.ts"
Cohesion: 0.19
Nodes (14): ContextCapsuleBarProps, NavigationBarProps, QuickTabSwitcher(), QuickTabSwitcherProps, TabBarProps, MainPanelProps, NavDesignMode, ProjectWorkspace (+6 more)

## Knowledge Gaps
- **54 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `ContextOrbitDeck.tsx` to `icons.tsx`, `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `icons.tsx`, `ContextOrbitDeck.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `icons.tsx`, `ContextOrbitDeck.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09175377468060394 - nodes in this community are weakly interconnected._