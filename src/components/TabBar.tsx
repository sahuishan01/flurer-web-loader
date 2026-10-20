import { For, Show, createSignal, createEffect, onCleanup } from "solid-js";
import { Tab, ProjectWorkspace } from "../types";
import { S } from "../styles";
import { PlusIcon, CloseIcon, GlobeIcon, SearchIcon, CompactIcon } from "../icons";
import { WebsiteIcon } from "./WebsiteIcon";
import { getModifierKey, tabMatchesWorkspace } from "../utils";
import {
  draggedTabId,
  setDraggedTabId,
  draggedWorkspaceId,
  setDraggedWorkspaceId,
  TAB_DRAG_MIME,
  WORKSPACE_DRAG_MIME,
} from "../dragDrop";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  workspaces?: ProjectWorkspace[];
  currentWorkspace?: ProjectWorkspace;
  compactTabs?: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onOpenQuickSwitcher?: () => void;
  onUpdateTabWorkspace?: (tabId: string, projectId: string | undefined) => void;
  onSwitchWorkspace?: (id: string) => void;
  onReorderTabs?: (draggedTabId: string, targetTabId: string, insertBefore: boolean) => void;
  onReorderWorkspaces?: (draggedWsId: string, targetWsId: string, insertBefore: boolean) => void;
  onAddWorkspace?: (name: string, color?: string, icon?: string, keywords?: string[]) => string;
  onToggleCompactTabs?: () => void;
  shortcuts?: Record<string, string>;
}

