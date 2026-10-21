import { createSignal, createEffect, onCleanup, For, Show } from "solid-js";
import { HistoryItem, ClosedTabRecord, ProjectWorkspace } from "../types";
import { HistoryIcon, CloseIcon, PlusIcon, TrashIcon, GlobeIcon } from "../icons";
import { WebsiteIcon } from "./WebsiteIcon";
import { getDomain, getModifierKey } from "../utils";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  closedTabs: ClosedTabRecord[];
  workspaces: ProjectWorkspace[];
  currentWorkspace: ProjectWorkspace;
  onSelectUrl: (url: string, title?: string, projectId?: string) => void;
  onOpenInNewTab: (url: string, title?: string, projectId?: string) => void;
  onReopenClosedTab: (record: ClosedTabRecord) => void;
  onReopenAllClosedTabs: (projectId?: string) => void;
  onRemoveHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onRemoveClosedTab: (id: string) => void;
  onClearClosedTabs: (projectId?: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  if (secs < 30) return "Just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function HistoryModal(props: HistoryModalProps) {
  const mod = getModifierKey();
  const [activeTab, setActiveTab] = createSignal<"closed" | "history">("closed");
  const [scopeToWorkspace, setScopeToWorkspace] = createSignal(true);
  const [searchQuery, setSearchQuery] = createSignal("");
  let inputRef: HTMLInputElement | undefined;

  createEffect(() => {
    if (props.isOpen) {
      setSearchQuery("");
      setTimeout(() => inputRef?.focus(), 50);
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!props.isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      props.onClose();
    }
  };

  createEffect(() => {
    if (props.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
    }
  });

  const getWs = (wsId?: string) =>
    props.workspaces.find((w) => w.id === wsId) || props.workspaces[0];

  const filteredClosedTabs = () => {
    const q = searchQuery().trim().toLowerCase();
    const curWsId = props.currentWorkspace.id;
    let list = props.closedTabs;
    if (scopeToWorkspace()) {
      list = list.filter((ct) => {
        if (ct.projectId === curWsId) return true;
        if (!ct.projectId && (curWsId === "general" || curWsId === "default")) return true;
        return false;
      });
    }
    if (q) {
      list = list.filter(
        (ct) =>
          (ct.title && ct.title.toLowerCase().includes(q)) ||
          (ct.url && ct.url.toLowerCase().includes(q))
      );
    }
    return list;
  };

  const filteredHistory = () => {
    const q = searchQuery().trim().toLowerCase();
    const curWsId = props.currentWorkspace.id;
    let list = props.history;
    if (scopeToWorkspace()) {
      list = list.filter((h) => {
        if (h.projectId === curWsId) return true;
        if (!h.projectId && (curWsId === "general" || curWsId === "default")) return true;
        return false;
      });
    }
    if (q) {
      list = list.filter(
        (h) =>
          (h.title && h.title.toLowerCase().includes(q)) ||
          (h.url && h.url.toLowerCase().includes(q))
      );
    }
    return list;
  };

  const currentWsClosedCount = () => {
    const curWsId = props.currentWorkspace.id;
    return props.closedTabs.filter((ct) => {
      if (ct.projectId === curWsId) return true;
      if (!ct.projectId && (curWsId === "general" || curWsId === "default")) return true;
      return false;
    }).length;
  };

  return (
    <Show when={props.isOpen}>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          "z-index": 10010,
          background: "rgba(0, 0, 0, 0.65)",
          "backdrop-filter": "blur(8px)",
          "-webkit-backdrop-filter": "blur(8px)",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          animation: "web-loader-fade-in 0.15s ease-out forwards",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) props.onClose();
        }}
      >
        {/* Modal Window */}
        <div
          style={{
            position: "relative",
            width: "680px",
            "max-width": "92vw",
            height: "560px",
            "max-height": "86vh",
            background: "rgba(15, 23, 42, 0.94)",
            "backdrop-filter": "blur(24px)",
            "-webkit-backdrop-filter": "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            "border-radius": "16px",
            "box-shadow": "0 24px 64px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            display: "flex",
            "flex-direction": "column",
            overflow: "hidden",
            animation: "web-loader-card-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px 12px 20px",
              border: "none",
              display: "flex",
              "align-items": "center",
              "justify-content": "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  width: "32px",
                  height: "32px",
                  "border-radius": "8px",
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "var(--accent-default, #38bdf8)",
                }}
              >
                <HistoryIcon size={18} />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    "font-size": "15px",
                    "font-weight": 600,
                    color: "var(--text-primary, #f8fafc)",
                    display: "flex",
                    "align-items": "center",
                    gap: "8px",
                  }}
                >
                  History & Reopen
                </h3>
                <span
                  style={{
                    "font-size": "11px",
                    color: "var(--text-muted, #94a3b8)",
                    "font-family": "Space Mono, monospace",
                  }}
                >
                  Workspace-scoped tab restore ({mod}+Shift+T)
                </span>
              </div>
            </div>

            <button
              type="button"
              class="icon-btn web-loader-icon-btn"
              style={{
                width: "28px",
                height: "28px",
                "border-radius": "6px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted, #94a3b8)",
                cursor: "pointer",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
              onClick={props.onClose}
              title="Close (Esc)"
            >
              <CloseIcon size={16} />
            </button>
          </div>

          {/* Navigation Bar / Scope Selector / Search */}
          <div
            style={{
              padding: "0 20px 12px 20px",
              display: "flex",
              "flex-direction": "column",
              gap: "10px",
              "border-bottom": "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* View Tabs & Workspace Pill */}
            <div
              style={{
                display: "flex",
                "align-items": "center",
                "justify-content": "space-between",
                gap: "8px",
                "flex-wrap": "wrap",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "2px",
                  "border-radius": "8px",
                  gap: "2px",
                }}
              >
                <button
                  type="button"
                  style={{
                    padding: "5px 12px",
                    "border-radius": "6px",
                    border: "none",
                    "font-size": "12px",
                    "font-weight": activeTab() === "closed" ? 600 : 500,
                    background: activeTab() === "closed" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                    color: activeTab() === "closed" ? "#38bdf8" : "var(--text-secondary, #cbd5e1)",
                    cursor: "pointer",
                    display: "flex",
                    "align-items": "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => setActiveTab("closed")}
                >
                  <span>Recently Closed</span>
                  <span
                    style={{
                      "font-size": "10px",
                      "font-family": "Space Mono, monospace",
                      background: "rgba(0, 0, 0, 0.35)",
                      padding: "1px 6px",
                      "border-radius": "999px",
                      color: activeTab() === "closed" ? "#38bdf8" : "inherit",
                    }}
                  >
                    {scopeToWorkspace() ? currentWsClosedCount() : props.closedTabs.length}
                  </span>
                </button>

                <button
                  type="button"
                  style={{
                    padding: "5px 12px",
                    "border-radius": "6px",
                    border: "none",
                    "font-size": "12px",
                    "font-weight": activeTab() === "history" ? 600 : 500,
                    background: activeTab() === "history" ? "rgba(56, 189, 248, 0.2)" : "transparent",
                    color: activeTab() === "history" ? "#38bdf8" : "var(--text-secondary, #cbd5e1)",
                    cursor: "pointer",
                    display: "flex",
                    "align-items": "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => setActiveTab("history")}
                >
                  <span>Browsing History</span>
                  <span
                    style={{
                      "font-size": "10px",
                      "font-family": "Space Mono, monospace",
                      background: "rgba(0, 0, 0, 0.35)",
                      padding: "1px 6px",
                      "border-radius": "999px",
                      color: activeTab() === "history" ? "#38bdf8" : "inherit",
                    }}
                  >
                    {filteredHistory().length}
                  </span>
                </button>
              </div>

              {/* Workspace Scope Pill Toggle */}
              <div
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    "font-size": "11px",
                    color: "var(--text-muted, #94a3b8)",
                    "font-family": "Space Mono, monospace",
                  }}
                >
                  Scope:
                </span>
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    "align-items": "center",
                    gap: "6px",
                    padding: "4px 10px",
                    "border-radius": "6px",
                    border: `1px solid ${scopeToWorkspace() ? props.currentWorkspace.color : "rgba(255, 255, 255, 0.15)"}`,
                    background: scopeToWorkspace() ? `${props.currentWorkspace.color}22` : "rgba(255, 255, 255, 0.04)",
                    color: scopeToWorkspace() ? props.currentWorkspace.color : "var(--text-secondary, #cbd5e1)",
                    "font-size": "11px",
                    "font-weight": 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => setScopeToWorkspace(!scopeToWorkspace())}
                  title={scopeToWorkspace() ? "Click to view all workspaces" : "Click to scope to current workspace"}
                >
                  <Show
                    when={scopeToWorkspace()}
                    fallback={
                      <>
                        <GlobeIcon size={12} />
                        <span>All Groups</span>
                      </>
                    }
                  >
                    <span>{props.currentWorkspace.icon || "✦"}</span>
                    <span>{props.currentWorkspace.name}</span>
                    <span style={{ "font-size": "9px", opacity: 0.8 }}>✓</span>
                  </Show>
                </button>
              </div>
            </div>

            {/* Filter Input & Fast Actions */}
            <div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "8px",
                  flex: 1,
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "border-radius": "8px",
                  padding: "7px 12px",
                }}
              >
                <span style={{ color: "var(--text-muted, #94a3b8)", "font-size": "12px" }}>🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    activeTab() === "closed"
                      ? "Filter recently closed tabs..."
                      : "Search browsing history..."
                  }
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary, #f8fafc)",
                    "font-size": "13px",
                    "font-family": "inherit",
                  }}
                />
                <Show when={searchQuery()}>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--text-muted, #94a3b8)",
                      cursor: "pointer",
                      padding: "0",
                      "font-size": "11px",
                    }}
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                </Show>
              </div>

              {/* Action buttons based on active tab */}
              <Show when={activeTab() === "closed"}>
                <Show when={filteredClosedTabs().length > 0}>
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      "align-items": "center",
                      gap: "5px",
                      padding: "7px 12px",
                      "border-radius": "8px",
                      border: "none",
                      background: "var(--accent-default, #38bdf8)",
                      color: "#0f172a",
                      "font-size": "12px",
                      "font-weight": 600,
                      cursor: "pointer",
                      "white-space": "nowrap",
                    }}
                    onClick={() => {
                      const first = filteredClosedTabs()[0];
                      if (first) {
                        props.onReopenClosedTab(first);
                        props.onClose();
                      }
                    }}
                    title={`Reopen Most Recent Tab (${mod}+Shift+T)`}
                  >
                    <span>Reopen Last</span>
                    <span style={{ "font-size": "10px", opacity: 0.8 }}>({mod}+Shift+T)</span>
                  </button>
                </Show>
              </Show>
            </div>
          </div>

          {/* List Content Area */}
          <div
            style={{
              flex: 1,
              "overflow-y": "auto",
              padding: "8px 12px",
              display: "flex",
              "flex-direction": "column",
              gap: "4px",
            }}
          >
            {/* VIEW 1: RECENTLY CLOSED TABS */}
            <Show when={activeTab() === "closed"}>
              <Show
                when={filteredClosedTabs().length > 0}
                fallback={
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "column",
                      "align-items": "center",
                      "justify-content": "center",
                      padding: "60px 20px",
                      gap: "10px",
                      color: "var(--text-muted, #94a3b8)",
                    }}
                  >
                    <span style={{ "font-size": "36px", opacity: 0.5 }}>📂</span>
                    <p style={{ margin: 0, "font-size": "13px" }}>
                      {scopeToWorkspace()
                        ? `No closed tabs recorded in ${props.currentWorkspace.name}`
                        : "No recently closed tabs"}
                    </p>
                    <span style={{ "font-size": "11px", opacity: 0.7 }}>
                      Close any tab with {mod}+W and restore it here or with {mod}+Shift+T
                    </span>
                  </div>
                }
              >
                <For each={filteredClosedTabs()}>
                  {(item) => {
                    const ws = getWs(item.projectId);
                    return (
                      <div
                        style={{
                          display: "flex",
                          "align-items": "center",
                          "justify-content": "space-between",
                          gap: "12px",
                          padding: "8px 12px",
                          "border-radius": "8px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          transition: "all 0.15s ease",
                          cursor: "pointer",
                        }}
                        class="web-loader-hover-item"
                        onClick={() => {
                          props.onReopenClosedTab(item);
                          props.onClose();
                        }}
                      >
                        <div style={{ display: "flex", "align-items": "center", gap: "10px", flex: 1, "min-width": 0 }}>
                          <WebsiteIcon url={item.url} favicon={item.favicon} size={16} />
                          <div style={{ display: "flex", "flex-direction": "column", "min-width": 0, flex: 1 }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                              <span
                                style={{
                                  "font-size": "13px",
                                  "font-weight": 500,
                                  color: "var(--text-primary, #f8fafc)",
                                  overflow: "hidden",
                                  "text-overflow": "ellipsis",
                                  "white-space": "nowrap",
                                }}
                              >
                                {item.title || "Untitled Tab"}
                              </span>
                            </div>
                            <span
                              style={{
                                "font-size": "11px",
                                color: "var(--text-muted, #94a3b8)",
                                overflow: "hidden",
                                "text-overflow": "ellipsis",
                                "white-space": "nowrap",
                              }}
                            >
                              {item.url}
                            </span>
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div style={{ display: "flex", "align-items": "center", gap: "8px", "flex-shrink": 0 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              "align-items": "center",
                              gap: "4px",
                              padding: "2px 6px",
                              "border-radius": "4px",
                              background: `${ws.color}18`,
                              color: ws.color,
                              "font-size": "10px",
                              "font-family": "Space Mono, monospace",
                            }}
                          >
                            <span>{ws.icon || "✦"}</span>
                            <span>{ws.name}</span>
                          </span>

                          <span
                            style={{
                              "font-size": "10px",
                              color: "var(--text-muted, #94a3b8)",
                              "font-family": "Space Mono, monospace",
                              "min-width": "50px",
                              "text-align": "right",
                            }}
                          >
                            {formatRelativeTime(item.closedAt)}
                          </span>

                          <button
                            type="button"
                            style={{
                              padding: "4px 8px",
                              "border-radius": "4px",
                              border: "1px solid rgba(56, 189, 248, 0.4)",
                              background: "rgba(56, 189, 248, 0.12)",
                              color: "var(--accent-default, #38bdf8)",
                              "font-size": "11px",
                              "font-weight": 600,
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onReopenClosedTab(item);
                              props.onClose();
                            }}
                            title="Reopen in Workspace"
                          >
                            Reopen
                          </button>

                          <button
                            type="button"
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "var(--text-muted, #94a3b8)",
                              cursor: "pointer",
                              padding: "4px",
                              "border-radius": "4px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onRemoveClosedTab(item.id);
                            }}
                            title="Remove from Closed Tabs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </Show>
            </Show>

            {/* VIEW 2: BROWSING HISTORY */}
            <Show when={activeTab() === "history"}>
              <Show
                when={filteredHistory().length > 0}
                fallback={
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "column",
                      "align-items": "center",
                      "justify-content": "center",
                      padding: "60px 20px",
                      gap: "10px",
                      color: "var(--text-muted, #94a3b8)",
                    }}
                  >
                    <span style={{ "font-size": "36px", opacity: 0.5 }}>🕒</span>
                    <p style={{ margin: 0, "font-size": "13px" }}>
                      {searchQuery() ? "No history matching your search" : "No browsing history yet"}
                    </p>
                    <span style={{ "font-size": "11px", opacity: 0.7 }}>
                      Pages you visit will appear here automatically
                    </span>
                  </div>
                }
              >
                <For each={filteredHistory()}>
                  {(item) => {
                    const ws = getWs(item.projectId);
                    return (
                      <div
                        style={{
                          display: "flex",
                          "align-items": "center",
                          "justify-content": "space-between",
                          gap: "12px",
                          padding: "8px 12px",
                          "border-radius": "8px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          transition: "all 0.15s ease",
                          cursor: "pointer",
                        }}
                        class="web-loader-hover-item"
                        onClick={() => {
                          props.onSelectUrl(item.url, item.title, item.projectId);
                          props.onClose();
                        }}
                      >
                        <div style={{ display: "flex", "align-items": "center", gap: "10px", flex: 1, "min-width": 0 }}>
                          <WebsiteIcon url={item.url} favicon={item.favicon} size={16} />
                          <div style={{ display: "flex", "flex-direction": "column", "min-width": 0, flex: 1 }}>
                            <span
                              style={{
                                "font-size": "13px",
                                "font-weight": 500,
                                color: "var(--text-primary, #f8fafc)",
                                overflow: "hidden",
                                "text-overflow": "ellipsis",
                                "white-space": "nowrap",
                              }}
                            >
                              {item.title || getDomain(item.url)}
                            </span>
                            <span
                              style={{
                                "font-size": "11px",
                                color: "var(--text-muted, #94a3b8)",
                                overflow: "hidden",
                                "text-overflow": "ellipsis",
                                "white-space": "nowrap",
                              }}
                            >
                              {item.url}
                            </span>
                          </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div style={{ display: "flex", "align-items": "center", gap: "8px", "flex-shrink": 0 }}>
                          <Show when={item.projectId}>
                            <span
                              style={{
                                display: "inline-flex",
                                "align-items": "center",
                                gap: "4px",
                                padding: "2px 6px",
                                "border-radius": "4px",
                                background: `${ws.color}18`,
                                color: ws.color,
                                "font-size": "10px",
                                "font-family": "Space Mono, monospace",
                              }}
                            >
                              <span>{ws.icon || "✦"}</span>
                              <span>{ws.name}</span>
                            </span>
                          </Show>

                          <span
                            style={{
                              "font-size": "10px",
                              color: "var(--text-muted, #94a3b8)",
                              "font-family": "Space Mono, monospace",
                              "min-width": "50px",
                              "text-align": "right",
                            }}
                          >
                            {formatRelativeTime(item.timestamp)}
                          </span>

                          <button
                            type="button"
                            style={{
                              border: "none",
                              background: "rgba(255, 255, 255, 0.06)",
                              color: "var(--text-secondary, #cbd5e1)",
                              cursor: "pointer",
                              padding: "4px 6px",
                              "border-radius": "4px",
                              display: "flex",
                              "align-items": "center",
                              "justify-content": "center",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onOpenInNewTab(item.url, item.title, item.projectId);
                              props.onClose();
                            }}
                            title="Open in New Tab"
                          >
                            <PlusIcon size={12} />
                          </button>

                          <button
                            type="button"
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "var(--text-muted, #94a3b8)",
                              cursor: "pointer",
                              padding: "4px",
                              "border-radius": "4px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              props.onRemoveHistoryItem(item.id);
                            }}
                            title="Remove from History"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </Show>
            </Show>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 16px",
              "border-top": "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              "align-items": "center",
              "justify-content": "space-between",
              background: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
              <span
                style={{
                  "font-size": "11px",
                  color: "var(--text-muted, #94a3b8)",
                  "font-family": "Space Mono, monospace",
                }}
              >
                {activeTab() === "closed"
                  ? `${filteredClosedTabs().length} closed tab${filteredClosedTabs().length === 1 ? "" : "s"}`
                  : `${filteredHistory().length} history record${filteredHistory().length === 1 ? "" : "s"}`}
              </span>
            </div>

            <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
              <Show when={activeTab() === "closed" && filteredClosedTabs().length > 1}>
                <button
                  type="button"
                  style={{
                    padding: "4px 10px",
                    "border-radius": "6px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    background: "transparent",
                    color: "var(--text-secondary, #cbd5e1)",
                    "font-size": "11px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    props.onReopenAllClosedTabs(scopeToWorkspace() ? props.currentWorkspace.id : undefined);
                    props.onClose();
                  }}
                >
                  Reopen All ({filteredClosedTabs().length})
                </button>
              </Show>

              <Show when={activeTab() === "closed" && filteredClosedTabs().length > 0}>
                <button
                  type="button"
                  style={{
                    padding: "4px 10px",
                    "border-radius": "6px",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-muted, #94a3b8)",
                    "font-size": "11px",
                    cursor: "pointer",
                  }}
                  onClick={() => props.onClearClosedTabs(scopeToWorkspace() ? props.currentWorkspace.id : undefined)}
                >
                  Clear Closed Tabs
                </button>
              </Show>

              <Show when={activeTab() === "history" && filteredHistory().length > 0}>
                <button
                  type="button"
                  style={{
                    padding: "4px 10px",
                    "border-radius": "6px",
                    border: "none",
                    background: "transparent",
                    color: "#f87171",
                    "font-size": "11px",
                    cursor: "pointer",
                    display: "flex",
                    "align-items": "center",
                    gap: "4px",
                  }}
                  onClick={() => {
                    if (confirm("Clear all browsing history?")) {
                      props.onClearHistory();
                    }
                  }}
                >
                  <TrashIcon size={12} />
                  <span>Clear All History</span>
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
