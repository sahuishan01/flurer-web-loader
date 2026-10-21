# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 28 files · ~38,821 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 252 nodes · 660 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a42d7ff9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- types.ts
- compilerOptions
- package.json
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md
- utils.ts
- WebViewport.tsx
- Project Guidelines & Invariants (GEMINI.md)

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 28 edges
2. `getDomain()` - 22 edges
3. `SettingsPanel()` - 16 edges
4. `invoke()` - 13 edges
5. `Tab` - 12 edges
6. `getModifierKey()` - 12 edges
7. `ProjectWorkspace` - 11 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (43): ContextCapsuleBar(), ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, QuickTabSwitcher(), QuickTabSwitcherProps, TabBarProps, WebsiteIcon() (+35 more)

### Community 1 - "types.ts"
Cohesion: 0.16
Nodes (20): ContextOrbitDeck(), ContextOrbitDeckProps, classifyHeuristic(), downloadAndSetupLayaOffline(), getLayaOfflineMetadata(), isLayaOfflineDownloaded(), RouteDecision, routeTab() (+12 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (36): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), KeyboardIcon(), ShieldIcon(), DEFAULT_SHORTCUTS, eventToShortcutString() (+28 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.07
Nodes (53): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs() (+45 more)

### Community 12 - "WebViewport.tsx"
Cohesion: 0.16
Nodes (19): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewport(), WebViewportProps, HistoryIcon() (+11 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **64 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `types.ts` to `ContextCapsuleBar.tsx`, `utils.ts`, `WebViewport.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `WebBrowserPanel()` connect `utils.ts` to `types.ts`, `WebViewport.tsx`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `types.ts`, `utils.ts`, `WebViewport.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10667634252539913 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `SettingsPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09581646423751687 - nodes in this community are weakly interconnected._