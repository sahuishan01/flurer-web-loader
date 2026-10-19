import { For, Show, createSignal, createEffect, onCleanup } from "solid-js";
import { Tab, ProjectWorkspace } from "../types";
import { S } from "../styles";
import { PlusIcon, CloseIcon, GlobeIcon, SearchIcon, CompactIcon } from "../icons";
import { WebsiteIcon } from "./WebsiteIcon";
import { getModifierKey } from "../utils";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  workspaces?: ProjectWorkspace[];
  compactTabs?: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onOpenQuickSwitcher?: () => void;
  onUpdateTabWorkspace?: (tabId: string, projectId: string | undefined) => void;
  onToggleCompactTabs?: () => void;
}

export function TabBar(props: TabBarProps) {
  const mod = getModifierKey();
  const [tabMenu, setTabMenu] = createSignal<{ tabId: string; x: number; y: number } | null>(null);

  createEffect(() => {
    if (!tabMenu()) return;
    const handleClick = () => setTabMenu(null);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTabMenu(null);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKey);
    onCleanup(() => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    });
  });

  return (
    <div
      style={{
        display: "flex",
        "align-items": "center",
        gap: "6px",
        width: "100%",
        "min-width": 0,
      }}
    >
      {/* Extreme Left: Search / Quick Switcher + Compact Mode Toggle */}
      <div style={{ display: "flex", "align-items": "center", gap: "4px", "flex-shrink": 0 }}>
        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={{
            ...S.iconBtn,
            width: "32px",
            height: "32px",
            "min-width": "32px",
            "min-height": "32px",
            background: "rgba(255, 255, 255, 0.04)",
            color: "var(--text-muted, #94a3b8)",
          }}
          onClick={() => props.onOpenQuickSwitcher?.()}
          title={`Quick Tab Search & Jump (${mod}+P / ${mod}+O)`}
        >
          <SearchIcon size={16} />
        </button>

        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={{
            ...S.iconBtn,
            width: "32px",
            height: "32px",
            "min-width": "32px",
            "min-height": "32px",
            background: props.compactTabs ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.04)",
            color: props.compactTabs ? "var(--accent-default, #38bdf8)" : "var(--text-muted, #94a3b8)",
            border: props.compactTabs ? "1px solid rgba(56, 189, 248, 0.4)" : "none",
          }}
          onClick={() => props.onToggleCompactTabs?.()}
          title={props.compactTabs ? "Switch to Full Tab View" : "Switch to Compact Tab View (Favicons Only)"}
        >
          <CompactIcon size={16} />
        </button>
      </div>

      {/* Scrollable Tab Strip */}
      <div
        style={{
          ...S.tabRow,
          flex: "1 1 auto",
          "min-width": 0,
        }}
      >
        <For each={props.tabs}>
          {(tab) => {
            const isActive = () => tab.id === props.activeTabId;
            const isCompact = () => !!props.compactTabs;

            return (
              <div
                class={`web-loader-tab ${isActive() ? "active" : ""} ${isCompact() ? "web-loader-tab-compact" : ""}`}
                style={{
                  ...S.tab,
                  ...(isActive() ? S.tabActive : {}),
                  ...(isCompact()
                    ? {
                        "min-width": "34px",
                        "max-width": "54px",
                        padding: "6px 8px",
                        gap: "4px",
                        "justify-content": "center",
                      }
                    : {}),
                }}
                onClick={() => props.onSelectTab(tab.id)}
                onMouseDown={(e) => {
                  // Middle click to close tab
                  if (e.button === 1) {
                    e.preventDefault();
                    props.onCloseTab(tab.id);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTabMenu({ tabId: tab.id, x: e.clientX, y: e.clientY });
                }}
                title={`${tab.title || "New Tab"}\n${tab.url}`}
              >
                <WebsiteIcon url={tab.url} favicon={tab.favicon} size={16} />
                <Show when={!isCompact()}>
                  <span style={S.tabTitle}>{tab.title || "New Tab"}</span>
                </Show>
                <button
                  type="button"
                  class="icon-btn web-loader-icon-btn web-loader-tab-close"
                  style={{
                    ...S.tabCloseBtn,
                    ...(isCompact()
                      ? {
                          width: "14px",
                          height: "14px",
                          "min-width": "14px",
                          "min-height": "14px",
                          padding: "0",
                          ...(isActive() ? {} : { display: "none" }),
                        }
                      : {}),
                  }}
                  title="Close Tab"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onCloseTab(tab.id);
                  }}
                >
                  <CloseIcon size={isCompact() ? 10 : 15} />
                </button>
              </div>
            );
          }}
        </For>

        <button
          type="button"
          class="icon-btn web-loader-icon-btn"
          style={{
            ...S.iconBtn,
            width: "32px",
            height: "32px",
            "min-width": "32px",
            "min-height": "32px",
            "flex-shrink": 0,
          }}
          onClick={props.onNewTab}
          title={`Open New Tab (${mod}+T)`}
        >
          <PlusIcon size={18} />
        </button>
      </div>

      {/* Floating Tab Context Menu for Group / Ungroup */}
      <Show when={tabMenu()}>
        <div
          style={{
            position: "fixed",
            top: `${tabMenu()!.y}px`,
            left: `${Math.min(tabMenu()!.x, window.innerWidth - 220)}px`,
            "z-index": 10000,
            background: "rgba(15, 23, 42, 0.95)",
            "backdrop-filter": "blur(16px)",
            "-webkit-backdrop-filter": "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            "border-radius": "10px",
            padding: "6px",
            "box-shadow": "0 16px 36px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2)",
            "min-width": "200px",
            display: "flex",
            "flex-direction": "column",
            gap: "2px",
            animation: "web-loader-card-enter 0.15s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "4px 8px",
              "font-size": "10px",
              "font-family": "Space Mono, monospace",
              color: "var(--text-muted, #94a3b8)",
              "text-transform": "uppercase",
              "letter-spacing": "0.08em",
            }}
          >
            Assign Workspace
          </div>

          <For each={props.workspaces || []}>
            {(ws) => {
              const isCurrent = () => {
                const t = props.tabs.find((x) => x.id === tabMenu()?.tabId);
                return (t?.projectId || "general") === ws.id;
              };
              return (
                <button
                  type="button"
                  style={{
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "space-between",
                    gap: "8px",
                    padding: "6px 8px",
                    "border-radius": "6px",
                    background: isCurrent() ? "rgba(255, 255, 255, 0.1)" : "transparent",
                    border: "none",
                    color: "var(--text-primary, #f8fafc)",
                    "font-size": "12px",
                    cursor: "pointer",
                    "text-align": "left",
                    transition: "background 0.15s ease",
                  }}
                  onClick={() => {
                    if (tabMenu()) {
                      props.onUpdateTabWorkspace?.(tabMenu()!.tabId, ws.id);
                      setTabMenu(null);
                    }
                  }}
                >
                  <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                    <span style={{ color: ws.color }}>{ws.icon || "✦"}</span>
                    <span>{ws.name}</span>
                  </div>
                  {isCurrent() && (
                    <span style={{ color: "var(--accent-default, #38bdf8)", "font-size": "11px" }}>✓</span>
                  )}
                </button>
              );
            }}
          </For>

          <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "4px 0" }} />

          <button
            type="button"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "6px",
              padding: "6px 8px",
              "border-radius": "6px",
              background: "transparent",
              border: "none",
              color: "var(--text-secondary, #cbd5e1)",
              "font-size": "12px",
              cursor: "pointer",
              "text-align": "left",
            }}
            onClick={() => {
              if (tabMenu()) {
                props.onUpdateTabWorkspace?.(tabMenu()!.tabId, undefined);
                setTabMenu(null);
              }
            }}
          >
            <span>❖</span>
            <span>Ungroup Tab (General)</span>
          </button>

          <button
            type="button"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "6px",
              padding: "6px 8px",
              "border-radius": "6px",
              background: "transparent",
              border: "none",
              color: "#f87171",
              "font-size": "12px",
              cursor: "pointer",
              "text-align": "left",
            }}
            onClick={() => {
              if (tabMenu()) {
                props.onCloseTab(tabMenu()!.tabId);
                setTabMenu(null);
              }
            }}
          >
            <span>✕</span>
            <span>Close Tab</span>
          </button>
        </div>
      </Show>
    </div>
  );
}
