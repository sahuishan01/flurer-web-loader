# Graph Report - flurer-web-loader-plugin  (2026-10-26)

## Corpus Check
- 29 files · ~44,280 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 291 nodes · 784 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aee2d0d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- getDomain
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
- TabBar
- types.ts
- Project Guidelines & Invariants (GEMINI.md)
- WebViewport.tsx
- ContextCapsuleBar
- getSavedClosedTabs
- openInWebviewWindow

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 34 edges
2. `getDomain()` - 25 edges
3. `SettingsPanel()` - 16 edges
4. `ContextCapsuleBar()` - 15 edges
5. `ContextOrbitDeck()` - 15 edges
6. `ProjectWorkspace` - 14 edges
7. `Tab` - 14 edges
8. `getModifierKey()` - 14 edges
9. `TabBar()` - 13 edges
10. `invoke()` - 13 edges

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

## Communities (19 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.09
Nodes (53): ContextCapsuleBarProps, ContextOrbitDeckProps, formatRelativeTime(), HistoryModal(), NavigationBar(), NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS (+45 more)

### Community 1 - "getDomain"
Cohesion: 0.20
Nodes (20): ContextOrbitDeck(), endMatrixCardDrag(), endMatrixColDrag(), onMatrixCardPointerMove(), onMatrixCardPointerUp(), onMatrixColPointerMove(), onMatrixColPointerUp(), startMatrixCardDrag() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (11): COMMON_DOMAIN_SHORTCUTS, DOCKED_WEBVIEW_PREFIX, DockedWebviewInfo, hideDockedWebview, KNOWN_FRAME_RESTRICTED_DOMAINS, Platform, queryDockedWebviewInfo(), queryDockedWebviewUrl() (+3 more)

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
Cohesion: 0.15
Nodes (26): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs(), lastAssignedActiveTime (+18 more)

### Community 12 - "TabBar"
Cohesion: 0.38
Nodes (10): TabBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+2 more)

### Community 13 - "types.ts"
Cohesion: 0.18
Nodes (13): HistoryModalProps, QuickDialProps, WebViewportProps, Bookmark, ClosedTabRecord, HistoryItem, MainPanelProps, NavDesignMode (+5 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "WebViewport.tsx"
Cohesion: 0.18
Nodes (18): WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview(), getCurrentWindowLabel(), getIframeEmbedUrl() (+10 more)

### Community 16 - "ContextCapsuleBar"
Cohesion: 0.44
Nodes (9): ContextCapsuleBar(), endTabDrag(), endWsDrag(), onTabPointerMove(), onTabPointerUp(), onWsPointerMove(), onWsPointerUp(), startTabDrag() (+1 more)

### Community 17 - "getSavedClosedTabs"
Cohesion: 0.43
Nodes (7): [closedTabs, setClosedTabs], clearClosedTabs(), getSavedClosedTabs(), popClosedTab(), pushClosedTab(), removeClosedTab(), saveClosedTabs()

### Community 18 - "openInWebviewWindow"
Cohesion: 0.67
Nodes (4): getDomainSlug(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ContextCapsuleBar()` connect `ContextCapsuleBar` to `ContextCapsuleBar.tsx`, `getDomain`, `index.tsx`, `TabBar`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `TabBar()` connect `TabBar` to `ContextCapsuleBar.tsx`, `getDomain`, `index.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `ContextOrbitDeck()` connect `getDomain` to `ContextCapsuleBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ContextCapsuleBar()` (e.g. with `endTabDrag()` and `endWsDrag()`) actually correct?**
  _`ContextCapsuleBar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ContextOrbitDeck()` (e.g. with `endMatrixCardDrag()` and `endMatrixColDrag()`) actually correct?**
  _`ContextOrbitDeck()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09038461538461538 - nodes in this community are weakly interconnected._