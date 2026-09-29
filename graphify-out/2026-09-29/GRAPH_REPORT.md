# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 18 files · ~6,103 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 116 nodes · 217 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14850511`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- QuickDial.tsx
- NavigationBar.tsx
- compilerOptions
- package.json
- utils.ts
- index.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `WebBrowserPanel()` - 8 edges
3. `Tab` - 8 edges
4. `S` - 7 edges
5. `Bookmark` - 7 edges
6. `getDomain()` - 7 edges
7. `openInWebviewWindow()` - 7 edges
8. `getModifierKey()` - 6 edges
9. `getPlatformEngineName()` - 6 edges
10. `NavigationBar()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `NavigationBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts
- `NavigationBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `NavigationBar()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `QuickDialProps` --references--> `Bookmark`  [EXTRACTED]
  src/components/QuickDial.tsx → src/types.ts
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "QuickDial.tsx"
Cohesion: 0.14
Nodes (18): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, TabBar(), TabBarProps, WebViewportProps (+10 more)

### Community 1 - "NavigationBar.tsx"
Cohesion: 0.25
Nodes (12): NavigationBar(), NavigationBarProps, ArrowLeftIcon(), ArrowRightIcon(), ExternalIcon(), HomeIcon(), LockIcon(), PopoutIcon() (+4 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.23
Nodes (15): WebViewport(), WebBrowserPanel(), getDomain(), getPlatform(), getPlatformEngineName(), invoke(), isKnownFrameRestricted(), KNOWN_FRAME_RESTRICTED_DOMAINS (+7 more)

### Community 5 - "index.tsx"
Cohesion: 0.23
Nodes (11): SettingsPanel(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], S (+3 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

## Knowledge Gaps
- **43 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `QuickDial.tsx` to `utils.ts`, `index.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `QuickDial.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._