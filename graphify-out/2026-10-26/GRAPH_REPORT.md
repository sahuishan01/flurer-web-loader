# Graph Report - flurer-web-loader-plugin  (2026-10-21)

## Corpus Check
- 29 files · ~43,827 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 267 nodes · 733 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2699049`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- getDomain
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
- WebViewport.tsx
- types.ts
- Project Guidelines & Invariants (GEMINI.md)
- invoke
- createNewTab
- addHistoryItem
- openInWebviewWindow

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 34 edges
2. `getDomain()` - 24 edges
3. `SettingsPanel()` - 16 edges
4. `ProjectWorkspace` - 14 edges
5. `Tab` - 14 edges
6. `getModifierKey()` - 14 edges
7. `invoke()` - 13 edges
8. `WebViewport()` - 11 edges
9. `GlobeIcon()` - 10 edges
10. `routeTab()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `HistoryModalProps` --references--> `HistoryItem`  [EXTRACTED]
  src/components/HistoryModal.tsx → src/types.ts
- `HistoryModal()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/HistoryModal.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `downloadAndSetupLayaOffline()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (19 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.12
Nodes (40): ContextCapsuleBar(), formatRelativeTime(), HistoryModal(), NavigationBar(), QuickTabSwitcher(), TabBar(), WebsiteIcon(), WebsiteIconProps (+32 more)

### Community 1 - "getDomain"
Cohesion: 0.42
Nodes (10): ContextOrbitDeck(), classifyHeuristic(), downloadAndSetupLayaOffline(), isLayaOfflineDownloaded(), RouteDecision, routeTab(), routeViaLayaOffline(), routeViaOpenAiCompatible() (+2 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (15): addUserRestrictedDomain(), COMMON_DOMAIN_SHORTCUTS, DOCKED_WEBVIEW_PREFIX, DockedWebviewInfo, getUserRestrictedDomains(), hideDockedWebview, isKnownFrameRestricted(), KNOWN_FRAME_RESTRICTED_DOMAINS (+7 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.09
Nodes (37): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), KeyboardIcon(), ShieldIcon(), DEFAULT_SHORTCUTS, eventToShortcutString() (+29 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.17
Nodes (23): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], [closedTabs, setClosedTabs], initialTabsState, lastAssignedActiveTime, [tabs, setTabs], WebBrowserPanel(), matchesAction() (+15 more)

### Community 12 - "WebViewport.tsx"
Cohesion: 0.29
Nodes (10): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, NewTabIcon(), S (+2 more)

### Community 13 - "types.ts"
Cohesion: 0.16
Nodes (18): ContextCapsuleBarProps, ContextOrbitDeckProps, HistoryModalProps, NavigationBarProps, QuickTabSwitcherProps, TabBarProps, ClosedTabRecord, MainPanelProps (+10 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "invoke"
Cohesion: 0.17
Nodes (15): WebViewport(), clearAllBrowsingData(), closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview(), getCurrentWindowLabel(), getIframeEmbedUrl() (+7 more)

### Community 16 - "createNewTab"
Cohesion: 0.38
Nodes (7): createNewTab(), getMonotonicTimestamp(), initRestoredTabs(), deriveTabTitle(), getSavedActiveTab(), getSavedTabs(), getSavedWorkspaces()

### Community 17 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 18 - "openInWebviewWindow"
Cohesion: 0.50
Nodes (5): getDomainSlug(), getPlatform(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `getDomain` to `ContextCapsuleBar.tsx`, `utils.ts`, `index.tsx`, `WebViewport.tsx`, `invoke`, `addHistoryItem`, `openInWebviewWindow`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `ContextCapsuleBar.tsx`, `getDomain`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `WebViewport.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11510204081632654 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._