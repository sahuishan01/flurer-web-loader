# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 27 files · ~34,064 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 232 nodes · 591 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `765f11e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- compilerOptions
- package.json
- utils.ts
- ContextOrbitDeck.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- index.tsx
- types.ts
- Project Guidelines & Invariants (GEMINI.md)

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 23 edges
2. `getDomain()` - 20 edges
3. `invoke()` - 13 edges
4. `getModifierKey()` - 12 edges
5. `WebViewport()` - 11 edges
6. `SettingsPanel()` - 11 edges
7. `Tab` - 10 edges
8. `routeTab()` - 10 edges
9. `compilerOptions` - 10 edges
10. `openInWebviewWindow()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `routeTab()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/smartRouter.ts
- `ContextOrbitDeck()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.10
Nodes (45): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial() (+37 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.09
Nodes (29): WebViewport(), addUserRestrictedDomain(), clearAllBrowsingData(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview() (+21 more)

### Community 5 - "ContextOrbitDeck.tsx"
Cohesion: 0.09
Nodes (37): ContextOrbitDeck(), ContextOrbitDeckProps, QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), BranchIcon(), GripIcon(), IncognitoIcon() (+29 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.13
Nodes (33): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs(), lastAssignedActiveTime (+25 more)

### Community 12 - "types.ts"
Cohesion: 0.22
Nodes (8): MainPanelProps, NavDesignMode, OrbitLayoutMode, SavedTabRecord, SearchEngine, SettingsPanelProps, SmartRouterProvider, WebPluginSettings

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **64 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `index.tsx` to `ContextCapsuleBar.tsx`, `utils.ts`, `ContextOrbitDeck.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `HistoryItem` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09610389610389611 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09009009009009009 - nodes in this community are weakly interconnected._