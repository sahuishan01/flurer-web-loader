# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 28 files · ~37,942 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 252 nodes · 666 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f3059448`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
- smartRouter.ts
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
- WebViewport.tsx
- Project Guidelines & Invariants (GEMINI.md)
- invoke
- addHistoryItem

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 27 edges
2. `getDomain()` - 22 edges
3. `SettingsPanel()` - 16 edges
4. `Tab` - 14 edges
5. `invoke()` - 14 edges
6. `ProjectWorkspace` - 12 edges
7. `getModifierKey()` - 12 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `downloadAndSetupLayaOffline()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/smartRouter.ts
- `SettingsPanel()` --calls--> `isLayaOfflineDownloaded()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.12
Nodes (36): ContextCapsuleBar(), NavigationBar(), QuickTabSwitcher(), WebsiteIcon(), WebsiteIconProps, [draggedTabId, setDraggedTabId], [draggedWorkspaceId, setDraggedWorkspaceId], TAB_DRAG_MIME (+28 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.32
Nodes (12): ContextOrbitDeck(), classifyHeuristic(), DEFAULT_WORKSPACES, downloadAndSetupLayaOffline(), getLayaOfflineMetadata(), isLayaOfflineDownloaded(), RouteDecision, routeTab() (+4 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.11
Nodes (16): COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DEFAULT_DESKTOP_USER_AGENT, DOCKED_WEBVIEW_PREFIX, getCurrentWindowLabel(), getDomainSlug(), hideDockedWebview (+8 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (35): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), KeyboardIcon(), ShieldIcon(), DEFAULT_SHORTCUTS, eventToShortcutString() (+27 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.15
Nodes (23): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), initialTabsState, initRestoredTabs(), lastAssignedActiveTime (+15 more)

### Community 12 - "types.ts"
Cohesion: 0.10
Nodes (27): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps (+19 more)

### Community 13 - "WebViewport.tsx"
Cohesion: 0.39
Nodes (8): WebViewport(), addUserRestrictedDomain(), closeTabWebview(), getIframeEmbedUrl(), getUserRestrictedDomains(), isKnownFrameRestricted(), removeUserRestrictedDomain(), updateDockedWebviewBounds()

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "invoke"
Cohesion: 0.25
Nodes (9): clearAllBrowsingData(), closeAllDockedWebviews(), hideAllDockedWebviews(), hideTabWebview(), invoke(), queryDockedWebviewUrl(), restoreMainWebviewFocus(), setDockedWebviewZoom() (+1 more)

### Community 16 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

## Knowledge Gaps
- **61 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `smartRouter.ts` to `ContextCapsuleBar.tsx`, `utils.ts`, `index.tsx`, `WebViewport.tsx`, `addHistoryItem`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `WebViewport.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `ContextCapsuleBar.tsx`, `smartRouter.ts`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12367149758454106 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10869565217391304 - nodes in this community are weakly interconnected._