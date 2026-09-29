import { Show, createSignal } from "solid-js";
import { Tab, Bookmark } from "../types";
import { S } from "../styles";
import { QuickDial } from "./QuickDial";
import { PopoutIcon, ExternalIcon, GlobeIcon, NewTabIcon } from "../icons";
import { isKnownFrameRestricted, getDomain, getPlatformEngineName } from "../utils";

interface WebViewportProps {
  activeTab: Tab | undefined;
  bookmarks: Bookmark[];
  onOpenUrl: (url: string) => void;
  onNewTab: (url: string) => void;
  onOpenInWebviewWindow: (url: string) => void;
  onOpenExternal: (url: string) => void;
  onAddBookmark: (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => void;
  onRemoveBookmark: (id: string) => void;
}

export function WebViewport(props: WebViewportProps) {
  const isBlank = () => !props.activeTab || props.activeTab.url === "about:blank" || !props.activeTab.url;
  const isRestricted = () => (props.activeTab ? isKnownFrameRestricted(props.activeTab.url) : false);
  const [dismissedWarnings, setDismissedWarnings] = createSignal<Record<string, boolean>>({});

  const showWarning = () => {
    if (!props.activeTab) return false;
    if (dismissedWarnings()[props.activeTab.id]) return false;
    return isRestricted();
  };

  return (
    <div style={S.viewport}>
      <Show
        when={!isBlank()}
        fallback={
          <QuickDial
            bookmarks={props.bookmarks}
            onOpenUrl={props.onOpenUrl}
            onNewTab={props.onNewTab}
            onOpenInWebviewWindow={props.onOpenInWebviewWindow}
            onOpenExternal={props.onOpenExternal}
            onAddBookmark={props.onAddBookmark}
            onRemoveBookmark={props.onRemoveBookmark}
          />
        }
      >
        {/* Floating helper pill for sites that may enforce frame restrictions */}
        <Show when={showWarning()}>
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              "z-index": 10,
              display: "flex",
              "align-items": "center",
              gap: "8px",
              padding: "6px 12px",
              background: "rgba(15, 23, 42, 0.92)",
              "backdrop-filter": "blur(12px)",
              "-webkit-backdrop-filter": "blur(12px)",
              border: "1px solid rgba(var(--accent-rgb, 56, 189, 248), 0.35)",
              "border-radius": "8px",
              color: "var(--text-primary, #f8fafc)",
              "font-size": "12px",
              "font-family": "Space Mono, monospace",
              "box-shadow": "0 4px 16px rgba(0, 0, 0, 0.45)",
            }}
          >
            <span>If page refuses to connect:</span>
            <button
              type="button"
              class="icon-btn"
              style={{
                ...S.actionBtn,
                padding: "4px 10px !important",
                "font-size": "11px",
                display: "inline-flex",
                "align-items": "center",
                gap: "5px",
              }}
              onClick={() => props.onOpenInWebviewWindow(props.activeTab!.url)}
            >
              <PopoutIcon size={14} />
              Pop out Window
            </button>
            <button
              type="button"
              class="icon-btn"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted, #94a3b8)",
                cursor: "pointer",
                padding: "2px !important",
                display: "inline-flex",
                "align-items": "center",
              }}
              onClick={() => {
                if (props.activeTab) {
                  setDismissedWarnings((prev) => ({ ...prev, [props.activeTab!.id]: true }));
                }
              }}
              title="Dismiss notice"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        </Show>

        <iframe
          src={props.activeTab!.url}
          title={props.activeTab!.title || "Web View"}
          style={{
            ...S.iframe,
            transform: `scale(${props.activeTab!.zoom})`,
            "transform-origin": "0 0",
            width: `${100 / props.activeTab!.zoom}%`,
            height: `${100 / props.activeTab!.zoom}%`,
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        />
      </Show>
    </div>
  );
}
