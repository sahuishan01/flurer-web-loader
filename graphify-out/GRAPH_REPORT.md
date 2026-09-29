# Graph Report - flurer-web-loader-plugin  (2026-09-29)

## Corpus Check
- 19 files · ~10,855 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 147 nodes · 306 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6d27bb97`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NavigationBar.tsx
- WebViewport.tsx
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
- QuickDial.tsx
- getModifierKey
- TabBar.tsx
- addHistoryItem
- getDomain
- openInWebviewWindow

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 12 edges
2. `compilerOptions` - 10 edges
3. `getDomain()` - 9 edges
4. `openInWebviewWindow()` - 9 edges
5. `Tab` - 8 edges
6. `SettingsPanel()` - 7 edges
7. `Bookmark` - 7 edges
8. `HistoryItem` - 7 edges
9. `S` - 6 edges
10. `getEffectiveThemeStyles()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `getEffectiveThemeStyles()`  [EXTRACTED]
  src/index.tsx → src/theme.ts
- `WebBrowserPanel()` --calls--> `addHistoryItem()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "NavigationBar.tsx"
Cohesion: 0.23
Nodes (12): ArrowLeftIcon(), ArrowRightIcon(), ExternalIcon(), HistoryIcon(), HomeIcon(), IncognitoIcon(), LockIcon(), PopoutIcon() (+4 more)

### Community 1 - "WebViewport.tsx"
Cohesion: 0.33
Nodes (9): NavigationBarProps, QuickDialProps, WebViewportProps, Bookmark, HistoryItem, SearchEngine, SettingsPanelProps, Tab (+1 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.21
Nodes (14): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel(), MainPanelProps (+6 more)

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
Cohesion: 0.25
Nodes (6): CHROME_DESKTOP_USER_AGENT, DEFAULT_DESKTOP_USER_AGENT, KNOWN_FRAME_RESTRICTED_DOMAINS, Platform, WebviewWindowLaunchOptions, Window

### Community 12 - "QuickDial.tsx"
Cohesion: 0.29
Nodes (6): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), NewTabIcon(), PlusIcon()

### Community 13 - "getModifierKey"
Cohesion: 0.40
Nodes (6): NavigationBar(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 14 - "TabBar.tsx"
Cohesion: 0.40
Nodes (4): TabBarProps, CloseIcon(), GlobeIcon(), S

### Community 15 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 16 - "getDomain"
Cohesion: 0.67
Nodes (4): WebViewport(), getDomain(), getDomainSlug(), isKnownFrameRestricted()

### Community 17 - "openInWebviewWindow"
Cohesion: 0.83
Nodes (4): invoke(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

## Knowledge Gaps
- **47 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bookmark` connect `WebViewport.tsx` to `utils.ts`, `QuickDial.tsx`, `index.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `HistoryItem` connect `WebViewport.tsx` to `utils.ts`, `QuickDial.tsx`, `index.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._