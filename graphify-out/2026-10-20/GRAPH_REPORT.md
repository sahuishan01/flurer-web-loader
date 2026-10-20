# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 27 files · ~34,061 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 609 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1a177e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- getModifierKey
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
2. `getDomain()` - 20 edges
3. `invoke()` - 14 edges
4. `getModifierKey()` - 12 edges
5. `Tab` - 12 edges
6. `WebViewport()` - 11 edges
7. `SettingsPanel()` - 11 edges
8. `ProjectWorkspace` - 10 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `TabBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/TabBar.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (40): ContextCapsuleBarProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickTabSwitcherProps, TabBarProps, WebsiteIcon() (+32 more)

### Community 1 - "getModifierKey"
Cohesion: 0.43
Nodes (7): ContextCapsuleBar(), NavigationBar(), QuickTabSwitcher(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (31): QuickDial(), WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview() (+23 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.11
Nodes (34): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), BranchIcon(), IncognitoIcon(), MatrixIcon(), ShieldIcon() (+26 more)

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
Cohesion: 0.18
Nodes (13): ContextOrbitDeckProps, QuickDialProps, WebViewportProps, Bookmark, HistoryItem, MainPanelProps, NavDesignMode, OrbitLayoutMode (+5 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `SettingsPanel.tsx` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `types.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10823529411764705 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09615384615384616 - nodes in this community are weakly interconnected._