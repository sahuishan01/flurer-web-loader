# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 19 files · ~12,729 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 155 nodes · 331 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0bf4649f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NavigationBar.tsx
- getModifierKey
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
- WebViewport.tsx
- addHistoryItem
- getDomain
- QuickDial.tsx
- TabBar.tsx

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 14 edges
2. `getDomain()` - 10 edges
3. `compilerOptions` - 10 edges
4. `invoke()` - 9 edges
5. `openInWebviewWindow()` - 9 edges
6. `WebViewport()` - 9 edges
7. `closeDockedWebview()` - 7 edges
8. `SettingsPanel()` - 7 edges
9. `S` - 6 edges
10. `Bookmark` - 6 edges

## Surprising Connections (you probably didn't know these)
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `WebBrowserPanel()` --calls--> `addHistoryItem()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `clearHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `closeDockedWebview()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "NavigationBar.tsx"
Cohesion: 0.23
Nodes (12): NavigationBarProps, ArrowLeftIcon(), ArrowRightIcon(), ExternalIcon(), HomeIcon(), IncognitoIcon(), LockIcon(), PopoutIcon() (+4 more)

### Community 1 - "getModifierKey"
Cohesion: 0.40
Nodes (6): NavigationBar(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.23
Nodes (13): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel(), getSavedActiveTab() (+5 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.20
Nodes (16): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), getEffectiveThemeStyles(), getSavedThemeConfig(), hexToRgb(), PRESET_THEMES, PresetDef (+8 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.18
Nodes (16): CHROME_DESKTOP_USER_AGENT, createDockedWebview(), DEFAULT_DESKTOP_USER_AGENT, DOCKED_WEBVIEW_PREFIX, getDomainSlug(), invoke(), KNOWN_FRAME_RESTRICTED_DOMAINS, openInExternalBrowser() (+8 more)

### Community 12 - "WebViewport.tsx"
Cohesion: 0.33
Nodes (8): WebViewportProps, Bookmark, HistoryItem, MainPanelProps, SearchEngine, SettingsPanelProps, Tab, WebPluginSettings

### Community 13 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 14 - "getDomain"
Cohesion: 0.47
Nodes (6): WebViewport(), closeDockedWebview(), getDomain(), getIframeEmbedUrl(), hideDockedWebview(), isKnownFrameRestricted()

### Community 15 - "QuickDial.tsx"
Cohesion: 0.25
Nodes (7): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, HistoryIcon(), NewTabIcon()

### Community 16 - "TabBar.tsx"
Cohesion: 0.33
Nodes (5): TabBarProps, CloseIcon(), GlobeIcon(), PlusIcon(), S

## Knowledge Gaps
- **51 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `WebViewport.tsx` to `utils.ts`, `index.tsx`, `QuickDial.tsx`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._