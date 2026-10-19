# Graph Report - flurer-web-loader-plugin  (2026-10-19)

## Corpus Check
- 25 files · ~29,861 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 221 nodes · 565 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `69c7f5a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextOrbitDeck.tsx
- WebViewport.tsx
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
- invoke
- Project Guidelines & Invariants (GEMINI.md)
- openInWebviewWindow
- initRestoredTabs

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 22 edges
2. `getDomain()` - 18 edges
3. `Tab` - 14 edges
4. `invoke()` - 13 edges
5. `ProjectWorkspace` - 12 edges
6. `getModifierKey()` - 12 edges
7. `SettingsPanel()` - 11 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `clearAllBrowsingData()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `clearHistory()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/utils.ts
- `WebViewportProps` --references--> `Tab`  [EXTRACTED]
  src/components/WebViewport.tsx → src/types.ts
- `WebViewport()` --calls--> `createOrShowDockedWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "ContextOrbitDeck.tsx"
Cohesion: 0.12
Nodes (36): ContextCapsuleBar(), NavigationBar(), DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickTabSwitcher(), TabBar() (+28 more)

### Community 1 - "WebViewport.tsx"
Cohesion: 0.25
Nodes (13): QuickDialProps, WebViewport(), WebViewportProps, Bookmark, HistoryItem, addUserRestrictedDomain(), closeTabWebview(), getIframeEmbedUrl() (+5 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.12
Nodes (11): COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DOCKED_WEBVIEW_PREFIX, getCurrentWindowLabel(), hideDockedWebview, KNOWN_FRAME_RESTRICTED_DOMAINS, Platform (+3 more)

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
Cohesion: 0.16
Nodes (21): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, [tabs, setTabs], WebBrowserPanel(), addHistoryItem() (+13 more)

### Community 12 - "types.ts"
Cohesion: 0.18
Nodes (16): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, QuickTabSwitcherProps, TabBarProps, MainPanelProps, NavDesignMode, OrbitLayoutMode (+8 more)

### Community 13 - "invoke"
Cohesion: 0.29
Nodes (7): clearAllBrowsingData(), closeAllDockedWebviews(), hideTabWebview(), invoke(), queryDockedWebviewUrl(), setDockedWebviewZoom(), showDockedWebview()

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "openInWebviewWindow"
Cohesion: 0.50
Nodes (5): getDomainSlug(), getPlatform(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

### Community 16 - "initRestoredTabs"
Cohesion: 0.67
Nodes (3): initRestoredTabs(), getSavedActiveTab(), getSavedTabs()

## Knowledge Gaps
- **56 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `SettingsPanel.tsx` to `ContextOrbitDeck.tsx`, `WebViewport.tsx`, `utils.ts`, `index.tsx`, `types.ts`, `openInWebviewWindow`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `ContextOrbitDeck.tsx`, `WebViewport.tsx`, `index.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `ContextOrbitDeck.tsx`, `index.tsx`, `utils.ts`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextOrbitDeck.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11945031712473574 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11695906432748537 - nodes in this community are weakly interconnected._