import { For, Show, createSignal, createEffect, onCleanup } from "solid-js";
import { Tab, ProjectWorkspace, TabIntent, SearchEngine } from "../types";
import { S } from "../styles";
import {
  OrbitIcon,
  PlusIcon,
  CloseIcon,
  GlobeIcon,
  ReloadIcon,
  HomeIcon,
  StarIcon,
  LockIcon,
  PopoutIcon,
  ExternalIcon,
  BranchIcon,
  SparklesIcon,
  LayersIcon,
} from "../icons";
import { normalizeUrl, getModifierKey, getPlatformEngineName, getDomain } from "../utils";
import { INTENT_COLORS, INTENT_LABELS } from "../smartRouter";

interface ContextCapsuleBarProps {
  activeTab: Tab | undefined;
  tabs: Tab[];
  workspaces: ProjectWorkspace[];
  currentWorkspace: ProjectWorkspace;
  searchEngine: SearchEngine;
  homeUrl: string;
  isBookmarked: boolean;
  orbitDeckOpen: boolean;
  isWsMenuOpen?: boolean;
  onWsMenuToggle?: (isOpen: boolean) => void;
  onToggleOrbitDeck: () => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string, parentId?: string) => void;
  onNavigate: (url: string) => void;
  onReload: () => void;
  onGoHome: () => void;
  onPopoutWebviewWindow: () => void;
  onOpenExternal: () => void;
  onToggleBookmark: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSwitchWorkspace: (workspaceId: string) => void;
}

