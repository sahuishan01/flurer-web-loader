import { createSignal, createEffect, onMount, onCleanup, For, Show } from "solid-js";
import { Tab, ProjectWorkspace } from "../types";
import { GlobeIcon, CloseIcon } from "../icons";
import { WebsiteIcon } from "./WebsiteIcon";
import { getDomain, getModifierKey } from "../utils";

interface QuickTabSwitcherProps {
  isOpen: boolean;
  tabs: Tab[];
  activeTabId: string;
  workspaces: ProjectWorkspace[];
  onClose: () => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string) => void;
}

export function QuickTabSwitcher(props: QuickTabSwitcherProps) {
  const mod = getModifierKey();
  const [query, setQuery] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  const filteredTabs = () => {
    const q = query().trim().toLowerCase();
    if (!q) return props.tabs;
    return props.tabs.filter(
      (t) =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.url && t.url.toLowerCase().includes(q)) ||
        (t.intent && t.intent.toLowerCase().includes(q))
    );
  };

  createEffect(() => {
    if (props.isOpen) {
      setQuery("");
      // Select currently active tab index initially
      const idx = props.tabs.findIndex((t) => t.id === props.activeTabId);
      setSelectedIndex(idx >= 0 ? idx : 0);
      setTimeout(() => inputRef?.focus(), 30);
    }
  });

  createEffect(() => {
    // Reset selection index bounds when query changes
    const list = filteredTabs();
    if (selectedIndex() >= list.length) {
      setSelectedIndex(Math.max(0, list.length - 1));
    }
  });

  const getWorkspace = (projectId?: string) =>
    props.workspaces.find((w) => w.id === projectId) || props.workspaces[0];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!props.isOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      props.onClose();
    } else if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
      e.preventDefault();
      const list = filteredTabs();
      if (list.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % list.length);
      }
    } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
      e.preventDefault();
      const list = filteredTabs();
      if (list.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const list = filteredTabs();
      if (list.length > 0 && list[selectedIndex()]) {
        props.onSelectTab(list[selectedIndex()].id);
        props.onClose();
      } else if (query().trim()) {
        props.onNewTab(query().trim());
        props.onClose();
      }
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <Show when={props.isOpen}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          "z-index": 10000,
          display: "flex",
          "align-items": "flex-start",
          "justify-content": "center",
          "padding-top": "12vh",
          background: "rgba(0, 0, 0, 0.55)",
          "backdrop-filter": "blur(6px)",
          "-webkit-backdrop-filter": "blur(6px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) props.onClose();
        }}
      >
        <div
          style={{
            width: "90%",
            "max-width": "580px",
            background: "rgba(15, 23, 42, 0.96)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            "border-radius": "12px",
            "box-shadow": "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 24px rgba(56, 189, 248, 0.15)",
            overflow: "hidden",
            display: "flex",
            "flex-direction": "column",
            animation: "web-loader-card-enter 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {/* Search Header */}
          <div
            style={{
              padding: "12px 16px",
              "border-bottom": "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              "align-items": "center",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <GlobeIcon size={18} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search all open tabs, enter URL, or switch (↑ / ↓, Enter)..."
              value={query()}
              onInput={(e) => {
                setQuery(e.currentTarget.value);
                setSelectedIndex(0);
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#ffffff",
                "font-size": "14px",
                "font-family": "system-ui, sans-serif",
              }}
            />
            <div
              style={{
                "font-size": "10px",
                "font-family": "Space Mono, monospace",
                color: "var(--text-muted, #94a3b8)",
                background: "rgba(255, 255, 255, 0.08)",
                padding: "2px 6px",
                "border-radius": "4px",
              }}
            >
              ESC to exit
            </div>
          </div>

          {/* Tab List */}
          <div
            style={{
              "max-height": "360px",
              overflow: "auto",
              padding: "8px",
              display: "flex",
              "flex-direction": "column",
              gap: "3px",
            }}
          >
            <For
              each={filteredTabs()}
              fallback={
                <div
                  style={{
                    padding: "24px 16px",
                    "text-align": "center",
                    color: "var(--text-muted, #94a3b8)",
                    "font-size": "13px",
                  }}
                >
                  No open tabs match "{query()}". Press <strong>Enter</strong> to open as new tab.
                </div>
              }
            >
              {(tab, idx) => {
                const isSelected = () => idx() === selectedIndex();
                const isCurrent = () => tab.id === props.activeTabId;
                const ws = () => getWorkspace(tab.projectId);

                return (
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      padding: "8px 12px",
                      "border-radius": "8px",
                      cursor: "pointer",
                      background: isSelected()
                        ? "rgba(56, 189, 248, 0.18)"
                        : isCurrent()
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                      border: isSelected()
                        ? "1px solid rgba(56, 189, 248, 0.4)"
                        : "1px solid transparent",
                      transition: "all 0.12s ease",
                    }}
                    onClick={() => {
                      props.onSelectTab(tab.id);
                      props.onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx())}
                  >
                    <div
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "10px",
                        flex: 1,
                        "min-width": 0,
                      }}
                    >
                      <WebsiteIcon url={tab.url} favicon={tab.favicon} size={16} />
                      <div
                        style={{
                          display: "flex",
                          "flex-direction": "column",
                          flex: 1,
                          "min-width": 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              "font-size": "13px",
                              "font-weight": isSelected() || isCurrent() ? 600 : 400,
                              color: isSelected() ? "#38bdf8" : "#f8fafc",
                              overflow: "hidden",
                              "text-overflow": "ellipsis",
                              "white-space": "nowrap",
                            }}
                          >
                            {tab.title || "New Tab"}
                          </span>
                          <Show when={isCurrent()}>
                            <span
                              style={{
                                "font-size": "9px",
                                "font-family": "Space Mono, monospace",
                                padding: "1px 5px",
                                "border-radius": "999px",
                                background: "rgba(16, 185, 129, 0.2)",
                                color: "#10b981",
                                border: "1px solid rgba(16, 185, 129, 0.35)",
                              }}
                            >
                              active
                            </span>
                          </Show>
                        </div>
                        <span
                          style={{
                            "font-size": "11px",
                            "font-family": "Space Mono, monospace",
                            color: "var(--text-muted, #94a3b8)",
                            overflow: "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap",
                          }}
                        >
                          {tab.url}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "8px",
                        "flex-shrink": 0,
                      }}
                    >
                      <span
                        style={{
                          "font-size": "10px",
                          "font-family": "Space Mono, monospace",
                          padding: "2px 6px",
                          "border-radius": "4px",
                          background: `rgba(${
                            ws().color === "#38bdf8" ? "56, 189, 248" : "148, 163, 184"
                          }, 0.15)`,
                          color: ws().color,
                          border: `1px solid ${ws().color}40`,
                        }}
                      >
                        {ws().name}
                      </span>

                      <button
                        type="button"
                        class="icon-btn web-loader-icon-btn web-loader-tab-close"
                        style={{
                          width: "20px",
                          height: "20px",
                          "min-width": "20px",
                          "min-height": "20px",
                          border: "none",
                          background: "transparent",
                          color: "var(--text-muted, #94a3b8)",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onCloseTab(tab.id);
                        }}
                        title="Close tab"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>

          {/* Quick Switcher Footer */}
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(0, 0, 0, 0.3)",
              "border-top": "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              "align-items": "center",
              "justify-content": "space-between",
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              color: "var(--text-muted, #94a3b8)",
            }}
          >
            <span>
              <strong>{filteredTabs().length}</strong> of {props.tabs.length} tabs
            </span>
            <div style={{ display: "flex", gap: "12px" }}>
              <span>↑↓ navigate</span>
              <span>↵ switch</span>
              <span>esc dismiss</span>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
