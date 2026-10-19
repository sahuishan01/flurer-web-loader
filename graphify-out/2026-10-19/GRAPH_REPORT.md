# Graph Report - flurer-web-loader-plugin  (2026-10-19)

## Corpus Check
- 23 files · ~28,913 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 215 nodes · 560 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ec4524f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- icons.tsx
- QuickDial.tsx
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
- QuickTabSwitcher.tsx
- ContextOrbitDeck.tsx
- TabBar.tsx

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 22 edges
2. `getDomain()` - 18 edges
3. `Tab` - 14 edges
4. `invoke()` - 13 edges
5. `ProjectWorkspace` - 12 edges
6. `getModifierKey()` - 12 edges
7. `SettingsPanel()` - 11 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `WebViewportProps` --references--> `Tab`  [EXTRACTED]
  src/components/WebViewport.tsx → src/types.ts
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.24
Nodes (13): ArrowLeftIcon(), ArrowRightIcon(), BranchIcon(), HomeIcon(), IncognitoIcon(), LayersIcon(), LockIcon(), OrbitIcon() (+5 more)

### Community 1 - "QuickDial.tsx"
Cohesion: 0.21
Nodes (11): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, HistoryIcon(), NewTabIcon() (+3 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (31): WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DOCKED_WEBVIEW_PREFIX (+23 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.12
Nodes (31): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), classifyHeuristic(), clearLayaOfflineStorage(), DEFAULT_WORKSPACES, downloadAndSetupLayaOffline() (+23 more)

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
Cohesion: 0.18
Nodes (16): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, QuickTabSwitcherProps, TabBarProps, MainPanelProps, NavDesignMode, OrbitLayoutMode (+8 more)

### Community 13 - "QuickTabSwitcher.tsx"
Cohesion: 0.27
Nodes (9): ContextCapsuleBar(), NavigationBar(), QuickTabSwitcher(), TabBar(), CloseIcon(), GlobeIcon(), getModifierKey(), getPlatformEngineName() (+1 more)

### Community 14 - "ContextOrbitDeck.tsx"
Cohesion: 0.29
Nodes (6): ExternalIcon(), GripIcon(), MatrixIcon(), PinIcon(), INTENT_COLORS, INTENT_LABELS

### Community 15 - "TabBar.tsx"
Cohesion: 0.50
Nodes (3): PlusIcon(), SearchIcon(), S

## Knowledge Gaps
- **53 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `SettingsPanel.tsx` to `icons.tsx`, `utils.ts`, `index.tsx`, `QuickTabSwitcher.tsx`, `ContextOrbitDeck.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `icons.tsx`, `QuickDial.tsx`, `utils.ts`, `index.tsx`, `QuickTabSwitcher.tsx`, `ContextOrbitDeck.tsx`, `TabBar.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `icons.tsx`, `utils.ts`, `SettingsPanel.tsx`, `index.tsx`, `QuickTabSwitcher.tsx`, `ContextOrbitDeck.tsx`, `TabBar.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09743589743589744 - nodes in this community are weakly interconnected._
- **Should `SettingsPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._