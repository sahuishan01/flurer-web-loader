import { For, Show, createSignal, createEffect, onCleanup, untrack } from "solid-js";
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
  SearchIcon,
  CompactIcon,
} from "../icons";
import { WebsiteIcon } from "./WebsiteIcon";
import { normalizeUrl, getModifierKey, getPlatformEngineName, getDomain, tabMatchesWorkspace } from "../utils";
import { INTENT_COLORS, INTENT_LABELS } from "../smartRouter";
import {
  draggedTabId,
  setDraggedTabId,
  draggedWorkspaceId,
  setDraggedWorkspaceId,
  TAB_DRAG_MIME,
  WORKSPACE_DRAG_MIME,
} from "../dragDrop";

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
  onOpenQuickSwitcher?: () => void;
  onUpdateTabWorkspace?: (tabId: string, projectId: string | undefined) => void;
  onReorderTabs?: (draggedTabId: string, targetTabId: string, insertBefore: boolean) => void;
  onReorderWorkspaces?: (draggedWsId: string, targetWsId: string, insertBefore: boolean) => void;
  onAddWorkspace?: (name: string, color?: string, icon?: string, keywords?: string[]) => string;
  compactTabs?: boolean;
  onToggleCompactTabs?: () => void;
  shortcuts?: Record<string, string>;
}

