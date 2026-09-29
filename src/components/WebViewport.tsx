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
  const [forceLoadTabs, setForceLoadTabs] = createSignal<Record<string, boolean>>({});

  const isRestricted = () => (props.activeTab ? isKnownFrameRestricted(props.activeTab.url) : false);
  const shouldRenderIframe = () => {
    if (!props.activeTab) return false;
    if (forceLoadTabs()[props.activeTab.id]) return true;
    return !isRestricted();
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
        <Show
          when={shouldRenderIframe()}
          fallback={
            <div style={S.blockedNotice}>
              <div
                style={{
                  display: "inline-flex",
                  padding: "16px",
                  "border-radius": "999px",
                  background: "rgba(var(--accent-rgb, 56, 189, 248), 0.1)",
                  color: "var(--accent-default, #38bdf8)",
                }}
              >
                <GlobeIcon size={42} />
              </div>

              <div style={{ "max-width": "540px" }}>
                <h2
                  style={{
                    margin: "0 0 8px 0",
                    "font-size": "20px",
                    "font-weight": 600,
                    color: "var(--text-primary, #f8fafc)",
                  }}
                >
                  Frame Protection Detected ({getDomain(props.activeTab!.url)})
                </h2>
                <p
                  style={{
                    margin: 0,
                    "font-size": "13px",
                    color: "var(--text-secondary, #94a3b8)",
                    "line-height": 1.5,
                  }}
                >
                  This modern platform enforces strict browser frame policies (<code>X-Frame-Options: SAMEORIGIN</code> or CSP frame-ancestors) that block embedded iframes.
                  <br />
                  <br />
                  Launch it in an unrestricted <strong>Native WebviewWindow</strong> powered by {getPlatformEngineName()} for full compatibility, WebGL, streaming media, and authenticated sessions.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", "margin-top": "8px", "flex-wrap": "wrap", "justify-content": "center" }}>
                <button
                  type="button"
                  style={S.actionBtn}
                  onClick={() => props.onOpenInWebviewWindow(props.activeTab!.url)}
                >
                  <PopoutIcon size={18} />
                  Open in Dedicated WebviewWindow
                </button>

                <button
                  type="button"
                  style={S.secondaryBtn}
                  onClick={() => props.onNewTab(props.activeTab!.url)}
                  title="Open this URL in a new tab"
                >
                  <NewTabIcon size={18} />
                  Open in New Tab
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
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "var(--text-secondary, #94a3b8)",
                  }}
                  onClick={() => {
                    if (props.activeTab) {
                      setForceLoadTabs((prev) => ({ ...prev, [props.activeTab!.id]: true }));
                    }
                  }}
                  title="Attempt to render inside this tab's embedded iframe"
                >
                  Try in Tab Anyway
                </button>
              </div>
            </div>
          }
        >
          <Show when={isRestricted()}>
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
                background: "rgba(15, 23, 42, 0.9)",
                "backdrop-filter": "blur(8px)",
                "-webkit-backdrop-filter": "blur(8px)",
                border: "1px solid rgba(var(--accent-rgb, 56, 189, 248), 0.3)",
                "border-radius": "8px",
                color: "var(--text-primary, #f8fafc)",
                "font-size": "12px",
                "font-family": "Space Mono, monospace",
                "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.4)",
              }}
            >
              <span>Frame restrictions may apply</span>
              <button
                type="button"
                style={{ ...S.actionBtn, padding: "4px 10px", "font-size": "11px" }}
                onClick={() => props.onOpenInWebviewWindow(props.activeTab!.url)}
              >
                <PopoutIcon size={14} />
                Pop out Window
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
      </Show>
    </div>
  );
}
