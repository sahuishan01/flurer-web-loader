import { Show, createSignal } from "solid-js";
import { Tab, Bookmark } from "../types";
import { S } from "../styles";
import { QuickDial } from "./QuickDial";
import { PopoutIcon, ExternalIcon, GlobeIcon, NewTabIcon, CloseIcon } from "../icons";
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
  const [forceEmbedTabs, setForceEmbedTabs] = createSignal<Record<string, boolean>>({});

  const shouldShowLauncher = () => {
    if (!props.activeTab) return false;
    return isRestricted() && !forceEmbedTabs()[props.activeTab.id];
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
                    X-Frame-Options: DENY
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
                  This platform enforces browser frame security (<code>X-Frame-Options</code>), which blocks embedded tab rendering.
                  <br />
                  <br />
                  Launch it in an unrestricted <strong>Native WebviewWindow</strong> powered by {getPlatformEngineName()} for full compatibility, WebGL, cookies, and chat sessions.
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
            src={props.activeTab!.url}
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
    </div>
  );
}
