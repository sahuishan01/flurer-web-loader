import { createSignal, createEffect } from "solid-js";
import { S } from "../styles";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ReloadIcon,
  HomeIcon,
  PopoutIcon,
  ExternalIcon,
  StarIcon,
  LockIcon,
} from "../icons";
import { Tab, SearchEngine } from "../types";
import { normalizeUrl } from "../utils";

interface NavigationBarProps {
  activeTab: Tab | undefined;
  searchEngine: SearchEngine;
  homeUrl: string;
  isBookmarked: boolean;
  onNavigate: (url: string) => void;
  onReload: () => void;
  onGoHome: () => void;
  onPopoutWebviewWindow: () => void;
  onOpenExternal: () => void;
  onToggleBookmark: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function NavigationBar(props: NavigationBarProps) {
  const [inputValue, setInputValue] = createSignal("");
  const [isFocused, setIsFocused] = createSignal(false);

  // Sync omnibox with active tab's URL unless the user is actively typing
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

  return (
    <div style={S.navRow}>
      {/* History & Reload Controls */}
      <button
        type="button"
        style={S.iconBtn}
        onClick={props.onReload}
        title="Reload Page (F5 / Ctrl+R)"
      >
        <ReloadIcon size={15} />
      </button>

      <button
        type="button"
        style={S.iconBtn}
        onClick={props.onGoHome}
        title="Go to Home"
      >
        <HomeIcon size={15} />
      </button>

      {/* Smart Omnibox */}
      <form
        onSubmit={handleSubmit}
        style={{
          ...S.omniboxContainer,
          ...(isFocused()
            ? {
                "border-color": "var(--accent-default, #38bdf8)",
                "box-shadow": "0 0 0 2px rgba(var(--accent-rgb, 56, 189, 248), 0.2)",
              }
            : {}),
        }}
      >
        <LockIcon size={13} />
        <input
          type="text"
          style={S.omniboxInput}
          placeholder="Search with DuckDuckGo or enter web address / localhost:port..."
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {inputValue() && (
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted, #94a3b8)",
              cursor: "pointer",
              "font-size": "12px",
            }}
            onClick={() => setInputValue("")}
            title="Clear input"
          >
            ✕
          </button>
        )}
      </form>

      {/* Bookmark Star */}
      <button
        type="button"
        style={{
          ...S.iconBtn,
          ...(props.isBookmarked ? { color: "#eab308" } : {}),
        }}
        onClick={props.onToggleBookmark}
        title={props.isBookmarked ? "Remove Bookmark" : "Bookmark this Page"}
      >
        <StarIcon size={15} filled={props.isBookmarked} />
      </button>

      {/* Zoom Controls */}
      <div style={{ display: "flex", "align-items": "center", gap: "2px" }}>
        <button
          type="button"
          style={{ ...S.iconBtn, width: "24px", height: "30px", "font-family": "Space Mono, monospace", "font-size": "13px" }}
          onClick={props.onZoomOut}
          title="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          style={{
            ...S.iconBtn,
            width: "48px",
            height: "30px",
            "font-family": "Space Mono, monospace",
            "font-size": "11px",
            padding: "0 4px",
          }}
          onClick={props.onResetZoom}
          title="Reset Zoom"
        >
          {Math.round((props.activeTab?.zoom ?? 1) * 100)}%
        </button>
        <button
          type="button"
          style={{ ...S.iconBtn, width: "24px", height: "30px", "font-family": "Space Mono, monospace", "font-size": "13px" }}
          onClick={props.onZoomIn}
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* Pop out to Dedicated Native WebviewWindow */}
      <button
        type="button"
        style={{
          ...S.iconBtn,
          background: "rgba(var(--accent-rgb, 56, 189, 248), 0.15)",
          color: "var(--accent-default, #38bdf8)",
          "border-color": "rgba(var(--accent-rgb, 56, 189, 248), 0.35)",
        }}
        onClick={props.onPopoutWebviewWindow}
        title="Open in Dedicated Native WebviewWindow (Full Unrestricted Chromium Engine)"
      >
        <PopoutIcon size={15} />
      </button>

      {/* Open in OS Default External Browser */}
      <button
        type="button"
        style={S.iconBtn}
        onClick={props.onOpenExternal}
        title="Open in System Default Browser"
      >
        <ExternalIcon size={15} />
      </button>
    </div>
  );
}
