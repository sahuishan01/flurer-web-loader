# Graph Report - flurer-web-loader-plugin  (2026-10-20)

## Corpus Check
- 27 files · ~34,061 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 234 nodes · 614 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae0f9554`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
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
1. `WebBrowserPanel()` - 25 edges
2. `getDomain()` - 20 edges
3. `Tab` - 14 edges
4. `invoke()` - 14 edges
5. `ProjectWorkspace` - 12 edges
6. `getModifierKey()` - 12 edges
7. `SettingsPanel()` - 11 edges
8. `WebViewport()` - 11 edges
9. `routeTab()` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ContextCapsuleBar()` --calls--> `tabMatchesWorkspace()`  [EXTRACTED]
  src/components/ContextCapsuleBar.tsx → src/utils.ts
- `ContextOrbitDeck()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `clearHistory()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/utils.ts
- `TabBar()` --calls--> `getModifierKey()`  [EXTRACTED]
  src/components/TabBar.tsx → src/utils.ts
- `WebViewport()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/WebViewport.tsx → src/utils.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.11
Nodes (40): ContextCapsuleBar(), NavigationBar(), DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickTabSwitcher(), WebsiteIcon(), WebsiteIconProps (+32 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "utils.ts"
Cohesion: 0.10
Nodes (31): QuickDial(), WebViewport(), addUserRestrictedDomain(), closeAllDockedWebviews(), closeTabWebview(), COMMON_DOMAIN_SHORTCUTS, createDockedWebview(), createOrShowDockedWebview() (+23 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.11
Nodes (34): ContextOrbitDeck(), QUICK_ACCENTS, QUICK_PANELS, SettingsPanel(), BranchIcon(), IncognitoIcon(), ShieldIcon(), SparklesIcon() (+26 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "index.tsx"
Cohesion: 0.13
Nodes (29): TabBar(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), getMonotonicTimestamp(), [history, setHistory], initialTabsState, initRestoredTabs() (+21 more)

### Community 12 - "types.ts"
Cohesion: 0.15
Nodes (20): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, QuickDialProps, QuickTabSwitcherProps, TabBarProps, WebViewportProps, Bookmark (+12 more)

### Community 14 - "Project Guidelines & Invariants (GEMINI.md)"
Cohesion: 0.33
Nodes (5): 1. Automatic Version Bumping & Release Workflow, 2. Architecture & Runtime Invariants, 3. Secret & Instruction Handling, Project Guidelines & Invariants (GEMINI.md), Release Steps:

## Knowledge Gaps
- **60 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDomain()` connect `SettingsPanel.tsx` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Tab` connect `types.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `ProjectWorkspace` connect `types.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `utils.ts`, `SettingsPanel.tsx`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10901960784313726 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09615384615384616 - nodes in this community are weakly interconnected._