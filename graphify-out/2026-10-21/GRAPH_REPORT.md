# Graph Report - flurer-web-loader-plugin  (2026-10-21)

## Corpus Check
- 28 files · ~39,185 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 254 nodes · 669 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a42d7ff9`
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
1. `WebBrowserPanel()` - 28 edges
2. `getDomain()` - 22 edges
3. `SettingsPanel()` - 16 edges
4. `Tab` - 14 edges
5. `invoke()` - 13 edges
6. `ProjectWorkspace` - 12 edges
7. `getModifierKey()` - 12 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeckProps` --references--> `ProjectWorkspace`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/types.ts
- `ContextOrbitDeckProps` --references--> `Tab`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/types.ts
- `ContextOrbitDeck()` --calls--> `routeTab()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/smartRouter.ts

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

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
Cohesion: 0.11
Nodes (35): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), DEFAULT_SHORTCUTS, eventToShortcutString(), findShortcutConflict(), formatShortcutParts() (+27 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.17
Nodes (21): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), initialTabsState, initRestoredTabs(), lastAssignedActiveTime, [tabs, setTabs] (+13 more)

### Community 12 - "types.ts"
Cohesion: 0.11
Nodes (21): ContextOrbitDeckProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, HistoryIcon() (+13 more)

### Community 13 - "WebViewport.tsx"
Cohesion: 0.26
Nodes (13): ContextCapsuleBar(), TabBar(), WebViewport(), addUserRestrictedDomain(), closeTabWebview(), getDomain(), getIframeEmbedUrl(), getPlatformEngineName() (+5 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "invoke"
Cohesion: 0.27
Nodes (10): closeAllDockedWebviews(), getDomainSlug(), hideAllDockedWebviews(), hideTabWebview(), invoke(), openInExternalBrowser(), openInWebviewWindow(), restoreMainWebviewFocus() (+2 more)

### Community 16 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

## Knowledge Gaps
- **62 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `WebViewport.tsx` to `ContextCapsuleBar.tsx`, `smartRouter.ts`, `utils.ts`, `SettingsPanel.tsx`, `index.tsx`, `invoke`, `addHistoryItem`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Tab` connect `ContextCapsuleBar.tsx` to `index.tsx`, `types.ts`, `WebViewport.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `ContextCapsuleBar.tsx` to `smartRouter.ts`, `index.tsx`, `types.ts`, `utils.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10784313725490197 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._