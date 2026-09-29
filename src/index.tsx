import { createSignal, createRoot, createEffect, onMount } from "solid-js";
import { MainPanelProps, Tab, Bookmark, WebPluginSettings } from "./types";
import { S } from "./styles";
import { GlobeIcon } from "./icons";
import { TabBar } from "./components/TabBar";
import { NavigationBar } from "./components/NavigationBar";
import { WebViewport } from "./components/WebViewport";
import { SettingsPanel } from "./components/SettingsPanel";
import { openInWebviewWindow, openInExternalBrowser, getDomain } from "./utils";

declare const __VERSION__: string;

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

// Module-level reactive state that survives unmount/remount across Flurer views
const [tabs, setTabs] = createRoot(() => createSignal<Tab[]>([createNewTab()]));
const [activeTabId, setActiveTabId] = createRoot(() => createSignal<string>(tabs()[0].id));
const [bookmarks, setBookmarks] = createRoot(() => createSignal<Bookmark[]>([]));

function WebBrowserPanel(props: MainPanelProps) {
  // Restore persisted state from pluginSettings on initial load
  onMount(() => {
    if (props.pluginSettings?.bookmarks && Array.isArray(props.pluginSettings.bookmarks)) {
      setBookmarks(props.pluginSettings.bookmarks);
    }

    if (props.pluginSettings?.persistTabs && props.pluginSettings.savedTabs?.length) {
      const restored = props.pluginSettings.savedTabs.map((saved) =>
        createNewTab(saved.url, saved.title)
      );
      if (restored.length > 0) {
        setTabs(restored);
        const match = restored.find((t) => t.url === props.pluginSettings.savedActiveTabUrl);
        setActiveTabId(match ? match.id : restored[0].id);
      }
    }
  });

  // Sync state changes back to pluginSettings for persistence
  createEffect(() => {
    const currentTabs = tabs();
    const activeId = activeTabId();
    const activeTab = currentTabs.find((t) => t.id === activeId);

    props.onPluginSettingsChange({
      bookmarks: bookmarks(),
      savedTabs: currentTabs.map((t) => ({ title: t.title, url: t.url })),
      savedActiveTabUrl: activeTab ? activeTab.url : undefined,
    });
  });

  const activeTab = () => tabs().find((t) => t.id === activeTabId()) || tabs()[0];

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleNewTab = (url: string = "about:blank") => {
    const newTab = createNewTab(url, url === "about:blank" ? "New Tab" : getDomain(url));
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    const current = tabs();
    if (current.length === 1) {
      // If closing last tab, reset it to about:blank
      setTabs([createNewTab()]);
      setActiveTabId(tabs()[0].id);
      return;
    }
    const idx = current.findIndex((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    setTabs(updated);

    if (activeTabId() === id) {
      const nextIdx = Math.max(0, idx - 1);
      setActiveTabId(updated[nextIdx].id);
    }
  };

  const handleNavigate = (url: string) => {
    const id = activeTabId();
    const domain = getDomain(url);

    // If preferred launch mode is WebviewWindow, spawn directly
    if (props.pluginSettings?.defaultMode === "webviewwindow") {
      openInWebviewWindow(url, domain);
      return;
    }

    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, url, title: domain } : t))
    );
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
      openInWebviewWindow(current.url, current.title);
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

    if (isCurrentBookmarked()) {
      setBookmarks((prev) => prev.filter((b) => b.url !== current.url));
    } else {
      const newBookmark: Bookmark = {
        id: `bm-${Date.now()}`,
        title: current.title || getDomain(current.url),
        url: current.url,
        category: "custom",
      };
      setBookmarks((prev) => [...prev, newBookmark]);
    }
  };

  const handleAddBookmark = (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      title,
      url,
      category,
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
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

  return (
    <div
      style={{
        ...S.container,
        background: `rgba(var(--panel-rgb, 15, 23, 42), ${opacity()})`,
        "backdrop-filter": `blur(${blur()}px)`,
        "-webkit-backdrop-filter": `blur(${blur()}px)`,
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
        onOpenUrl={handleNavigate}
        onOpenInWebviewWindow={(url) => openInWebviewWindow(url)}
        onOpenExternal={handleOpenExternal}
        onAddBookmark={handleAddBookmark}
        onRemoveBookmark={handleRemoveBookmark}
      />
    </div>
  );
}

// Register the plugin with Flurer's plugin host
(window as any).registerPlugin({
  id: "web-loader",
  name: "Web Loader",
  description: "High-performance browser and WebviewWindow loader for modern websites and local web apps.",
  version: typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.1.0",
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
      <GlobeIcon size={19} />
    </button>
  ),
  fullPanel: (props: any) => <WebBrowserPanel {...props} />,
  settingsPanel: (props: any) => <SettingsPanel {...props} />,
});
