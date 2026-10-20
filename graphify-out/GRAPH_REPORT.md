# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 27 files · ~35,344 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 616 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1a177e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
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
- Project Guidelines & Invariants (GEMINI.md)

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 25 edges
2. `getDomain()` - 22 edges
3. `Tab` - 14 edges
4. `invoke()` - 14 edges
5. `ProjectWorkspace` - 12 edges
6. `getModifierKey()` - 12 edges
7. `SettingsPanel()` - 11 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeckProps` --references--> `ProjectWorkspace`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/types.ts
- `ContextOrbitDeckProps` --references--> `Tab`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/types.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.12
Nodes (33): ContextCapsuleBarProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickTabSwitcherProps, TabBarProps, WebsiteIcon() (+25 more)

### Community 1 - "ContextOrbitDeck.tsx"
Cohesion: 0.20
Nodes (20): ContextOrbitDeck(), ContextOrbitDeckProps, GripIcon(), LayersIcon(), MatrixIcon(), OrbitIcon(), PinIcon(), classifyHeuristic() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.09
Nodes (38): ContextCapsuleBar(), NavigationBar(), QuickDial(), QuickTabSwitcher(), WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview() (+30 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.12
Nodes (24): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), BranchIcon(), IncognitoIcon(), ShieldIcon(), SparklesIcon(), clearLayaOfflineStorage() (+16 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.13
Nodes (29): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs() (+21 more)

### Community 12 - "types.ts"
Cohesion: 0.22
Nodes (10): QuickDialProps, WebViewportProps, Bookmark, HistoryItem, MainPanelProps, NavDesignMode, SavedTabRecord, SettingsPanelProps (+2 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **60 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `ContextOrbitDeck.tsx` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `ContextOrbitDeck.tsx`, `index.tsx`, `utils.ts`, `types.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `ContextCapsuleBar.tsx` to `ContextOrbitDeck.tsx`, `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12292358803986711 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._