export function ContextCapsuleBar(props: ContextCapsuleBarProps) {
  const mod = getModifierKey();
  const engineName = getPlatformEngineName();
  const [inputValue, setInputValue] = createSignal("");
  const [isFocused, setIsFocused] = createSignal(false);
  const [internalWsMenu, setInternalWsMenu] = createSignal(false);
  const [tabMenu, setTabMenu] = createSignal<{ tabId: string; x: number; y: number } | null>(null);

  // Workspace creation state
  const [isCreatingWs, setIsCreatingWs] = createSignal(false);
  const [newWsName, setNewWsName] = createSignal("");
  const [newWsColor, setNewWsColor] = createSignal("#38bdf8");
  let wsInputRef: HTMLInputElement | undefined;

  const showWsMenu = () => (props.isWsMenuOpen !== undefined ? props.isWsMenuOpen : internalWsMenu());
  const setShowWsMenu = (open: boolean) => {
    if (!open) {
      setIsCreatingWs(false);
      setNewWsName("");
    }
    setInternalWsMenu(open);
    props.onWsMenuToggle?.(open);
  };
  const [showAllWorkspaces, setShowAllWorkspaces] = createSignal(false);

  // Drag and drop states for tabs and workspace reordering
  const [tabDropTarget, setTabDropTarget] = createSignal<{ id: string; isBefore: boolean } | null>(null);
  const [wsDropTarget, setWsDropTarget] = createSignal<{ id: string; isBefore: boolean } | null>(null);
  const [wsTabHoverTarget, setWsTabHoverTarget] = createSignal<string | null>(null);
  let wsHoverTimer: any = null;

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

  let inputRef: HTMLInputElement | undefined;

  // Sync omnibox with active tab's URL unless user is actively typing, and autofocus on new tab
  createEffect(() => {
    const tab = props.activeTab;
    if (!tab) return;
    const url = tab.url;

    if (url === "about:blank") {
      setInputValue("");
      setIsFocused(true);
      const doFocus = () => {
        if (inputRef) {
          inputRef.focus();
          if (inputRef.value) {
            inputRef.select();
          }
        }
      };
      doFocus();
      requestAnimationFrame(doFocus);
      setTimeout(doFocus, 25);
      setTimeout(doFocus, 75);
      setTimeout(doFocus, 150);
      setTimeout(doFocus, 300);
    } else if (!untrack(isFocused)) {
      setInputValue(url);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const targetUrl = normalizeUrl(inputValue(), props.searchEngine);
    props.onNavigate(targetUrl);
  };

  const handleCreateWsSubmit = () => {
    const name = newWsName().trim();
    if (!name) return;
    const newId = props.onAddWorkspace?.(name, newWsColor());
    if (newId) {
      if (draggedTabId()) {
        props.onUpdateTabWorkspace?.(draggedTabId()!, newId);
        setDraggedTabId(null);
      }
      props.onSwitchWorkspace(newId);
    }
    setIsCreatingWs(false);
    setNewWsName("");
    setShowWsMenu(false);
  };

  const visibleTabs = () => {
    if (showAllWorkspaces()) {
      return props.tabs;
    }
    return props.tabs.filter((t) => tabMatchesWorkspace(t, props.currentWorkspace.id));
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
      {/* Row 1: Extreme Left Controls (Search & Compact) + Workspace Selector + Living Tab Capsules Strip + Add Tab + Orbit Deck Button */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          gap: "8px",
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
              width: "30px",
              height: "30px",
              "min-width": "30px",
              "min-height": "30px",
              "border-radius": "6px",
              "flex-shrink": 0,
              background: "rgba(255, 255, 255, 0.04)",
              color: "var(--text-muted, #94a3b8)",
            }}
            onClick={() => props.onOpenQuickSwitcher?.()}
            title={`Quick Tab Search & Jump (${props.shortcuts?.quickSwitcher || "Ctrl+P"})`}
          >
            <SearchIcon size={15} />
          </button>

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
              background: props.compactTabs ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.04)",
              color: props.compactTabs ? "var(--accent-default, #38bdf8)" : "var(--text-muted, #94a3b8)",
              border: props.compactTabs ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
            }}
            onClick={() => props.onToggleCompactTabs?.()}
            title={props.compactTabs ? `Switch to Full Tab Titles (${props.shortcuts?.toggleCompact || "Ctrl+Shift+C"})` : `Switch to Compact Tab View (${props.shortcuts?.toggleCompact || "Ctrl+Shift+C"})`}
          >
            <CompactIcon size={14} />
          </button>
        </div>

        {/* Workspace Pill Dropdown Button */}
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
                props.onUpdateTabWorkspace?.(draggedTabId()!, props.currentWorkspace.id);
                if (wsHoverTimer) {
                  clearTimeout(wsHoverTimer);
                  wsHoverTimer = null;
                }
              }
            }}
            title="Switch Workspace / Project (drag tab here to group)"
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
                "min-width": "230px",
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
                  background: wsTabHoverTarget() === "all"
                    ? "rgba(56, 189, 248, 0.22)"
                    : showAllWorkspaces()
                    ? "rgba(255, 255, 255, 0.12)"
                    : "transparent",
                  border: wsTabHoverTarget() === "all"
                    ? "1px dashed var(--accent-default, #38bdf8)"
                    : "1px solid transparent",
                  color: "#ffffff",
                  "font-size": "12px",
                  cursor: "pointer",
                  "text-align": "left",
                  transition: "all 0.15s ease",
                }}
                onClick={() => {
                  setShowAllWorkspaces(true);
                  setShowWsMenu(false);
                }}
                onDragOver={(e) => {
                  if (draggedTabId()) {
                    e.preventDefault();
                    e.dataTransfer!.dropEffect = "move";
                    setWsTabHoverTarget("all");
                  }
                }}
                onDragLeave={() => {
                  if (wsTabHoverTarget() === "all") setWsTabHoverTarget(null);
                }}
                onDrop={(e) => {
                  if (draggedTabId()) {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onUpdateTabWorkspace?.(draggedTabId()!, undefined);
                    setWsTabHoverTarget(null);
                    setShowWsMenu(false);
                  }
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
                {(ws) => {
                  const isHoveredForTab = () => wsTabHoverTarget() === ws.id;
                  const isWsDrop = () => wsDropTarget()?.id === ws.id;
                  const isDropBefore = () => wsDropTarget()?.isBefore;

                  return (
                    <div style={{ position: "relative" }}>
                      {/* Drop indicator when reordering workspaces */}
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
                            : !showAllWorkspaces() && ws.id === props.currentWorkspace.id
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
                          props.onSwitchWorkspace(newId);
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
              const isCompact = () => !!props.compactTabs;
              const intent = (): TabIntent => tab.intent || "general";
              const badgeColor = () => INTENT_COLORS[intent()];

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
                      display: "inline-flex",
                      "align-items": "center",
                      "justify-content": isCompact() ? "center" : "flex-start",
                      gap: isCompact() ? "4px" : "6px",
                      padding: isCompact() ? "5px 7px" : "5px 10px",
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
                      "max-width": isCompact() ? "56px" : "200px",
                      "min-width": isCompact() ? "34px" : "110px",
                      "user-select": "none",
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
                    title={`${tab.title || "New Tab"}\n${tab.url} (Drag to reorder / move to group)`}
                  >
                  <WebsiteIcon url={tab.url} favicon={tab.favicon} size={15} />

                  <Show when={!isCompact()}>
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

                    {/* Intent tag pill on the tab - Click to group/ungroup */}
                    <span
                      style={{
                        "font-size": "9px",
                        "font-family": "Space Mono, monospace",
                        padding: "1px 5px",
                        "border-radius": "4px",
                        background: "rgba(0, 0, 0, 0.35)",
                        color: badgeColor(),
                        "flex-shrink": 0,
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTabMenu({ tabId: tab.id, x: rect.left, y: rect.bottom + 6 });
                      }}
                      title="Click or right-click tab to group/ungroup workspace"
                    >
                      {intent().slice(0, 3).toUpperCase()}
                    </span>
                  </Show>

                  {/* Close Tab Button */}
                  <button
                    type="button"
                    class="icon-btn web-loader-icon-btn web-loader-tab-close"
                    style={{
                      ...S.tabCloseBtn,
                      width: isCompact() ? "14px" : "18px",
                      height: isCompact() ? "14px" : "18px",
                      "min-width": isCompact() ? "14px" : "18px",
                      "min-height": isCompact() ? "14px" : "18px",
                      ...(isCompact() && !isActive() ? { display: "none" } : {}),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onCloseTab(tab.id);
                    }}
                    title={`Close Tab (${props.shortcuts?.closeTab || "Ctrl+W"})`}
                  >
                    <CloseIcon size={isCompact() ? 10 : 12} />
                  </button>
                </div>
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
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => props.onNewTab("about:blank", props.activeTab?.id)}
            title={`Open New Tab in ${props.currentWorkspace.name} (${props.shortcuts?.newTab || "Ctrl+T"})`}
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
          title={`Toggle Workspace Orbit Canvas (${props.shortcuts?.orbitDeck || "Ctrl+E"})`}
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
            ref={inputRef}
            type="text"
            autofocus={props.activeTab?.url === "about:blank"}
            style={S.omniboxInput}
            placeholder={`Search ${props.searchEngine} or enter web address / localhost:port...`}
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            title={`Address & Search Bar (${props.shortcuts?.focusOmnibox || "Ctrl+L"})`}
          />
          <Show when={!isFocused() && !inputValue()}>
            <span
              style={{
                "font-size": "10px",
                "font-family": "Space Mono, monospace",
                color: "var(--text-muted, #94a3b8)",
                padding: "2px 6px",
                background: "rgba(255, 255, 255, 0.06)",
                "border-radius": "4px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                "pointer-events": "none",
                "user-select": "none",
                "flex-shrink": 0,
                "margin-right": "4px",
              }}
            >
              {props.shortcuts?.focusOmnibox || "Ctrl+L"}
            </span>
          </Show>
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
            title={`Zoom Out (${props.shortcuts?.zoomOut || "Ctrl+-"})`}
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
            title={`Reset Zoom (${props.shortcuts?.resetZoom || "Ctrl+0"})`}
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
            title={`Zoom In (${props.shortcuts?.zoomIn || "Ctrl+="})`}
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

          <For each={props.workspaces}>
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
                  props.onSwitchWorkspace(newId);
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
