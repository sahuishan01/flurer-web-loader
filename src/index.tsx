import { createSignal, createRoot, Show, onMount, onCleanup, createEffect } from "solid-js";
import {
  MainPanelProps,
  Tab,
  Bookmark,
  HistoryItem,
  ProjectWorkspace,
  OrbitLayoutMode,
} from "./types";
import { S } from "./styles";
import { GlobeIcon } from "./icons";
import { TabBar } from "./components/TabBar";
import { NavigationBar } from "./components/NavigationBar";
import { ContextCapsuleBar } from "./components/ContextCapsuleBar";
import { ContextOrbitDeck } from "./components/ContextOrbitDeck";
import { WebViewport } from "./components/WebViewport";
import { SettingsPanel } from "./components/SettingsPanel";
import { themeConfig, getEffectiveThemeStyles } from "./theme";
import { DEFAULT_WORKSPACES, classifyHeuristic } from "./smartRouter";
import {
  openInWebviewWindow,
  openInExternalBrowser,
  getDomain,
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
  closeDockedWebview,
  setDockedWebviewZoom,
  getSavedWorkspaces,
  saveWorkspaces,
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

function createNewTab(
  url: string = "about:blank",
  title: string = "New Tab",
  parentId?: string,
  parentTitle?: string,
  projectId?: string
): Tab {
  const domain = url === "about:blank" ? "" : getDomain(url);
  const decision = classifyHeuristic(url, title || domain, getSavedWorkspaces(), projectId);
  return {
    id: `tab-${++tabCounter}`,
    title: title || (url === "about:blank" ? "New Tab" : domain),
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
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
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
    const restored = saved.map((s) => {
      const tab = createNewTab(s.url, s.title, s.parentId, s.parentTitle, s.projectId);
      if (s.intent) tab.intent = s.intent;
      if (s.pinned !== undefined) tab.pinned = s.pinned;
      if (s.position) tab.position = s.position;
      return tab;
    });
    const match = restored.find((t) => t.url === savedActive);
    return {
      tabs: restored,
      activeId: match ? match.id : restored[0].id,
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

function WebBrowserPanel(props: MainPanelProps) {
  const activeTab = () => tabs().find((t) => t.id === activeTabId()) || tabs()[0];

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
  const orbitLayoutMode = () => props.pluginSettings?.orbitDeckLayout ?? "matrix";

  // Sync currentWorkspaceId with active tab if active tab changes
  createEffect(() => {
    const cur = activeTab();
    if (cur?.projectId && cur.projectId !== currentWorkspaceId()) {
      const exists = workspaces().some((w) => w.id === cur.projectId);
      if (exists) {
        setCurrentWorkspaceId(cur.projectId);
      }
    }
  });

  // Global Keyboard shortcuts
  onMount(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && (e.key === "e" || e.key === "E" || e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOrbitDeckOpen((prev) => !prev);
      } else if (isMod && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        handleNewTab("about:blank", activeTab()?.id, currentWorkspace().id);
      } else if (isMod && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        if (activeTab()) {
          handleCloseTab(activeTab().id);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    onCleanup(() => window.removeEventListener("keydown", handleGlobalKey));
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
        projectId: t.projectId,
        intent: t.intent,
        parentId: t.parentId,
        parentTitle: t.parentTitle,
        pinned: t.pinned,
        position: t.position,
      }))
    );
    if (activeUrl !== undefined) {
      saveActiveTab(activeUrl === "about:blank" ? null : activeUrl);
    }
  };

  const handleSelectTab = (id: string) => {
    if (id !== activeTabId()) {
      closeDockedWebview();
    }
    setActiveTabId(id);
    const target = tabs().find((t) => t.id === id);
    if (target) {
      saveActiveTab(target.url === "about:blank" ? null : target.url);
      if (target.projectId) {
        setCurrentWorkspaceId(target.projectId);
      }
    }
  };

  const handleNewTab = (
    url: string = "about:blank",
    parentId?: string,
    projectId?: string
  ) => {
    closeDockedWebview();
    const parentTab = parentId ? tabs().find((t) => t.id === parentId) : undefined;
    const parentTitle = parentTab ? parentTab.title : undefined;
    const targetWs = projectId || parentTab?.projectId || currentWorkspace().id;
    const newTab = createNewTab(
      url,
      url === "about:blank" ? "New Tab" : getDomain(url),
      parentId,
      parentTitle,
      targetWs
    );
    const nextTabs = [...tabs(), newTab];
    setTabs(nextTabs);
    setActiveTabId(newTab.id);
    setCurrentWorkspaceId(targetWs);
    persistCurrentTabs(nextTabs, newTab.url);
  };

  const handleCloseTab = (id: string) => {
    if (id === activeTabId()) {
      closeDockedWebview();
    }
    const current = tabs();
    if (current.length === 1) {
      // If closing last tab, reset it to about:blank
      const fresh = [createNewTab("about:blank", "New Tab", undefined, undefined, currentWorkspace().id)];
      setTabs(fresh);
      setActiveTabId(fresh[0].id);
      persistCurrentTabs(fresh, fresh[0].url);
      return;
    }

    const idx = current.findIndex((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    setTabs(updated);

    let nextActiveUrl: string | undefined;
    if (activeTabId() === id) {
      const nextIdx = Math.max(0, idx - 1);
      setActiveTabId(updated[nextIdx].id);
      nextActiveUrl = updated[nextIdx].url;
      if (updated[nextIdx].projectId) {
        setCurrentWorkspaceId(updated[nextIdx].projectId);
      }
    }
    persistCurrentTabs(updated, nextActiveUrl);
  };

  const handleNavigate = (url: string) => {
    const id = activeTabId();
    const domain = getDomain(url);

    if (props.pluginSettings?.defaultMode === "webviewwindow") {
      openInWebviewWindow(url, domain, getLaunchOptions());
      if (url && url !== "about:blank") {
        setHistory(addHistoryItem(domain, url));
      }
      return;
    }

    const cur = tabs().find((t) => t.id === id);
    const decision = classifyHeuristic(url, domain, workspaces(), cur?.projectId);

    const nextTabs = tabs().map((t) =>
      t.id === id
        ? {
            ...t,
            url,
            title: domain,
            projectId: t.projectId || decision.projectId,
            intent: decision.intent,
            lastActiveAt: Date.now(),
          }
        : t
    );
    setTabs(nextTabs);
    persistCurrentTabs(nextTabs, url);
    if (url && url !== "about:blank") {
      setHistory(addHistoryItem(domain, url));
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
      setHistory(addHistoryItem(current.title || getDomain(current.url), current.url));
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
            onToggleOrbitDeck={() => setOrbitDeckOpen(!orbitDeckOpen())}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onNewTab={(url, parentId) => handleNewTab(url, parentId, currentWorkspace().id)}
            onNavigate={handleNavigate}
            onReload={handleReload}
            onGoHome={handleGoHome}
            onPopoutWebviewWindow={handlePopoutWebviewWindow}
            onOpenExternal={() => handleOpenExternal()}
            onToggleBookmark={handleToggleBookmark}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onResetZoom={handleResetZoom}
            onSwitchWorkspace={(wsId) => setCurrentWorkspaceId(wsId)}
          />
        }
      >
        <div style={S.topBar}>
          <TabBar
            tabs={tabs()}
            activeTabId={activeTabId()}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
            onNewTab={() => handleNewTab("about:blank")}
          />

          <NavigationBar
            activeTab={activeTab()}
            searchEngine={props.pluginSettings?.searchEngine ?? "duckduckgo"}
            homeUrl={props.pluginSettings?.homeUrl ?? ""}
            isBookmarked={isCurrentBookmarked()}
            onNavigate={handleNavigate}
            onReload={handleReload}
            onGoHome={handleGoHome}
            onPopoutWebviewWindow={handlePopoutWebviewWindow}
            onOpenExternal={() => handleOpenExternal()}
            onToggleBookmark={handleToggleBookmark}
            onZoomIn={() => handleZoom(0.1)}
            onZoomOut={() => handleZoom(-0.1)}
            onResetZoom={handleResetZoom}
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
        onSwitchWorkspace={(wsId) => setCurrentWorkspaceId(wsId)}
        onAddWorkspace={(name, color, keywords) => {
          const newWs = {
            id: `ws-${Date.now()}`,
            name,
            color,
            icon: "✦",
            keywords,
          };
          const updated = [...workspaces(), newWs];
          setWorkspaces(updated);
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
            localEndpointUrl: "http://127.0.0.1:11434",
            modelName: "laya-router",
            autoCreateCategories: true,
          };
          props.onPluginSettingsChange?.({ smartRouter: { ...current, ...patch } });
        }}
      />

      <WebViewport
        activeTab={activeTab()}
        bookmarks={bookmarks()}
        history={history()}
        active={props.active}
        dockedChildWebview={props.pluginSettings?.dockedChildWebview !== false}
        onOpenUrl={handleNavigate}
        onNewTab={(url) => handleNewTab(url, activeTab()?.id, currentWorkspace().id)}
        onOpenInWebviewWindow={(url) => {
          const domain = getDomain(url);
          openInWebviewWindow(url, domain, getLaunchOptions());
          setHistory(addHistoryItem(domain, url));
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
  version: typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.1.15",
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