export function TabBar(props: TabBarProps) {
  const mod = getModifierKey();
  const [tabMenu, setTabMenu] = createSignal<{ tabId: string; x: number; y: number } | null>(null);
  const [showWsMenu, setShowWsMenu] = createSignal(false);
  const [tabDropTarget, setTabDropTarget] = createSignal<{ id: string; isBefore: boolean } | null>(null);
  const [wsDropTarget, setWsDropTarget] = createSignal<{ id: string; isBefore: boolean } | null>(null);
  const [wsTabHoverTarget, setWsTabHoverTarget] = createSignal<string | null>(null);
  let wsHoverTimer: any = null;

  // Workspace creation state
  const [isCreatingWs, setIsCreatingWs] = createSignal(false);
  const [newWsName, setNewWsName] = createSignal("");
  const [newWsColor, setNewWsColor] = createSignal("#38bdf8");
  let wsInputRef: HTMLInputElement | undefined;

  const handleCreateWsSubmit = () => {
    const name = newWsName().trim();
    if (!name) return;
    const newId = props.onAddWorkspace?.(name, newWsColor());
    if (newId) {
      if (draggedTabId()) {
        props.onUpdateTabWorkspace?.(draggedTabId()!, newId);
        setDraggedTabId(null);
      }
      props.onSwitchWorkspace?.(newId);
    }
    setIsCreatingWs(false);
    setNewWsName("");
    setShowWsMenu(false);
  };

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

  onCleanup(() => {
    if (wsHoverTimer) {
      clearTimeout(wsHoverTimer);
      wsHoverTimer = null;
    }
  });

  const visibleTabs = () => {
    if (!props.currentWorkspace) return props.tabs;
    return props.tabs.filter((t) => tabMatchesWorkspace(t, props.currentWorkspace!.id));
  };

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
          title={`Quick Tab Search & Jump (${props.shortcuts?.quickSwitcher || "Ctrl+P"})`}
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
          title={props.compactTabs ? `Switch to Full Tab View (${props.shortcuts?.toggleCompact || "Ctrl+Shift+C"})` : `Switch to Compact Tab View (${props.shortcuts?.toggleCompact || "Ctrl+Shift+C"})`}
        >
          <CompactIcon size={16} />
        </button>
      </div>

      {/* Workspace Pill Dropdown Button (if workspaces available) */}
      <Show when={props.workspaces && props.workspaces.length > 0 && props.currentWorkspace}>
        <div
          style={{ position: "relative", "flex-shrink": 0 }}
          onDragEnter={(e) => {
            if (draggedTabId()) {
              if (wsHoverTimer) clearTimeout(wsHoverTimer);
              wsHoverTimer = setTimeout(() => {
                setShowWsMenu(true);
                wsHoverTimer = null;
              }, 110);
            }
          }}
          onDragOver={(e) => {
            if (draggedTabId()) {
              e.preventDefault();
              e.dataTransfer!.dropEffect = "move";
              if (!showWsMenu() && !wsHoverTimer) {
                wsHoverTimer = setTimeout(() => {
                  setShowWsMenu(true);
                  wsHoverTimer = null;
                }, 110);
              }
            }
          }}
          onDragLeave={(e) => {
            const related = e.relatedTarget as Node;
            if (related && (e.currentTarget as HTMLElement).contains(related)) return;
            if (wsHoverTimer) {
              clearTimeout(wsHoverTimer);
              wsHoverTimer = null;
            }
          }}
        >
          <button
            type="button"
            class="web-loader-action-btn"
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "5px 10px",
              "border-radius": "8px",
              background: `rgba(56, 189, 248, 0.14)`,
              border: `1px solid ${props.currentWorkspace!.color || "#38bdf8"}`,
              color: props.currentWorkspace!.color || "#38bdf8",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
              "font-weight": 600,
              cursor: "pointer",
            }}
            onClick={() => setShowWsMenu(!showWsMenu())}
            onDragOver={(e) => {
              if (draggedTabId()) {
                e.preventDefault();
                e.dataTransfer!.dropEffect = "move";
              }
            }}
            onDrop={(e) => {
              if (draggedTabId()) {
                e.preventDefault();
                e.stopPropagation();
                props.onUpdateTabWorkspace?.(draggedTabId()!, props.currentWorkspace!.id);
                if (wsHoverTimer) {
                  clearTimeout(wsHoverTimer);
                  wsHoverTimer = null;
                }
              }
            }}
            title="Switch Workspace / Group (drag tab here)"
          >
            <span>{props.currentWorkspace!.icon || "✦"}</span>
            <span>{props.currentWorkspace!.name}</span>
            <span style={{ "font-size": "9px", opacity: 0.8 }}>▾</span>
          </button>

          {/* Backdrop */}
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
                "box-shadow": "0 16px 40px rgba(0, 0, 0, 0.7)",
                "min-width": "220px",
                "max-height": "420px",
                "overflow-y": "auto",
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
                Workspaces (drag to reorder / drop tab)
              </div>

              <For each={props.workspaces}>
                {(ws) => {
                  const isHoveredForTab = () => wsTabHoverTarget() === ws.id;
                  const isWsDrop = () => wsDropTarget()?.id === ws.id;
                  const isDropBefore = () => wsDropTarget()?.isBefore;

                  return (
                    <div style={{ position: "relative" }}>
                      <Show when={isWsDrop() && draggedWorkspaceId() && draggedWorkspaceId() !== ws.id}>
                        <div
                          style={{
                            position: "absolute",
                            left: "4px",
                            right: "4px",
                            top: isDropBefore() ? "-2px" : "auto",
                            bottom: !isDropBefore() ? "-2px" : "auto",
                            height: "2px",
                            "border-radius": "1px",
                            background: "var(--accent-default, #38bdf8)",
                            "box-shadow": "0 0 6px rgba(56, 189, 248, 0.8)",
                            "z-index": 10,
                            "pointer-events": "none",
                          }}
                        />
                      </Show>

                      <button
                        type="button"
                        draggable={true}
                        style={{
                          display: "flex",
                          "align-items": "center",
                          "justify-content": "space-between",
                          gap: "8px",
                          width: "100%",
                          padding: "6px 8px",
                          "border-radius": "6px",
                          background: isHoveredForTab()
                            ? "rgba(56, 189, 248, 0.22)"
                            : ws.id === props.currentWorkspace?.id
                            ? "rgba(255, 255, 255, 0.1)"
                            : "transparent",
                          border: isHoveredForTab()
                            ? "1px dashed var(--accent-default, #38bdf8)"
                            : "1px solid transparent",
                          color: ws.color,
                          "font-size": "12px",
                          cursor: "pointer",
                          "text-align": "left",
                          transition: "all 0.15s ease",
                        }}
                        onDragStart={(e) => {
                          e.dataTransfer!.setData(WORKSPACE_DRAG_MIME, ws.id);
                          e.dataTransfer!.effectAllowed = "move";
                          setDraggedWorkspaceId(ws.id);
                        }}
                        onDragEnd={() => {
                          setDraggedWorkspaceId(null);
                          setWsDropTarget(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (draggedTabId()) {
                            e.dataTransfer!.dropEffect = "move";
                            setWsTabHoverTarget(ws.id);
                          } else if (draggedWorkspaceId() && draggedWorkspaceId() !== ws.id) {
                            e.dataTransfer!.dropEffect = "move";
                            const rect = e.currentTarget.getBoundingClientRect();
                            const isBefore = e.clientY < rect.top + rect.height / 2;
                            setWsDropTarget({ id: ws.id, isBefore });
                          }
                        }}
                        onDragLeave={() => {
                          if (wsTabHoverTarget() === ws.id) setWsTabHoverTarget(null);
                          if (wsDropTarget()?.id === ws.id) setWsDropTarget(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (draggedTabId()) {
                            props.onUpdateTabWorkspace?.(draggedTabId()!, ws.id);
                            setWsTabHoverTarget(null);
                            setShowWsMenu(false);
                          } else if (draggedWorkspaceId() && draggedWorkspaceId() !== ws.id) {
                            const isBefore = wsDropTarget()?.isBefore ?? true;
                            props.onReorderWorkspaces?.(draggedWorkspaceId()!, ws.id, isBefore);
                            setDraggedWorkspaceId(null);
                            setWsDropTarget(null);
                          }
                        }}
                        onClick={() => {
                          props.onSwitchWorkspace?.(ws.id);
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
                          {props.tabs.filter((t) => tabMatchesWorkspace(t, ws.id)).length}
                        </span>
                      </button>
                    </div>
                  );
                }}
              </For>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "4px 0" }} />

              {/* New Group Option / Inline Creation Form */}
              <Show
                when={isCreatingWs()}
                fallback={
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      "align-items": "center",
                      gap: "8px",
                      padding: "6px 8px",
                      "border-radius": "6px",
                      background: wsTabHoverTarget() === "new-group"
                        ? "rgba(56, 189, 248, 0.22)"
                        : "rgba(255, 255, 255, 0.04)",
                      border: wsTabHoverTarget() === "new-group"
                        ? "1px dashed var(--accent-default, #38bdf8)"
                        : "1px dashed rgba(255, 255, 255, 0.15)",
                      color: "var(--accent-default, #38bdf8)",
                      "font-size": "12px",
                      "font-weight": 500,
                      cursor: "pointer",
                      "text-align": "left",
                      width: "100%",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => {
                      setIsCreatingWs(true);
                      setTimeout(() => wsInputRef?.focus(), 25);
                    }}
                    onDragOver={(e) => {
                      if (draggedTabId()) {
                        e.preventDefault();
                        e.dataTransfer!.dropEffect = "move";
                        setWsTabHoverTarget("new-group");
                      }
                    }}
                    onDragLeave={() => {
                      if (wsTabHoverTarget() === "new-group") setWsTabHoverTarget(null);
                    }}
                    onDrop={(e) => {
                      if (draggedTabId()) {
                        e.preventDefault();
                        e.stopPropagation();
                        const tid = draggedTabId()!;
                        const tab = props.tabs.find((t) => t.id === tid);
                        const name = tab ? (tab.title && tab.title !== "New Tab" ? tab.title : getDomain(tab.url)) || "New Group" : "New Group";
                        const newId = props.onAddWorkspace?.(name, "#38bdf8");
                        if (newId) {
                          props.onUpdateTabWorkspace?.(tid, newId);
                          props.onSwitchWorkspace?.(newId);
                        }
                        setDraggedTabId(null);
                        setWsTabHoverTarget(null);
                        setShowWsMenu(false);
                      }
                    }}
                    title={`Create a new group / workspace (${props.shortcuts?.newWorkspace || "Ctrl+Shift+G"})`}
                  >
                    <PlusIcon size={14} />
                    <span>New Group</span>
                  </button>
                }
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateWsSubmit();
                  }}
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(0, 0, 0, 0.35)",
                    border: "1px solid rgba(56, 189, 248, 0.35)",
                    "border-radius": "6px",
                    margin: "2px 0",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                    <input
                      ref={wsInputRef}
                      type="text"
                      placeholder="Group name..."
                      value={newWsName()}
                      onInput={(e) => setNewWsName(e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsCreatingWs(false);
                          setNewWsName("");
                        }
                      }}
                      style={{
                        flex: 1,
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        "border-radius": "4px",
                        padding: "4px 8px",
                        color: "#f8fafc",
                        "font-size": "12px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", "align-items": "center", gap: "6px", "justify-content": "space-between" }}>
                    <div style={{ display: "flex", "align-items": "center", gap: "5px" }}>
                      <For each={["#38bdf8", "#05ffb0", "#a855f7", "#f59e0b", "#f43f5e", "#ec4899", "#94a3b8"]}>
                        {(c) => (
                          <button
                            type="button"
                            style={{
                              width: "16px",
                              height: "16px",
                              "border-radius": "50%",
                              background: c,
                              border: newWsColor() === c ? "2px solid #ffffff" : "1px solid rgba(0, 0, 0, 0.3)",
                              "box-shadow": newWsColor() === c ? `0 0 6px ${c}` : "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                            onClick={() => setNewWsColor(c)}
                          />
                        )}
                      </For>
                    </div>

                    <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted, #94a3b8)",
                          "font-size": "11px",
                          cursor: "pointer",
                          padding: "3px 6px",
                        }}
                        onClick={() => {
                          setIsCreatingWs(false);
                          setNewWsName("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newWsName().trim()}
                        style={{
                          background: "var(--accent-default, #38bdf8)",
                          border: "none",
                          "border-radius": "4px",
                          color: "#0f172a",
                          "font-size": "11px",
                          "font-weight": 600,
                          cursor: newWsName().trim() ? "pointer" : "not-allowed",
                          opacity: newWsName().trim() ? 1 : 0.5,
                          padding: "3px 8px",
                        }}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              </Show>
            </div>
          </Show>
        </div>
      </Show>

      {/* Scrollable Tab Strip */}
      <div
        style={{
          ...S.tabRow,
          flex: "1 1 auto",
          "min-width": 0,
        }}
      >
        <For each={visibleTabs()}>
          {(tab) => {
            const isActive = () => tab.id === props.activeTabId;
            const isCompact = () => !!props.compactTabs;
            const isTabDrop = () => tabDropTarget()?.id === tab.id;
            const isTabDropBefore = () => tabDropTarget()?.isBefore;

            return (
              <div style={{ position: "relative", display: "inline-flex", "align-items": "center", "flex-shrink": 0 }}>
                {/* Drop indicator line */}
                <Show when={isTabDrop() && draggedTabId() && draggedTabId() !== tab.id}>
                  <div
                    style={{
                      position: "absolute",
                      top: "2px",
                      bottom: "2px",
                      left: isTabDropBefore() ? "-2px" : "auto",
                      right: !isTabDropBefore() ? "-2px" : "auto",
                      width: "3px",
                      "border-radius": "2px",
                      background: "var(--accent-default, #38bdf8)",
                      "box-shadow": "0 0 8px rgba(56, 189, 248, 0.9)",
                      "z-index": 100,
                      "pointer-events": "none",
                    }}
                  />
                </Show>

                <div
                  draggable={true}
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
                    opacity: draggedTabId() === tab.id ? 0.45 : 1,
                    transition: "opacity 0.15s ease",
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer!.setData(TAB_DRAG_MIME, tab.id);
                    e.dataTransfer!.setData("text/plain", tab.id);
                    e.dataTransfer!.effectAllowed = "move";
                    setDraggedTabId(tab.id);
                  }}
                  onDragEnd={() => {
                    setDraggedTabId(null);
                    setTabDropTarget(null);
                  }}
                  onDragOver={(e) => {
                    if (draggedTabId() && draggedTabId() !== tab.id) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer!.dropEffect = "move";
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isBefore = e.clientX < rect.left + rect.width / 2;
                      setTabDropTarget({ id: tab.id, isBefore });
                    }
                  }}
                  onDragLeave={(e) => {
                    const related = e.relatedTarget as Node;
                    if (related && (e.currentTarget as HTMLElement).contains(related)) return;
                    if (tabDropTarget()?.id === tab.id) setTabDropTarget(null);
                  }}
                  onDrop={(e) => {
                    if (draggedTabId() && draggedTabId() !== tab.id) {
                      e.preventDefault();
                      e.stopPropagation();
                      const isBefore = tabDropTarget()?.isBefore ?? true;
                      props.onReorderTabs?.(draggedTabId()!, tab.id, isBefore);
                      setDraggedTabId(null);
                      setTabDropTarget(null);
                    }
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
                  title={`${tab.title || "New Tab"}\n${tab.url} (Drag to reorder / move)`}
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
                    title={`Close Tab (${props.shortcuts?.closeTab || "Ctrl+W"})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onCloseTab(tab.id);
                    }}
                  >
                    <CloseIcon size={isCompact() ? 10 : 15} />
                  </button>
                </div>
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
          onMouseDown={(e) => e.preventDefault()}
          onClick={props.onNewTab}
          title={`Open New Tab (${props.shortcuts?.newTab || "Ctrl+T"})`}
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
              color: "var(--accent-default, #38bdf8)",
              "font-size": "12px",
              cursor: "pointer",
              "text-align": "left",
              transition: "background 0.15s ease",
            }}
            onClick={() => {
              if (tabMenu()) {
                const tid = tabMenu()!.tabId;
                const tab = props.tabs.find((x) => x.id === tid);
                const name = tab ? (tab.title && tab.title !== "New Tab" ? tab.title : getDomain(tab.url)) || "New Group" : "New Group";
                const newId = props.onAddWorkspace?.(name, "#38bdf8");
                if (newId) {
                  props.onUpdateTabWorkspace?.(tid, newId);
                  props.onSwitchWorkspace?.(newId);
                }
                setTabMenu(null);
              }
            }}
          >
            <PlusIcon size={12} />
            <span>Create New Group...</span>
          </button>

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
