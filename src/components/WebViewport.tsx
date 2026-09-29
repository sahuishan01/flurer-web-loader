import { Show } from "solid-js";
import { Tab, Bookmark } from "../types";
import { S } from "../styles";
import { QuickDial } from "./QuickDial";
import { PopoutIcon, ExternalIcon, GlobeIcon } from "../icons";
import { isKnownFrameRestricted, getDomain } from "../utils";

interface WebViewportProps {
  activeTab: Tab | undefined;
  bookmarks: Bookmark[];
  onOpenUrl: (url: string) => void;
  onOpenInWebviewWindow: (url: string) => void;
  onOpenExternal: (url: string) => void;
  onAddBookmark: (title: string, url: string, category: "dev" | "docs" | "ai" | "custom") => void;
  onRemoveBookmark: (id: string) => void;
}

export function WebViewport(props: WebViewportProps) {
  const isBlank = () => !props.activeTab || props.activeTab.url === "about:blank" || !props.activeTab.url;
  const isRestricted = () => props.activeTab ? isKnownFrameRestricted(props.activeTab.url) : false;

  return (
    <div style={S.viewport}>
      <Show
        when={!isBlank()}
        fallback={
          <QuickDial
            bookmarks={props.bookmarks}
            onOpenUrl={props.onOpenUrl}
            onOpenInWebviewWindow={props.onOpenInWebviewWindow}
            onAddBookmark={props.onAddBookmark}
            onRemoveBookmark={props.onRemoveBookmark}
          />
        }
      >
        <Show
          when={!isRestricted()}
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
                <GlobeIcon size={36} />
              </div>

              <div style={{ "max-width": "500px" }}>
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
                  This modern website enforces strict security policies (<code>X-Frame-Options: SAMEORIGIN</code> or CSP frame-ancestors) that block embedded iframes.
                  <br />
                  <br />
                  Launch it in an unrestricted <strong>Native WebviewWindow</strong> powered by Microsoft Edge WebView2 for full compatibility, WebGL, streaming media, and authenticated sessions.
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", "margin-top": "8px" }}>
                <button
                  type="button"
                  style={S.actionBtn}
                  onClick={() => props.onOpenInWebviewWindow(props.activeTab!.url)}
                >
                  <PopoutIcon size={16} />
                  Open in Dedicated WebviewWindow
                </button>

                <button
                  type="button"
                  style={S.secondaryBtn}
                  onClick={() => props.onOpenExternal(props.activeTab!.url)}
                >
                  <ExternalIcon size={16} />
                  Open in System Browser
                </button>
              </div>
            </div>
          }
        >
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
