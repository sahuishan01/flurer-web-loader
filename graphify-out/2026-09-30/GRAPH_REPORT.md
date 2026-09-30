# Graph Report - flurer-web-loader-plugin  (2026-09-30)

## Corpus Check
- 22 files · ~21,798 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 186 nodes · 472 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0bf4649f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ContextCapsuleBar.tsx
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
- types.ts
- QuickDial.tsx

## God Nodes (most connected - your core abstractions)
1. `WebBrowserPanel()` - 17 edges
2. `getDomain()` - 16 edges
3. `Tab` - 12 edges
4. `getModifierKey()` - 10 edges
5. `compilerOptions` - 10 edges
6. `WebViewport()` - 9 edges
7. `invoke()` - 9 edges
8. `openInWebviewWindow()` - 9 edges
9. `S` - 8 edges
10. `ProjectWorkspace` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ContextOrbitDeck()` --calls--> `getDomain()`  [EXTRACTED]
  src/components/ContextOrbitDeck.tsx → src/utils.ts
- `SettingsPanel()` --calls--> `saveThemeConfig()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/theme.ts
- `SettingsPanel()` --calls--> `clearAllBrowsingData()`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/utils.ts
- `TabBarProps` --references--> `Tab`  [EXTRACTED]
  src/components/TabBar.tsx → src/types.ts
- `WebViewportProps` --references--> `Tab`  [EXTRACTED]
  src/components/WebViewport.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "ContextCapsuleBar.tsx"
Cohesion: 0.15
Nodes (30): ContextCapsuleBar(), ContextOrbitDeck(), NavigationBar(), TabBar(), ArrowLeftIcon(), ArrowRightIcon(), BranchIcon(), CloseIcon() (+22 more)

### Community 2 - "compilerOptions"
Cohesion: 0.15
Nodes (12): src, compilerOptions, esModuleInterop, jsx, jsxImportSource, module, moduleResolution, outDir (+4 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, solid-js, @tauri-apps/api, typescript, vite, vite-plugin-solid, name, private (+11 more)

### Community 4 - "index.tsx"
Cohesion: 0.15
Nodes (26): SettingsPanel(), [activeTabId, setActiveTabId], [bookmarks, setBookmarks], createNewTab(), [history, setHistory], initialTabsState, initRestoredTabs(), [tabs, setTabs] (+18 more)

### Community 5 - "SettingsPanel.tsx"
Cohesion: 0.16
Nodes (15): QUICK_ACCENTS, QUICK_PANELS, IncognitoIcon(), ShieldIcon(), getSavedThemeConfig(), PRESET_THEMES, PresetDef, PresetThemeId (+7 more)

### Community 6 - "Flurer Web Loader Plugin (`web-loader`)"
Cohesion: 0.50
Nodes (3): Building, Features, Flurer Web Loader Plugin (`web-loader`)

### Community 7 - "sync-version.cjs"
Cohesion: 0.33
Nodes (5): fs, path, pkg, plugin, pluginPath

### Community 11 - "utils.ts"
Cohesion: 0.18
Nodes (20): WebViewport(), clearAllBrowsingData(), closeDockedWebview(), createDockedWebview(), DOCKED_WEBVIEW_PREFIX, getDomain(), getDomainSlug(), getIframeEmbedUrl() (+12 more)

### Community 12 - "types.ts"
Cohesion: 0.16
Nodes (17): ContextCapsuleBarProps, ContextOrbitDeckProps, NavigationBarProps, TabBarProps, DEFAULT_WORKSPACES, RouteDecision, MainPanelProps, NavDesignMode (+9 more)

### Community 15 - "QuickDial.tsx"
Cohesion: 0.21
Nodes (11): DEFAULT_AI_TARGETS, DEFAULT_DEV_TARGETS, DEFAULT_DOC_TARGETS, QuickDial(), QuickDialProps, WebViewportProps, HistoryIcon(), NewTabIcon() (+3 more)

## Knowledge Gaps
- **49 isolated node(s):** `name`, `version`, `private`, `type`, `prebuild` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tab` connect `types.ts` to `ContextCapsuleBar.tsx`, `utils.ts`, `index.tsx`, `QuickDial.tsx`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `getDomain()` connect `utils.ts` to `ContextCapsuleBar.tsx`, `index.tsx`, `types.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContextCapsuleBar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14564564564564564 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._