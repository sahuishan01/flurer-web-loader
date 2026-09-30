# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 19 files · ~11,915 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 154 nodes · 328 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `897ed45c`
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
- utils.ts
- TabBar.tsx
- types.ts

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 12 edges
2. `WebViewport()` - 10 edges
3. `getDomain()` - 10 edges
4. `compilerOptions` - 10 edges
5. `invoke()` - 9 edges
6. `openInWebviewWindow()` - 9 edges
7. `Tab` - 7 edges
8. `SettingsPanel()` - 7 edges
9. `getModifierKey()` - 6 edges
10. `getPlatformEngineName()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `WebBrowserPanel()` --calls--> `clearHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `openInExternalBrowser()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "WebViewport.tsx"
Cohesion: 0.22
Nodes (12): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, ExternalIcon(), HistoryIcon() (+4 more)

### Community 1 - "NavigationBar.tsx"
Cohesion: 0.27
Nodes (10): ArrowLeftIcon(), ArrowRightIcon(), HomeIcon(), IncognitoIcon(), LockIcon(), PopoutIcon(), ReloadIcon(), ShieldIcon() (+2 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.17
Nodes (19): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs] (+11 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.17
Nodes (18): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES, PresetDef (+10 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.17
Nodes (24): NavigationBar(), WebViewport(), closeDockedWebview(), createDockedWebview(), DOCKED_WEBVIEW_LABEL, getDomain(), getDomainSlug(), getIframeEmbedUrl() (+16 more)

### Community 12 - "TabBar.tsx"
Cohesion: 0.38
Nodes (5): TabBarProps, CloseIcon(), GlobeIcon(), S, Tab

### Community 13 - "types.ts"
Cohesion: 0.33
Nodes (5): NavigationBarProps, MainPanelProps, SearchEngine, SettingsPanelProps, WebPluginSettings

## Knowledge Gaps
- **49 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `WebViewport.tsx` to `utils.ts`, `index.tsx`, `types.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `HistoryItem` connect `WebViewport.tsx` to `utils.ts`, `index.tsx`, `types.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._