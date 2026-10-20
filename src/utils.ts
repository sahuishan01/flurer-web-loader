import { SearchEngine, Bookmark, HistoryItem, SavedTabRecord, ProjectWorkspace, SmartRouterConfig } from "./types";
import { DEFAULT_WORKSPACES } from "./smartRouter";

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
    TauriEvent?: {
      listen<T = any>(event: string, handler: (event: { event: string; id: number; payload: T }) => void): Promise<() => void>;
      emit(event: string, payload?: any): Promise<void>;
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

export const COMMON_DOMAIN_SHORTCUTS: Record<string, string> = {
  github: "https://github.com",
  youtube: "https://youtube.com",
  reddit: "https://reddit.com",
  twitter: "https://x.com",
  x: "https://x.com",
  linkedin: "https://linkedin.com",
  outlook: "https://outlook.office.com",
  office: "https://office.com",
  gmail: "https://mail.google.com",
  chatgpt: "https://chatgpt.com",
  claude: "https://claude.ai",
  notion: "https://notion.so",
  figma: "https://figma.com",
  linear: "https://linear.app",
  gitlab: "https://gitlab.com",
  wikipedia: "https://wikipedia.org",
  stackoverflow: "https://stackoverflow.com",
  amazon: "https://amazon.com",
  netflix: "https://netflix.com",
  spotify: "https://open.spotify.com",
  twitch: "https://twitch.tv",
  discord: "https://discord.com",
  slack: "https://app.slack.com",
  termix: "https://termix.algosculptor.com",
};

export function normalizeUrl(input: string, searchEngine: SearchEngine = "duckduckgo"): string {
  const trimmed = input.trim();
  if (!trimmed) return "about:blank";

  // Prevent script/protocol injection
  const sanitized = sanitizeUrl(trimmed);
  if (!sanitized.isSafe) {
    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  }

  const lower = trimmed.toLowerCase();

  // Instant known domain shortcuts (e.g. "github" -> https://github.com)
  if (COMMON_DOMAIN_SHORTCUTS[lower]) {
    return COMMON_DOMAIN_SHORTCUTS[lower];
  }

  // Direct Google domain mapping with igu=1 (disables X-Frame-Options)
  if (
    lower === "google.com" ||
    lower === "www.google.com" ||
    lower === "https://google.com" ||
    lower === "https://www.google.com" ||
    lower === "https://google.com/" ||
    lower === "https://www.google.com/" ||
    lower === "http://google.com" ||
    lower === "http://www.google.com" ||
    lower === "http://google.com/" ||
    lower === "http://www.google.com/"
  ) {
    return "https://www.google.com/search?igu=1";
  }

  // Protocol already provided
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    // If user provided http:// for algosculptor.com domains, auto-upgrade to https://
    // Caddy & Cloudflare terminate HTTPS; loading http:// inside iframes triggers Mixed Content blocks
    if (trimmed.startsWith("http://") && trimmed.includes("algosculptor.com")) {
      return trimmed.replace(/^http:\/\//i, "https://");
    }
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

  // Looks like a domain with optional port (e.g., github.com, algosculptor.com, splitter.algosculptor.com:8088, host.org:3000/path)
  if (/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?([/?#].*)?$/.test(trimmed) && !trimmed.includes(" ")) {
    if (trimmed.includes("google.") && !trimmed.includes("igu=1")) {
      return `https://${trimmed}/search?igu=1`;
    }
    return `https://${trimmed}`;
  }

  // Fallback to search engine query
  const query = encodeURIComponent(trimmed);
  switch (searchEngine) {
    case "google":
      return `https://www.google.com/search?q=${query}&igu=1`;
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

export function getIframeEmbedUrl(url: string): string {
  try {
    if (!url || url === "about:blank") return url;
    const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    const domain = getDomain(fullUrl).toLowerCase();
    if (domain.includes("google.") && !fullUrl.includes("igu=1")) {
      const parsed = new URL(fullUrl);
      if (parsed.pathname === "/" || parsed.pathname === "") {
        const query = parsed.search ? parsed.search.slice(1) + "&" : "";
        return `https://${parsed.hostname}/search?${query}igu=1`;
      }
      const sep = fullUrl.includes("?") ? "&" : "?";
      return `${fullUrl}${sep}igu=1`;
    }
  } catch {}
  return url;
}

export const KNOWN_FRAME_RESTRICTED_DOMAINS = [
  // Microsoft & Office 365
  "office.com",
  "office365.com",
  "outlook.com",
  "outlook.office.com",
  "outlook.office365.com",
  "microsoft.com",
  "microsoft365.com",
  "live.com",
  "login.microsoftonline.com",
  "sharepoint.com",
  "teams.microsoft.com",

  // Google Protected Portals
  "accounts.google.com",
  "mail.google.com",
  "drive.google.com",
  "docs.google.com",

  // Developer & Collaboration Workspaces
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "notion.so",
  "figma.com",
  "trello.com",
  "linear.app",
  "atlassian.net",
  "jira.com",
  "slack.com",
  "discord.com",
  "zoom.us",

  // Media, Video & Social Networks
  "youtube.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "netflix.com",
  "spotify.com",
  "twitch.tv",

  // AI & LLM Consoles
  "openai.com",
  "chatgpt.com",
  "anthropic.com",
  "claude.ai",
  "perplexity.ai",
  "gemini.google.com",
  "aistudio.google.com",

  // Banking & Financial Auth
  "paypal.com",
  "stripe.com",
  "chase.com",
  "bankofamerica.com",
  "wellsfargo.com",
];

const USER_RESTRICTED_DOMAINS_KEY = "flurer-web-loader-user-restricted-domains";

export function getUserRestrictedDomains(): string[] {
  try {
    const raw = localStorage.getItem(USER_RESTRICTED_DOMAINS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addUserRestrictedDomain(domain: string): void {
  try {
    const clean = domain.toLowerCase().trim().replace(/^www\./, "");
    if (!clean) return;
    const current = getUserRestrictedDomains();
    if (!current.includes(clean)) {
      const updated = [...current, clean];
      localStorage.setItem(USER_RESTRICTED_DOMAINS_KEY, JSON.stringify(updated));
    }
  } catch {}
}

export function removeUserRestrictedDomain(domain: string): void {
  try {
    const clean = domain.toLowerCase().trim().replace(/^www\./, "");
    const current = getUserRestrictedDomains();
    const updated = current.filter((d) => d !== clean);
    localStorage.setItem(USER_RESTRICTED_DOMAINS_KEY, JSON.stringify(updated));
  } catch {}
}

export function isKnownFrameRestricted(url: string): boolean {
  try {
    if (!url || url === "about:blank") return false;
    const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    const parsed = new URL(fullUrl);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    // Google Search with igu=1 explicitly permits iframe embedding without X-Frame-Options
    if (url.includes("igu=1") && (hostname === "google.com" || hostname.endsWith(".google.com"))) {
      if (
        !hostname.startsWith("mail.") &&
        !hostname.startsWith("accounts.") &&
        !hostname.startsWith("docs.") &&
        !hostname.startsWith("drive.")
      ) {
        return false;
      }
    }

    const isMatch = (blocked: string) => {
      const clean = blocked.toLowerCase().trim();
      return hostname === clean || hostname.endsWith("." + clean);
    };

    const userRestricted = getUserRestrictedDomains();
    if (userRestricted.some(isMatch)) {
      return true;
    }

    return (
      hostname.includes("youtube.") ||
      KNOWN_FRAME_RESTRICTED_DOMAINS.some(isMatch)
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
  const reuseExisting = Boolean(options?.reuseExisting) && !isIncognito;
  const slug = getDomainSlug(targetUrl);
  const uniqueSuffix = `${Date.now().toString(36)}-${(++windowCounter).toString(36)}`;
  const label = isIncognito
    ? `web-incog-${uniqueSuffix}`
    : (reuseExisting ? `web-${slug}` : `web-${slug}-${uniqueSuffix}`);

  // If single window per service is explicitly requested, re-focus existing window if already open
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
    try {
      await window.TauriCore.invoke("attach_child_webview_shortcuts", {
        label,
        pluginId: "web-loader",
      });
    } catch {}
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
      // If focusing the existing label failed, retry with a fresh unique label
      try {
        const retryLabel = `web-${slug}-${Date.now().toString(36)}-${(++windowCounter).toString(36)}`;
        await window.TauriCore.invoke("plugin:webview|create_webview_window", {
          options: {
            label: retryLabel,
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
          },
        });
        try {
          await window.TauriCore.invoke("attach_child_webview_shortcuts", {
            label: retryLabel,
            pluginId: "web-loader",
          });
        } catch {}
        return { success: true };
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
  if (!targetUrl || targetUrl === "about:blank") return;

  // 1. Try Tauri v2 Opener plugin (allowed via opener:default in Flurer capabilities)
  if (window.TauriCore) {
    try {
      await window.TauriCore.invoke("plugin:opener|open_url", { url: targetUrl });
      return;
    } catch (openerErr) {
      console.warn("plugin:opener|open_url failed, trying open_path fallback:", openerErr);
    }

    try {
      await window.TauriCore.invoke("plugin:opener|open_path", { path: targetUrl });
      return;
    } catch (pathErr) {
      console.warn("plugin:opener|open_path failed, trying shell fallback:", pathErr);
    }
  }

  // 2. Try TauriShell.open with defensive error boundary
  if (window.TauriShell?.open) {
    try {
      await window.TauriShell.open(targetUrl);
      return;
    } catch (shellErr) {
      console.warn("window.TauriShell.open failed, trying window.open fallback:", shellErr);
    }
  }

  // 3. Fallback to standard window.open
  try {
    window.open(targetUrl, "_blank");
  } catch (err) {
    console.error("All external browser openers failed:", err);
  }
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

export const DOCKED_WEBVIEW_PREFIX = "web-docked";
let dockedCounter = 0;
let dockedWebviewSupported: boolean | null = null;

// Registry of child webviews keyed by tabId: tabId -> { label: string, url: string }
const tabWebviewRegistry = new Map<string, { label: string; url: string }>();
let currentVisibleTabId: string | null = null;
let currentVisibleLabel: string | null = null;

export function getActiveDockedLabel(): string | null {
  return currentVisibleLabel;
}

export function getDockedWebviewEntry(tabId: string): { label: string; url: string } | undefined {
  return tabWebviewRegistry.get(tabId);
}

export function updateDockedWebviewUrl(tabId: string, newUrl: string): void {
  const existing = tabWebviewRegistry.get(tabId);
  if (existing) {
    tabWebviewRegistry.set(tabId, { ...existing, url: newUrl });
  }
}

export function isTabWebviewMounted(tabId: string): boolean {
  return tabWebviewRegistry.has(tabId);
}

export function getCurrentWindowLabel(): string {
  try {
    const internals = (window as any).__TAURI_INTERNALS__;
    if (internals?.metadata?.currentWindow?.label) {
      return internals.metadata.currentWindow.label;
    }
    if (internals?.metadata?.currentWebview?.label) {
      return internals.metadata.currentWebview.label;
    }
  } catch {}
  return "flurer-0";
}

export async function createOrShowDockedWebview(
  tabId: string,
  url: string,
  rect: { x: number; y: number; width: number; height: number },
  windowLabel?: string
): Promise<{ success: boolean; error?: string; reused?: boolean }> {
  if (dockedWebviewSupported === false) {
    return { success: false, error: "Docked child webview not supported by host runtime" };
  }
  if (!window.TauriCore) {
    dockedWebviewSupported = false;
    return { success: false, error: "TauriCore not available" };
  }
  const targetWindowLabel = windowLabel || getCurrentWindowLabel();

  const sanitized = sanitizeUrl(url);
  if (!sanitized.isSafe) {
    return { success: false, error: sanitized.warning || "Unsafe URL blocked" };
  }

  const x = Math.max(0, Math.round(rect.x));
  const y = Math.max(0, Math.round(rect.y));
  const width = Math.max(100, Math.round(rect.width));
  const height = Math.max(100, Math.round(rect.height));

  // Case 1: Tab already has a child webview mounted
  const existing = tabWebviewRegistry.get(tabId);
  if (existing) {
    // If URL is the same: reuse existing webview! No reload!
    if (existing.url === sanitized.url) {
      // Hide all other tab webviews
      for (const [otherId, other] of tabWebviewRegistry.entries()) {
        if (otherId !== tabId) {
          try {
            await window.TauriCore.invoke("plugin:webview|set_webview_position", {
              label: other.label,
              value: { Logical: { x: -10000, y: -10000 } },
            });
            await window.TauriCore.invoke("plugin:webview|set_webview_size", {
              label: other.label,
              value: { Logical: { width: 0, height: 0 } },
            });
            await window.TauriCore.invoke("plugin:webview|webview_hide", { label: other.label });
          } catch {}
        }
      }

      // Show and update bounds of this tab's webview
      try {
        await window.TauriCore.invoke("plugin:webview|webview_show", { label: existing.label });
        await window.TauriCore.invoke("plugin:webview|set_webview_position", {
          label: existing.label,
          value: { Logical: { x, y } },
        });
        await window.TauriCore.invoke("plugin:webview|set_webview_size", {
          label: existing.label,
          value: { Logical: { width, height } },
        });
        await window.TauriCore.invoke("plugin:webview|set_webview_focus", { label: existing.label });
        currentVisibleTabId = tabId;
        currentVisibleLabel = existing.label;
        dockedWebviewSupported = true;
        return { success: true, reused: true };
      } catch (err: any) {
        console.warn("Failed to reuse existing docked webview, will recreate:", err);
        try {
          await window.TauriCore.invoke("plugin:webview|webview_close", { label: existing.label });
        } catch {}
        tabWebviewRegistry.delete(tabId);
      }
    } else {
      // URL changed for this tab: close old webview and create a new one
      try {
        await window.TauriCore.invoke("plugin:webview|webview_close", { label: existing.label });
      } catch {}
      tabWebviewRegistry.delete(tabId);
    }
  }

  // Case 2: Create new child webview for this tab
  // Hide all other webviews
  for (const [otherId, other] of tabWebviewRegistry.entries()) {
    if (otherId !== tabId) {
      try {
        await window.TauriCore.invoke("plugin:webview|set_webview_position", {
          label: other.label,
          value: { Logical: { x: -10000, y: -10000 } },
        });
        await window.TauriCore.invoke("plugin:webview|set_webview_size", {
          label: other.label,
          value: { Logical: { width: 0, height: 0 } },
        });
        await window.TauriCore.invoke("plugin:webview|webview_hide", { label: other.label });
      } catch {}
    }
  }

  const cleanTabId = tabId.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 16);
  const newLabel = `${DOCKED_WEBVIEW_PREFIX}-${cleanTabId}-${Date.now().toString(36)}-${(++dockedCounter).toString(36)}`;

  try {
    const windowOptions: Record<string, any> = {
      label: newLabel,
      url: sanitized.url,
      x,
      y,
      width,
      height,
      focus: true,
      transparent: false,
      userAgent: DEFAULT_DESKTOP_USER_AGENT,
    };

    try {
      await window.TauriCore.invoke("plugin:webview|create_webview", {
        windowLabel: targetWindowLabel,
        options: windowOptions,
      });
    } catch (invokeErr: any) {
      const msg = String(invokeErr?.message || invokeErr);
      if (msg.includes("WindowNotFound") && targetWindowLabel !== "flurer-0") {
        await window.TauriCore.invoke("plugin:webview|create_webview", {
          windowLabel: "flurer-0",
          options: windowOptions,
        });
      } else if (msg.includes("WindowNotFound") && targetWindowLabel !== "main") {
        await window.TauriCore.invoke("plugin:webview|create_webview", {
          windowLabel: "main",
          options: windowOptions,
        });
      } else {
        throw invokeErr;
      }
    }

    tabWebviewRegistry.set(tabId, { label: newLabel, url: sanitized.url });
    currentVisibleTabId = tabId;
    currentVisibleLabel = newLabel;
    dockedWebviewSupported = true;

    // Attach native OS accelerator key interception (Flurer Core & Global System)
    try {
      if ((window as any).attachChildWebviewShortcuts) {
        await (window as any).attachChildWebviewShortcuts(newLabel, "web-loader");
      } else {
        await window.TauriCore.invoke("attach_child_webview_shortcuts", {
          label: newLabel,
          pluginId: "web-loader",
        });
      }
    } catch {
      try {
        await window.TauriCore.invoke("attach_docked_webview_shortcuts", { label: newLabel });
      } catch (shortcutErr) {
        console.warn("attach_child_webview_shortcuts not supported or failed:", shortcutErr);
      }
    }

    return { success: true, reused: false };
  } catch (err: any) {
    const errStr = String(err?.message || err);
    console.warn("create_webview error:", errStr);
    if (errStr.includes("UnstableFeatureNotSupported")) {
      dockedWebviewSupported = false;
    }
    return { success: false, error: errStr };
  }
}

export async function updateDockedWebviewBounds(
  rect: { x: number; y: number; width: number; height: number },
  tabId?: string
): Promise<void> {
  if (!window.TauriCore) return;
  const targetLabel = tabId ? tabWebviewRegistry.get(tabId)?.label : currentVisibleLabel;
  if (!targetLabel) return;
  try {
    const x = Math.max(0, Math.round(rect.x));
    const y = Math.max(0, Math.round(rect.y));
    const width = Math.max(100, Math.round(rect.width));
    const height = Math.max(100, Math.round(rect.height));

    await window.TauriCore.invoke("plugin:webview|set_webview_position", {
      label: targetLabel,
      value: { Logical: { x, y } },
    });
    await window.TauriCore.invoke("plugin:webview|set_webview_size", {
      label: targetLabel,
      value: { Logical: { width, height } },
    });
  } catch {}
}

export async function hideTabWebview(tabId: string): Promise<void> {
  if (!window.TauriCore) return;
  const entry = tabWebviewRegistry.get(tabId);
  if (!entry) return;
  try {
    await window.TauriCore.invoke("plugin:webview|set_webview_position", {
      label: entry.label,
      value: { Logical: { x: -10000, y: -10000 } },
    });
    await window.TauriCore.invoke("plugin:webview|set_webview_size", {
      label: entry.label,
      value: { Logical: { width: 0, height: 0 } },
    });
    await window.TauriCore.invoke("plugin:webview|webview_hide", { label: entry.label });
  } catch {}
  if (currentVisibleTabId === tabId) {
    currentVisibleTabId = null;
    currentVisibleLabel = null;
  }
}

export function tabMatchesWorkspace(tab: { projectId?: string }, wsId: string): boolean {
  if (tab.projectId) {
    return tab.projectId === wsId;
  }
  return wsId === "flurer" || wsId === "general";
}

export function restoreMainWebviewFocus(): void {
  if (typeof window === "undefined" || !window.TauriCore) return;
  const winLabel = (window as any).__TAURI_INTERNALS__?.metadata?.currentWindow?.label || "main";
  const webviewLabel = (window as any).__TAURI_INTERNALS__?.metadata?.currentWebview?.label || "main";

  try {
    window.TauriCore.invoke("plugin:window|set_focus", { label: winLabel })?.catch?.(() => {});
  } catch {}
  try {
    window.TauriCore.invoke("plugin:webview|set_webview_focus", { label: webviewLabel })?.catch?.(() => {});
  } catch {}
}

export async function hideAllDockedWebviews(): Promise<void> {
  if (!window.TauriCore) return;
  for (const entry of tabWebviewRegistry.values()) {
    try {
      await window.TauriCore.invoke("plugin:webview|set_webview_position", {
        label: entry.label,
        value: { Logical: { x: -10000, y: -10000 } },
      });
      await window.TauriCore.invoke("plugin:webview|set_webview_size", {
        label: entry.label,
        value: { Logical: { width: 0, height: 0 } },
      });
      await window.TauriCore.invoke("plugin:webview|webview_hide", { label: entry.label });
    } catch {}
  }
  currentVisibleTabId = null;
  currentVisibleLabel = null;
  restoreMainWebviewFocus();
}

export async function closeTabWebview(tabId: string): Promise<void> {
  if (!window.TauriCore) return;
  const entry = tabWebviewRegistry.get(tabId);
  if (!entry) return;
  tabWebviewRegistry.delete(tabId);
  if (currentVisibleTabId === tabId) {
    currentVisibleTabId = null;
    currentVisibleLabel = null;
  }
  try {
    await window.TauriCore.invoke("plugin:webview|set_webview_position", {
      label: entry.label,
      value: { Logical: { x: -10000, y: -10000 } },
    });
    await window.TauriCore.invoke("plugin:webview|set_webview_size", {
      label: entry.label,
      value: { Logical: { width: 0, height: 0 } },
    });
    await window.TauriCore.invoke("plugin:webview|webview_hide", { label: entry.label });
    await window.TauriCore.invoke("plugin:webview|webview_close", { label: entry.label });
  } catch {}
}

export async function closeAllDockedWebviews(): Promise<void> {
  if (!window.TauriCore) return;
  const entries = Array.from(tabWebviewRegistry.values());
  tabWebviewRegistry.clear();
  currentVisibleTabId = null;
  currentVisibleLabel = null;
  for (const entry of entries) {
    try {
      await window.TauriCore.invoke("plugin:webview|webview_close", { label: entry.label });
    } catch {}
  }
}

// Backward-compatibility aliases
export const createDockedWebview = (
  url: string,
  rect: { x: number; y: number; width: number; height: number },
  windowLabel?: string
) => createOrShowDockedWebview("default", url, rect, windowLabel);

export const closeDockedWebview = closeAllDockedWebviews;
export const hideDockedWebview = hideAllDockedWebviews;

export async function showDockedWebview(tabId?: string): Promise<void> {
  if (!window.TauriCore) return;
  const targetLabel = tabId ? tabWebviewRegistry.get(tabId)?.label : currentVisibleLabel;
  if (!targetLabel) return;
  try {
    await window.TauriCore.invoke("plugin:webview|webview_show", { label: targetLabel });
  } catch {}
}

export async function setDockedWebviewZoom(zoom: number, tabId?: string): Promise<void> {
  if (!window.TauriCore) return;
  const targetLabel = tabId ? tabWebviewRegistry.get(tabId)?.label : currentVisibleLabel;
  if (!targetLabel) return;
  try {
    await window.TauriCore.invoke("plugin:webview|set_webview_zoom", {
      label: targetLabel,
      value: zoom,
    });
  } catch {}
}

export async function queryDockedWebviewUrl(tabId?: string): Promise<string | null> {
  if (!window.TauriCore) return null;
  const targetLabel = tabId ? tabWebviewRegistry.get(tabId)?.label : currentVisibleLabel;
  if (!targetLabel) return null;
  try {
    const url = await window.TauriCore.invoke("get_docked_webview_url", { label: targetLabel });
    if (typeof url === "string" && url.length > 0 && url !== "about:blank") {
      return url;
    }
  } catch {}
  return null;
}



const TABS_KEY = "flurer-web-loader-tabs";
const ACTIVE_TAB_KEY = "flurer-web-loader-active-tab";
const BOOKMARKS_KEY = "flurer-web-loader-bookmarks";
const HISTORY_KEY = "flurer-web-loader-history";
const WORKSPACES_KEY = "flurer-web-loader-workspaces";
const ROUTER_CONFIG_KEY = "flurer-web-loader-router-config";

export function getSavedTabs(): SavedTabRecord[] {
  try {
    const raw = localStorage.getItem(TABS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTabs(tabs: SavedTabRecord[]): void {
  try {
    localStorage.setItem(TABS_KEY, JSON.stringify(tabs));
  } catch {}
}

export function getSavedWorkspaces(): ProjectWorkspace[] {
  try {
    const raw = localStorage.getItem(WORKSPACES_KEY);
    if (!raw) return DEFAULT_WORKSPACES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_WORKSPACES;
  } catch {
    return DEFAULT_WORKSPACES;
  }
}

export function saveWorkspaces(workspaces: ProjectWorkspace[]): void {
  try {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  } catch {}
}

export function getSavedRouterConfig(): SmartRouterConfig {
  try {
    const raw = localStorage.getItem(ROUTER_CONFIG_KEY);
    if (!raw) {
      return {
        enabled: true,
        provider: "heuristic",
        apiEndpointUrl: "http://127.0.0.1:11434/v1",
        modelName: "laya-router",
        autoCreateCategories: true,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      enabled: true,
      provider: "heuristic",
      apiEndpointUrl: "http://127.0.0.1:11434/v1",
      modelName: "laya-router",
      autoCreateCategories: true,
    };
  }
}

export function saveRouterConfig(cfg: SmartRouterConfig): void {
  try {
    localStorage.setItem(ROUTER_CONFIG_KEY, JSON.stringify(cfg));
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

