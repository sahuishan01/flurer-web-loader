# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 19 files · ~8,597 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 131 nodes · 243 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `baf0f263`
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
- types.ts
- TabBar.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 10 edges
2. `WebBrowserPanel()` - 9 edges
3. `getDomain()` - 7 edges
4. `openInWebviewWindow()` - 7 edges
5. `S` - 6 edges
6. `getModifierKey()` - 6 edges
7. `getPlatformEngineName()` - 6 edges
8. `getEffectiveThemeStyles()` - 6 edges
9. `NavigationBar()` - 5 edges
10. `WebViewport()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `TabBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/TabBar.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `NavigationBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `NavigationBar()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts
- `NavigationBar()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/components/NavigationBar.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.27
Nodes (8): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, ExternalIcon(), S

### Community 1 - "NavigationBar.tsx"
Cohesion: 0.31
Nodes (9): NavigationBarProps, ArrowLeftIcon(), ArrowRightIcon(), HomeIcon(), LockIcon(), NewTabIcon(), PopoutIcon(), ReloadIcon() (+1 more)

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
Cohesion: 0.23
Nodes (14): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES, PresetDef (+6 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "types.ts"
Cohesion: 0.25
Nodes (7): Bookmark, HistoryItem, MainPanelProps, SearchEngine, SettingsPanelProps, Tab, WebPluginSettings

### Community 12 - "TabBar.tsx"
Cohesion: 0.33
Nodes (5): TabBar(), TabBarProps, CloseIcon(), GlobeIcon(), PlusIcon()

## Knowledge Gaps
- **51 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `version`, `private` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14482758620689656 - nodes in this community are weakly interconnected._