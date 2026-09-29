# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 19 files · ~8,545 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 131 nodes · 247 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `baf0f263`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NavigationBar.tsx
- compilerOptions
- package.json
- index.tsx
- SettingsPanel.tsx
- Flurer Web Loader Plugin (`web-loader`)
- sync-version.cjs
- vite.config.ts
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `WebBrowserPanel()` - 9 edges
3. `Tab` - 8 edges
4. `Bookmark` - 7 edges
5. `openInWebviewWindow()` - 7 edges
6. `S` - 6 edges
7. `getEffectiveThemeStyles()` - 6 edges
8. `getModifierKey()` - 6 edges
9. `getDomain()` - 6 edges
10. `NavigationBar()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `NavigationBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts
- `QuickDialProps` --references--> `Bookmark`  [EXTRACTED]
  src/components/QuickDial.tsx → src/types.ts
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `NavigationBarProps` --references--> `SearchEngine`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (10 total, 3 thin omitted)

### Community 0 - "NavigationBar.tsx"
Cohesion: 0.17
Nodes (22): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, TabBarProps, WebViewportProps, ArrowLeftIcon() (+14 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.14
Nodes (28): NavigationBar(), TabBar(), WebViewport(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs() (+20 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.14
Nodes (20): NavigationBarProps, QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES (+12 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

## Knowledge Gaps
- **47 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `NavigationBar.tsx` to `index.tsx`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Tab` connect `NavigationBar.tsx` to `index.tsx`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13548387096774195 - nodes in this community are weakly interconnected._
- **Should `SettingsPanel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._