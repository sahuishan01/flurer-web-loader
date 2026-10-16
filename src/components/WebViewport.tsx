import { Show, For, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { Tab, Bookmark, HistoryItem } from "../types";
import { S } from "../styles";
import { QuickDial } from "./QuickDial";
import { PopoutIcon, ExternalIcon, GlobeIcon, NewTabIcon, CloseIcon } from "../icons";
import {
  isKnownFrameRestricted,
  getDomain,
  getPlatformEngineName,
  createOrShowDockedWebview,
  updateDockedWebviewBounds,
  hideAllDockedWebviews,
  closeTabWebview,
  closeAllDockedWebviews,
  getIframeEmbedUrl,
  addUserRestrictedDomain,
} from "../utils";

interface WebViewportProps {
  activeTab: Tab | undefined;
  tabs?: Tab[];
  bookmarks: Bookmark[];
  history?: HistoryItem[];
  active?: boolean;
  dockedChildWebview?: boolean;
  isOverlayOpen?: boolean;
  autoLaunchRestricted?: boolean;
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

  const [dockedActiveMap, setDockedActiveMap] = createSignal<Record<string, boolean>>({});
  const [dockedFailed, setDockedFailed] = createSignal(false);
  const [forceEmbedTabs, setForceEmbedTabs] = createSignal<Record<string, boolean>>({});

  const isCurrentDockedActive = () => (props.activeTab ? !!dockedActiveMap()[props.activeTab.id] : false);

  const shouldShowLauncher = () => {
    if (!props.activeTab) return false;
    // If native docked child webview is active, no launcher needed!
    if (isCurrentDockedActive()) return false;
    return isRestricted() && !forceEmbedTabs()[props.activeTab.id];
  };

  const syncDockedBounds = () => {
    if (!containerRef || props.isOverlayOpen) return;
    const rect = containerRef.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    if (props.activeTab && isCurrentDockedActive()) {
      updateDockedWebviewBounds(
        {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        },
        props.activeTab.id
      );
    } else {
      syncCurrentTabDocked();
    }
  };

  let isSyncing = false;
  const syncCurrentTabDocked = async () => {
    if (!containerRef || isSyncing) return;
    const tab = props.activeTab;
    const isPanelActive = props.active !== false;

    // 1. If blank tab (New Tab / Home Page), panel inactive, or overlay is open: hide all docked webviews!
    if (!tab || isBlank() || !tab.url || !isPanelActive || props.isOverlayOpen) {
      await hideAllDockedWebviews();
      return;
    }

    // 2. If docked child webviews are disabled or tab forced embed: hide webviews
    if (props.dockedChildWebview === false || forceEmbedTabs()[tab.id]) {
      await hideAllDockedWebviews();
      return;
    }

    const rect = containerRef.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    isSyncing = true;
    try {
      const res = await createOrShowDockedWebview(tab.id, tab.url, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      if (res.success) {
        setDockedActiveMap((prev) => ({ ...prev, [tab.id]: true }));
        setDockedFailed(false);
      } else {
        console.warn("Native docked child webview unavailable, falling back:", res.error);
        setDockedActiveMap((prev) => ({ ...prev, [tab.id]: false }));
        setDockedFailed(true);
      }
    } catch (err) {
      console.error("syncCurrentTabDocked error:", err);
    } finally {
      isSyncing = false;
    }
  };

  // Auto-launch separate native window if autoLaunchRestricted is enabled
  createEffect(() => {
    const tab = props.activeTab;
    if (
      props.autoLaunchRestricted &&
      tab &&
      tab.url &&
      tab.url !== "about:blank" &&
      isRestricted() &&
      !isCurrentDockedActive() &&
      !forceEmbedTabs()[tab.id]
    ) {
      props.onOpenInWebviewWindow(tab.url);
    }
  });

  // Watch URL changes, active tab, panel visibility, and overlay state
  createEffect(() => {
    const tabId = props.activeTab?.id;
    const url = props.activeTab?.url;
    const isPanelActive = props.active !== false;
    const overlayOpen = props.isOverlayOpen;

    syncCurrentTabDocked();
  });

  onMount(() => {
    if (!containerRef) return;
    const ro = new ResizeObserver(() => {
      syncDockedBounds();
    });
    ro.observe(containerRef);

    onCleanup(() => {
      ro.disconnect();
      hideAllDockedWebviews();
    });
  });

  const handlePopOut = () => {
    if (!props.activeTab || isBlank()) return;
    closeTabWebview(props.activeTab.id);
    setDockedActiveMap((prev) => ({ ...prev, [props.activeTab!.id]: false }));
    props.onOpenInWebviewWindow(props.activeTab.url);
  };

  // For iframe fallback: strictly exclude frame-restricted tabs so blocked sites NEVER mount an iframe in the DOM
  const webTabs = () =>
    props.tabs?.filter(
      (t) =>
        t.url &&
        t.url !== "about:blank" &&
        (!isKnownFrameRestricted(t.url) || forceEmbedTabs()[t.id])
    ) ||
    (props.activeTab &&
    !isBlank() &&
    (!isKnownFrameRestricted(props.activeTab.url) || forceEmbedTabs()[props.activeTab.id])
      ? [props.activeTab]
      : []);

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
          when={!isCurrentDockedActive()}
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
                      X-Frame-Options / CSP Restrict
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
                    <strong>{getDomain(props.activeTab!.url)}</strong> explicitly blocks embedded HTML iframes to protect authentication against clickjacking.
                    <br />
                    <br />
                    Click <strong>Launch Native Window</strong> to open an unrestricted, persistent <strong>{getPlatformEngineName()}</strong> session with full login & cookie support.
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
            {/* Quick-switch helper overlay if an embedded iframe refuses connection */}
            <Show when={props.activeTab && !isRestricted() && props.activeTab.url !== "about:blank"}>
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "16px",
                  "z-index": 60,
                  display: "flex",
                  "align-items": "center",
                  gap: "8px",
                  padding: "4px 10px",
                  background: "rgba(15, 23, 42, 0.85)",
                  "backdrop-filter": "blur(8px)",
                  "-webkit-backdrop-filter": "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  "border-radius": "999px",
                  "box-shadow": "0 4px 16px rgba(0, 0, 0, 0.3)",
                }}
              >
                <span style={{ "font-size": "11px", "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>
                  Refused to connect?
                </span>
                <button
                  type="button"
                  class="icon-btn web-loader-icon-btn"
                  style={{
                    ...S.actionBtn,
                    padding: "3px 8px",
                    "font-size": "11px",
                    "border-radius": "999px",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (props.activeTab && props.activeTab.url !== "about:blank") {
                      addUserRestrictedDomain(getDomain(props.activeTab.url));
                      props.onOpenInWebviewWindow(props.activeTab.url);
                    }
                  }}
                  title="Open in native desktop window and automatically remember this domain as frame-restricted"
                >
                  <PopoutIcon size={12} />
                  Open Natively
                </button>
              </div>
            </Show>

            <For each={webTabs()}>
              {(tab) => (
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: "100%",
                    height: "100%",
                    display: tab.id === props.activeTab?.id ? "block" : "none",
                  }}
                >
                  <iframe
                    src={getIframeEmbedUrl(tab.url)}
                    title={tab.title || "Web View"}
                    style={{
                      ...S.iframe,
                      transform: `scale(${tab.zoom || 1})`,
                      "transform-origin": "0 0",
                      width: `${100 / (tab.zoom || 1)}%`,
                      height: `${100 / (tab.zoom || 1)}%`,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  />
                </div>
              )}
            </For>
          </Show>
        </Show>
      </Show>
    </div>
  );
}
