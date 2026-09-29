# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 19 files · ~8,123 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 130 nodes · 244 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60a9c0e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WebViewport.tsx
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
4. `getDomain()` - 7 edges
5. `openInWebviewWindow()` - 7 edges
6. `S` - 6 edges
7. `getEffectiveThemeStyles()` - 6 edges
8. `Bookmark` - 6 edges
9. `getModifierKey()` - 6 edges
10. `getPlatformEngineName()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `NavigationBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/types.ts
- `TabBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/TabBar.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/theme.ts

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.17
Nodes (17): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, TabBar(), TabBarProps, WebViewportProps (+9 more)

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
Cohesion: 0.14
Nodes (27): NavigationBar(), WebViewport(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs] (+19 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.21
Nodes (15): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES, PresetDef (+7 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

## Knowledge Gaps
- **48 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tab` connect `WebViewport.tsx` to `NavigationBar.tsx`, `index.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14482758620689656 - nodes in this community are weakly interconnected._