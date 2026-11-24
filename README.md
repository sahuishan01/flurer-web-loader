# 🌐 Flurer Web Loader

![Flurer plugin](https://img.shields.io/badge/Flurer-plugin-38bdf8)
![SolidJS](https://img.shields.io/badge/SolidJS-UI-2C4F7C?logo=solid&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB?logo=tauri&logoColor=white)
![WebView2](https://img.shields.io/badge/WebView2-Chromium-0078D4?logo=microsoftedge&logoColor=white)
![Version](https://img.shields.io/badge/version-0.1.64-2ea44f)

A browser plugin (`web-loader`) for [Flurer](https://github.com/sahuishan01/Flurer), the Tauri v2 and SolidJS file manager. It adds a tabbed browser workspace inside Flurer and a one-click launcher for full native web windows. It reuses the system's WebView2 runtime instead of shipping a browser engine, so the plugin itself is just one small JavaScript bundle.

---

## ✨ Features

| | Feature |
|---|---|
| 🪟 | **Two ways to browse.** A **docked viewport** inside Flurer that picks up your theme's translucency and blur, or a **native `WebviewWindow`** that gets around iframe embedding blocks (`X-Frame-Options`, CSP) so modern web apps work. |
| 🗂️ | **Multi-tab browsing.** Open, pin, close and reopen tabs, with tabs restored after Flurer restarts. |
| 🧠 | **Project workspaces.** Tabs are grouped into color-coded workspaces and tagged by intent (dev, docs, AI, research, leisure). A smart router can sort new tabs automatically with simple heuristics, any OpenAI-compatible endpoint (online or local), or an offline model. |
| 🪐 | **Orbit deck** (`Ctrl+E`). See all your tabs as a matrix or a spatial canvas, with the lineage of which tab opened which. |
| 🔎 | **Smart omnibox.** Adds `https://`, resolves `localhost:PORT`, and turns queries into searches on DuckDuckGo, Google, Bing or Brave. |
| ⚡ | **Quick dial.** One-click launchers for local dev servers (`:3000`, `:5173`, `:8080`, `:8082`, `:3100`, `:3200`), language docs (Rust, MDN, Crates.io, Tauri) and AI tools. |
| 🔀 | **Quick switcher** (`Ctrl+P`), history (`Ctrl+H`), bookmarks (`Ctrl+D`) and per-tab zoom. |
| ⌨️ | **Rebindable shortcuts,** with secondary bindings for common actions. |
| 🎨 | **Adaptive settings.** A searchable settings panel with tabs for Appearance, Workspaces & AI, Shortcuts, Browser & System, and Privacy & Security, which follows Flurer's theme and light or dark mode. |
| 🧭 | **Default browser.** Register Web Loader as the system default browser from Settings. |

### ⌨️ Default shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab |
| `Ctrl+Shift+T` | Reopen closed tab |
| `Ctrl+Tab` / `Ctrl+Shift+Tab` | Next or previous tab |
| `Ctrl+L` | Focus the omnibox |
| `Ctrl+R` | Reload |
| `Ctrl+P` | Quick tab switcher |
| `Ctrl+E` | Orbit deck |
| `Ctrl+H` | History |
| `Ctrl+D` | Toggle bookmark |
| `Ctrl+Shift+G` | New workspace |
| `Ctrl+Shift+C` | Toggle compact mode |
| `Ctrl+=`, `Ctrl+-`, `Ctrl+0` | Zoom in, out, reset |

---

## 🚀 Install

Open **Settings → Plugin Marketplace** in Flurer and install `sahuishan01/flurer-web-loader`. Flurer downloads the latest release's `.zip`, which contains `index.js`, `plugin.json` and `package.json`. Updates show up in the marketplace as new releases are published.

---

## 🛠️ Development

```bash
bun install
bun run build     # IIFE bundle at dist/index.js
bun run dev       # rebuild on change
```

The build first copies the version from `package.json` into `plugin.json`, then runs Vite in library mode. SolidJS and the Tauri API come from Flurer at runtime, so they aren't bundled. To try a local build, place `dist/index.js` and `plugin.json` in a folder under Flurer's plugin directory.

### 📦 Releasing

Push a tag like `v0.1.65`. The [release workflow](.github/workflows/release.yml) builds the bundle, zips `index.js` with `plugin.json` and `package.json`, and publishes `flurer-web-loader.zip` to a GitHub Release with generated notes. That's the asset Flurer's marketplace installs.

---

## 🗂️ Layout

```
src/
├── index.tsx             plugin entry and registration
├── components/           TabBar, NavigationBar, WebViewport, QuickDial, QuickTabSwitcher,
│                         ContextOrbitDeck, ContextCapsuleBar, HistoryModal, SettingsPanel
├── smartRouter.ts        workspaces, intent detection and routing
├── shortcuts.ts          default and rebindable shortcuts
├── dragDrop.ts           tab drag and drop
├── theme.ts, styles.ts   adaptive styling from Flurer's theme tokens
└── utils.ts, types.ts    URL handling, WebviewWindow launching, shared types
plugin.json               plugin manifest (id, version, entry, repo)
```

See the [Flurer plugin spec](https://github.com/sahuishan01/Flurer/blob/main/plugin-spec.md) for how plugins are built and installed.
