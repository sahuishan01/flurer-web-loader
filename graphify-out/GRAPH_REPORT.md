# Graph Report - flurer-web-loader-plugin  (2026-11-02)

## Corpus Check
- 29 files · ~45,016 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 293 nodes · 792 edges · 20 communities (16 shown, 4 thin omitted)
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
- WebViewport
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
- createNewTab
- addHistoryItem
- queryDockedWebviewUrl

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 34 edges
2. `getDomain()` - 27 edges
3. `SettingsPanel()` - 16 edges
4. `ContextCapsuleBar()` - 15 edges
5. `ContextOrbitDeck()` - 15 edges
6. `invoke()` - 15 edges
7. `ProjectWorkspace` - 14 edges
8. `Tab` - 14 edges
9. `getModifierKey()` - 14 edges
10. `TabBar()` - 13 edges

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

## Communities (20 total, 4 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (46): formatRelativeTime(), HistoryModal(), NavigationBar(), DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickTabSwitcher() (+38 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.20
Nodes (18): ContextOrbitDeck(), endMatrixCardDrag(), endMatrixColDrag(), onMatrixCardPointerMove(), onMatrixCardPointerUp(), onMatrixColPointerMove(), onMatrixColPointerUp(), startMatrixCardDrag() (+10 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "WebViewport"
Cohesion: 0.22
Nodes (10): WebViewport(), addUserRestrictedDomain(), closeTabWebview(), getIframeEmbedUrl(), getUserRestrictedDomains(), hideAllDockedWebviews(), isKnownFrameRestricted(), removeUserRestrictedDomain() (+2 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (36): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), KeyboardIcon(), ShieldIcon(), DEFAULT_SHORTCUTS, eventToShortcutString() (+28 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.18
Nodes (22): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], [closedTabs, setClosedTabs], initialTabsState, lastAssignedActiveTime, [tabs, setTabs], WebBrowserPanel(), clearClosedTabs() (+14 more)

### Community 12 - "TabBar"
Cohesion: 0.44
Nodes (9): TabBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+1 more)

### Community 13 - "types.ts"
Cohesion: 0.13
Nodes (23): ContextCapsuleBarProps, ContextOrbitDeckProps, HistoryModalProps, NavigationBarProps, QuickDialProps, QuickTabSwitcherProps, TabBarProps, WebViewportProps (+15 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "utils.ts"
Cohesion: 0.10
Nodes (24): clearAllBrowsingData(), closeAllDockedWebviews(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DOCKED_WEBVIEW_PREFIX, DockedWebviewInfo, getCurrentWindowLabel() (+16 more)

### Community 16 - "ContextCapsuleBar"
Cohesion: 0.44
Nodes (9): ContextCapsuleBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+1 more)

### Community 17 - "createNewTab"
Cohesion: 0.38
Nodes (7): createNewTab(), getMonotonicTimestamp(), initRestoredTabs(), deriveTabTitle(), getSavedActiveTab(), getSavedTabs(), getSavedWorkspaces()

### Community 18 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContextOrbitDeck()` connect `smartRouter.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `ContextCapsuleBar()` connect `ContextCapsuleBar` to `ContextCapsuleBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `TabBar()` connect `TabBar` to `ContextCapsuleBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ContextCapsuleBar()` (e.g. with `endTabDrag()` and `endWsDrag()`) actually correct?**
  _`ContextCapsuleBar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ContextOrbitDeck()` (e.g. with `endMatrixCardDrag()` and `endMatrixColDrag()`) actually correct?**
  _`ContextOrbitDeck()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10578609000584453 - nodes in this community are weakly interconnected._