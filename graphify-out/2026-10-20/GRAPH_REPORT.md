# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 27 files · ~34,041 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 233 nodes · 602 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae0f9554`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
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
- addHistoryItem
- openInWebviewWindow
- getModifierKey

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 24 edges
2. `getDomain()` - 20 edges
3. `invoke()` - 14 edges
4. `getModifierKey()` - 12 edges
5. `Tab` - 12 edges
6. `ProjectWorkspace` - 11 edges
7. `WebViewport()` - 11 edges
8. `SettingsPanel()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `[history, setHistory]` --calls--> `getSavedHistory()`  [EXTRACTED]
  src/index.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `WebBrowserPanel()` --calls--> `routeTab()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (38): ContextCapsuleBarProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickTabSwitcherProps, TabBarProps (+30 more)

### Community 1 - "WebViewport.tsx"
Cohesion: 0.38
Nodes (9): WebViewport(), addUserRestrictedDomain(), closeTabWebview(), getDomain(), getIframeEmbedUrl(), getUserRestrictedDomains(), isKnownFrameRestricted(), removeUserRestrictedDomain() (+1 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (12): COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DOCKED_WEBVIEW_PREFIX, getCurrentWindowLabel(), getDockedWebviewEntry(), hideDockedWebview, KNOWN_FRAME_RESTRICTED_DOMAINS (+4 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (35): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), CompactIcon(), IncognitoIcon(), ShieldIcon(), SparklesIcon() (+27 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.16
Nodes (22): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), initialTabsState, initRestoredTabs(), lastAssignedActiveTime, [tabs, setTabs] (+14 more)

### Community 12 - "types.ts"
Cohesion: 0.16
Nodes (14): ContextOrbitDeckProps, QuickDialProps, WebViewportProps, Bookmark, HistoryItem, MainPanelProps, NavDesignMode, OrbitLayoutMode (+6 more)

### Community 13 - "invoke"
Cohesion: 0.40
Nodes (6): closeAllDockedWebviews(), hideAllDockedWebviews(), hideTabWebview(), invoke(), restoreMainWebviewFocus(), showDockedWebview()

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 16 - "openInWebviewWindow"
Cohesion: 0.67
Nodes (4): getDomainSlug(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

### Community 17 - "getModifierKey"
Cohesion: 0.36
Nodes (8): ContextCapsuleBar(), NavigationBar(), QuickTabSwitcher(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `WebViewport.tsx` to `ContextCapsuleBar.tsx`, `utils.ts`, `SettingsPanel.tsx`, `index.tsx`, `addHistoryItem`, `openInWebviewWindow`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `WebViewport.tsx`, `index.tsx`, `types.ts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `ContextCapsuleBar.tsx` to `utils.ts`, `index.tsx`, `types.ts`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11224489795918367 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11052631578947368 - nodes in this community are weakly interconnected._