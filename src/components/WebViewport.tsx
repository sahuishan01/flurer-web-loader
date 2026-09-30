import { Show, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { Tab, Bookmark, HistoryItem } from "../types";
import { S } from "../styles";
import { QuickDial } from "./QuickDial";
import { PopoutIcon, ExternalIcon, GlobeIcon, NewTabIcon, CloseIcon } from "../icons";
import {
  isKnownFrameRestricted,
  getDomain,
  getPlatformEngineName,
  createDockedWebview,
  updateDockedWebviewBounds,
  closeDockedWebview,
  hideDockedWebview,
  showDockedWebview,
  getIframeEmbedUrl,
} from "../utils";

interface WebViewportProps {
  activeTab: Tab | undefined;
  bookmarks: Bookmark[];
  history?: HistoryItem[];
  active?: boolean;
  dockedChildWebview?: boolean;
  onOpenUrl: (url: string) => void;
  onNewTab: (url: string) => void;
  onOpenInWebviewWindow: (url: string) => void;
  onOpenExternal: (url: string) => void;
  onAddBookmark: (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => void;
  onRemoveBookmark: (id: string) => void;
  onRemoveHistory?: (id: string) => void;
  onClearHistory?: () => void;
}

export function WebViewport(props: WebViewportProps) {
  let containerRef: HTMLDivElement | undefined;
  const isBlank = () => !props.activeTab || props.activeTab.url === "about:blank" || !props.activeTab.url;
  const isRestricted = () => (props.activeTab ? isKnownFrameRestricted(props.activeTab.url) : false);

  const [dockedActive, setDockedActive] = createSignal(false);
  const [dockedFailed, setDockedFailed] = createSignal(false);
  const [forceEmbedTabs, setForceEmbedTabs] = createSignal<Record<string, boolean>>({});

  const shouldShowLauncher = () => {
    if (!props.activeTab) return false;
    // If native docked child webview is active, no launcher needed!
    if (dockedActive()) return false;
    return isRestricted() && !forceEmbedTabs()[props.activeTab.id];
  };

  const syncDockedBounds = () => {
    if (!containerRef || !dockedActive()) return;
    const rect = containerRef.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      updateDockedWebviewBounds({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const tryMountDockedWebview = async (targetUrl: string) => {
    if (!containerRef || props.dockedChildWebview === false) {
      setDockedActive(false);
      setDockedFailed(true);
      return;
    }
    const rect = containerRef.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const res = await createDockedWebview(targetUrl, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });

    if (res.success) {
      setDockedActive(true);
      setDockedFailed(false);
    } else {
      console.warn("Native docked child webview unavailable, falling back:", res.error);
      setDockedActive(false);
      setDockedFailed(true);
    }
  };

  // Watch URL changes and active tab to manage docked webview lifecycle
  createEffect(() => {
    const url = props.activeTab?.url;
    const isPanelActive = props.active !== false;

    if (isBlank() || !url || !isPanelActive) {
      if (dockedActive()) {
        hideDockedWebview();
        setDockedActive(false);
      }
      return;
    }

    if (props.dockedChildWebview !== false && !forceEmbedTabs()[props.activeTab!.id]) {
      tryMountDockedWebview(url);
    } else {
      closeDockedWebview();
      setDockedActive(false);
    }
  });

  onMount(() => {
    if (!containerRef) return;
    const ro = new ResizeObserver(() => {
      syncDockedBounds();
    });
    ro.observe(containerRef);

    onCleanup(() => {
      ro.disconnect();
      closeDockedWebview();
    });
  });

  const handlePopOut = () => {
    if (!props.activeTab || isBlank()) return;
    closeDockedWebview();
    setDockedActive(false);
    props.onOpenInWebviewWindow(props.activeTab.url);
  };

  return (
    <div ref={containerRef} style={{ ...S.viewport, position: "relative" }}>
      <Show
        when={!isBlank()}
        fallback={
          <QuickDial
            bookmarks={props.bookmarks}
            history={props.history}
            onOpenUrl={props.onOpenUrl}
            onNewTab={props.onNewTab}
            onOpenInWebviewWindow={props.onOpenInWebviewWindow}
            onOpenExternal={props.onOpenExternal}
            onAddBookmark={props.onAddBookmark}
            onRemoveBookmark={props.onRemoveBookmark}
            onRemoveHistory={props.onRemoveHistory}
            onClearHistory={props.onClearHistory}
          />
        }
      >
        <Show
          when={!dockedActive()}
          fallback={
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                "z-index": 100,
                display: "flex",
                "align-items": "center",
                gap: "8px",
                padding: "6px 12px",
                background: "rgba(15, 23, 42, 0.85)",
                "backdrop-filter": "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                "border-radius": "999px",
                "box-shadow": "0 4px 16px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", "border-radius": "50%", background: "#10b981", display: "inline-block" }} />
                <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-secondary, #94a3b8)" }}>
                  Native Docked View
                </span>
              </div>
              <button
                type="button"
                class="icon-btn web-loader-icon-btn"
                style={{
                  ...S.secondaryBtn,
                  padding: "4px 8px",
                  "font-size": "11px",
                  "border-radius": "999px",
                  gap: "4px",
                  cursor: "pointer",
                }}
                onClick={handlePopOut}
                title="Pop out into separate Native WebviewWindow"
              >
                <PopoutIcon size={14} />
                Pop Out
              </button>
            </div>
          }
        >
          <Show
            when={!shouldShowLauncher()}
            fallback={
              <div style={S.blockedNotice}>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "18px",
                    "border-radius": "999px",
                    background: "rgba(var(--accent-rgb, 56, 189, 248), 0.12)",
                    color: "var(--accent-default, #38bdf8)",
                    border: "1px solid rgba(var(--accent-rgb, 56, 189, 248), 0.3)",
                    "box-shadow": "0 0 24px rgba(var(--accent-rgb, 56, 189, 248), 0.2)",
                  }}
                >
                  <GlobeIcon size={38} />
                </div>

                <div style={{ "max-width": "540px" }}>
                  <div style={{ display: "flex", "align-items": "center", "justify-content": "center", gap: "8px", "margin-bottom": "8px" }}>
                    <span style={S.badge}>Frame Protected</span>
                    <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                      X-Frame-Options: SAMEORIGIN
                    </span>
                  </div>

                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      "font-size": "22px",
                      "font-weight": 600,
                      color: "var(--text-primary, #f8fafc)",
                    }}
                  >
                    {getDomain(props.activeTab!.url)}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      "font-size": "13px",
                      color: "var(--text-secondary, #94a3b8)",
                      "line-height": 1.55,
                    }}
                  >
                    Google and major platforms block embedded HTML iframes via <code>X-Frame-Options: SAMEORIGIN</code>.
                    <br />
                    <br />
                    Click <strong>Launch Native Window</strong> to open an unrestricted, persistent <strong>{getPlatformEngineName()}</strong> session, or use the manual pop-out toggle anytime.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", "margin-top": "8px", "flex-wrap": "wrap", "justify-content": "center" }}>
                  <button
                    type="button"
                    style={S.actionBtn}
                    onClick={() => props.onOpenInWebviewWindow(props.activeTab!.url)}
                  >
                    <PopoutIcon size={18} />
                    Launch Native Window
                  </button>

                  <button
                    type="button"
                    style={S.secondaryBtn}
                    onClick={() => props.onOpenExternal(props.activeTab!.url)}
                  >
                    <ExternalIcon size={18} />
                    Open in System Browser
                  </button>

                  <button
                    type="button"
                    style={{
                      ...S.secondaryBtn,
                      background: "transparent",
                      color: "var(--text-muted, #94a3b8)",
                      border: "1px dashed var(--border-color, rgba(255, 255, 255, 0.15))",
                    }}
                    onClick={() => {
                      if (props.activeTab) {
                        setForceEmbedTabs((prev) => ({ ...prev, [props.activeTab!.id]: true }));
                      }
                    }}
                    title="Attempt loading in iframe anyway"
                  >
                    Try in Tab Anyway
                  </button>
                </div>
              </div>
            }
          >
            <iframe
              src={getIframeEmbedUrl(props.activeTab!.url)}
              title={props.activeTab!.title || "Web View"}
              style={{
                ...S.iframe,
                transform: `scale(${props.activeTab!.zoom})`,
                "transform-origin": "0 0",
                width: `${100 / props.activeTab!.zoom}%`,
                height: `${100 / props.activeTab!.zoom}%`,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            />
          </Show>
        </Show>
      </Show>
    </div>
  );
}
