# Graph Report - flurer-web-loader-plugin  (2026-11-02)

## Corpus Check
- 29 files · ~44,783 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 291 nodes · 770 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae58d827`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- smartRouter.ts
- compilerOptions
- package.json
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- index.tsx
- TabBar
- types.ts
- Project Guidelines & Invariants (GEMINI.md)
- utils.ts
- ContextCapsuleBar

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 34 edges
2. `getDomain()` - 25 edges
3. `SettingsPanel()` - 16 edges
4. `ContextCapsuleBar()` - 15 edges
5. `ContextOrbitDeck()` - 15 edges
6. `getModifierKey()` - 14 edges
7. `TabBar()` - 13 edges
8. `invoke()` - 13 edges
9. `WebViewport()` - 11 edges
10. `Tab` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.10
Nodes (49): ContextCapsuleBarProps, ContextOrbitDeckProps, formatRelativeTime(), HistoryModal(), HistoryModalProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS (+41 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.18
Nodes (20): ContextOrbitDeck(), endMatrixCardDrag(), endMatrixColDrag(), onMatrixCardPointerMove(), onMatrixCardPointerUp(), onMatrixColPointerMove(), onMatrixColPointerUp(), startMatrixCardDrag() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.09
Nodes (38): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), KeyboardIcon(), ShieldIcon(), DEFAULT_SHORTCUTS, eventToShortcutString() (+30 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.12
Nodes (35): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], [closedTabs, setClosedTabs], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs() (+27 more)

### Community 12 - "TabBar"
Cohesion: 0.38
Nodes (10): TabBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+2 more)

### Community 13 - "types.ts"
Cohesion: 0.16
Nodes (13): QuickDialProps, WebViewportProps, Bookmark, ClosedTabRecord, HistoryItem, MainPanelProps, NavDesignMode, OrbitLayoutMode (+5 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "utils.ts"
Cohesion: 0.09
Nodes (35): NavigationBar(), WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview() (+27 more)

### Community 16 - "ContextCapsuleBar"
Cohesion: 0.44
Nodes (9): ContextCapsuleBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+1 more)

## Knowledge Gaps
- **67 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContextCapsuleBar()` connect `ContextCapsuleBar` to `ContextCapsuleBar.tsx`, `index.tsx`, `TabBar`, `utils.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `TabBar()` connect `TabBar` to `ContextCapsuleBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `ContextOrbitDeck()` connect `smartRouter.ts` to `ContextCapsuleBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ContextCapsuleBar()` (e.g. with `endTabDrag()` and `endWsDrag()`) actually correct?**
  _`ContextCapsuleBar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ContextOrbitDeck()` (e.g. with `endMatrixCardDrag()` and `endMatrixColDrag()`) actually correct?**
  _`ContextOrbitDeck()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09508196721311475 - nodes in this community are weakly interconnected._