export function ContextCapsuleBar(props: ContextCapsuleBarProps) {
  const mod = getModifierKey();
  const engineName = getPlatformEngineName();
  const [inputValue, setInputValue] = createSignal("");
  const [isFocused, setIsFocused] = createSignal(false);
  const [internalWsMenu, setInternalWsMenu] = createSignal(false);
  const showWsMenu = () => (props.isWsMenuOpen !== undefined ? props.isWsMenuOpen : internalWsMenu());
  const setShowWsMenu = (open: boolean) => {
    setInternalWsMenu(open);
    props.onWsMenuToggle?.(open);
  };
  const [showAllWorkspaces, setShowAllWorkspaces] = createSignal(false);

  createEffect(() => {
    if (!showWsMenu()) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWsMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  // Sync omnibox with active tab's URL unless user is actively typing
  createEffect(() => {
    if (!isFocused() && props.activeTab) {
      setInputValue(props.activeTab.url === "about:blank" ? "" : props.activeTab.url);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const targetUrl = normalizeUrl(inputValue(), props.searchEngine);
    props.onNavigate(targetUrl);
  };

  const visibleTabs = () => {
    if (showAllWorkspaces()) {
      return props.tabs;
    }
    const currentWsId = props.currentWorkspace.id;
    const inWs = props.tabs.filter((t) => (t.projectId || "general") === currentWsId);
    // If no tabs in selected workspace, fall back to all tabs so user is never stranded
    return inWs.length > 0 ? inWs : props.tabs;
  };

  const activeIntent = (): TabIntent => props.activeTab?.intent || "general";
  const intentColor = () => INTENT_COLORS[activeIntent()];

  return (
    <div
      style={{
        ...S.topBar,
        position: "relative",
        "z-index": 50,
        gap: "6px",
        padding: "6px 12px",
      }}
    >
      {/* Row 1: Workspace Selector + Living Tab Capsules Strip + Add Tab + Orbit Deck Button */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          gap: "8px",
          width: "100%",
          "min-width": 0,
        }}
      >
        {/* Workspace Pill Dropdown Button */}
        <div style={{ position: "relative", "flex-shrink": 0 }}>
          <button
            type="button"
            class="web-loader-action-btn"
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "5px 10px",
              "border-radius": "8px",
              background: `rgba(${
                props.currentWorkspace.color === "#38bdf8"
                  ? "56, 189, 248"
                  : props.currentWorkspace.color === "#05ffb0"
                  ? "5, 255, 176"
                  : props.currentWorkspace.color === "#a855f7"
                  ? "168, 85, 247"
                  : props.currentWorkspace.color === "#f59e0b"
                  ? "245, 158, 11"
                  : "148, 163, 184"
              }, 0.18)`,
              border: `1px solid ${props.currentWorkspace.color}`,
              color: props.currentWorkspace.color,
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
              "font-weight": 600,
              cursor: "pointer",
            }}
            onClick={() => setShowWsMenu(!showWsMenu())}
            title="Switch Workspace / Project (or view All Tabs)"
          >
            <span>{showAllWorkspaces() ? "❖" : props.currentWorkspace.icon || "✦"}</span>
            <span>{showAllWorkspaces() ? "All Tabs" : props.currentWorkspace.name}</span>
            <span
              style={{
                "font-size": "10px",
                padding: "1px 5px",
                "border-radius": "999px",
                background: "rgba(0, 0, 0, 0.35)",
                color: "#ffffff",
              }}
            >
              {visibleTabs().length}
            </span>
            <span style={{ "font-size": "9px", opacity: 0.8 }}>▾</span>
          </button>

          {/* Backdrop to capture outside clicks and prevent webview click blocking */}
          <Show when={showWsMenu()}>
            <div
              style={{
                position: "fixed",
                inset: 0,
                "z-index": 9998,
                background: "rgba(0, 0, 0, 0.25)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowWsMenu(false);
              }}
            />
          </Show>

          {/* Workspace Switcher Popover */}
          <Show when={showWsMenu()}>
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                "margin-top": "6px",
                "z-index": 9999,
                background: "rgba(15, 23, 42, 0.98)",
                "backdrop-filter": "blur(20px)",
                "-webkit-backdrop-filter": "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                "border-radius": "10px",
                padding: "8px",
                "box-shadow": "0 16px 40px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.1)",
                "min-width": "220px",
                display: "flex",
                "flex-direction": "column",
                gap: "4px",
                animation: "web-loader-card-enter 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >
              <div
                style={{
                  padding: "4px 8px",
                  "font-size": "10px",
                  "font-family": "Space Mono, monospace",
                  color: "var(--text-muted, #94a3b8)",
                  "text-transform": "uppercase",
                  "letter-spacing": "0.1em",
                }}
              >
                Workspaces
              </div>

              {/* View All Tabs Option */}
              <button
                type="button"
                style={{
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "space-between",
                  gap: "8px",
                  padding: "6px 8px",
                  "border-radius": "6px",
                  background: showAllWorkspaces() ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  border: "none",
                  color: "#ffffff",
                  "font-size": "12px",
                  cursor: "pointer",
                  "text-align": "left",
                }}
                onClick={() => {
                  setShowAllWorkspaces(true);
                  setShowWsMenu(false);
                }}
              >
                <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                  <span>❖</span>
                  <span>All Tabs</span>
                </div>
                <span
                  style={{
                    "font-size": "10px",
                    "font-family": "Space Mono, monospace",
                    color: "var(--text-muted, #94a3b8)",
                  }}
                >
                  {props.tabs.length}
                </span>
              </button>

              <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "2px 0" }} />

              <For each={props.workspaces}>
                {(ws) => (
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      gap: "8px",
                      padding: "6px 8px",
                      "border-radius": "6px",
                      background:
                        !showAllWorkspaces() && ws.id === props.currentWorkspace.id
                          ? "rgba(255, 255, 255, 0.1)"
                          : "transparent",
                      border: "none",
                      color: ws.color,
                      "font-size": "12px",
                      cursor: "pointer",
                      "text-align": "left",
                      transition: "background 0.15s ease",
                    }}
                    onClick={() => {
                      setShowAllWorkspaces(false);
                      props.onSwitchWorkspace(ws.id);
                      setShowWsMenu(false);
                    }}
                  >
                    <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                      <span>{ws.icon || "✦"}</span>
                      <span style={{ color: "var(--text-primary, #f8fafc)" }}>{ws.name}</span>
                    </div>
                    <span
                      style={{
                        "font-size": "10px",
                        "font-family": "Space Mono, monospace",
                        color: "var(--text-muted, #94a3b8)",
                      }}
                    >
                      {props.tabs.filter((t) => (t.projectId || "general") === ws.id).length}
                    </span>
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Scrollable Living Tab Capsules Strip */}
        <div
          style={{
            display: "flex",
            "align-items": "center",
            gap: "6px",
            flex: "1 1 auto",
            "min-width": 0,
            overflow: "auto",
            "scrollbar-width": "none",
          }}
        >
          <For each={visibleTabs()}>
            {(tab) => {
              const isActive = () => tab.id === props.activeTab?.id;
              const intent = (): TabIntent => tab.intent || "general";
              const badgeColor = () => INTENT_COLORS[intent()];

              return (
                <div
                  class="web-loader-tab"
                  style={{
                    display: "inline-flex",
                    "align-items": "center",
                    gap: "6px",
                    padding: "5px 10px",
                    "border-radius": "8px",
                    "font-size": "12px",
                    "font-family": "system-ui, sans-serif",
                    color: isActive() ? "#38bdf8" : "var(--text-secondary, #cbd5e1)",
                    background: isActive()
                      ? "rgba(56, 189, 248, 0.18)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: isActive()
                      ? "1px solid rgba(56, 189, 248, 0.45)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    "box-shadow": isActive() ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "none",
                    cursor: "pointer",
                    "flex-shrink": 0,
                    "max-width": "200px",
                    "min-width": "110px",
                    "user-select": "none",
                  }}
                  onClick={() => props.onSelectTab(tab.id)}
                  title={tab.url}
                >
                  <GlobeIcon size={14} />
                  <span
                    style={{
                      overflow: "hidden",
                      "text-overflow": "ellipsis",
                      "white-space": "nowrap",
                      flex: 1,
                      "font-weight": isActive() ? 600 : 400,
                    }}
                  >
                    {tab.title || "New Tab"}
                  </span>

                  {/* Intent tag pill on the tab */}
                  <span
                    style={{
                      "font-size": "9px",
                      "font-family": "Space Mono, monospace",
                      padding: "1px 4px",
                      "border-radius": "3px",
                      background: "rgba(0, 0, 0, 0.3)",
                      color: badgeColor(),
                      "flex-shrink": 0,
                    }}
                  >
                    {intent().slice(0, 3).toUpperCase()}
                  </span>

                  {/* Close Tab Button */}
                  <button
                    type="button"
                    class="icon-btn web-loader-icon-btn web-loader-tab-close"
                    style={{
                      ...S.tabCloseBtn,
                      width: "18px",
                      height: "18px",
                      "min-width": "18px",
                      "min-height": "18px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onCloseTab(tab.id);
                    }}
                    title="Close Tab"
                  >
                    <CloseIcon size={12} />
                  </button>
                </div>
              );
            }}
          </For>

          {/* New Tab Button */}
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "30px",
              height: "30px",
              "min-width": "30px",
              "min-height": "30px",
              "border-radius": "6px",
              "flex-shrink": 0,
            }}
            onClick={() => props.onNewTab("about:blank", props.activeTab?.id)}
            title={`Open New Tab in ${props.currentWorkspace.name} (${mod}+T)`}
          >
            <PlusIcon size={16} />
          </button>
        </div>

        {/* Orbit View Launcher Button */}
        <button
          type="button"
          class="web-loader-action-btn"
          style={{
            display: "inline-flex",
            "align-items": "center",
            gap: "6px",
            padding: "5px 12px",
            "border-radius": "999px",
            background: props.orbitDeckOpen
              ? "linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(168, 85, 247, 0.4))"
              : "rgba(255, 255, 255, 0.08)",
            border: props.orbitDeckOpen
              ? "1px solid var(--accent-default, #38bdf8)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            color: props.orbitDeckOpen ? "#ffffff" : "var(--accent-default, #38bdf8)",
            "font-family": "Space Mono, monospace",
            "font-size": "11px",
            "font-weight": 600,
            cursor: "pointer",
            "flex-shrink": 0,
            "box-shadow": props.orbitDeckOpen
              ? "0 0 16px rgba(56, 189, 248, 0.4)"
              : "none",
          }}
          onClick={props.onToggleOrbitDeck}
          title={`Toggle Workspace Orbit Canvas (${mod}+E / ${mod}+K)`}
        >
          <OrbitIcon size={15} />
          <span>Orbit Canvas</span>
          <span
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              padding: "1px 5px",
              "border-radius": "999px",
              "font-size": "10px",
              color: "#f8fafc",
            }}
          >
            {props.tabs.length}
          </span>
        </button>
      </div>

      {/* Row 2: History Controls + Lineage + Omnibox + Zoom + Windows */}
      <div style={S.navRow}>
        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          classList={{ "web-loader-spinning": props.activeTab?.isLoading }}
          style={S.iconBtn}
          onClick={props.onReload}
          title={`Reload Page (F5 / ${mod}+R)`}
        >
          <ReloadIcon size={20} />
        </button>

        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={S.iconBtn}
          onClick={props.onGoHome}
          title="Go to Home"
        >
          <HomeIcon size={20} />
        </button>

        {/* Lineage Trail Pill (Parent -> Child Breadcrumb) */}
        <Show when={props.activeTab?.parentId && props.activeTab?.parentTitle}>
          <button
            type="button"
            class="web-loader-secondary-btn"
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "4px",
              padding: "4px 8px",
              "border-radius": "6px",
              background: "rgba(0, 240, 255, 0.08)",
              border: "1px solid rgba(0, 240, 255, 0.25)",
              color: "#00f0ff",
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              cursor: "pointer",
              "max-width": "180px",
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "white-space": "nowrap",
              "flex-shrink": 0,
            }}
            onClick={() => {
              if (props.activeTab?.parentId) {
                props.onSelectTab(props.activeTab.parentId);
              }
            }}
            title={`Jump to parent origin tab: ${props.activeTab?.parentTitle}`}
          >
            <BranchIcon size={12} />
            <span style={{ overflow: "hidden", "text-overflow": "ellipsis" }}>
              ↳ {props.activeTab?.parentTitle}
            </span>
          </button>
        </Show>

        {/* Omnibox */}
        <form
          onSubmit={handleSubmit}
          class="web-loader-omnibox"
          style={{
            ...S.omniboxContainer,
            ...(isFocused()
              ? {
                  "border-color": "var(--accent-default, #38bdf8)",
                  "box-shadow":
                    "0 0 0 3px rgba(var(--accent-rgb, 56, 189, 248), 0.22), 0 4px 16px rgba(0, 0, 0, 0.25)",
                }
              : {}),
          }}
        >
          <LockIcon size={16} />
          <input
            type="text"
            style={S.omniboxInput}
            placeholder={`Search ${props.searchEngine} or enter web address / localhost:port...`}
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {inputValue() && (
            <button
              type="button"
              class="icon-btn web-loader-icon-btn"
              style={{
                ...S.iconBtn,
                width: "24px",
                height: "24px",
                "min-width": "24px",
                "min-height": "24px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted, #94a3b8)",
              }}
              onClick={() => setInputValue("")}
              title="Clear input"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </form>

        {/* Bookmark Star */}
        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={{
            ...S.iconBtn,
            ...(props.isBookmarked ? { color: "#eab308" } : {}),
          }}
          onClick={props.onToggleBookmark}
          title={props.isBookmarked ? "Remove Bookmark" : "Bookmark this Page"}
        >
          <StarIcon size={20} filled={props.isBookmarked} />
        </button>

        {/* Zoom Controls */}
        <div style={{ display: "flex", "align-items": "center", gap: "2px" }}>
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "30px",
              height: "34px",
              "font-family": "Space Mono, monospace",
              "font-size": "16px",
              "font-weight": 700,
            }}
            onClick={props.onZoomOut}
            title="Zoom Out"
          >
            -
          </button>
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "56px",
              height: "34px",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
              "font-weight": 600,
              padding: "0 4px",
            }}
            onClick={props.onResetZoom}
            title="Reset Zoom"
          >
            {Math.round((props.activeTab?.zoom ?? 1) * 100)}%
          </button>
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "30px",
              height: "34px",
              "font-family": "Space Mono, monospace",
              "font-size": "16px",
              "font-weight": 700,
            }}
            onClick={props.onZoomIn}
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* Popout Button */}
        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={{
            ...S.iconBtn,
            background: "rgba(var(--accent-rgb, 56, 189, 248), 0.15)",
            color: "var(--accent-default, #38bdf8)",
            "border-color": "rgba(var(--accent-rgb, 56, 189, 248), 0.35)",
          }}
          onClick={props.onPopoutWebviewWindow}
          title={`Open in Dedicated Native WebviewWindow (${engineName})`}
        >
          <PopoutIcon size={20} />
        </button>

        {/* Open External Browser */}
        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={S.iconBtn}
          onClick={props.onOpenExternal}
          title="Open in System Default Browser"
        >
          <ExternalIcon size={20} />
        </button>
      </div>
    </div>
  );
}
