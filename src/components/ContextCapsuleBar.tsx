import { Show, createSignal, createEffect } from "solid-js";
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
  const [showWsMenu, setShowWsMenu] = createSignal(false);

  // Sync omnibox with active tab's URL unless user is typing
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

  const activeTabsInProject = () =>
    props.tabs.filter((t) => (t.projectId || "general") === props.currentWorkspace.id);

  const activeIntent = (): TabIntent => props.activeTab?.intent || "general";
  const intentColor = () => INTENT_COLORS[activeIntent()];

  return (
    <div
      style={{
        ...S.topBar,
        gap: "8px",
        padding: "8px 12px",
      }}
    >
      {/* Top Capsule Row */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          gap: "10px",
          width: "100%",
        }}
      >
        {/* Left: Active Context Identity & Lineage */}
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "min-width": "0", flex: "1 1 auto" }}>
          {/* Workspace Pill Dropdown Button */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              class="web-loader-action-btn"
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "6px",
                padding: "4px 10px",
                "border-radius": "999px",
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
                }, 0.15)`,
                border: `1px solid ${props.currentWorkspace.color}`,
                color: props.currentWorkspace.color,
                "font-family": "Space Mono, monospace",
                "font-size": "12px",
                "font-weight": 600,
                cursor: "pointer",
              }}
              onClick={() => setShowWsMenu(!showWsMenu())}
              title="Switch Active Workspace / Project"
            >
              <span style={{ "font-size": "13px" }}>{props.currentWorkspace.icon || "✦"}</span>
              <span>{props.currentWorkspace.name}</span>
              <span
                style={{
                  "font-size": "10px",
                  opacity: 0.8,
                  padding: "1px 5px",
                  "border-radius": "999px",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                {activeTabsInProject().length}
              </span>
            </button>

            {/* Workspace Switcher Popover */}
            <Show when={showWsMenu()}>
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  "margin-top": "6px",
                  "z-index": 1000,
                  background: "rgba(15, 23, 42, 0.95)",
                  "backdrop-filter": "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  "border-radius": "10px",
                  padding: "6px",
                  "box-shadow": "0 10px 30px rgba(0, 0, 0, 0.4)",
                  "min-width": "180px",
                  display: "flex",
                  "flex-direction": "column",
                  gap: "4px",
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
                {props.workspaces.map((ws) => (
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
                        ws.id === props.currentWorkspace.id
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
                ))}
              </div>
            </Show>
          </div>

          {/* Intent Chip */}
          <span
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "4px",
              padding: "3px 8px",
              "border-radius": "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              color: intentColor(),
              "white-space": "nowrap",
            }}
            title={`Intent: ${INTENT_LABELS[activeIntent()]}`}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                "border-radius": "50%",
                background: intentColor(),
                display: "inline-block",
              }}
            />
            {activeIntent().toUpperCase()}
          </span>

          {/* Lineage Trail Pill (Parent -> Child Breadcrumb) */}
          <Show when={props.activeTab?.parentId && props.activeTab?.parentTitle}>
            <button
              type="button"
              class="web-loader-secondary-btn"
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "4px",
                padding: "3px 8px",
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

          {/* Active Tab Title Capsule */}
          <div
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "4px 10px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              "border-radius": "6px",
              "font-size": "12px",
              color: "var(--text-primary, #f8fafc)",
              "max-width": "260px",
              overflow: "hidden",
              "text-overflow": "ellipsis",
              "white-space": "nowrap",
            }}
            title={props.activeTab?.url}
          >
            <GlobeIcon size={14} />
            <span style={{ overflow: "hidden", "text-overflow": "ellipsis" }}>
              {props.activeTab?.title || "New Session"}
            </span>
          </div>
        </div>

        {/* Center / Right: The Context Orbit Deck Launcher & Fast Controls */}
        <div style={{ display: "flex", "align-items": "center", gap: "6px", "flex-shrink": 0 }}>
          {/* Main Orbit Deck Launcher Button */}
          <button
            type="button"
            class="web-loader-action-btn"
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "6px 14px",
              "border-radius": "999px",
              background: props.orbitDeckOpen
                ? "linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(168, 85, 247, 0.3))"
                : "rgba(255, 255, 255, 0.08)",
              border: props.orbitDeckOpen
                ? "1px solid var(--accent-default, #38bdf8)"
                : "1px solid rgba(255, 255, 255, 0.15)",
              color: props.orbitDeckOpen ? "#ffffff" : "var(--accent-default, #38bdf8)",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
              "font-weight": 600,
              cursor: "pointer",
              "box-shadow": props.orbitDeckOpen
                ? "0 0 16px rgba(56, 189, 248, 0.35)"
                : "none",
            }}
            onClick={props.onToggleOrbitDeck}
            title={`Toggle Workspace Orbit Deck (${mod}+E / ${mod}+K)`}
          >
            <OrbitIcon size={16} />
            <span>Workspace Orbit</span>
            <span
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                padding: "1px 6px",
                "border-radius": "999px",
                "font-size": "10px",
                color: "#f8fafc",
              }}
            >
              {props.tabs.length}
            </span>
          </button>

          {/* New Tab Quick Button */}
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "32px",
              height: "32px",
              "border-radius": "8px",
            }}
            onClick={() => props.onNewTab("about:blank", props.activeTab?.id)}
            title={`Open New Tab in ${props.currentWorkspace.name} (${mod}+T)`}
          >
            <PlusIcon size={18} />
          </button>

          {/* Close Tab Quick Button */}
          <Show when={props.activeTab}>
            <button
              type="button"
              class="icon-btn web-loader-icon-btn"
              style={{
                ...S.iconBtn,
                width: "32px",
                height: "32px",
                "border-radius": "8px",
                opacity: 0.8,
              }}
              onClick={() => props.activeTab && props.onCloseTab(props.activeTab.id)}
              title={`Close Active Tab (${mod}+W)`}
            >
              <CloseIcon size={15} />
            </button>
          </Show>
        </div>
      </div>

      {/* Bottom Navigation & Omnibox Row */}
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
