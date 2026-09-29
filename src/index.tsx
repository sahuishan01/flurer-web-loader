import { createSignal, createRoot } from "solid-js";
import { MainPanelProps, Tab, Bookmark, HistoryItem } from "./types";
import { S } from "./styles";
import { GlobeIcon } from "./icons";
import { TabBar } from "./components/TabBar";
import { NavigationBar } from "./components/NavigationBar";
import { WebViewport } from "./components/WebViewport";
import { SettingsPanel } from "./components/SettingsPanel";
import { themeConfig, getEffectiveThemeStyles } from "./theme";
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
} from "./utils";

declare const __VERSION__: string;

const STYLE_ID = "flurer-web-loader-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    .web-loader-icon-btn {
      padding: 0 !important;
      box-sizing: border-box !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      line-height: 1 !important;
    }
    .web-loader-icon-btn svg {
      display: block !important;
      flex-shrink: 0 !important;
      pointer-events: none;
    }
  `;
  document.head.appendChild(styleEl);
}

let tabCounter = 0;

function createNewTab(url: string = "about:blank", title: string = "New Tab"): Tab {
  return {
    id: `tab-${++tabCounter}`,
    title,
    url,
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
    zoom: 1.0,
    mode: "embedded",
  };
}

function initRestoredTabs(): { tabs: Tab[]; activeId: string } {
  const saved = getSavedTabs();
  const savedActive = getSavedActiveTab();
  if (saved.length > 0) {
    const restored = saved.map((s) => createNewTab(s.url, s.title));
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

  const getLaunchOptions = () => ({
    incognito: props.pluginSettings?.incognitoMode,
    userAgent: props.pluginSettings?.customUserAgent,
    reuseExisting: props.pluginSettings?.singleWindowPerDomain ?? true,
  });

  const persistCurrentTabs = (currentTabs: Tab[], activeUrl?: string) => {
    saveTabs(currentTabs.map((t) => ({ title: t.title, url: t.url })));
    if (activeUrl !== undefined) {
      saveActiveTab(activeUrl === "about:blank" ? null : activeUrl);
    }
  };

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    const target = tabs().find((t) => t.id === id);
    if (target) {
      saveActiveTab(target.url === "about:blank" ? null : target.url);
    }
  };

  const handleNewTab = (url: string = "about:blank") => {
    const newTab = createNewTab(url, url === "about:blank" ? "New Tab" : getDomain(url));
    const nextTabs = [...tabs(), newTab];
    setTabs(nextTabs);
    setActiveTabId(newTab.id);
    persistCurrentTabs(nextTabs, newTab.url);
  };

  const handleCloseTab = (id: string) => {
    const current = tabs();
    if (current.length === 1) {
      // If closing last tab, reset it to about:blank
      const fresh = [createNewTab()];
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
    }
    persistCurrentTabs(updated, nextActiveUrl);
  };

  const handleNavigate = (url: string) => {
    const id = activeTabId();
    const domain = getDomain(url);

    // If preferred launch mode is WebviewWindow, spawn directly
    if (props.pluginSettings?.defaultMode === "webviewwindow") {
      openInWebviewWindow(url, domain, getLaunchOptions());
      if (url && url !== "about:blank") {
        setHistory(addHistoryItem(domain, url));
      }
      return;
    }

    const nextTabs = tabs().map((t) => (t.id === id ? { ...t, url, title: domain } : t));
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
      // Trigger iframe reload by momentarily resetting URL
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
    const home = props.pluginSettings?.homeUrl || "about:blank";
    handleNavigate(home);
  };

  const handlePopoutWebviewWindow = () => {
    const current = activeTab();
    if (current && current.url !== "about:blank") {
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
        return { ...t, zoom: newZoom };
      })
    );
  };

  const handleResetZoom = () => {
    const id = activeTabId();
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

      <WebViewport
        activeTab={activeTab()}
        bookmarks={bookmarks()}
        history={history()}
        onOpenUrl={handleNavigate}
        onNewTab={handleNewTab}
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
  version: typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.1.8",
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
