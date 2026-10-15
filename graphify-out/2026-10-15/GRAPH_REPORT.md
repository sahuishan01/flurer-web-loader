# Graph Report - flurer-web-loader-plugin  (2026-10-15)

## Corpus Check
- 23 files · ~25,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 205 nodes · 529 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12994e20`
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
1. `WebBrowserPanel()` - 19 edges
2. `getDomain()` - 19 edges
3. `getModifierKey()` - 12 edges
4. `invoke()` - 12 edges
5. `Tab` - 11 edges
6. `SettingsPanel()` - 11 edges
7. `routeTab()` - 10 edges
8. `WebViewport()` - 10 edges
9. `compilerOptions` - 10 edges
10. `classifyHeuristic()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `WebBrowserPanel()` --calls--> `routeTab()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "icons.tsx"
Cohesion: 0.11
Nodes (37): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial() (+29 more)

### Community 1 - "ContextOrbitDeck.tsx"
Cohesion: 0.21
Nodes (20): ContextOrbitDeck(), ContextOrbitDeckProps, GripIcon(), MatrixIcon(), PinIcon(), classifyHeuristic(), downloadAndSetupLayaOffline(), getLayaOfflineMetadata() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (27): WebViewport(), DEFAULT_WORKSPACES, CHROME_DESKTOP_USER_AGENT, closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview(), DEFAULT_DESKTOP_USER_AGENT (+19 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.17
Nodes (19): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), clearLayaOfflineStorage(), getEffectiveThemeStyles(), getSavedThemeConfig() (+11 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.16
Nodes (22): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel() (+14 more)

### Community 12 - "types.ts"
Cohesion: 0.22
Nodes (10): QuickDialProps, WebViewportProps, Bookmark, HistoryItem, MainPanelProps, NavDesignMode, SavedTabRecord, SettingsPanelProps (+2 more)

## Knowledge Gaps
- **55 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `ContextOrbitDeck.tsx` to `icons.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `types.ts` to `icons.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10808080808080808 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._