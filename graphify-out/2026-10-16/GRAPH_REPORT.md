# Graph Report - flurer-web-loader-plugin  (2026-10-16)

## Corpus Check
- 23 files · ~26,625 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 211 nodes · 543 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cdac7665`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
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
2. `getDomain()` - 18 edges
3. `Tab` - 13 edges
4. `getModifierKey()` - 12 edges
5. `invoke()` - 12 edges
6. `WebViewport()` - 11 edges
7. `SettingsPanel()` - 11 edges
8. `ProjectWorkspace` - 10 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "ContextOrbitDeck.tsx"
Cohesion: 0.12
Nodes (40): ContextCapsuleBar(), ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBar(), NavigationBarProps, QuickTabSwitcher(), QuickTabSwitcherProps, TabBar() (+32 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (27): WebViewport(), WebViewportProps, addUserRestrictedDomain(), CHROME_DESKTOP_USER_AGENT, closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview() (+19 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.12
Nodes (31): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), classifyHeuristic(), clearLayaOfflineStorage() (+23 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.15
Nodes (25): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel() (+17 more)

### Community 12 - "types.ts"
Cohesion: 0.14
Nodes (16): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, HistoryIcon(), NewTabIcon(), TrashIcon() (+8 more)

## Knowledge Gaps
- **53 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `SettingsPanel.tsx` to `ContextOrbitDeck.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextOrbitDeck.tsx` to `index.tsx`, `utils.ts`, `types.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextOrbitDeck.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11613475177304965 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09841269841269841 - nodes in this community are weakly interconnected._
- **Should `SettingsPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._