# Graph Report - flurer-web-loader-plugin  (2026-10-21)

## Corpus Check
- 28 files · ~39,469 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 254 nodes · 665 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `28f6b3f1`
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
- openInWebviewWindow

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 28 edges
2. `getDomain()` - 22 edges
3. `SettingsPanel()` - 16 edges
4. `Tab` - 13 edges
5. `invoke()` - 13 edges
6. `ProjectWorkspace` - 12 edges
7. `getModifierKey()` - 12 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPanel()` --calls--> `routeTab()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/smartRouter.ts
- `WebViewport()` --calls--> `createOrShowDockedWebview()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `hideAllDockedWebviews()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `createNewTab()` --calls--> `classifyHeuristic()`  [EXTRACTED]
  src/index.tsx → src/smartRouter.ts
- `createNewTab()` --calls--> `getDomain()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (42): ContextCapsuleBarProps, NavigationBar(), NavigationBarProps, QuickTabSwitcher(), QuickTabSwitcherProps, TabBarProps, WebsiteIcon(), WebsiteIconProps (+34 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.29
Nodes (10): classifyHeuristic(), DEFAULT_WORKSPACES, getLayaOfflineMetadata(), INTENT_COLORS, INTENT_LABELS, RouteDecision, routeTab(), routeViaLayaOffline() (+2 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.09
Nodes (16): CHROME_DESKTOP_USER_AGENT, COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview(), DEFAULT_DESKTOP_USER_AGENT, DOCKED_WEBVIEW_PREFIX, DockedWebviewInfo, getCurrentWindowLabel() (+8 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (36): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), DEFAULT_SHORTCUTS, eventToShortcutString(), findShortcutConflict(), formatShortcutParts() (+28 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.16
Nodes (22): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), initialTabsState, initRestoredTabs(), lastAssignedActiveTime (+14 more)

### Community 12 - "types.ts"
Cohesion: 0.12
Nodes (19): ContextOrbitDeckProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, HistoryIcon(), NewTabIcon() (+11 more)

### Community 13 - "WebViewport.tsx"
Cohesion: 0.28
Nodes (12): ContextCapsuleBar(), WebViewport(), WebViewportProps, addUserRestrictedDomain(), closeTabWebview(), getDomain(), getIframeEmbedUrl(), getPlatformEngineName() (+4 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "invoke"
Cohesion: 0.33
Nodes (7): closeAllDockedWebviews(), hideAllDockedWebviews(), hideTabWebview(), invoke(), restoreMainWebviewFocus(), setDockedWebviewZoom(), showDockedWebview()

### Community 16 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 17 - "openInWebviewWindow"
Cohesion: 0.67
Nodes (4): getDomainSlug(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

## Knowledge Gaps
- **64 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `WebViewport.tsx` to `ContextCapsuleBar.tsx`, `smartRouter.ts`, `utils.ts`, `SettingsPanel.tsx`, `index.tsx`, `addHistoryItem`, `openInWebviewWindow`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `ContextCapsuleBar.tsx` to `smartRouter.ts`, `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `WebViewport.tsx`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10784313725490197 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._