# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 18 files · ~5,912 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 108 nodes · 197 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4aa72cf9`
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
2. `Tab` - 8 edges
3. `S` - 7 edges
4. `getDomain()` - 7 edges
5. `openInWebviewWindow()` - 7 edges
6. `Bookmark` - 6 edges
7. `getModifierKey()` - 6 edges
8. `getPlatformEngineName()` - 6 edges
9. `NavigationBar()` - 5 edges
10. `WebViewport()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `NavigationBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts
- `QuickDialProps` --references--> `Bookmark`  [EXTRACTED]
  src/components/QuickDial.tsx → src/types.ts
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `NavigationBarProps` --references--> `SearchEngine`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts
- `NavigationBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.16
Nodes (18): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, SettingsPanel(), TabBarProps, WebViewportProps (+10 more)

### Community 1 - "NavigationBar.tsx"
Cohesion: 0.30
Nodes (10): NavigationBarProps, ArrowLeftIcon(), ArrowRightIcon(), ExternalIcon(), HomeIcon(), LockIcon(), PopoutIcon(), ReloadIcon() (+2 more)

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
- **41 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+36 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `version`, `private` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._