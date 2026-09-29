# Flurer Web Loader Plugin (`web-loader`)

High-performance, ultra-efficient web browser and `WebviewWindow` loader for [Flurer](https://github.com/sahuishan01/Flurer) (Windows Tauri v2 + SolidJS File Manager).

---

## Features

* **Dual-Engine Operation**:
  * **Docked In-App Viewport**: Seamlessly integrated browser workspace right inside Flurer's UI with custom surface translucency and blur tokens (`--panel-rgb`, `--surface-blur`).
  * **Native `WebviewWindow`**: 1-click launcher for unrestricted top-level or popup native windows powered by Microsoft Edge WebView2 (Chromium). Bypasses iframe embedding blocks (`X-Frame-Options: SAMEORIGIN` / `DENY`, CSP) for modern web applications (Google, YouTube, GitHub, ChatGPT, Claude, DevTools).
* **Multi-Tab Architecture**: Open, duplicate, close, and switch between multiple web tabs with tab persistence across Flurer restarts.
* **Smart Omnibox**: Auto-normalizes URLs (adds `https://`, resolves `localhost:PORT`), detects queries, and searches via DuckDuckGo, Google, Bing, or Brave.
* **Developer Quick Dial**: Fast launcher for localhost development servers (`:3000`, `:5173`, `:8080`, `:8082`, `:3100`, `:3200`), language documentation (Rust, MDN, Crates.io, Tauri), and AI workstations.
* **Zero Binary Bloat**: Reuses the host's existing Evergreen WebView2 runtime. Bundle footprint is under 40 KB!

---

## Building

```bash
bun install
bun run build
```

The build outputs an IIFE bundle to `dist/index.js` ready for distribution.
