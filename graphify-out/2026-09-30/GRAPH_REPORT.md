# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 22 files · ~22,037 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 186 nodes · 462 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `39e4f0d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
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
- ContextOrbitDeck.tsx

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 17 edges
2. `getDomain()` - 16 edges
3. `getModifierKey()` - 10 edges
4. `compilerOptions` - 10 edges
5. `WebViewport()` - 9 edges
6. `Tab` - 9 edges
7. `invoke()` - 9 edges
8. `openInWebviewWindow()` - 9 edges
9. `getPlatformEngineName()` - 8 edges
10. `S` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.12
Nodes (33): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial() (+25 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.15
Nodes (25): SettingsPanel(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs] (+17 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.11
Nodes (21): QUICK_ACCENTS, QUICK_PANELS, BranchIcon(), IncognitoIcon(), LayersIcon(), MatrixIcon(), OrbitIcon(), ShieldIcon() (+13 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.15
Nodes (24): QuickDialProps, WebViewport(), WebViewportProps, Bookmark, HistoryItem, clearAllBrowsingData(), closeDockedWebview(), createDockedWebview() (+16 more)

### Community 12 - "ContextOrbitDeck.tsx"
Cohesion: 0.19
Nodes (16): ContextOrbitDeck(), ContextOrbitDeckProps, classifyHeuristic(), INTENT_COLORS, INTENT_LABELS, RouteDecision, routeTabViaLaya(), MainPanelProps (+8 more)

## Knowledge Gaps
- **52 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `utils.ts` to `ContextCapsuleBar.tsx`, `ContextOrbitDeck.tsx`, `index.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `utils.ts`, `ContextOrbitDeck.tsx`, `index.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11923076923076924 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1476923076923077 - nodes in this community are weakly interconnected._
- **Should `SettingsPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11067193675889328 - nodes in this community are weakly interconnected._