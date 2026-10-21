import { createSignal, createRoot, Show, onMount, onCleanup, createEffect, batch, untrack } from "solid-js";
import {
  MainPanelProps,
  Tab,
  Bookmark,
  HistoryItem,
  ClosedTabRecord,
  ProjectWorkspace,
  OrbitLayoutMode,
} from "./types";
import { S } from "./styles";
import { GlobeIcon } from "./icons";
import { TabBar } from "./components/TabBar";
import { NavigationBar } from "./components/NavigationBar";
import { ContextCapsuleBar } from "./components/ContextCapsuleBar";
import { ContextOrbitDeck } from "./components/ContextOrbitDeck";
import { QuickTabSwitcher } from "./components/QuickTabSwitcher";
import { HistoryModal } from "./components/HistoryModal";
import { WebViewport } from "./components/WebViewport";
import { SettingsPanel } from "./components/SettingsPanel";
import { themeConfig, getEffectiveThemeStyles } from "./theme";
import { DEFAULT_WORKSPACES, classifyHeuristic, routeTab } from "./smartRouter";
import { getEffectiveShortcuts, matchesAction } from "./shortcuts";
import {
  openInWebviewWindow,
  openInExternalBrowser,
  getDomain,
  deriveTabTitle,
  getSavedTabs,
  saveTabs,
  getSavedActiveTab,
  saveActiveTab,
  getSavedBookmarks,
  saveBookmarks,
  getSavedHistory,
  addHistoryItem,
  removeHistoryItem,
  clearHistory,
  getSavedClosedTabs,
  saveClosedTabs,
  pushClosedTab,
  popClosedTab,
  removeClosedTab,
  clearClosedTabs,
  closeDockedWebview,
  closeTabWebview,
  closeAllDockedWebviews,
  hideAllDockedWebviews,
  restoreMainWebviewFocus,
  tabMatchesWorkspace,
  setDockedWebviewZoom,
  getSavedWorkspaces,
  saveWorkspaces,
  getDockedWebviewEntry,
  updateDockedWebviewUrl,
  queryDockedWebviewUrl,
} from "./utils";

declare const __VERSION__: string;

const STYLE_ID = "flurer-web-loader-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    :root {
      --web-loader-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --web-loader-ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes web-loader-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes web-loader-card-enter {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .web-loader-icon-btn {
      padding: 0 !important;
      box-sizing: border-box !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      line-height: 1 !important;
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.18s ease,
                  border-color 0.18s ease,
                  color 0.18s ease,
                  box-shadow 0.18s ease,
                  opacity 0.18s ease !important;
      will-change: transform;
    }
    .web-loader-icon-btn:hover {
      transform: translateY(-1px);
      background: var(--card-bg-hover, rgba(255, 255, 255, 0.09)) !important;
      border-color: rgba(var(--accent-rgb, 56, 189, 248), 0.3) !important;
    }
    .web-loader-icon-btn:active {
      transform: scale(0.92) translateY(0px) !important;
    }
    .web-loader-icon-btn svg {
      display: block !important;
      flex-shrink: 0 !important;
      pointer-events: none;
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .web-loader-spinning svg {
      animation: web-loader-spin 0.85s linear infinite !important;
      transform-origin: center center;
    }

    .web-loader-tab {
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.2s ease,
                  border-color 0.2s ease,
                  color 0.2s ease,
                  box-shadow 0.2s ease !important;
      will-change: transform;
    }
    .web-loader-tab:hover {
      transform: translateY(-1px);
      border-color: rgba(var(--accent-rgb, 56, 189, 248), 0.35) !important;
      background: rgba(255, 255, 255, 0.08) !important;
    }
    .web-loader-tab:active {
      transform: scale(0.98) translateY(0px) !important;
    }

    .web-loader-tab-close {
      transition: opacity 0.15s ease,
                  background-color 0.15s ease,
                  transform 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .web-loader-tab-close:hover {
      opacity: 1 !important;
      background: rgba(255, 255, 255, 0.12) !important;
      transform: scale(1.1) !important;
    }
    .web-loader-tab-close:active {
      transform: scale(0.9) !important;
    }

    .web-loader-tab-compact {
      justify-content: center !important;
    }
    .web-loader-tab-compact:not(:hover):not(.active) .web-loader-tab-close {
      display: none !important;
    }
    .web-loader-tab-compact:hover .web-loader-tab-close {
      display: inline-flex !important;
    }

    .web-loader-omnibox {
      transition: border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.22s ease !important;
    }
    .web-loader-omnibox:focus-within {
      border-color: var(--accent-default, #38bdf8) !important;
      box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 56, 189, 248), 0.22),
                  0 4px 16px rgba(0, 0, 0, 0.25) !important;
    }

    .web-loader-card {
      animation: web-loader-card-enter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.22s ease,
                  box-shadow 0.22s ease,
                  background-color 0.22s ease !important;
      will-change: transform;
    }
    .web-loader-card:hover {
      transform: translateY(-2px);
      border-color: rgba(var(--accent-rgb, 56, 189, 248), 0.35) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25),
                  0 1px 2px rgba(var(--accent-rgb, 56, 189, 248), 0.1) !important;
      background: rgba(255, 255, 255, 0.065) !important;
    }
    .web-loader-card:active {
      transform: translateY(0px) scale(0.99) !important;
    }

    .web-loader-action-btn {
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.18s ease,
                  opacity 0.18s ease,
                  background-color 0.18s ease !important;
    }
    .web-loader-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(var(--accent-rgb, 56, 189, 248), 0.35) !important;
      opacity: 0.95;
    }
    .web-loader-action-btn:active {
      transform: translateY(0px) scale(0.97) !important;
    }

    .web-loader-secondary-btn {
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  border-color 0.18s ease,
                  box-shadow 0.18s ease,
                  background-color 0.18s ease !important;
    }
    .web-loader-secondary-btn:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    }
    .web-loader-secondary-btn:active {
      transform: translateY(0px) scale(0.97) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      .web-loader-card, .web-loader-tab, .web-loader-icon-btn, .web-loader-action-btn, .web-loader-secondary-btn {
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

let tabCounter = 0;
let lastAssignedActiveTime = Date.now();
export function getMonotonicTimestamp(): number {
  const now = Date.now();
  if (now > lastAssignedActiveTime) {
    lastAssignedActiveTime = now;
  } else {
    lastAssignedActiveTime += 1;
  }
  return lastAssignedActiveTime;
}

function createNewTab(
  url: string = "about:blank",
  title?: string,
  parentId?: string,
  parentTitle?: string,
  projectId?: string
): Tab {
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith("{") && cleanUrl.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleanUrl);
      if (parsed && typeof parsed.url === "string") {
        cleanUrl = parsed.url;
      }
    } catch {}
  }
  url = cleanUrl;

  const initialTitle = deriveTabTitle(url, title);
  const decision = classifyHeuristic(url, initialTitle, getSavedWorkspaces(), projectId);
  const now = getMonotonicTimestamp();
  return {
    id: `tab-${++tabCounter}`,
    title: initialTitle,
    url,
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
    zoom: 1.0,
    mode: "embedded",
    projectId: projectId || decision.projectId,
    intent: decision.intent,
    parentId,
    parentTitle,
    createdAt: now,
    lastActiveAt: now,
    position: {
      x: 180 + Math.floor(Math.random() * 450),
      y: 140 + Math.floor(Math.random() * 320),
    },
  };
}

