# Graph Report - flurer-web-loader-plugin  (2026-10-19)

## Corpus Check
- 27 files · ~33,987 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 232 nodes · 593 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a0d0c30`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- invoke
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
- getModifierKey
- Project Guidelines & Invariants (GEMINI.md)
- getDomain
- addHistoryItem

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 23 edges
2. `getDomain()` - 20 edges
3. `invoke()` - 13 edges
4. `getModifierKey()` - 12 edges
5. `Tab` - 11 edges
6. `WebViewport()` - 11 edges
7. `SettingsPanel()` - 11 edges
8. `routeTab()` - 10 edges
9. `compilerOptions` - 10 edges
10. `ProjectWorkspace` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `routeTab()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/smartRouter.ts
- `ContextOrbitDeck()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.10
Nodes (44): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps (+36 more)

### Community 1 - "invoke"
Cohesion: 0.20
Nodes (12): WebViewport(), clearAllBrowsingData(), closeAllDockedWebviews(), closeTabWebview(), getIframeEmbedUrl(), hideAllDockedWebviews(), hideTabWebview(), invoke() (+4 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (15): addUserRestrictedDomain(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DOCKED_WEBVIEW_PREFIX, getCurrentWindowLabel(), getUserRestrictedDomains(), hideDockedWebview (+7 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.11
Nodes (29): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), clearLayaOfflineStorage(), DEFAULT_WORKSPACES (+21 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.16
Nodes (21): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), initialTabsState, initRestoredTabs(), lastAssignedActiveTime, [tabs, setTabs] (+13 more)

### Community 12 - "types.ts"
Cohesion: 0.20
Nodes (10): QuickTabSwitcher(), QuickTabSwitcherProps, MainPanelProps, NavDesignMode, OrbitLayoutMode, ProjectWorkspace, SavedTabRecord, SettingsPanelProps (+2 more)

### Community 13 - "getModifierKey"
Cohesion: 0.43
Nodes (7): ContextCapsuleBar(), NavigationBar(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "getDomain"
Cohesion: 0.39
Nodes (9): classifyHeuristic(), routeTab(), routeViaLayaOffline(), routeViaOpenAiCompatible(), getDomain(), getDomainSlug(), openInExternalBrowser(), openInWebviewWindow() (+1 more)

### Community 16 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

## Knowledge Gaps
- **63 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `getDomain` to `ContextCapsuleBar.tsx`, `invoke`, `utils.ts`, `SettingsPanel.tsx`, `index.tsx`, `types.ts`, `addHistoryItem`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10101010101010101 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1067193675889328 - nodes in this community are weakly interconnected._