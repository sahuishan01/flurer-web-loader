# Graph Report - flurer-web-loader-plugin  (2026-10-21)

## Corpus Check
- 28 files · ~40,206 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 664 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f8b17c7`
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
- Project Guidelines & Invariants (GEMINI.md)

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 29 edges
2. `getDomain()` - 21 edges
3. `SettingsPanel()` - 16 edges
4. `invoke()` - 13 edges
5. `getModifierKey()` - 12 edges
6. `Tab` - 11 edges
7. `WebViewport()` - 11 edges
8. `routeTab()` - 10 edges
9. `compilerOptions` - 10 edges
10. `openInWebviewWindow()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.10
Nodes (43): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBar(), NavigationBarProps, QuickTabSwitcher(), QuickTabSwitcherProps, TabBarProps, WebsiteIcon() (+35 more)

### Community 1 - "smartRouter.ts"
Cohesion: 0.22
Nodes (14): ContextOrbitDeck(), classifyHeuristic(), DEFAULT_WORKSPACES, downloadAndSetupLayaOffline(), getLayaOfflineMetadata(), INTENT_COLORS, INTENT_LABELS, isLayaOfflineDownloaded() (+6 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (34): ContextCapsuleBar(), WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview() (+26 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.10
Nodes (35): QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), DEFAULT_SHORTCUTS, eventToShortcutString(), findShortcutConflict(), formatShortcutParts(), getEffectiveShortcuts() (+27 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.13
Nodes (30): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs() (+22 more)

### Community 12 - "types.ts"
Cohesion: 0.13
Nodes (18): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, HistoryIcon(), NewTabIcon() (+10 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **65 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `utils.ts` to `ContextCapsuleBar.tsx`, `smartRouter.ts`, `index.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `WebBrowserPanel()` connect `index.tsx` to `smartRouter.ts`, `utils.ts`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `SettingsPanel()` connect `SettingsPanel.tsx` to `smartRouter.ts`, `index.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10087082728592163 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09634551495016612 - nodes in this community are weakly interconnected._