function initRestoredTabs(): { tabs: Tab[]; activeId: string } {
  const saved = getSavedTabs();
  const savedActive = getSavedActiveTab();
  if (saved.length > 0) {
    const baseTime = Date.now() - saved.length * 1000;
    const restored = saved.map((s, idx) => {
      const derived = deriveTabTitle(s.url, s.title);
      const tab = createNewTab(s.url, derived, s.parentId, s.parentTitle, s.projectId);
      if (s.intent) tab.intent = s.intent;
      if (s.pinned !== undefined) tab.pinned = s.pinned;
      if (s.position) tab.position = s.position;
      if (s.favicon) tab.favicon = s.favicon;
      tab.lastActiveAt = s.lastActiveAt || (baseTime + idx * 1000);
      return tab;
    });
    const match = restored.find((t) => t.url === savedActive);
    const activeId = match ? match.id : restored[0].id;
    const now = getMonotonicTimestamp();
    const finalTabs = restored.map((t) => (t.id === activeId ? { ...t, lastActiveAt: now } : t));
    return {
      tabs: finalTabs,
      activeId,
    };
  }
  const defaultTab = createNewTab();
  return {
    tabs: [defaultTab],
    activeId: defaultTab.id,
  };
}

// Module-level reactive state that survives unmount/remount across Flurer views
const initialTabsState = initRestoredTabs();
const [tabs, setTabs] = createRoot(() => createSignal<Tab[]>(initialTabsState.tabs));
const [activeTabId, setActiveTabId] = createRoot(() => createSignal<string>(initialTabsState.activeId));
const [bookmarks, setBookmarks] = createRoot(() => createSignal<Bookmark[]>(getSavedBookmarks()));
const [history, setHistory] = createRoot(() => createSignal<HistoryItem[]>(getSavedHistory()));
const [closedTabs, setClosedTabs] = createRoot(() => createSignal<ClosedTabRecord[]>(getSavedClosedTabs()));

