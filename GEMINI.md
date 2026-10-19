# Project Guidelines & Invariants (GEMINI.md)

## 1. Automatic Version Bumping & Release Workflow
**CRITICAL RULE**: Whenever a bug fix is resolved or a new feature/improvement is implemented, the agent **MUST ALWAYS** bump the project version and publish a release so users and the Flurer host app can detect and install the update.

### Release Steps:
1. **Bump Version**:
   - Increment the version in `package.json` (semantic versioning: patch for fixes, minor for features).
2. **Build & Verify**:
   - Run `bun run build`.
   - The prebuild step automatically runs `scripts/sync-version.cjs` to sync the updated version into `plugin.json`.
   - Ensure the build succeeds and generates an updated `dist/index.js`.
3. **Commit Changes**:
   - Stage modified code, `package.json`, `plugin.json`, `dist/index.js`, and documentation.
   - Commit using conventional commit format:
     `git commit -m "fix(scope): description (v<version>)"` or `feat(scope): description (v<version>)"`
4. **Tag & Push Release**:
   - Create an annotated git tag matching the version:
     `git tag -a v<version> -m "Release v<version>: <summary>"`
   - Push both the branch and the new tag to GitHub:
     `git push origin main && git push origin v<version>`
   - GitHub Actions (`.github/workflows/release.yml`) triggers on `v*` tags to bundle `flurer-web-loader.zip` and publish the GitHub Release asset.
5. **Verify & Notify**:
   - Verify the GitHub release using `gh run list` / `gh release view v<version>`.
   - Once verified, send the release push notification to the `agent-releases` topic using `~/.local/bin/ntfy-agent-notify`:
     ```bash
     printf '• <Summary of changes>\n• Release: https://github.com/sahuishan01/flurer-web-loader/releases/tag/v<version>\n' | ~/.local/bin/ntfy-agent-notify agent-releases "Flurer Web Loader v<version> Released ($(hostname))"
     ```

---

## 2. Architecture & Runtime Invariants
- **IIFE Bundle**: The plugin is built as an IIFE (`dist/index.js`) for Flurer's plugin host (`new Function(code)` execution).
- **External Shared Dependencies**: `solid-js`, `@tauri-apps/api/core`, `@tauri-apps/api/event`, etc. are externalized in `vite.config.ts` and provided at runtime via Flurer host globals (`window.Solid`, `window.TauriCore`, `window.TauriEvent`).
- **Reactive Tab State & Synchronization**:
  - Tab state mutations (`tabs`, `activeTabId`, `currentWorkspaceId`) that occur together MUST be wrapped in Solid's `batch(() => { ... })` to prevent transient evaluation of stale tabs or fallback to index 0.
  - Native docked webview synchronization in `WebViewport` uses sequence versioning (`syncSeq`) and pending sync queues to prevent stale in-flight IPC calls from overriding active tab views.
- **Docked Webview Lifetime**:
  - Always reposition docked child webviews offscreen (`Logical: { x: -10000, y: -10000 }`, `width: 0, height: 0}`) and hide before closing to prevent visual flicker.

---

## 3. Secret & Instruction Handling
- Never inline tokens, credentials, or private keys into repository files or documentation.
- Use dedicated token scripts (`~/.local/bin/ntfy-agent-notify`) and environment configuration.
