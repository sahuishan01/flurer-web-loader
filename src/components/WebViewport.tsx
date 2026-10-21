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
    // If native docked child webviews are enabled and haven't failed, let docked webview handle it in-place
    if (props.dockedChildWebview !== false && !dockedFailed()) return false;
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

  let syncSeq = 0;
  let isSyncing = false;
  let hasPendingSync = false;

  const syncCurrentTabDocked = async () => {
    if (!containerRef) return;

    if (isSyncing) {
      hasPendingSync = true;
      return;
    }

    const currentSeq = ++syncSeq;
    const tab = props.activeTab;
    const tabId = tab?.id;
    const tabUrl = tab?.url;
    const isPanelActive = props.active !== false;

    isSyncing = true;
    try {
      // 1. If blank tab (New Tab / Home Page), panel inactive, or overlay is open: hide all docked webviews!
      if (!tab || isBlank() || !tabUrl || !isPanelActive || props.isOverlayOpen) {
        await hideAllDockedWebviews();
        return;
      }

      // 2. If docked child webviews are disabled or tab forced embed: hide webviews
      if (props.dockedChildWebview === false || (tabId && forceEmbedTabs()[tabId])) {
        await hideAllDockedWebviews();
        return;
      }

      const rect = containerRef.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const res = await createOrShowDockedWebview(tabId!, tabUrl, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });

      // Stale check: if active tab changed while awaiting IPC, do not activate stale tab
      if (currentSeq !== syncSeq || props.activeTab?.id !== tabId) {
        return;
      }

      if (res.success) {
        setDockedActiveMap((prev) => ({ ...prev, [tabId!]: true }));
        setDockedFailed(false);
      } else {
        console.warn("Native docked child webview unavailable, falling back:", res.error);
        setDockedActiveMap((prev) => ({ ...prev, [tabId!]: false }));
        setDockedFailed(true);
      }
    } catch (err) {
      console.error("syncCurrentTabDocked error:", err);
    } finally {
      isSyncing = false;
      // If a newer sync was requested while busy or if activeTab changed in-flight, resync to latest state immediately!
      if (hasPendingSync || currentSeq !== syncSeq || props.activeTab?.id !== tabId) {
        hasPendingSync = false;
        syncCurrentTabDocked();
      }
    }
  };

  // Synchronize dockedActiveMap when tabs are removed
  createEffect(() => {
    const currentTabIds = new Set((props.tabs || []).map((t) => t.id));
    setDockedActiveMap((prev) => {
      let changed = false;
      const next: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (currentTabIds.has(k)) {
          next[k] = v;
        } else {
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  });

  // Auto-launch separate native window ONLY if docked webview is disabled/failed and autoLaunchRestricted is enabled
  createEffect(() => {
    const tab = props.activeTab;
    if (
      props.autoLaunchRestricted &&
      (props.dockedChildWebview === false || dockedFailed()) &&
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
                    onLoad={(e) => {
                      const iframeEl = e.currentTarget as HTMLIFrameElement;
                      try {
                        const frameWindow = iframeEl?.contentWindow;
                        const frameHref = frameWindow?.location?.href;
                        if (frameHref && frameHref !== "about:blank" && frameHref !== tab.url) {
                          props.onOpenUrl(frameHref);
                        }

                        // Intercept target="_blank" and new-tab link clicks / window.open
                        if (frameWindow && frameWindow.document) {
                          // 1. Intercept link clicks with target="_blank", middle-click, or Ctrl/Cmd-click
                          frameWindow.document.addEventListener(
                            "click",
                            (evt: MouseEvent) => {
                              const target = evt.target as HTMLElement | null;
                              const a = target?.closest?.("a");
                              if (a && a.href) {
                                const isBlank =
                                  a.target === "_blank" ||
                                  a.getAttribute("target") === "_blank";
                                const isMiddleClick = evt.button === 1;
                                const isCtrlClick =
                                  (evt.ctrlKey || evt.metaKey) && evt.button === 0;

                                if (isBlank || isMiddleClick || isCtrlClick) {
                                  evt.preventDefault();
                                  evt.stopPropagation();
                                  props.onNewTab(a.href);
                                }
                              }
                            },
                            true
                          );

                          // 2. Intercept window.open calls
                          try {
                            const origOpen = frameWindow.open;
                            frameWindow.open = function (
                              url?: string | URL,
                              target?: string,
                              features?: string
                            ) {
                              if (url) {
                                const finalUrl =
                                  typeof url === "string" ? url : url.toString();
                                if (finalUrl && finalUrl !== "about:blank") {
                                  props.onNewTab(finalUrl);
                                  return null;
                                }
                              }
                              return origOpen
                                ? origOpen.apply(frameWindow, arguments as any)
                                : null;
                            };
                          } catch {}

                          // 3. Attach keydown forwarder
                          frameWindow.addEventListener("keydown", (evt: KeyboardEvent) => {
                            const isMod = evt.ctrlKey || evt.metaKey;
                            const isAlt = evt.altKey;
                            const isShift = evt.shiftKey;
                            const k = evt.key?.toLowerCase();
                            const isFunc = /^f\d+$/i.test(k);

                            // Preserve native text-editing commands in page inputs (copy, paste, cut, select all, undo, redo)
                            if (isMod && !isShift && !isAlt && ["c", "v", "x", "a", "z", "y"].includes(k)) {
                              return;
                            }

                            // Forward shortcuts: any modifier combo (Ctrl/Cmd, Alt) or Function keys (F1-F12)
                            if (isMod || isAlt || isFunc) {
                              evt.preventDefault();
                              evt.stopPropagation();
                              window.postMessage(
                                {
                                  type: "web-loader:shortcut",
                                  payload: {
                                    key: evt.key,
                                    code: evt.code,
                                    ctrlKey: evt.ctrlKey,
                                    metaKey: evt.metaKey,
                                    shiftKey: evt.shiftKey,
                                    altKey: evt.altKey,
                                  },
                                },
                                "*"
                              );
                            }
                          }, true);
                        }
                      } catch {
                        // Cross-origin access blocked by browser security policy (expected for external sites)
                      }
                    }}
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