function WebBrowserPanel(props: MainPanelProps) {
  const activeTab = () => tabs().find((t) => t.id === activeTabId()) || tabs()[0];
  const effectiveShortcuts = () => getEffectiveShortcuts(props.pluginSettings?.shortcuts);

  const workspaces = () => props.pluginSettings?.workspaces ?? getSavedWorkspaces();
  const setWorkspaces = (ws: ProjectWorkspace[]) => {
    saveWorkspaces(ws);
    props.onPluginSettingsChange?.({ workspaces: ws });
  };

  const [currentWorkspaceId, setCurrentWorkspaceId] = createSignal<string>(
    activeTab()?.projectId || "flurer"
  );

  const currentWorkspace = () =>
    workspaces().find((w) => w.id === currentWorkspaceId()) ||
    workspaces()[0] ||
    DEFAULT_WORKSPACES[0];

  const [orbitDeckOpen, setOrbitDeckOpen] = createSignal(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = createSignal(false);
  const [quickSwitcherOpen, setQuickSwitcherOpen] = createSignal(false);
  const [historyModalOpen, setHistoryModalOpen] = createSignal(false);
  const orbitLayoutMode = () => props.pluginSettings?.orbitDeckLayout ?? "matrix";

  // Reactive compact tabs state with instant local response
  const [compactTabs, setCompactTabs] = createSignal<boolean>(
    props.pluginSettings?.compactTabs ?? false
  );
  createEffect(() => {
    if (props.pluginSettings?.compactTabs !== undefined) {
      setCompactTabs(props.pluginSettings.compactTabs);
    }
  });

  const handleToggleCompactTabs = () => {
    const next = !compactTabs();
    setCompactTabs(next);
    props.onPluginSettingsChange?.({ compactTabs: next });
  };

  // Sync currentWorkspaceId only when activeTabId changes to a different tab
  let lastSyncedActiveId = activeTabId();
  createEffect(() => {
    const curId = activeTabId();
    if (curId !== lastSyncedActiveId) {
      lastSyncedActiveId = curId;
      const cur = tabs().find((t) => t.id === curId);
      if (cur?.projectId && cur.projectId !== untrack(currentWorkspaceId)) {
        const exists = workspaces().some((w) => w.id === cur.projectId);
        if (exists) {
          setCurrentWorkspaceId(cur.projectId);
        }
      }
    }
  });

  // Global Keyboard shortcuts & Child Webview Bridge
  onMount(() => {
    let lastShortcutSig = "";
    let lastShortcutTime = 0;

    const handleShortcutAction = (k: string, code: string, isMod: boolean, isShift: boolean, isAlt: boolean, preventDefault?: () => void) => {
      const now = Date.now();
      const sig = `${k}_${code}_${isMod}_${isShift}_${isAlt}`;
      if (sig === lastShortcutSig && now - lastShortcutTime < 250) {
        return false;
      }
      lastShortcutSig = sig;
      lastShortcutTime = now;

      const key = (k || "").toLowerCase();
      const c = code || "";
      const sc = effectiveShortcuts();

      // 1. Fast Tab Switcher / Palette
      if (matchesAction("quickSwitcher", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        setQuickSwitcherOpen((prev) => !prev);
        return true;
      }

      // 2. Orbit Canvas
      if (matchesAction("orbitDeck", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        setOrbitDeckOpen((prev) => !prev);
        return true;
      }

      // 3. New Tab
      if (matchesAction("newTab", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleNewTab("about:blank", activeTab()?.id, currentWorkspace().id);
        setTimeout(focusOmnibox, 0);
        return true;
      }

      // 4. Close Tab
      if (matchesAction("closeTab", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        if (activeTab()) {
          handleCloseTab(activeTab().id);
        }
        return true;
      }

      // 5. Reload Page
      if (matchesAction("reload", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleReload();
        return true;
      }

      // 6. Focus Address Bar / Omnibox
      if (matchesAction("focusOmnibox", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        focusOmnibox();
        return true;
      }

      // 7. Cycle Tabs: Next Tab
      if (matchesAction("nextTab", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        const currentWsId = currentWorkspace().id;
        const currentList = tabs().filter((t) => tabMatchesWorkspace(t, currentWsId));
        if (currentList.length <= 1) return true;
        const currentIdx = currentList.findIndex((t) => t.id === activeTabId());
        const nextIdx = currentIdx < 0
          ? 0
          : (currentIdx + 1) % currentList.length;
        handleSelectTab(currentList[nextIdx].id);
        return true;
      }

      // 8. Cycle Tabs: Previous Tab
      if (matchesAction("prevTab", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        const currentWsId = currentWorkspace().id;
        const currentList = tabs().filter((t) => tabMatchesWorkspace(t, currentWsId));
        if (currentList.length <= 1) return true;
        const currentIdx = currentList.findIndex((t) => t.id === activeTabId());
        const prevIdx = currentIdx < 0
          ? 0
          : (currentIdx - 1 + currentList.length) % currentList.length;
        handleSelectTab(currentList[prevIdx].id);
        return true;
      }

      // 9. Zoom In
      if (matchesAction("zoomIn", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleZoom(0.1);
        return true;
      }

      // 10. Zoom Out
      if (matchesAction("zoomOut", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleZoom(-0.1);
        return true;
      }

      // 11. Reset Zoom
      if (matchesAction("resetZoom", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleResetZoom();
        return true;
      }

      // 12. Bookmark Toggle
      if (matchesAction("toggleBookmark", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleToggleBookmark();
        return true;
      }

      // 13. New Group / Workspace
      if (matchesAction("newWorkspace", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        const name = `Group ${workspaces().length + 1}`;
        handleAddWorkspace(name);
        return true;
      }

      // 14. Toggle Compact Tabs
      if (matchesAction("toggleCompact", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleToggleCompactTabs();
        return true;
      }

      // 15. Numbered Tab Switch: Ctrl+1..Ctrl+8 (direct), Ctrl+9 (last tab) within current workspace
      if (isMod && !isShift && (/^[1-9]$/.test(key) || /^(Digit|Numpad)[1-9]$/.test(c))) {
        preventDefault?.();
        const currentWsId = currentWorkspace().id;
        const currentList = tabs().filter((t) => tabMatchesWorkspace(t, currentWsId));
        if (currentList.length === 0) return true;
        const digitChar = /^[1-9]$/.test(key) ? key : c.replace(/^(Digit|Numpad)/, "");
        const num = parseInt(digitChar, 10);
        if (num === 9) {
          handleSelectTab(currentList[currentList.length - 1].id);
        } else if (num - 1 < currentList.length) {
          handleSelectTab(currentList[num - 1].id);
        }
        return true;
      }

      // 16. Reopen Last Closed Tab (workspace-scoped)
      if (matchesAction("reopenClosedTab", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        handleReopenClosedTab();
        return true;
      }

      // 17. Toggle Browsing History & Closed Tabs Modal
      if (matchesAction("toggleHistory", sc, key, c, isMod, isShift, isAlt)) {
        preventDefault?.();
        setHistoryModalOpen((prev) => !prev);
        return true;
      }

      return false;
    };

    const handleGlobalKey = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      handleShortcutAction(e.key, e.code, isMod, isShift, isAlt, () => {
        e.preventDefault();
        e.stopPropagation();
      });
    };

    // Capture phase on window & document to preempt child element interception
    window.addEventListener("keydown", handleGlobalKey, true);
    document.addEventListener("keydown", handleGlobalKey, true);

    // Tauri bridge listener for child webviews emitting "web-loader:shortcut"
    let unlistenTauriShortcut: (() => void) | undefined;
    let unlistenFlurerShortcut: (() => void) | undefined;
    let unlistenPageLoad: (() => void) | undefined;
    let unlistenNavigated: (() => void) | undefined;
    let unlistenFlurerNavigated: (() => void) | undefined;
    let unlistenNewWindow: (() => void) | undefined;
    let unlistenFlurerNewWindow: (() => void) | undefined;
    let unlistenOpenTab: (() => void) | undefined;
    let lastNewWindowUrl = "";
    let lastNewWindowTime = 0;

    const handleNewWindowRequested = (rawUrl: string, sourceWebview?: string) => {
      if (!rawUrl || rawUrl === "about:blank" || rawUrl.startsWith("javascript:")) return;
      let cleanUrl = rawUrl.trim();
      if (cleanUrl.startsWith("{") && cleanUrl.endsWith("}")) {
        try {
          const parsed = JSON.parse(cleanUrl);
          if (parsed && typeof parsed.url === "string") {
            cleanUrl = parsed.url;
          }
        } catch {}
      }
      if (!cleanUrl || cleanUrl.startsWith("{") || cleanUrl === "about:blank") return;

      const now = Date.now();
      if (cleanUrl === lastNewWindowUrl && now - lastNewWindowTime < 800) {
        return;
      }
      lastNewWindowUrl = cleanUrl;
      lastNewWindowTime = now;

      const currentTabs = tabs();
      const parentTab = sourceWebview
        ? currentTabs.find((t) => {
            const entry = getDockedWebviewEntry(t.id);
            return entry?.label === sourceWebview;
          }) || activeTab()
        : activeTab();

      const targetWs = parentTab?.projectId || currentWorkspace().id;
      handleNewTab(cleanUrl, parentTab?.id, targetWs);
    };

    if (window.TauriEvent?.listen) {
      const handlePayloadShortcut = (event: any) => {
        const p = event?.payload;
        if (p) {
          // If event has pluginId, verify it matches our plugin or is meant for us
          if (p.pluginId && p.pluginId !== "web-loader" && !String(p.sourceWebview || "").startsWith("web-")) {
            return;
          }
          handleShortcutAction(p.key, p.code, !!p.ctrlKey || !!p.metaKey, !!p.shiftKey, !!p.altKey);
        }
      };

      const handlePayloadNewWindow = (event: any) => {
        const p = event?.payload;
        const rawUrl = typeof p === "string" ? p : p?.url;
        const sourceWebview = p?.sourceWebview;
        if (rawUrl) {
          handleNewWindowRequested(rawUrl, sourceWebview);
        }
      };

      window.TauriEvent.listen("web-loader:shortcut", handlePayloadShortcut).then((unlisten: () => void) => {
        unlistenTauriShortcut = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("flurer:webview-shortcut", handlePayloadShortcut).then((unlisten: () => void) => {
        unlistenFlurerShortcut = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("web-loader:new-window", handlePayloadNewWindow).then((unlisten: () => void) => {
        unlistenNewWindow = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("flurer:webview-new-window", handlePayloadNewWindow).then((unlisten: () => void) => {
        unlistenFlurerNewWindow = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("web-loader:open-tab", handlePayloadNewWindow).then((unlisten: () => void) => {
        unlistenOpenTab = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("tauri://page-load", (event: any) => {
        const rawUrl = typeof event?.payload === "string" ? event.payload : event?.payload?.url;
        const pageTitle = event?.payload?.title;
        if (rawUrl && rawUrl !== "about:blank") {
          handleWebviewNavigated(rawUrl, undefined, pageTitle);
        }
      }).then((unlisten: () => void) => {
        unlistenPageLoad = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("web-loader:navigated", (event: any) => {
        const rawUrl = typeof event?.payload === "string" ? event.payload : event?.payload?.url;
        const pageTitle = event?.payload?.title;
        const targetTabId = event?.payload?.tabId;
        const sourceWebview = event?.payload?.sourceWebview;
        const targetId = targetTabId || (sourceWebview ? tabs().find((t) => getDockedWebviewEntry(t.id)?.label === sourceWebview)?.id : undefined);
        if (rawUrl && rawUrl !== "about:blank") {
          handleWebviewNavigated(rawUrl, targetId, pageTitle);
        }
      }).then((unlisten: () => void) => {
        unlistenNavigated = unlisten;
      }).catch(() => {});

      window.TauriEvent.listen("flurer:webview-navigated", (event: any) => {
        const rawUrl = typeof event?.payload === "string" ? event.payload : event?.payload?.url;
        const pageTitle = event?.payload?.title;
        const targetTabId = event?.payload?.tabId;
        const sourceWebview = event?.payload?.sourceWebview;
        const targetId = targetTabId || (sourceWebview ? tabs().find((t) => getDockedWebviewEntry(t.id)?.label === sourceWebview)?.id : undefined);
        if (rawUrl && rawUrl !== "about:blank") {
          handleWebviewNavigated(rawUrl, targetId, pageTitle);
        }
      }).then((unlisten: () => void) => {
        unlistenFlurerNavigated = unlisten;
      }).catch(() => {});
    }

    // Message bridge listener for iframe / postMessage communications
    const handleWindowMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "web-loader:shortcut") {
        const p = e.data.payload;
        if (p) {
          handleShortcutAction(p.key, p.code, !!p.ctrlKey || !!p.metaKey, !!p.shiftKey, !!p.altKey);
        }
      } else if (e.data && e.data.type === "web-loader:navigated") {
        const rawUrl = e.data.payload?.url || e.data.url;
        const pageTitle = e.data.payload?.title || e.data.title;
        const targetTabId = e.data.payload?.tabId || e.data.tabId;
        if (rawUrl) {
          handleWebviewNavigated(rawUrl, targetTabId, pageTitle);
        }
      } else if (
        e.data &&
        (e.data.type === "web-loader:new-window" ||
          e.data.type === "web-loader:new-tab" ||
          e.data.type === "web-loader:open-tab")
      ) {
        const rawUrl = e.data.payload?.url || e.data.url;
        const sourceWebview = e.data.payload?.sourceWebview || e.data.sourceWebview;
        if (rawUrl) {
          handleNewWindowRequested(rawUrl, sourceWebview);
        }
      }
    };
    window.addEventListener("message", handleWindowMessage);

    // Periodically poll active docked webview's live URL & page title
    const pollInterval = setInterval(async () => {
      const curTab = activeTab();
      if (!curTab || curTab.url === "about:blank" || props.active === false) return;
      let reportedTitle: string | undefined = undefined;
      const liveUrl = await queryDockedWebviewUrl(
        curTab.id,
        (nwUrl) => {
          handleNewWindowRequested(nwUrl, getDockedWebviewEntry(curTab.id)?.label);
        },
        (t) => {
          reportedTitle = t;
        }
      );
      if (liveUrl && liveUrl !== "about:blank" && !liveUrl.startsWith("javascript:")) {
        handleWebviewNavigated(liveUrl, curTab.id, reportedTitle);
      } else if (reportedTitle && reportedTitle !== curTab.title) {
        handleWebviewNavigated(curTab.url, curTab.id, reportedTitle);
      }
    }, 350);

    onCleanup(() => {
      clearInterval(pollInterval);
      window.removeEventListener("keydown", handleGlobalKey, true);
      document.removeEventListener("keydown", handleGlobalKey, true);
      window.removeEventListener("message", handleWindowMessage);
      if (unlistenTauriShortcut) {
        unlistenTauriShortcut();
      }
      if (unlistenFlurerShortcut) {
        unlistenFlurerShortcut();
      }
      if (unlistenPageLoad) {
        unlistenPageLoad();
      }
      if (unlistenNavigated) {
        unlistenNavigated();
      }
      if (unlistenFlurerNavigated) {
        unlistenFlurerNavigated();
      }
      if (unlistenNewWindow) {
        unlistenNewWindow();
      }
      if (unlistenFlurerNewWindow) {
        unlistenFlurerNewWindow();
      }
      if (unlistenOpenTab) {
        unlistenOpenTab();
      }
    });
  });

  const getLaunchOptions = () => ({
    incognito: props.pluginSettings?.incognitoMode,
    userAgent: props.pluginSettings?.customUserAgent,
    reuseExisting: props.pluginSettings?.singleWindowPerDomain ?? false,
  });

  const persistCurrentTabs = (currentTabs: Tab[], activeUrl?: string) => {
    saveTabs(
      currentTabs.map((t) => ({
        title: t.title,
        url: t.url,
        favicon: t.favicon,
        projectId: t.projectId,
        intent: t.intent,
        parentId: t.parentId,
        parentTitle: t.parentTitle,
        pinned: t.pinned,
        position: t.position,
        lastActiveAt: t.lastActiveAt,
      }))
    );
    if (activeUrl !== undefined) {
      saveActiveTab(activeUrl === "about:blank" ? null : activeUrl);
    }
  };

  const focusOmnibox = () => {
    restoreMainWebviewFocus();

    const doFocus = () => {
      const omni = document.querySelector(".web-loader-omnibox input") as HTMLInputElement | null;
      if (omni) {
        omni.focus();
        if (omni.value) {
          omni.select();
        }
        return document.activeElement === omni;
      }
      return false;
    };

    doFocus();
    requestAnimationFrame(doFocus);
    setTimeout(doFocus, 25);
    setTimeout(doFocus, 75);
    setTimeout(doFocus, 150);
    setTimeout(doFocus, 300);
  };

  const handleSelectTab = (id: string) => {
    const target = tabs().find((t) => t.id === id);
    if (!target) return;
    const now = getMonotonicTimestamp();
    const nextTabs = tabs().map((t) => (t.id === id ? { ...t, lastActiveAt: now } : t));
    batch(() => {
      setOrbitDeckOpen(false);
      setWorkspaceMenuOpen(false);
      setTabs(nextTabs);
      setActiveTabId(id);
      if (target.projectId) {
        setCurrentWorkspaceId(target.projectId);
      }
    });
    if (target.url === "about:blank") {
      hideAllDockedWebviews();
      focusOmnibox();
    }
    saveActiveTab(target.url === "about:blank" ? null : target.url);
    persistCurrentTabs(nextTabs, target.url);
  };

  const handleNewTab = (
    url: string = "about:blank",
    parentId?: string,
    projectId?: string,
    title?: string
  ) => {
    hideAllDockedWebviews();
    const parentTab = parentId ? tabs().find((t) => t.id === parentId) : undefined;
    const parentTitle = parentTab ? parentTab.title : undefined;
    const targetWs = projectId || parentTab?.projectId || currentWorkspace().id;
    const initialTitle = deriveTabTitle(url, title);
    const newTab = createNewTab(
      url,
      initialTitle,
      parentId,
      parentTitle,
      targetWs
    );
    const nextTabs = [...tabs(), newTab];
    batch(() => {
      setOrbitDeckOpen(false);
      setWorkspaceMenuOpen(false);
      setQuickSwitcherOpen(false);
      setActiveTabId(newTab.id);
      setTabs(nextTabs);
      setCurrentWorkspaceId(targetWs);
    });
    persistCurrentTabs(nextTabs, newTab.url);
    if (url === "about:blank") {
      focusOmnibox();
    }
  };

  const handleUpdateTabWorkspace = (tabId: string, projectId: string | undefined) => {
    const nextTabs = tabs().map((t) => (t.id === tabId ? { ...t, projectId } : t));
    setTabs(nextTabs);
    persistCurrentTabs(nextTabs);
    if (tabId === activeTabId() && projectId) {
      setCurrentWorkspaceId(projectId);
    }
  };

  const handleReorderTabs = (
    draggedTabId: string,
    targetTabId: string,
    insertBefore: boolean = true,
    newWorkspaceId?: string
  ) => {
    if (!draggedTabId || !targetTabId || draggedTabId === targetTabId) return;
    const currentTabs = [...tabs()];
    const fromIndex = currentTabs.findIndex((t) => t.id === draggedTabId);
    if (fromIndex === -1) return;

    const [movedTab] = currentTabs.splice(fromIndex, 1);
    if (newWorkspaceId) {
      movedTab.projectId = newWorkspaceId;
    }
    let targetIndex = currentTabs.findIndex((t) => t.id === targetTabId);
    if (targetIndex === -1) {
      currentTabs.push(movedTab);
    } else {
      if (!insertBefore) targetIndex += 1;
      currentTabs.splice(targetIndex, 0, movedTab);
    }
    setTabs(currentTabs);
    persistCurrentTabs(currentTabs, activeTab()?.url);
  };

  const handleReorderWorkspaces = (
    draggedWsId: string,
    targetWsId: string,
    insertBefore: boolean = true
  ) => {
    if (!draggedWsId || !targetWsId || draggedWsId === targetWsId) return;
    const currentWs = [...workspaces()];
    const fromIndex = currentWs.findIndex((w) => w.id === draggedWsId);
    if (fromIndex === -1) return;

    const [movedWs] = currentWs.splice(fromIndex, 1);
    let targetIndex = currentWs.findIndex((w) => w.id === targetWsId);
    if (targetIndex === -1) {
      currentWs.push(movedWs);
    } else {
      if (!insertBefore) targetIndex += 1;
      currentWs.splice(targetIndex, 0, movedWs);
    }
    setWorkspaces(currentWs);
  };

  const handleAddWorkspace = (
    name: string,
    color?: string,
    icon?: string,
    keywords?: string[]
  ) => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    const newId = `ws-${Date.now()}`;
    const newWs: ProjectWorkspace = {
      id: newId,
      name: trimmed,
      color: color || "#38bdf8",
      icon: icon || "✦",
      keywords: keywords || [],
    };
    const updated = [...workspaces(), newWs];
    setWorkspaces(updated);
    handleSwitchWorkspace(newId);
    return newId;
  };

  const handleCloseTab = (id: string) => {
    closeTabWebview(id);
    const current = tabs();
    if (current.length <= 1) {
      const single = current[0];
      if (single && single.url && single.url !== "about:blank" && !single.url.startsWith("javascript:")) {
        const rec = {
          url: single.url,
          title: single.title || getDomain(single.url),
          projectId: single.projectId || currentWorkspace().id,
          favicon: single.favicon,
          zoom: single.zoom,
          intent: single.intent,
        };
        setClosedTabs(pushClosedTab(rec));
      }
      // If closing last tab, reset it to about:blank
      const fresh = [createNewTab("about:blank", "New Tab", undefined, undefined, currentWorkspace().id)];
      batch(() => {
        setActiveTabId(fresh[0].id);
        setTabs(fresh);
      });
      persistCurrentTabs(fresh, fresh[0].url);
      focusOmnibox();
      return;
    }

    const closingTab = current.find((t) => t.id === id);
    if (!closingTab) return;

    if (closingTab.url && closingTab.url !== "about:blank" && !closingTab.url.startsWith("javascript:")) {
      const rec = {
        url: closingTab.url,
        title: closingTab.title || getDomain(closingTab.url),
        projectId: closingTab.projectId || currentWorkspace().id,
        favicon: closingTab.favicon,
        zoom: closingTab.zoom,
        intent: closingTab.intent,
      };
      setClosedTabs(pushClosedTab(rec));
    }

    const updated = current.filter((t) => t.id !== id);

    if (activeTabId() === id) {
      // Determine the group / workspace of the closing tab
      const targetWsId = closingTab.projectId || currentWorkspace().id;

      // Filter remaining tabs that belong to the SAME group/workspace
      const groupTabs = updated.filter((t) => tabMatchesWorkspace(t, targetWsId));

      let nextTab: Tab;
      let finalTabs = updated;

      if (groupTabs.length > 0) {
        // Go to the last visited (most recently active) tab in that group
        nextTab = [...groupTabs].sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0))[0];
      } else {
        // If no more tabs in this group, create a fresh tab in this workspace so user stays in the group
        const fresh = createNewTab("about:blank", "New Tab", undefined, undefined, targetWsId);
        finalTabs = [...updated, fresh];
        nextTab = fresh;
      }

      // Mark the selected tab with latest active timestamp
      const now = getMonotonicTimestamp();
      const updatedWithActive = finalTabs.map((t) => (t.id === nextTab.id ? { ...t, lastActiveAt: now } : t));

      batch(() => {
        setActiveTabId(nextTab.id);
        setTabs(updatedWithActive);
        setOrbitDeckOpen(false);
        setWorkspaceMenuOpen(false);
        if (nextTab.projectId) {
          setCurrentWorkspaceId(nextTab.projectId);
        }
      });
      if (nextTab.url === "about:blank") {
        hideAllDockedWebviews();
        focusOmnibox();
      }
      saveActiveTab(nextTab.url === "about:blank" ? null : nextTab.url);
      persistCurrentTabs(updatedWithActive, nextTab.url);
    } else {
      setTabs(updated);
      persistCurrentTabs(updated, activeTab()?.url);
    }
  };

  const handleReopenClosedTab = (record?: ClosedTabRecord) => {
    let target = record;
    if (!target) {
      const curWsId = currentWorkspace().id;
      const res = popClosedTab(curWsId);
      if (!res.reopened) {
        return;
      }
      target = res.reopened;
      setClosedTabs(res.remaining);
    } else {
      setClosedTabs(removeClosedTab(target.id));
    }

    // Determine target workspace: use target.projectId if that workspace exists, else current workspace
    const wsId = target.projectId && workspaces().some((w) => w.id === target.projectId)
      ? target.projectId
      : currentWorkspace().id;

    const restored = createNewTab(
      target.url,
      target.title || getDomain(target.url),
      undefined,
      undefined,
      wsId
    );
    if (target.favicon) restored.favicon = target.favicon;
    if (target.zoom) restored.zoom = target.zoom;
    if (target.intent) restored.intent = target.intent;

    const currentTabs = tabs();
    // If the only tab in this workspace is an unused about:blank, replace it
    const wsTabs = currentTabs.filter((t) => tabMatchesWorkspace(t, wsId));
    let nextTabs: Tab[];
    if (wsTabs.length === 1 && wsTabs[0].url === "about:blank") {
      nextTabs = currentTabs.map((t) => (t.id === wsTabs[0].id ? restored : t));
    } else {
      nextTabs = [...currentTabs, restored];
    }

    batch(() => {
      setCurrentWorkspaceId(wsId);
      setActiveTabId(restored.id);
      setTabs(nextTabs);
    });
    persistCurrentTabs(nextTabs, restored.url);
    saveActiveTab(restored.url);
  };

  const handleReopenAllClosedTabs = (projectId?: string) => {
    const list = getSavedClosedTabs().filter((t) => {
      if (!projectId) return true;
      if (t.projectId === projectId) return true;
      if (!t.projectId && (projectId === "general" || projectId === "default")) return true;
      return false;
    });
    if (list.length === 0) return;

    clearClosedTabs(projectId);
    setClosedTabs(getSavedClosedTabs());

    const curTabs = tabs();
    const newTabsToAdd: Tab[] = [];
    for (const item of list) {
      const wsId = item.projectId && workspaces().some((w) => w.id === item.projectId)
        ? item.projectId
        : currentWorkspace().id;
      const t = createNewTab(item.url, item.title, undefined, undefined, wsId);
      if (item.favicon) t.favicon = item.favicon;
      if (item.zoom) t.zoom = item.zoom;
      newTabsToAdd.push(t);
    }
    if (newTabsToAdd.length === 0) return;

    const lastTab = newTabsToAdd[newTabsToAdd.length - 1];
    const finalTabs = [...curTabs, ...newTabsToAdd];
    batch(() => {
      setCurrentWorkspaceId(lastTab.projectId || currentWorkspace().id);
      setActiveTabId(lastTab.id);
      setTabs(finalTabs);
    });
    persistCurrentTabs(finalTabs, lastTab.url);
    saveActiveTab(lastTab.url);
  };

  const handleSwitchWorkspace = (wsId: string) => {
    const allTabs = tabs();
    const wsTabs = allTabs.filter((t) => tabMatchesWorkspace(t, wsId));

    batch(() => {
      setCurrentWorkspaceId(wsId);
      setOrbitDeckOpen(false);
      setWorkspaceMenuOpen(false);

      if (wsTabs.length > 0) {
        const targetTab = [...wsTabs].sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0))[0];
        const now = getMonotonicTimestamp();
        const nextTabs = allTabs.map((t) => (t.id === targetTab.id ? { ...t, lastActiveAt: now } : t));
        setActiveTabId(targetTab.id);
        setTabs(nextTabs);
        saveActiveTab(targetTab.url === "about:blank" ? null : targetTab.url);
        persistCurrentTabs(nextTabs, targetTab.url);
        if (targetTab.url === "about:blank") {
          hideAllDockedWebviews();
          focusOmnibox();
        }
      } else {
        const newTab = createNewTab(
          "about:blank",
          "New Tab",
          undefined,
          undefined,
          wsId
        );
        const nextTabs = [...allTabs, newTab];
        setTabs(nextTabs);
        setActiveTabId(newTab.id);
        persistCurrentTabs(nextTabs, newTab.url);
        hideAllDockedWebviews();
        focusOmnibox();
      }
    });
  };

  const handleNavigate = (url: string) => {
    const id = activeTabId();
    const domain = getDomain(url);
    const derivedTitle = deriveTabTitle(url);

    if (props.pluginSettings?.defaultMode === "webviewwindow") {
      openInWebviewWindow(url, derivedTitle || domain, getLaunchOptions());
      if (url && url !== "about:blank") {
        setHistory(addHistoryItem(derivedTitle || domain, url, cur?.projectId || currentWorkspace().id, cur?.favicon));
      }
      return;
    }

    const cur = tabs().find((t) => t.id === id);
    const initialTitle = cur?.url === url && cur?.title && cur.title !== "New Tab" && cur.title !== cur.url ? cur.title : derivedTitle;
    const decision = classifyHeuristic(url, initialTitle, workspaces(), cur?.projectId);

    const nextTabs = tabs().map((t) =>
      t.id === id
        ? {
            ...t,
            url,
            title: initialTitle,
            projectId: t.projectId || decision.projectId,
            intent: decision.intent,
            lastActiveAt: getMonotonicTimestamp(),
          }
        : t
    );
    setTabs(nextTabs);
    persistCurrentTabs(nextTabs, url);

    if (props.pluginSettings?.smartRouter?.enabled && props.pluginSettings.smartRouter.provider !== "heuristic") {
      routeTab(url, initialTitle, props.pluginSettings.smartRouter, workspaces(), cur?.projectId)
        .then((asyncDecision) => {
          if (asyncDecision.projectId !== decision.projectId || asyncDecision.intent !== decision.intent) {
            setTabs((prev) => {
              const updated = prev.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      projectId: asyncDecision.projectId,
                      intent: asyncDecision.intent,
                    }
                  : t
              );
              persistCurrentTabs(updated, url);
              return updated;
            });
          }
        })
        .catch(() => {
          // Keep heuristic categorization on any async failure
        });
    }

    if (url && url !== "about:blank") {
      setHistory(addHistoryItem(initialTitle, url, cur?.projectId || decision.projectId || currentWorkspace().id, cur?.favicon));
    }
  };

  const handleWebviewNavigated = (newUrl: string, targetTabId?: string, pageTitle?: string) => {
    if (!newUrl || newUrl === "about:blank" || newUrl.startsWith("javascript:")) return;
    let cleanUrl = newUrl.trim();
    if (cleanUrl.startsWith("{") && cleanUrl.endsWith("}")) {
      try {
        const parsed = JSON.parse(cleanUrl);
        if (parsed && typeof parsed.url === "string") {
          cleanUrl = parsed.url;
          if (typeof parsed.title === "string" && parsed.title.trim() && !pageTitle) {
            pageTitle = parsed.title.trim();
          }
          if (Array.isArray(parsed.nw)) {
            for (const nwUrl of parsed.nw) {
              if (typeof nwUrl === "string" && nwUrl && nwUrl !== "about:blank") {
                handleNewWindowRequested(nwUrl);
              }
            }
          }
        }
      } catch {}
    }
    if (!cleanUrl || cleanUrl.startsWith("{") || cleanUrl === "about:blank") return;
    newUrl = cleanUrl;

    const id = targetTabId || activeTabId();
    const cur = tabs().find((t) => t.id === id);
    if (!cur) return;

    const domain = getDomain(newUrl);
    const derived = deriveTabTitle(newUrl);
    const resolvedTitle = pageTitle && pageTitle.trim().length > 0 && pageTitle !== "about:blank"
      ? pageTitle.trim()
      : (cur.title && cur.title !== "New Tab" && cur.title !== cur.url && cur.title !== domain ? cur.title : derived);

    const urlChanged = cur.url !== newUrl;
    const titleChanged = resolvedTitle !== cur.title;

    // If neither URL nor title changed, skip updating
    if (!urlChanged && !titleChanged) return;

    if (urlChanged) {
      updateDockedWebviewUrl(id, newUrl);
    }

    const decision = classifyHeuristic(newUrl, resolvedTitle, workspaces(), cur.projectId);
    const nextTabs = tabs().map((t) =>
      t.id === id
        ? {
            ...t,
            url: newUrl,
            title: resolvedTitle,
            projectId: t.projectId || decision.projectId,
            intent: decision.intent,
            lastActiveAt: getMonotonicTimestamp(),
          }
        : t
    );
    setTabs(nextTabs);
    persistCurrentTabs(nextTabs, id === activeTabId() ? newUrl : undefined);
    setHistory(addHistoryItem(resolvedTitle, newUrl, cur.projectId || currentWorkspace().id, cur.favicon));

    if (urlChanged && props.pluginSettings?.smartRouter?.enabled && props.pluginSettings.smartRouter.provider !== "heuristic") {
      routeTab(newUrl, resolvedTitle, props.pluginSettings.smartRouter, workspaces(), cur.projectId)
        .then((asyncDecision) => {
          if (asyncDecision.projectId !== decision.projectId || asyncDecision.intent !== decision.intent) {
            setTabs((prev) => {
              const updated = prev.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      projectId: asyncDecision.projectId,
                      intent: asyncDecision.intent,
                    }
                  : t
              );
              persistCurrentTabs(updated, id === activeTabId() ? newUrl : undefined);
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  };

  const handleReload = () => {
    const id = activeTabId();
    const currentTab = activeTab();
    if (currentTab && currentTab.url !== "about:blank") {
      const originalUrl = currentTab.url;
      setTabs((prev) =>
        prev.map((t) => (t.id === id ? { ...t, url: "about:blank" } : t))
      );
      setTimeout(() => {
        setTabs((prev) =>
          prev.map((t) => (t.id === id ? { ...t, url: originalUrl } : t))
        );
      }, 50);
    }
  };

  const handleGoHome = () => {
    closeDockedWebview();
    const home = props.pluginSettings?.homeUrl || "about:blank";
    handleNavigate(home);
  };

  const handlePopoutWebviewWindow = () => {
    const current = activeTab();
    if (current && current.url !== "about:blank") {
      closeDockedWebview();
      openInWebviewWindow(current.url, current.title, getLaunchOptions());
      setHistory(addHistoryItem(current.title || getDomain(current.url), current.url, current.projectId || currentWorkspace().id, current.favicon));
    }
  };

  const handleOpenExternal = (targetUrl?: string) => {
    const url = targetUrl || activeTab()?.url;
    if (url && url !== "about:blank") {
      openInExternalBrowser(url);
    }
  };

  const isCurrentBookmarked = () => {
    const current = activeTab();
    if (!current || current.url === "about:blank") return false;
    return bookmarks().some((b) => b.url === current.url);
  };

  const handleToggleBookmark = () => {
    const current = activeTab();
    if (!current || current.url === "about:blank") return;

    let updated: Bookmark[];
    if (isCurrentBookmarked()) {
      updated = bookmarks().filter((b) => b.url !== current.url);
    } else {
      const newBookmark: Bookmark = {
        id: `bm-${Date.now()}`,
        title: current.title || getDomain(current.url),
        url: current.url,
        category: "custom",
      };
      updated = [...bookmarks(), newBookmark];
    }
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  const handleAddBookmark = (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      title,
      url,
      category,
    };
    const updated = [...bookmarks(), newBookmark];
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarks().filter((b) => b.id !== id);
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  const handleZoom = (delta: number) => {
    const id = activeTabId();
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newZoom = Math.min(2.5, Math.max(0.5, Math.round((t.zoom + delta) * 10) / 10));
        setDockedWebviewZoom(newZoom);
        return { ...t, zoom: newZoom };
      })
    );
  };

  const handleResetZoom = () => {
    const id = activeTabId();
    setDockedWebviewZoom(1.0);
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, zoom: 1.0 } : t)));
  };

  const opacity = () => Math.max(0.4, props.pluginSettings?.surfaceOpacity ?? props.baseSurfaceOpacity ?? 0.75);
  const blur = () => props.pluginSettings?.surfaceBlur ?? props.baseSurfaceBlur ?? 12;

  const effectiveTheme = () =>
    getEffectiveThemeStyles(
      themeConfig(),
      props.dataBgLightness,
      opacity(),
      blur()
    );

  return (
    <div
      style={{
        ...S.container,
        ...effectiveTheme(),
        background: `rgba(var(--panel-rgb, 15, 23, 42), var(--plugin-surface-opacity, ${opacity()}))`,
        "backdrop-filter": `blur(var(--surface-blur, ${blur()}px))`,
        "-webkit-backdrop-filter": `blur(var(--surface-blur, ${blur()}px))`,
      }}
    >
      {/* Dynamic Header: Context Capsule Bar (Third Design) or Classic TabBar */}
      <Show
        when={props.pluginSettings?.designMode === "standard-tabs"}
        fallback={
          <ContextCapsuleBar
            activeTab={activeTab()}
            tabs={tabs()}
            workspaces={workspaces()}
            currentWorkspace={currentWorkspace()}
            searchEngine={props.pluginSettings?.searchEngine ?? "duckduckgo"}
            homeUrl={props.pluginSettings?.homeUrl ?? ""}
            isBookmarked={isCurrentBookmarked()}
            orbitDeckOpen={orbitDeckOpen()}
            isWsMenuOpen={workspaceMenuOpen()}
            onWsMenuToggle={(open) => setWorkspaceMenuOpen(open)}
            onToggleOrbitDeck={() => {
              const nextState = !orbitDeckOpen();
              if (nextState) hideAllDockedWebviews();
              setOrbitDeckOpen(nextState);
            }}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onNewTab={(url, parentId) => handleNewTab(url, parentId, currentWorkspace().id)}
            onUpdateTabWorkspace={handleUpdateTabWorkspace}
            onNavigate={handleNavigate}
            onReload={handleReload}
            onGoHome={handleGoHome}
            onPopoutWebviewWindow={handlePopoutWebviewWindow}
            onOpenExternal={() => handleOpenExternal()}
            onToggleBookmark={handleToggleBookmark}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onResetZoom={handleResetZoom}
            onSwitchWorkspace={handleSwitchWorkspace}
            onOpenQuickSwitcher={() => setQuickSwitcherOpen(true)}
            onReorderTabs={handleReorderTabs}
            onReorderWorkspaces={handleReorderWorkspaces}
            onAddWorkspace={handleAddWorkspace}
            compactTabs={compactTabs()}
            shortcuts={effectiveShortcuts()}
            onToggleCompactTabs={handleToggleCompactTabs}
            onOpenHistory={() => {
              hideAllDockedWebviews();
              setHistoryModalOpen(true);
            }}
            onReopenClosedTab={() => handleReopenClosedTab()}
          />
        }
      >
        <div style={S.topBar}>
          <TabBar
            tabs={tabs()}
            activeTabId={activeTabId()}
            workspaces={workspaces()}
            currentWorkspace={currentWorkspace()}
            compactTabs={compactTabs()}
            shortcuts={effectiveShortcuts()}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onNewTab={() => handleNewTab("about:blank")}
            onUpdateTabWorkspace={handleUpdateTabWorkspace}
            onSwitchWorkspace={handleSwitchWorkspace}
            onReorderTabs={handleReorderTabs}
            onReorderWorkspaces={handleReorderWorkspaces}
            onAddWorkspace={handleAddWorkspace}
            onOpenQuickSwitcher={() => setQuickSwitcherOpen(true)}
            onToggleCompactTabs={handleToggleCompactTabs}
            onOpenHistory={() => {
              hideAllDockedWebviews();
              setHistoryModalOpen(true);
            }}
            onReopenClosedTab={() => handleReopenClosedTab()}
          />

          <NavigationBar
            activeTab={activeTab()}
            searchEngine={props.pluginSettings?.searchEngine ?? "duckduckgo"}
            homeUrl={props.pluginSettings?.homeUrl ?? ""}
            isBookmarked={isCurrentBookmarked()}
            shortcuts={effectiveShortcuts()}
            onNavigate={handleNavigate}
            onReload={handleReload}
            onGoHome={handleGoHome}
            onPopoutWebviewWindow={handlePopoutWebviewWindow}
            onOpenExternal={() => handleOpenExternal()}
            onToggleBookmark={handleToggleBookmark}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onResetZoom={handleResetZoom}
            onOpenHistory={() => {
              hideAllDockedWebviews();
              setHistoryModalOpen(true);
            }}
          />
        </div>
      </Show>

      {/* The Context Orbit Deck (The Third Design: Cluster Matrix & Spatial 2D Canvas) */}
      <ContextOrbitDeck
        isOpen={orbitDeckOpen()}
        onClose={() => setOrbitDeckOpen(false)}
        tabs={tabs()}
        activeTabId={activeTabId()}
        workspaces={workspaces()}
        currentWorkspace={currentWorkspace()}
        layoutMode={orbitLayoutMode()}
        smartRouterConfig={props.pluginSettings?.smartRouter}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={(url, parentId, wsId) => handleNewTab(url, parentId, wsId)}
        onPopoutTab={(url, title) => {
          openInWebviewWindow(url, title || getDomain(url), getLaunchOptions());
        }}
        onOpenExternal={handleOpenExternal}
        onSwitchWorkspace={handleSwitchWorkspace}
        onReorderTabs={handleReorderTabs}
        onReorderWorkspaces={handleReorderWorkspaces}
        onAddWorkspace={(name, color, keywords) => {
          handleAddWorkspace(name, color, "✦", keywords);
        }}
        onUpdateTabProject={(tabId, projectId) => {
          const next = tabs().map((t) => (t.id === tabId ? { ...t, projectId } : t));
          setTabs(next);
          persistCurrentTabs(next);
        }}
        onUpdateTabPosition={(tabId, x, y) => {
          const next = tabs().map((t) => (t.id === tabId ? { ...t, position: { x, y } } : t));
          setTabs(next);
          persistCurrentTabs(next);
        }}
        onToggleLayoutMode={(mode) => {
          props.onPluginSettingsChange?.({ orbitDeckLayout: mode });
        }}
        onUpdateSmartRouter={(patch) => {
          const current = props.pluginSettings?.smartRouter || {
            enabled: true,
            provider: "heuristic",
            apiEndpointUrl: "http://127.0.0.1:1234/v1",
            modelName: "laya",
            autoCreateCategories: true,
          };
          props.onPluginSettingsChange?.({ smartRouter: { ...current, ...patch } });
        }}
      />

      <QuickTabSwitcher
        isOpen={quickSwitcherOpen()}
        tabs={tabs()}
        activeTabId={activeTabId()}
        workspaces={workspaces()}
        onClose={() => setQuickSwitcherOpen(false)}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={(url) => handleNewTab(url, activeTab()?.id, currentWorkspace().id)}
      />

      <HistoryModal
        isOpen={historyModalOpen()}
        onClose={() => setHistoryModalOpen(false)}
        history={history()}
        closedTabs={closedTabs()}
        workspaces={workspaces()}
        currentWorkspace={currentWorkspace()}
        onSelectUrl={(url, title, projectId) => {
          if (projectId && projectId !== currentWorkspaceId()) {
            setCurrentWorkspaceId(projectId);
          }
          handleNavigate(url);
          setHistoryModalOpen(false);
        }}
        onOpenInNewTab={(url, title, projectId) => {
          handleNewTab(url, activeTab()?.id, projectId || currentWorkspace().id);
          setHistoryModalOpen(false);
        }}
        onReopenClosedTab={(rec) => {
          handleReopenClosedTab(rec);
          setHistoryModalOpen(false);
        }}
        onReopenAllClosedTabs={(projectId) => {
          handleReopenAllClosedTabs(projectId);
          setHistoryModalOpen(false);
        }}
        onRemoveHistoryItem={(id) => setHistory(removeHistoryItem(id))}
        onClearHistory={() => {
          clearHistory();
          setHistory([]);
        }}
        onRemoveClosedTab={(id) => setClosedTabs(removeClosedTab(id))}
        onClearClosedTabs={(projectId) => setClosedTabs(clearClosedTabs(projectId))}
      />

      <WebViewport
        activeTab={activeTab()}
        tabs={tabs()}
        bookmarks={bookmarks()}
        history={history()}
        active={props.active}
        isOverlayOpen={orbitDeckOpen() || workspaceMenuOpen() || quickSwitcherOpen() || historyModalOpen()}
        dockedChildWebview={props.pluginSettings?.dockedChildWebview !== false}
        autoLaunchRestricted={props.pluginSettings?.autoLaunchRestricted ?? false}
        onOpenUrl={handleNavigate}
        onNewTab={(url) => handleNewTab(url, activeTab()?.id, currentWorkspace().id)}
        onOpenInWebviewWindow={(url) => {
          const domain = getDomain(url);
          openInWebviewWindow(url, domain, getLaunchOptions());
          setHistory(addHistoryItem(domain, url, activeTab()?.projectId || currentWorkspace().id, activeTab()?.favicon));
        }}
        onOpenExternal={handleOpenExternal}
        onAddBookmark={handleAddBookmark}
        onRemoveBookmark={handleRemoveBookmark}
        onRemoveHistory={(id) => setHistory(removeHistoryItem(id))}
        onClearHistory={() => {
          clearHistory();
          setHistory([]);
        }}
      />
    </div>
  );
}

// Register the plugin with Flurer's plugin host
(window as any).registerPlugin({
  id: "web-loader",
  name: "Web Loader",
  description: "High-performance browser and WebviewWindow loader for modern websites and local web apps.",
  version: typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.1.29",
  author: "Algosculptor",
  hasCustomAppearanceSettings: true,
  viewRailButton: (props: any) => (
    <button
      type="button"
      class="view-rail-item"
      classList={{ active: props.active }}
      title="Web Loader (Browser)"
      aria-label="Web Loader"
      onClick={props.onClick}
    >
      <GlobeIcon size={20} />
    </button>
  ),
  fullPanel: (props: any) => <WebBrowserPanel {...props} />,
  settingsPanel: (props: any) => <SettingsPanel {...props} />,
});
