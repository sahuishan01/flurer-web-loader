import { SearchEngine, Bookmark, HistoryItem } from "./types";

export type Platform = "windows" | "macos" | "linux";

export const DEFAULT_DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0";

export const CHROME_DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36";

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

export function sanitizeUrl(input: string): { url: string; isSafe: boolean; isSecure: boolean; warning?: string } {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "about:blank") {
    return { url: "about:blank", isSafe: true, isSecure: true };
  }
  const lower = trimmed.toLowerCase();
  // Strictly block execution vectors and arbitrary local file probes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:")
  ) {
    return {
      url: "about:blank",
      isSafe: false,
      isSecure: false,
      warning: `Blocked unsafe protocol execution (${trimmed.split(":")[0]}:)`,
    };
  }
  const isSecure =
    lower.startsWith("https://") ||
    lower.startsWith("http://localhost") ||
    lower.startsWith("http://127.0.0.1") ||
    lower.startsWith("http://[::1]");
  return { url: trimmed, isSafe: true, isSecure };
}

export function normalizeUrl(input: string, searchEngine: SearchEngine = "duckduckgo"): string {
  const trimmed = input.trim();
  if (!trimmed) return "about:blank";

  // Prevent script/protocol injection
  const sanitized = sanitizeUrl(trimmed);
  if (!sanitized.isSafe) {
    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  }

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
  "duckduckgo.com",
  "bing.com",
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

export function getDomainSlug(url: string): string {
  try {
    const domain = getDomain(url).toLowerCase();
    const slug = domain.replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
    return slug || "session";
  } catch {
    return "session";
  }
}

export interface WebviewWindowLaunchOptions {
  incognito?: boolean;
  userAgent?: string;
  reuseExisting?: boolean;
}

let windowCounter = 0;

export async function openInWebviewWindow(
  url: string,
  title?: string,
  options?: WebviewWindowLaunchOptions
): Promise<{ success: boolean; error?: string; reused?: boolean }> {
  const sanitized = sanitizeUrl(url);
  if (!sanitized.isSafe) {
    return { success: false, error: sanitized.warning || "Unsafe URL blocked for security" };
  }
  const targetUrl = sanitized.url;
  const windowTitle = title || getDomain(targetUrl) || "Webview";

  if (!window.TauriCore) {
    console.warn("TauriCore not available, opening via window.open fallback");
    window.open(targetUrl, "_blank");
    return { success: true };
  }

  const isIncognito = Boolean(options?.incognito);
  const reuseExisting = options?.reuseExisting !== false && !isIncognito;
  const slug = getDomainSlug(targetUrl);
  const label = isIncognito
    ? `web-incog-${Date.now()}`
    : (reuseExisting ? `web-${slug}` : `web-${Date.now()}-${++windowCounter}`);

  // If single window per service is active, re-focus existing window if already open
  if (reuseExisting) {
    try {
      await window.TauriCore.invoke("plugin:window|show", { label });
      await window.TauriCore.invoke("plugin:window|set_focus", { label });
      return { success: true, reused: true };
    } catch {
      // Window is not currently active, proceed with spawning new instance
    }
  }

  try {
    const platform = getPlatform();
    const windowOptions: Record<string, any> = {
      label,
      url: targetUrl,
      title: windowTitle,
      width: 1200,
      height: 800,
      decorations: true,
      transparent: false,
      center: true,
      focus: true,
      incognito: isIncognito,
      userAgent: options?.userAgent || DEFAULT_DESKTOP_USER_AGENT,
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
    // If window already exists, attempt to focus it
    if (String(err).includes("already exists")) {
      try {
        await window.TauriCore.invoke("plugin:window|show", { label });
        await window.TauriCore.invoke("plugin:window|set_focus", { label });
        return { success: true, reused: true };
      } catch {}
    }
    // Graceful fallback to default system browser if window creation capability failed
    try {
      await openInExternalBrowser(targetUrl);
      return { success: true };
    } catch (fallbackErr: any) {
      return { success: false, error: String(err?.message || err) };
    }
  }
}

export async function openInExternalBrowser(url: string): Promise<void> {
  const sanitized = sanitizeUrl(url);
  const targetUrl = sanitized.isSafe ? sanitized.url : "about:blank";

  if (window.TauriShell?.open) {
    await window.TauriShell.open(targetUrl);
    return;
  }
  if (window.TauriCore) {
    try {
      await window.TauriCore.invoke("plugin:opener|open_url", { url: targetUrl });
      return;
    } catch {
      // Ignore
    }
  }
  window.open(targetUrl, "_blank");
}

export async function clearAllBrowsingData(): Promise<{ success: boolean; error?: string }> {
  if (!window.TauriCore) {
    return { success: false, error: "TauriCore not available in this host environment" };
  }
  try {
    await window.TauriCore.invoke("plugin:webview|clear_all_browsing_data");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to clear browsing data:", err);
    return { success: false, error: String(err?.message || err) };
  }
}

const TABS_KEY = "flurer-web-loader-tabs";
const ACTIVE_TAB_KEY = "flurer-web-loader-active-tab";
const BOOKMARKS_KEY = "flurer-web-loader-bookmarks";
const HISTORY_KEY = "flurer-web-loader-history";

export function getSavedTabs(): { title: string; url: string }[] {
  try {
    const raw = localStorage.getItem(TABS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTabs(tabs: { title: string; url: string }[]): void {
  try {
    localStorage.setItem(TABS_KEY, JSON.stringify(tabs));
  } catch {}
}

export function getSavedActiveTab(): string | null {
  try {
    return localStorage.getItem(ACTIVE_TAB_KEY);
  } catch {
    return null;
  }
}

export function saveActiveTab(url: string | null): void {
  try {
    if (url) {
      localStorage.setItem(ACTIVE_TAB_KEY, url);
    } else {
      localStorage.removeItem(ACTIVE_TAB_KEY);
    }
  } catch {}
}

export function getSavedBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {}
}

export function getSavedHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch {}
}

export function addHistoryItem(title: string, url: string): HistoryItem[] {
  if (!url || url === "about:blank") return getSavedHistory();
  const current = getSavedHistory();
  const filtered = current.filter((h) => h.url !== url);
  const newItem: HistoryItem = {
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: title || getDomain(url),
    url,
    timestamp: Date.now(),
  };
  const updated = [newItem, ...filtered].slice(0, 100);
  saveHistory(updated);
  return updated;
}

export function removeHistoryItem(id: string): HistoryItem[] {
  const current = getSavedHistory();
  const updated = current.filter((h) => h.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

