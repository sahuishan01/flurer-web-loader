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
import { normalizeUrl, getModifierKey, getPlatformEngineName } from "../utils";

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
  const mod = getModifierKey();
  const engineName = getPlatformEngineName();
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
        class="icon-btn"
        style={S.iconBtn}
        onClick={props.onReload}
        title={`Reload Page (F5 / ${mod}+R)`}
      >
        <ReloadIcon size={20} />
      </button>

      <button
        type="button"
        class="icon-btn"
        style={S.iconBtn}
        onClick={props.onGoHome}
        title="Go to Home"
      >
        <HomeIcon size={20} />
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
        <LockIcon size={16} />
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
            class="icon-btn"
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
        class="icon-btn"
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
          class="icon-btn"
          style={{ ...S.iconBtn, width: "30px", height: "34px", "font-family": "Space Mono, monospace", "font-size": "16px", "font-weight": 700 }}
          onClick={props.onZoomOut}
          title="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          class="icon-btn"
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
          class="icon-btn"
          style={{ ...S.iconBtn, width: "30px", height: "34px", "font-family": "Space Mono, monospace", "font-size": "16px", "font-weight": 700 }}
          onClick={props.onZoomIn}
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* Pop out to Dedicated Native WebviewWindow */}
      <button
        type="button"
        class="icon-btn"
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

      {/* Open in OS Default External Browser */}
      <button
        type="button"
        class="icon-btn"
        style={S.iconBtn}
        onClick={props.onOpenExternal}
        title="Open in System Default Browser"
      >
        <ExternalIcon size={20} />
      </button>
    </div>
  );
}
