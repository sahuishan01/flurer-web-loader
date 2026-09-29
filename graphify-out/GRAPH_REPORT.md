# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 18 files · ~5,912 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 108 nodes · 192 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `061c5887`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WebViewport.tsx
- NavigationBar.tsx
- compilerOptions
- package.json
- index.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `getDomain()` - 7 edges
3. `openInWebviewWindow()` - 7 edges
4. `S` - 7 edges
5. `getModifierKey()` - 6 edges
6. `getPlatformEngineName()` - 6 edges
7. `NavigationBar()` - 5 edges
8. `WebViewport()` - 5 edges
9. `openInExternalBrowser()` - 5 edges
10. `Bookmark` - 5 edges

## Surprising Connections (you probably didn't know these)
- `QuickDialProps` --references--> `Bookmark`  [EXTRACTED]
  src/components/QuickDial.tsx → src/types.ts
- `NavigationBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `NavigationBar()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `NavigationBar()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `TabBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/TabBar.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.15
Nodes (19): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, SettingsPanel(), TabBarProps, WebViewportProps (+11 more)

### Community 1 - "NavigationBar.tsx"
Cohesion: 0.33
Nodes (9): NavigationBarProps, ArrowLeftIcon(), ArrowRightIcon(), ExternalIcon(), HomeIcon(), LockIcon(), PopoutIcon(), ReloadIcon() (+1 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.18
Nodes (20): NavigationBar(), TabBar(), WebViewport(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [tabs, setTabs], WebBrowserPanel() (+12 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

## Knowledge Gaps
- **44 isolated node(s):** `NavigationBarProps`, `TabBarProps`, `WebViewportProps`, `Platform`, `Window` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `NavigationBarProps`, `TabBarProps`, `WebViewportProps` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WebViewport.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._