import { For, createSignal } from "solid-js";
import { Bookmark } from "../types";
import { S } from "../styles";
import { PopoutIcon, GlobeIcon, PlusIcon, CloseIcon, NewTabIcon, ExternalIcon } from "../icons";

interface QuickDialProps {
  bookmarks: Bookmark[];
  onOpenUrl: (url: string) => void;
  onNewTab: (url: string) => void;
  onOpenInWebviewWindow: (url: string) => void;
  onOpenExternal: (url: string) => void;
  onAddBookmark: (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => void;
  onRemoveBookmark: (id: string) => void;
}

const DEFAULT_DEV_TARGETS: { title: string; url: string; tag: string }[] = [
  { title: "Localhost :3000", url: "http://localhost:3000", tag: "App / Dash" },
  { title: "Localhost :5173", url: "http://localhost:5173", tag: "Vite Dev" },
  { title: "Localhost :8080", url: "http://localhost:8080", tag: "Taste Server" },
  { title: "Localhost :8082", url: "http://localhost:8082", tag: "Termix Web" },
  { title: "Localhost :3100", url: "http://localhost:3100", tag: "Resume" },
  { title: "Localhost :3200", url: "http://localhost:3200", tag: "Career Ops" },
];

const DEFAULT_DOC_TARGETS: { title: string; url: string; tag: string }[] = [
  { title: "GitHub", url: "https://github.com", tag: "Git VCS" },
  { title: "Rust std Docs", url: "https://doc.rust-lang.org/std/", tag: "Standard Lib" },
  { title: "Crates.io", url: "https://crates.io", tag: "Rust Registry" },
  { title: "MDN Web Docs", url: "https://developer.mozilla.org", tag: "Web Specs" },
  { title: "Tauri v2 Docs", url: "https://v2.tauri.app", tag: "Framework" },
];

const DEFAULT_AI_TARGETS: { title: string; url: string; tag: string }[] = [
  { title: "ChatGPT", url: "https://chatgpt.com", tag: "OpenAI" },
  { title: "Claude AI", url: "https://claude.ai", tag: "Anthropic" },
  { title: "Google Gemini", url: "https://gemini.google.com", tag: "Google DeepMind" },
];

export function QuickDial(props: QuickDialProps) {
  const [newTitle, setNewTitle] = createSignal("");
  const [newUrl, setNewUrl] = createSignal("");
  const [showAddForm, setShowAddForm] = createSignal(false);

  const handleAddSubmit = (e: Event) => {
    e.preventDefault();
    if (newTitle().trim() && newUrl().trim()) {
      props.onAddBookmark(newTitle().trim(), newUrl().trim(), "custom");
      setNewTitle("");
      setNewUrl("");
      setShowAddForm(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "28px",
        padding: "36px 48px",
        "max-width": "1200px",
        margin: "0 auto",
        width: "100%",
        "box-sizing": "border-box",
        overflow_y: "auto",
        height: "100%",
      }}
    >
      {/* Header Banner */}
      <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
        <div>
          <h1
            style={{
              margin: 0,
              "font-size": "26px",
              "font-weight": 700,
              color: "var(--text-primary, #f8fafc)",
              "letter-spacing": "-0.02em",
            }}
          >
            Web Loader Workstation
          </h1>
          <p
            style={{
              margin: "6px 0 0 0",
              "font-size": "13px",
              "font-family": "Space Mono, monospace",
              color: "var(--text-secondary, #94a3b8)",
            }}
          >
            High-efficiency web browser & WebviewWindow engine for Flurer
          </p>
        </div>

        <button
          type="button"
          class="icon-btn"
          style={S.secondaryBtn}
          onClick={() => setShowAddForm(!showAddForm())}
        >
          <PlusIcon size={18} />
          {showAddForm() ? "Cancel" : "Add Bookmark"}
        </button>
      </div>

      {/* Add Custom Bookmark Form */}
      {showAddForm() && (
        <form
          onSubmit={handleAddSubmit}
          style={{
            display: "flex",
            gap: "10px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "16px",
            "border-radius": "10px",
            "backdrop-filter": "blur(8px)",
          }}
        >
          <input
            type="text"
            placeholder="Bookmark Title (e.g. My Admin Dashboard)"
            value={newTitle()}
            onInput={(e) => setNewTitle(e.currentTarget.value)}
            style={{ ...S.omniboxInput, background: "rgba(0, 0, 0, 0.3)", padding: "8px 12px", "border-radius": "6px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          />
          <input
            type="text"
            placeholder="URL (e.g. http://localhost:8080 or https://...)"
            value={newUrl()}
            onInput={(e) => setNewUrl(e.currentTarget.value)}
            style={{ ...S.omniboxInput, background: "rgba(0, 0, 0, 0.3)", padding: "8px 12px", "border-radius": "6px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          />
          <button type="submit" style={S.actionBtn}>
            Save
          </button>
        </form>
      )}

      {/* Localhost & Developer Endpoints */}
      <div>
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "12px" }}>
          <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", "text-transform": "uppercase", "letter-spacing": "0.12em", color: "var(--accent-default, #38bdf8)" }}>
            Localhost & Service Endpoints
          </span>
        </div>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          <For each={DEFAULT_DEV_TARGETS}>
            {(item) => (
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "8px",
                  background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
                  border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
                  "border-radius": "10px",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onClick={() => props.onOpenUrl(item.url)}
              >
                <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                  <span style={{ "font-weight": 600, "font-size": "14px" }}>{item.title}</span>
                  <div style={{ display: "flex", "align-items": "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onNewTab(item.url)}
                      title="Open in New Tab"
                    >
                      <NewTabIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenInWebviewWindow(item.url)}
                      title="Open in Dedicated Native WebviewWindow"
                    >
                      <PopoutIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenExternal(item.url)}
                      title="Open in System Browser"
                    >
                      <ExternalIcon size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                  <span style={S.badge}>{item.tag}</span>
                  <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                    {item.url}
                  </span>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Developer Docs & VCS */}
      <div>
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "12px" }}>
          <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", "text-transform": "uppercase", "letter-spacing": "0.12em", color: "var(--accent-default, #38bdf8)" }}>
            Developer Documentation & Git
          </span>
        </div>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          <For each={DEFAULT_DOC_TARGETS}>
            {(item) => (
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "8px",
                  background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
                  border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
                  "border-radius": "10px",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onClick={() => props.onOpenUrl(item.url)}
              >
                <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                  <span style={{ "font-weight": 600, "font-size": "14px" }}>{item.title}</span>
                  <div style={{ display: "flex", "align-items": "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onNewTab(item.url)}
                      title="Open in New Tab"
                    >
                      <NewTabIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenInWebviewWindow(item.url)}
                      title="Open in Dedicated Native WebviewWindow"
                    >
                      <PopoutIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenExternal(item.url)}
                      title="Open in System Browser"
                    >
                      <ExternalIcon size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                  <span style={S.badge}>{item.tag}</span>
                  <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                    {item.url}
                  </span>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* AI Systems */}
      <div>
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "12px" }}>
          <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", "text-transform": "uppercase", "letter-spacing": "0.12em", color: "var(--accent-default, #38bdf8)" }}>
            AI Platforms & Workstations
          </span>
        </div>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          <For each={DEFAULT_AI_TARGETS}>
            {(item) => (
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "8px",
                  background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
                  border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
                  "border-radius": "10px",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onClick={() => props.onOpenUrl(item.url)}
              >
                <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                  <span style={{ "font-weight": 600, "font-size": "14px" }}>{item.title}</span>
                  <div style={{ display: "flex", "align-items": "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onNewTab(item.url)}
                      title="Open in New Tab"
                    >
                      <NewTabIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenInWebviewWindow(item.url)}
                      title="Open in Dedicated Native WebviewWindow"
                    >
                      <PopoutIcon size={18} />
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      style={S.cardIconBtn}
                      onClick={() => props.onOpenExternal(item.url)}
                      title="Open in System Browser"
                    >
                      <ExternalIcon size={18} />
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                  <span style={S.badge}>{item.tag}</span>
                  <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                    {item.url}
                  </span>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* User Custom Bookmarks */}
      {props.bookmarks.length > 0 && (
        <div>
          <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "12px" }}>
            <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", "text-transform": "uppercase", "letter-spacing": "0.12em", color: "#eab308" }}>
              Custom Bookmarks
            </span>
          </div>
          <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            <For each={props.bookmarks}>
              {(b) => (
                <div
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    gap: "8px",
                    background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
                    border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
                    "border-radius": "10px",
                    padding: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => props.onOpenUrl(b.url)}
                >
                  <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                    <span style={{ "font-weight": 600, "font-size": "14px" }}>{b.title}</span>
                    <div style={{ display: "flex", "align-items": "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        class="icon-btn"
                        style={S.cardIconBtn}
                        onClick={() => props.onNewTab(b.url)}
                        title="Open in New Tab"
                      >
                        <NewTabIcon size={18} />
                      </button>
                      <button
                        type="button"
                        class="icon-btn"
                        style={S.cardIconBtn}
                        onClick={() => props.onOpenInWebviewWindow(b.url)}
                        title="Open in Dedicated Native WebviewWindow"
                      >
                        <PopoutIcon size={18} />
                      </button>
                      <button
                        type="button"
                        class="icon-btn"
                        style={S.cardIconBtn}
                        onClick={() => props.onOpenExternal(b.url)}
                        title="Open in System Browser"
                      >
                        <ExternalIcon size={18} />
                      </button>
                      <button
                        type="button"
                        class="icon-btn"
                        style={S.cardIconBtn}
                        onClick={() => props.onRemoveBookmark(b.id)}
                        title="Remove Bookmark"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  </div>
                  <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                    {b.url}
                  </span>
                </div>
              )}
            </For>
          </div>
        </div>
      )}
    </div>
  );
}
