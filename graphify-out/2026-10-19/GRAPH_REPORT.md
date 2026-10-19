# Graph Report - flurer-web-loader-plugin  (2026-10-19)

## Corpus Check
- 26 files · ~30,786 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 225 nodes · 579 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1825e0a`
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
- getModifierKey
- Project Guidelines & Invariants (GEMINI.md)
- openInWebviewWindow
- addHistoryItem
- smartRouter.ts

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 22 edges
2. `getDomain()` - 20 edges
3. `invoke()` - 13 edges
4. `Tab` - 12 edges
5. `getModifierKey()` - 12 edges
6. `WebViewport()` - 11 edges
7. `SettingsPanel()` - 11 edges
8. `ProjectWorkspace` - 10 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `RouteDecision` --references--> `TabIntent`  [EXTRACTED]
  src/smartRouter.ts → src/types.ts
- `WebsiteIcon()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebsiteIcon.tsx → src/utils.ts
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebViewport()` --calls--> `getPlatformEngineName()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts
- `WebBrowserPanel()` --calls--> `closeTabWebview()`  [EXTRACTED]
  src/index.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.12
Nodes (34): ContextCapsuleBarProps, DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), TabBarProps, WebsiteIcon(), WebsiteIconProps (+26 more)

### Community 1 - "WebViewport.tsx"
Cohesion: 0.21
Nodes (16): WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), createDockedWebview(), createOrShowDockedWebview(), getCurrentWindowLabel(), getIframeEmbedUrl() (+8 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (12): DEFAULT_WORKSPACES, CHROME_DESKTOP_USER_AGENT, COMMON_DOMAIN_SHORTCUTS, DEFAULT_DESKTOP_USER_AGENT, DOCKED_WEBVIEW_PREFIX, getDockedWebviewEntry(), hideDockedWebview, KNOWN_FRAME_RESTRICTED_DOMAINS (+4 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.17
Nodes (19): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), IncognitoIcon(), ShieldIcon(), clearLayaOfflineStorage(), getEffectiveThemeStyles(), getSavedThemeConfig() (+11 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.18
Nodes (19): [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), initialTabsState, initRestoredTabs(), [tabs, setTabs], WebBrowserPanel(), closeDockedWebview (+11 more)

### Community 12 - "types.ts"
Cohesion: 0.15
Nodes (19): ContextOrbitDeckProps, NavigationBarProps, QuickDialProps, QuickTabSwitcher(), QuickTabSwitcherProps, WebViewportProps, Bookmark, HistoryItem (+11 more)

### Community 13 - "getModifierKey"
Cohesion: 0.43
Nodes (7): ContextCapsuleBar(), NavigationBar(), TabBar(), getModifierKey(), getPlatform(), getPlatformEngineName(), normalizeUrl()

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

### Community 15 - "openInWebviewWindow"
Cohesion: 0.67
Nodes (4): getDomainSlug(), openInExternalBrowser(), openInWebviewWindow(), sanitizeUrl()

### Community 16 - "addHistoryItem"
Cohesion: 0.50
Nodes (5): [history, setHistory], addHistoryItem(), getSavedHistory(), removeHistoryItem(), saveHistory()

### Community 17 - "smartRouter.ts"
Cohesion: 0.36
Nodes (11): ContextOrbitDeck(), classifyHeuristic(), downloadAndSetupLayaOffline(), getLayaOfflineMetadata(), isLayaOfflineDownloaded(), RouteDecision, routeTab(), routeViaLayaOffline() (+3 more)

## Knowledge Gaps
- **59 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `smartRouter.ts` to `ContextCapsuleBar.tsx`, `WebViewport.tsx`, `utils.ts`, `index.tsx`, `types.ts`, `openInWebviewWindow`, `addHistoryItem`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `ContextCapsuleBar.tsx`, `WebViewport.tsx`, `index.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Bookmark` connect `types.ts` to `ContextCapsuleBar.tsx`, `WebViewport.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12070874861572536 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._