import { SearchEngine } from "./types";

export type Platform = "windows" | "macos" | "linux";

export function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const p = (navigator.platform || navigator.userAgent || "").toLowerCase();
  if (p.includes("mac") || p.includes("darwin")) return "macos";
  if (p.includes("linux") || p.includes("x11") || p.includes("bsd")) return "linux";
  return "windows";
}

export function getModifierKey(): string {
  return getPlatform() === "macos" ? "⌘" : "Ctrl";
}

export function getPlatformEngineName(): string {
  switch (getPlatform()) {
    case "macos":
      return "Apple WebKit (WKWebView)";
    case "linux":
      return "WebKitGTK";
    case "windows":
    default:
      return "Microsoft Edge WebView2 (Chromium)";
  }
}

declare global {
  interface Window {
    TauriCore?: {
      invoke<T = any>(cmd: string, args?: Record<string, any>): Promise<T>;
    };
    TauriShell?: {
      open(path: string): Promise<void>;
    };
  }
}

export function normalizeUrl(input: string, searchEngine: SearchEngine = "duckduckgo"): string {
  const trimmed = input.trim();
  if (!trimmed) return "about:blank";

  // Protocol already provided
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }

  // Localhost or IPv4/IPv6 address
  if (
    trimmed.startsWith("localhost") ||
    trimmed.startsWith("127.0.0.1") ||
    trimmed.startsWith("[::1]") ||
    /^192\.168\.\d+\.\d+/.test(trimmed) ||
    /^10\.\d+\.\d+\.\d+/.test(trimmed)
  ) {
    return `http://${trimmed}`;
  }

  // Looks like a domain (e.g., github.com, algosculptor.com, sub.domain.org/path)
  if (/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/.test(trimmed) && !trimmed.includes(" ")) {
    return `https://${trimmed}`;
  }

  // Fallback to search engine query
  const query = encodeURIComponent(trimmed);
  switch (searchEngine) {
    case "google":
      return `https://www.google.com/search?q=${query}`;
    case "bing":
      return `https://www.bing.com/search?q=${query}`;
    case "brave":
      return `https://search.brave.com/search?q=${query}`;
    case "duckduckgo":
    default:
      return `https://duckduckgo.com/?q=${query}`;
  }
}

export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const KNOWN_FRAME_RESTRICTED_DOMAINS = [
  "google.com",
  "youtube.com",
  "github.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "netflix.com",
  "openai.com",
  "anthropic.com",
  "claude.ai",
  "chatgpt.com",
  "discord.com",
  "slack.com",
];

export function isKnownFrameRestricted(url: string): boolean {
  try {
    const domain = getDomain(url).toLowerCase();
    return KNOWN_FRAME_RESTRICTED_DOMAINS.some(
      (blocked) => domain === blocked || domain.endsWith("." + blocked)
    );
  } catch {
    return false;
  }
}

let windowCounter = 0;

export async function openInWebviewWindow(url: string, title?: string): Promise<{ success: boolean; error?: string }> {
  const label = `web-${Date.now()}-${++windowCounter}`;
  const windowTitle = title || getDomain(url) || "Webview";

  if (!window.TauriCore) {
    console.warn("TauriCore not available, opening via window.open fallback");
    window.open(url, "_blank");
    return { success: true };
  }

  try {
    const platform = getPlatform();
    const windowOptions: Record<string, any> = {
      label,
      url,
      title: windowTitle,
      width: 1200,
      height: 800,
      decorations: true,
      transparent: false,
      center: true,
      focus: true,
    };

    if (platform === "macos") {
      windowOptions.hiddenTitle = true;
    }

    await window.TauriCore.invoke("plugin:webview|create_webview_window", {
      options: windowOptions,
    });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to spawn native WebviewWindow via TauriCore:", err);
    // Graceful fallback to default system browser if window creation capability failed
    try {
      await openInExternalBrowser(url);
      return { success: true };
    } catch (fallbackErr: any) {
      return { success: false, error: String(err?.message || err) };
    }
  }
}

export async function openInExternalBrowser(url: string): Promise<void> {
  if (window.TauriShell?.open) {
    await window.TauriShell.open(url);
    return;
  }
  if (window.TauriCore) {
    try {
      await window.TauriCore.invoke("plugin:opener|open_url", { url });
      return;
    } catch {
      // Ignore
    }
  }
  window.open(url, "_blank");
}
