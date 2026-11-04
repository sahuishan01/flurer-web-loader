import { For, Show, createSignal, createEffect, onCleanup, onMount, JSX } from "solid-js";
import { SettingsPanelProps, SearchEngine, ShortcutActionId, NavDesignMode, OrbitLayoutMode } from "../types";

declare const __VERSION__: string;
import {
  themeConfig,
  setThemeConfig,
  saveThemeConfig,
  getEffectiveThemeStyles,
  PRESET_THEMES,
  PresetThemeId,
  ThemeMode,
  hexToRgb,
} from "../theme";
import {
  ShieldIcon,
  TrashIcon,
  LockIcon,
  IncognitoIcon,
  OrbitIcon,
  MatrixIcon,
  SparklesIcon,
  LayersIcon,
  CompactIcon,
  KeyboardIcon,
  SearchIcon,
  GlobeIcon,
  ExternalIcon,
  PaletteIcon,
  CheckIcon,
  SlidersIcon,
} from "../icons";
import {
  SHORTCUT_METADATA,
  DEFAULT_SHORTCUTS,
  getEffectiveShortcuts,
  saveShortcuts,
  normalizeShortcutString,
  eventToShortcutString,
  findShortcutConflict,
} from "../shortcuts";
import {
  DEFAULT_WORKSPACES,
  isLayaOfflineDownloaded,
  downloadAndSetupLayaOffline,
  clearLayaOfflineStorage,
  routeTab,
} from "../smartRouter";
import {
  clearAllBrowsingData,
  clearHistory,
  DEFAULT_DESKTOP_USER_AGENT,
  CHROME_DESKTOP_USER_AGENT,
} from "../utils";
import { SwitchToggle } from "./SwitchToggle";

const QUICK_ACCENTS = [
  { name: "Cyan", hex: "#00f0ff" },
  { name: "Sky", hex: "#38bdf8" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Emerald", hex: "#05ffb0" },
  { name: "Rose", hex: "#ff2a6d" },
  { name: "Violet", hex: "#a855f7" },
  { name: "White", hex: "#ffffff" },
];

const QUICK_PANELS = [
  { name: "Slate", rgb: "15, 23, 42", hex: "#0f172a" },
  { name: "Obsidian", rgb: "8, 13, 26", hex: "#080d1a" },
  { name: "Charcoal", rgb: "26, 29, 36", hex: "#1a1d24" },
  { name: "Indigo", rgb: "26, 27, 38", hex: "#1a1b26" },
  { name: "Arctic", rgb: "46, 52, 64", hex: "#2e3440" },
  { name: "OLED", rgb: "0, 0, 0", hex: "#000000" },
];

type SettingsTab = "appearance" | "workspaces" | "shortcuts" | "browser" | "security" | "all";

function KeycapBadge(props: { keys: string }) {
  const parts = () => props.keys.split("+").map((k) => k.trim());
  return (
    <div style={{ display: "inline-flex", "align-items": "center", gap: "4px" }}>
      <For each={parts()}>
        {(key) => (
          <kbd
            style={{
              display: "inline-block",
              padding: "2px 7px",
              "border-radius": "4px",
              background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.12))",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
              "box-shadow": "0 1px 2px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              "font-family": "var(--font-data, Space Mono, monospace)",
              "font-size": "11px",
              "font-weight": 600,
              color: "var(--text-primary, var(--text-color, currentColor))",
              "line-height": "1.3",
              "min-width": "18px",
              "text-align": "center",
            }}
          >
            {key}
          </kbd>
        )}
      </For>
    </div>
  );
}

export function SettingsPanel(props: SettingsPanelProps) {
  // Navigation / active tab state
  const [activeTab, setActiveTab] = createSignal<SettingsTab>("appearance");
  const [globalSearch, setGlobalSearch] = createSignal("");

  // Live Flurer Theme & Mode Observer
  const [flurerTheme, setFlurerTheme] = createSignal(
    document.documentElement?.dataset?.theme || "dark"
  );
  const [flurerMode, setFlurerMode] = createSignal(
    document.documentElement?.dataset?.mode ||
      (props.dataBgLightness === "light" ? "light" : "dark")
  );

  onMount(() => {
    checkDefaultBrowserStatus();

    const updateThemeState = () => {
      const theme = document.documentElement?.dataset?.theme || "dark";
      const mode =
        document.documentElement?.dataset?.mode ||
        (theme === "light" || theme === "paper" ? "light" : "dark");
      setFlurerTheme(theme);
      setFlurerMode(mode);
    };
    updateThemeState();

    const observer = new MutationObserver(() => {
      updateThemeState();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode", "data-bg-lightness"],
    });

    onCleanup(() => observer.disconnect());
  });

  const isLightMode = () => flurerMode() === "light";
  const accentTextColor = () => (isLightMode() ? "#ffffff" : "#0f172a");

  // Direct plugin settings accessors
  const currentEngine = () => props.pluginSettings.searchEngine ?? "duckduckgo";
  const homeUrl = () => props.pluginSettings.homeUrl ?? "";
  const defaultMode = () => props.pluginSettings.defaultMode ?? "embedded";
  const persistTabs = () => props.pluginSettings.persistTabs ?? true;
  const persistLogin = () => props.pluginSettings.persistLogin ?? true;
  const incognitoMode = () => props.pluginSettings.incognitoMode ?? false;
  const singleWindow = () => props.pluginSettings.singleWindowPerDomain ?? true;
  const customUserAgent = () => props.pluginSettings.customUserAgent ?? DEFAULT_DESKTOP_USER_AGENT;

  const designMode = () => props.pluginSettings.designMode ?? "context-orbit";
  const orbitLayout = () => props.pluginSettings.orbitDeckLayout ?? "matrix";
  const currentWorkspaces = () => props.pluginSettings.workspaces ?? DEFAULT_WORKSPACES;
  const currentSmartRouter = () =>
    props.pluginSettings.smartRouter ?? {
      enabled: true,
      provider: "heuristic",
      apiEndpointUrl: "http://127.0.0.1:1234/v1",
      modelName: "laya",
      autoCreateCategories: true,
    };

  // Laya Offline / Smart Router State
  const [isDownloadingLaya, setIsDownloadingLaya] = createSignal(false);
  const [layaDownloadProgress, setLayaDownloadProgress] = createSignal(0);
  const [layaDownloadStage, setLayaDownloadStage] = createSignal("");
  const [layaOfflineReady, setLayaOfflineReady] = createSignal(isLayaOfflineDownloaded());
  const [testEndpointResult, setTestEndpointResult] = createSignal<string | null>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = createSignal(false);
  const [testEndpointUrl, setTestEndpointUrl] = createSignal("https://news.ycombinator.com");

  // System Default Browser State
  const [isDefaultBrowser, setIsDefaultBrowser] = createSignal<boolean | null>(null);
  const [isRegisteringBrowser, setIsRegisteringBrowser] = createSignal(false);
  const [browserNotice, setBrowserNotice] = createSignal("");

  const checkDefaultBrowserStatus = async () => {
    try {
      if (window.TauriCore?.invoke) {
        const timeoutPromise = new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout checking default browser")), 2000)
        );
        const res = await Promise.race([
          window.TauriCore.invoke<boolean>("check_is_default_browser"),
          timeoutPromise,
        ]);
        setIsDefaultBrowser(res);
      }
    } catch (e) {
      console.warn("Failed to check default browser status:", e);
      setIsDefaultBrowser(false);
    }
  };

  const handleRegisterDefaultBrowser = async () => {
    setIsRegisteringBrowser(true);
    setBrowserNotice("");
    try {
      if (window.TauriCore?.invoke) {
        await window.TauriCore.invoke("register_default_browser");
        setIsDefaultBrowser(true);
        setBrowserNotice("✓ Flurer registered as default browser handler. Windows Default Apps settings opened.");
      }
    } catch (e: any) {
      setBrowserNotice(`Failed: ${e?.message || String(e)}`);
    } finally {
      setIsRegisteringBrowser(false);
    }
  };

  const handleDownloadLaya = async () => {
    setIsDownloadingLaya(true);
    setLayaDownloadProgress(0);
    setLayaDownloadStage("Initializing download...");
    try {
      const ok = await downloadAndSetupLayaOffline((pct, text) => {
        setLayaDownloadProgress(pct);
        setLayaDownloadStage(text);
      });
      if (ok) {
        setLayaOfflineReady(true);
        props.onPluginSettingsChange({
          smartRouter: {
            ...currentSmartRouter(),
            isLayaDownloaded: true,
            provider: "laya-offline",
          },
        });
      }
    } finally {
      setIsDownloadingLaya(false);
    }
  };

  const handleClearLaya = () => {
    clearLayaOfflineStorage();
    setLayaOfflineReady(false);
    props.onPluginSettingsChange({
      smartRouter: {
        ...currentSmartRouter(),
        isLayaDownloaded: false,
      },
    });
  };

  const handleTestEndpoint = async () => {
    setIsTestingEndpoint(true);
    setTestEndpointResult(null);
    try {
      const decision = await routeTab(
        testEndpointUrl(),
        "Sample Page",
        currentSmartRouter(),
        currentWorkspaces()
      );
      setTestEndpointResult(
        `✓ [${decision.engineUsed.toUpperCase()}] Routed to: ${decision.projectId} (${decision.intent}) - ${Math.round(decision.confidence * 100)}% confidence. ${decision.reason || ""}`
      );
    } catch (e: any) {
      setTestEndpointResult(`✗ Error: ${e?.message || "Failed to reach endpoint"}`);
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  // Workspaces State & Handlers
  const [newWsName, setNewWsName] = createSignal("");
  const [newWsColor, setNewWsColor] = createSignal("#38bdf8");
  const [newWsKeywords, setNewWsKeywords] = createSignal("");

  const handleAddWorkspace = () => {
    if (!newWsName().trim()) return;
    const kw = newWsKeywords()
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const newWs = {
      id: `ws-${Date.now()}`,
      name: newWsName().trim(),
      color: newWsColor(),
      icon: "✦",
      keywords: kw,
    };
    const updated = [...currentWorkspaces(), newWs];
    props.onPluginSettingsChange({ workspaces: updated });
    setNewWsName("");
    setNewWsKeywords("");
  };

  const handleRemoveWorkspace = (id: string) => {
    if (id === "general") return;
    const updated = currentWorkspaces().filter((w) => w.id !== id);
    props.onPluginSettingsChange({ workspaces: updated });
  };

  // Shortcuts Studio state & handlers
  const effectiveShortcuts = () => getEffectiveShortcuts(props.pluginSettings.shortcuts);
  const [shortcutFilter, setShortcutFilter] = createSignal("");
  const [selectedCategory, setSelectedCategory] = createSignal<string>("All");
  const [recordingActionId, setRecordingActionId] = createSignal<ShortcutActionId | null>(null);
  const [recordingWarning, setRecordingWarning] = createSignal<string | null>(null);
  const [shortcutSuccessNotice, setShortcutSuccessNotice] = createSignal<string | null>(null);

  const handleUpdateShortcut = (id: ShortcutActionId, newShortcut: string) => {
    const current = props.pluginSettings.shortcuts || {};
    const updated = { ...current, [id]: newShortcut };
    saveShortcuts(updated);
    props.onPluginSettingsChange({ shortcuts: updated });
    setShortcutSuccessNotice(`✓ Updated shortcut for ${SHORTCUT_METADATA.find((m) => m.id === id)?.label || id} to ${newShortcut}`);
    setTimeout(() => setShortcutSuccessNotice(null), 3000);
  };

  const handleResetSingleShortcut = (id: ShortcutActionId) => {
    const current = { ...(props.pluginSettings.shortcuts || {}) };
    delete current[id];
    saveShortcuts(current);
    props.onPluginSettingsChange({ shortcuts: current });
    setShortcutSuccessNotice(`✓ Restored default shortcut for ${SHORTCUT_METADATA.find((m) => m.id === id)?.label || id}`);
    setTimeout(() => setShortcutSuccessNotice(null), 3000);
  };

  const handleResetAllShortcuts = () => {
    saveShortcuts({});
    props.onPluginSettingsChange({ shortcuts: {} });
    setShortcutSuccessNotice("✓ All keyboard shortcuts restored to defaults");
    setTimeout(() => setShortcutSuccessNotice(null), 3500);
  };

  // Keyboard shortcut live recording listener
  createEffect(() => {
    const actionId = recordingActionId();
    if (!actionId) return;

    const handleRecordKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        setRecordingActionId(null);
        setRecordingWarning(null);
        return;
      }

      const combo = eventToShortcutString(e);
      if (!combo) {
        if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
          return;
        }
        setRecordingWarning("Please include Ctrl, Alt, or Cmd, or use a Function key (F1-F12)");
        return;
      }

      handleUpdateShortcut(actionId, combo);
      setRecordingActionId(null);
      setRecordingWarning(null);
    };

    window.addEventListener("keydown", handleRecordKeyDown, true);
    onCleanup(() => {
      window.removeEventListener("keydown", handleRecordKeyDown, true);
    });
  });

  const filteredShortcuts = () => {
    const q = shortcutFilter().trim().toLowerCase();
    const cat = selectedCategory();
    const all = effectiveShortcuts();

    return SHORTCUT_METADATA.filter((meta) => {
      if (cat !== "All" && meta.category !== cat) return false;
      if (!q) return true;
      const currentSc = (all[meta.id] || meta.defaultShortcut).toLowerCase();
      return (
        meta.label.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.category.toLowerCase().includes(q) ||
        currentSc.includes(q)
      );
    });
  };

  // Security & Data Wipe State
  const [securityStatus, setSecurityStatus] = createSignal("");
  const [isWiping, setIsWiping] = createSignal(false);

  // Theme Studio State & Handlers
  const currentThemeMode = () => themeConfig().mode;
  const currentPreset = () => themeConfig().preset;

  const surfaceOpacity = () => themeConfig().surfaceOpacity ?? props.pluginSettings.surfaceOpacity ?? 0.75;
  const surfaceBlur = () => themeConfig().surfaceBlur ?? props.pluginSettings.surfaceBlur ?? 12;

  const updateTheme = (patch: Partial<ReturnType<typeof themeConfig>>) => {
    const updated = { ...themeConfig(), ...patch };
    setThemeConfig(updated);
    saveThemeConfig(updated);
    if (patch.surfaceOpacity !== undefined || patch.surfaceBlur !== undefined) {
      props.onPluginSettingsChange({
        surfaceOpacity: updated.surfaceOpacity,
        surfaceBlur: updated.surfaceBlur,
      });
    }
  };

  const handleSelectMode = (mode: ThemeMode) => {
    updateTheme({ mode });
  };

  const handleSelectPreset = (preset: PresetThemeId) => {
    updateTheme({ mode: "preset", preset });
  };

  const handleCustomAccent = (hex: string) => {
    const custom = {
      ...(themeConfig().customColors || {}),
      accent: hex,
      accentRgb: hexToRgb(hex),
    };
    updateTheme({ mode: "custom", customColors: custom });
  };

  const handleCustomPanel = (rgb: string) => {
    const custom = {
      ...(themeConfig().customColors || {}),
      panelRgb: rgb,
      panelBg: `rgb(${rgb})`,
    };
    updateTheme({ mode: "custom", customColors: custom });
  };

  const handleResetToAuto = () => {
    updateTheme({
      mode: "auto",
      preset: "auto",
      customColors: {},
      surfaceOpacity: undefined,
      surfaceBlur: undefined,
    });
    props.onPluginSettingsChange({
      surfaceOpacity: undefined,
      surfaceBlur: undefined,
    });
  };

  const effectiveTheme = () =>
    getEffectiveThemeStyles(
      themeConfig(),
      props.dataBgLightness,
      surfaceOpacity(),
      surfaceBlur()
    );

  // Search filter matching
  const matchesSearch = (text: string) => {
    const q = globalSearch().trim().toLowerCase();
    if (!q) return true;
    return text.toLowerCase().includes(q);
  };

  const isVisible = (tabId: SettingsTab, keywords: string) => {
    if (globalSearch().trim().length > 0) {
      return matchesSearch(keywords);
    }
    return activeTab() === "all" || activeTab() === tabId;
  };

  const navCategories = [
    { id: "appearance" as const, label: "Appearance", icon: PaletteIcon, desc: "Theme & Palette" },
    { id: "workspaces" as const, label: "Workspaces & AI", icon: OrbitIcon, desc: "Navigation & Router" },
    { id: "shortcuts" as const, label: "Shortcuts", icon: KeyboardIcon, desc: "Hotkeys Studio" },
    { id: "browser" as const, label: "Browser & System", icon: GlobeIcon, desc: "Defaults & Omnibox" },
    { id: "security" as const, label: "Privacy & Security", icon: ShieldIcon, desc: "Sessions & Storage" },
    { id: "all" as const, label: "All Settings", icon: SlidersIcon, desc: "Comprehensive View" },
  ];

  return (
    <div
      style={{
        ...effectiveTheme(),
        display: "flex",
        "flex-direction": "column",
        gap: "24px",
        padding: "20px 24px",
        color: "var(--text-primary, var(--text-color, currentColor))",
        "font-family": "var(--fluent-font, system-ui, -apple-system, sans-serif)",
        "max-width": "940px",
        margin: "0 auto",
        width: "100%",
        "box-sizing": "border-box",
      }}
    >
      {/* ── TOP HEADER & LIVE SEARCH ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          gap: "16px",
          "flex-wrap": "wrap",
          "padding-bottom": "18px",
          "border-bottom": "1px solid var(--border-color, rgba(128, 128, 128, 0.15))",
        }}
      >
        <div style={{ display: "flex", "align-items": "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              "border-radius": "var(--radius-md, 8px)",
              background: "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb, 56, 189, 248), 0.12)))",
              border: "1px solid var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.3))",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              color: "var(--accent-default, var(--accent, #38bdf8))",
              "box-shadow": "0 0 12px var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.15))",
            }}
          >
            <GlobeIcon size={20} />
          </div>
          <div>
            <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
              <h2 style={{ margin: 0, "font-size": "18px", "font-weight": 600, "letter-spacing": "-0.01em" }}>
                Web Loader Settings
              </h2>
              <span
                style={{
                  "font-size": "10.5px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  padding: "2px 7px",
                  "border-radius": "4px",
                  background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.15))",
                  color: "var(--accent-default, var(--accent, #38bdf8))",
                  "font-weight": 600,
                }}
              >
                v{typeof __VERSION__ !== "undefined" ? __VERSION__ : "0.1.64"}
              </span>
            </div>
            <p
              style={{
                margin: "2px 0 0 0",
                "font-size": "12px",
                color: "var(--text-secondary, currentColor)",
                opacity: 0.85,
              }}
            >
              Configure browser chrome appearance, tabs paradigm, keyboard hotkeys, and Windows integration.
            </p>
          </div>
        </div>

        {/* Search All Settings Bar */}
        <div
          style={{
            position: "relative",
            display: "flex",
            "align-items": "center",
            "min-width": "260px",
            flex: "1 1 260px",
            "max-width": "340px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "10px",
              color: "var(--text-secondary, currentColor)",
              opacity: 0.7,
              display: "flex",
              "pointer-events": "none",
            }}
          >
            <SearchIcon size={14} />
          </div>
          <input
            type="text"
            placeholder="Search all settings..."
            value={globalSearch()}
            onInput={(e) => setGlobalSearch(e.currentTarget.value)}
            style={{
              width: "100%",
              padding: "7px 30px 7px 32px",
              background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.08)))",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
              "border-radius": "var(--radius-sm, 6px)",
              color: "var(--text-primary, var(--text-color, currentColor))",
              "font-size": "12px",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-default, var(--accent, #38bdf8))";
              e.currentTarget.style.boxShadow = "0 0 0 2px var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.25))";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color, rgba(128, 128, 128, 0.18))";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <Show when={globalSearch()}>
            <button
              type="button"
              onClick={() => setGlobalSearch("")}
              style={{
                position: "absolute",
                right: "8px",
                background: "transparent",
                border: "none",
                color: "var(--text-secondary, currentColor)",
                cursor: "pointer",
                padding: "2px",
                "font-size": "12px",
              }}
              title="Clear search"
            >
              ✕
            </button>
          </Show>
        </div>
      </div>

      {/* ── CATEGORY PILL NAVIGATION ───────────────────────────────────── */}
      <Show when={!globalSearch()}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            "overflow-x": "auto",
            "scrollbar-width": "none",
            padding: "4px",
            background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
            border: "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
            "border-radius": "10px",
            "user-select": "none",
          }}
        >
          <For each={navCategories}>
            {(cat) => {
              const isSelected = () => activeTab() === cat.id;
              const IconComp = cat.icon;
              return (
                <button
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    display: "inline-flex",
                    "align-items": "center",
                    gap: "8px",
                    padding: "8px 14px",
                    "border-radius": "7px",
                    border: isSelected()
                      ? "1px solid var(--accent-border, transparent)"
                      : "1px solid transparent",
                    background: isSelected()
                      ? "var(--accent-default, var(--accent, #38bdf8))"
                      : "transparent",
                    color: isSelected()
                      ? accentTextColor()
                      : "var(--text-secondary, currentColor)",
                    "font-size": "12.5px",
                    "font-weight": isSelected() ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
                    "white-space": "nowrap",
                    "box-shadow": isSelected() ? "0 2px 8px rgba(0, 0, 0, 0.18)" : "none",
                  }}
                >
                  <IconComp size={15} />
                  <span>{cat.label}</span>
                </button>
              );
            }}
          </For>
        </div>
      </Show>

      {/* Search Result Banner */}
      <Show when={globalSearch()}>
        <div
          style={{
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            padding: "10px 14px",
            background: "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb, 56, 189, 248), 0.08)))",
            border: "1px solid var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.25))",
            "border-radius": "var(--radius-md, 8px)",
            "font-size": "12px",
          }}
        >
          <span style={{ color: "var(--text-primary, var(--text-color, currentColor))" }}>
            Showing search results for: <strong>"{globalSearch()}"</strong>
          </span>
          <button
            type="button"
            onClick={() => setGlobalSearch("")}
            style={{
              background: "transparent",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
              color: "var(--accent-default, var(--accent, #38bdf8))",
              padding: "4px 10px",
              "border-radius": "4px",
              "font-size": "11px",
              cursor: "pointer",
            }}
          >
            Reset to Categories
          </button>
        </div>
      </Show>

      {/* ── 1. APPEARANCE & THEMING STUDIO ────────────────────────────── */}
      <Show when={isVisible("appearance", "theme appearance palette colors preset studio accent translucency blur")}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            background: "var(--card-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.05))",
            border: "1px solid var(--card-border, var(--border-color, rgba(128, 128, 128, 0.12)))",
            "box-shadow": "inset 0 1px 0 0 rgba(var(--panel-rgb, 255, 255, 255), 0.1)",
            padding: "20px 24px",
            "border-radius": "var(--radius-lg, 10px)",
            "backdrop-filter": "blur(var(--surface-blur, 12px))",
            "-webkit-backdrop-filter": "blur(var(--surface-blur, 12px))",
          }}
        >
          <div style={{ display: "flex", "align-items": "flex-start", "justify-content": "space-between", gap: "12px", "flex-wrap": "wrap" }}>
            <div>
              <span
                style={{
                  "font-size": "11px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  "text-transform": "uppercase",
                  "letter-spacing": "0.12em",
                  color: "var(--accent-default, var(--accent, #38bdf8))",
                  display: "block",
                  "margin-bottom": "4px",
                }}
              >
                Theming & Palette Studio
              </span>
              <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600 }}>
                Visual Chrome & Surface Styling
              </h3>
              <p style={{ margin: "2px 0 0 0", "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
                Select automatic Flurer token sync, choose curated templates, or design custom accents.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetToAuto}
              style={{
                background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                padding: "6px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                "font-size": "11.5px",
                "font-family": "var(--font-data, Space Mono, monospace)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Reset to Flurer Auto
            </button>
          </div>

          {/* Mode Segmented Pills */}
          <div
            style={{
              display: "inline-flex",
              gap: "4px",
              padding: "4px",
              background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
              "border-radius": "8px",
              "align-self": "flex-start",
            }}
          >
            <button
              type="button"
              onClick={() => handleSelectMode("auto")}
              style={{
                padding: "6px 14px",
                "border-radius": "6px",
                border: "none",
                background: currentThemeMode() === "auto" ? "var(--accent-default, var(--accent, #38bdf8))" : "transparent",
                color: currentThemeMode() === "auto" ? accentTextColor() : "var(--text-secondary, currentColor)",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "11.5px",
                "font-weight": 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Auto (Flurer System)
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode("preset")}
              style={{
                padding: "6px 14px",
                "border-radius": "6px",
                border: "none",
                background: currentThemeMode() === "preset" ? "var(--accent-default, var(--accent, #38bdf8))" : "transparent",
                color: currentThemeMode() === "preset" ? accentTextColor() : "var(--text-secondary, currentColor)",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "11.5px",
                "font-weight": 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Preset Templates
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode("custom")}
              style={{
                padding: "6px 14px",
                "border-radius": "6px",
                border: "none",
                background: currentThemeMode() === "custom" ? "var(--accent-default, var(--accent, #38bdf8))" : "transparent",
                color: currentThemeMode() === "custom" ? accentTextColor() : "var(--text-secondary, currentColor)",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "11.5px",
                "font-weight": 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Custom Studio
            </button>
          </div>

          {/* Auto Mode: Live Flurer Synchronizer Status */}
          <Show when={currentThemeMode() === "auto"}>
            <div
              style={{
                padding: "16px 18px",
                "border-radius": "var(--radius-md, 8px)",
                background: "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb, 56, 189, 248), 0.06)))",
                border: "1px dashed var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.3))",
                display: "flex",
                "flex-direction": "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "flex-wrap": "wrap", gap: "10px" }}>
                <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                  <div style={{ color: "var(--accent-default, var(--accent, #38bdf8))" }}>
                    <CheckIcon size={16} />
                  </div>
                  <strong style={{ "font-size": "13px", color: "var(--text-primary, var(--text-color, currentColor))" }}>
                    Flurer System Sync Active
                  </strong>
                </div>

                <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                  <span
                    style={{
                      "font-size": "11px",
                      "font-family": "var(--font-data, Space Mono, monospace)",
                      padding: "2px 8px",
                      "border-radius": "4px",
                      background: "var(--control-bg, rgba(var(--panel-rgb), 0.15))",
                      border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                      color: "var(--text-primary, var(--text-color, currentColor))",
                      "font-weight": 600,
                    }}
                  >
                    Theme: {flurerTheme().toUpperCase()} ({flurerMode().toUpperCase()})
                  </span>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      "border-radius": "50%",
                      background: "var(--accent-default, var(--accent, #38bdf8))",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      "box-shadow": "0 0 6px var(--accent-default)",
                    }}
                    title="Active Accent Color"
                  />
                </div>
              </div>

              <p style={{ margin: 0, "font-size": "12px", "line-height": 1.5, color: "var(--text-secondary, currentColor)", opacity: 0.9 }}>
                Web Loader is listening to Flurer's theme engine. Switching Flurer between <strong>Light</strong>, <strong>Dark</strong>, <strong>Midnight</strong>, <strong>Ocean</strong>, <strong>Nord</strong>, and <strong>Paper</strong> instantly shifts all text colors, cards, accent borders, and input controls.
              </p>
            </div>
          </Show>

          {/* Presets Gallery */}
          <Show when={currentThemeMode() === "preset"}>
            <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              <For each={Object.values(PRESET_THEMES)}>
                {(p) => {
                  const isSelected = () => currentPreset() === p.id;
                  return (
                    <div
                      onClick={() => handleSelectPreset(p.id)}
                      style={{
                        display: "flex",
                        "flex-direction": "column",
                        gap: "8px",
                        padding: "14px 16px",
                        "border-radius": "var(--radius-md, 8px)",
                        background: p.colors.panelBg,
                        border: isSelected()
                          ? `2px solid ${p.colors.accent}`
                          : "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                        cursor: "pointer",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        "box-shadow": isSelected() ? `0 0 16px ${p.colors.accent}40` : "none",
                        transform: isSelected() ? "translateY(-1px)" : "none",
                      }}
                    >
                      <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                        <span style={{ "font-size": "13px", "font-weight": 600, color: p.colors.textPrimary }}>
                          {p.name}
                        </span>
                        {isSelected() && (
                          <span style={{ "font-size": "10px", "font-family": "var(--font-data, Space Mono, monospace)", color: p.colors.accent, "font-weight": 700 }}>
                            ● ACTIVE
                          </span>
                        )}
                      </div>
                      <span style={{ "font-size": "11.5px", color: p.colors.textSecondary }}>
                        {p.description}
                      </span>
                      <div style={{ display: "flex", gap: "6px", "margin-top": "6px" }}>
                        <div style={{ width: "18px", height: "18px", "border-radius": "4px", background: p.colors.accent }} title="Accent" />
                        <div style={{ width: "18px", height: "18px", "border-radius": "4px", background: `rgb(${p.colors.panelRgb})` }} title="Panel" />
                        <div style={{ width: "18px", height: "18px", "border-radius": "4px", background: p.colors.textPrimary }} title="Text" />
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>

          {/* Custom Studio */}
          <Show when={currentThemeMode() === "custom"}>
            <div style={{ display: "flex", "flex-direction": "column", gap: "18px" }}>
              {/* Accent Color */}
              <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
                <label style={{ "font-size": "13px", "font-weight": 500 }}>
                  Custom Accent Color
                </label>
                <div style={{ display: "flex", "align-items": "center", gap: "10px", "flex-wrap": "wrap" }}>
                  <input
                    type="color"
                    value={themeConfig().customColors?.accent || "#00f0ff"}
                    onInput={(e) => handleCustomAccent(e.currentTarget.value)}
                    style={{ width: "36px", height: "36px", border: "none", "border-radius": "6px", cursor: "pointer", background: "transparent" }}
                  />
                  <input
                    type="text"
                    value={themeConfig().customColors?.accent || "#00f0ff"}
                    onInput={(e) => handleCustomAccent(e.currentTarget.value)}
                    style={{
                      padding: "6px 12px",
                      "border-radius": "6px",
                      background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.15)))",
                      border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                      color: "var(--text-primary, var(--text-color, currentColor))",
                      "font-family": "var(--font-data, Space Mono, monospace)",
                      "font-size": "12px",
                      width: "90px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px", "align-items": "center" }}>
                    <For each={QUICK_ACCENTS}>
                      {(c) => (
                        <div
                          onClick={() => handleCustomAccent(c.hex)}
                          style={{
                            width: "22px",
                            height: "22px",
                            "border-radius": "4px",
                            background: c.hex,
                            cursor: "pointer",
                            border: themeConfig().customColors?.accent === c.hex ? "2px solid #ffffff" : "1px solid rgba(128,128,128,0.3)",
                            transition: "transform 0.15s ease",
                          }}
                          title={c.name}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </div>

              {/* Background Tint */}
              <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
                <label style={{ "font-size": "13px", "font-weight": 500 }}>
                  Panel Background Tint
                </label>
                <div style={{ display: "flex", "align-items": "center", gap: "10px", "flex-wrap": "wrap" }}>
                  <input
                    type="text"
                    value={themeConfig().customColors?.panelRgb || "15, 23, 42"}
                    onInput={(e) => handleCustomPanel(e.currentTarget.value)}
                    placeholder="r, g, b"
                    style={{
                      padding: "6px 12px",
                      "border-radius": "6px",
                      background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.15)))",
                      border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                      color: "var(--text-primary, var(--text-color, currentColor))",
                      "font-family": "var(--font-data, Space Mono, monospace)",
                      "font-size": "12px",
                      width: "120px",
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px", "align-items": "center" }}>
                    <For each={QUICK_PANELS}>
                      {(p) => (
                        <div
                          onClick={() => handleCustomPanel(p.rgb)}
                          style={{
                            width: "22px",
                            height: "22px",
                            "border-radius": "4px",
                            background: p.hex,
                            cursor: "pointer",
                            border: themeConfig().customColors?.panelRgb === p.rgb ? "2px solid var(--accent-default, #38bdf8)" : "1px solid rgba(128,128,128,0.3)",
                            transition: "transform 0.15s ease",
                          }}
                          title={p.name}
                        />
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </div>
          </Show>

          {/* Translucency & Blur Sliders */}
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              padding: "16px",
              background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.08))",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
              "border-radius": "var(--radius-md, 8px)",
            }}
          >
            <div>
              <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", "margin-bottom": "6px" }}>
                <span style={{ "font-weight": 500 }}>Surface Opacity</span>
                <span style={{ "font-family": "var(--font-data, Space Mono, monospace)", color: "var(--accent-default, var(--accent, #38bdf8))" }}>
                  {Math.round(surfaceOpacity() * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={surfaceOpacity()}
                onInput={(e) => updateTheme({ surfaceOpacity: parseFloat(e.currentTarget.value) })}
                style={{ width: "100%", "accent-color": "var(--accent-default, var(--accent, #38bdf8))", cursor: "pointer" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", "margin-bottom": "6px" }}>
                <span style={{ "font-weight": 500 }}>Backdrop Blur</span>
                <span style={{ "font-family": "var(--font-data, Space Mono, monospace)", color: "var(--accent-default, var(--accent, #38bdf8))" }}>
                  {surfaceBlur()}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={surfaceBlur()}
                onInput={(e) => updateTheme({ surfaceBlur: parseInt(e.currentTarget.value) })}
                style={{ width: "100%", "accent-color": "var(--accent-default, var(--accent, #38bdf8))", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </Show>

      {/* ── 2. WORKSPACES & SMART ROUTER ───────────────────────────────── */}
      <Show when={isVisible("workspaces", "workspaces tabs paradigm orbit smart router laya ai model spatial matrix")}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            background: "var(--card-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.05))",
            border: "1px solid var(--card-border, var(--border-color, rgba(128, 128, 128, 0.12)))",
            "box-shadow": "inset 0 1px 0 0 rgba(var(--panel-rgb, 255, 255, 255), 0.1)",
            padding: "20px 24px",
            "border-radius": "var(--radius-lg, 10px)",
            "backdrop-filter": "blur(var(--surface-blur, 12px))",
            "-webkit-backdrop-filter": "blur(var(--surface-blur, 12px))",
          }}
        >
          <div>
            <span
              style={{
                "font-size": "11px",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "text-transform": "uppercase",
                "letter-spacing": "0.12em",
                color: "var(--accent-default, var(--accent, #38bdf8))",
                display: "block",
                "margin-bottom": "4px",
              }}
            >
              Tab Architecture & Workspaces
            </span>
            <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600 }}>
              Navigation Paradigm & Smart Router (The Third Design)
            </h3>
            <p style={{ margin: "2px 0 0 0", "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
              Context Capsule HUD and extensible Workspace Orbit Deck with on-device routing.
            </p>
          </div>

          {/* Paradigm Selection Cards */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Active Navigation Paradigm
            </label>
            <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <div
                style={{
                  padding: "16px",
                  "border-radius": "var(--radius-md, 8px)",
                  background: designMode() === "context-orbit"
                    ? "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb), 0.1)))"
                    : "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.04))",
                  border: designMode() === "context-orbit"
                    ? "1px solid var(--accent-default, var(--accent, #38bdf8))"
                    : "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "box-shadow": designMode() === "context-orbit" ? "0 0 12px var(--accent-border, rgba(var(--accent-rgb), 0.2))" : "none",
                }}
                onClick={() => props.onPluginSettingsChange({ designMode: "context-orbit" })}
              >
                <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
                  <OrbitIcon size={18} />
                  <span style={{ "font-weight": 600, "font-size": "13px", color: designMode() === "context-orbit" ? "var(--accent-default, var(--accent, #38bdf8))" : "var(--text-primary, var(--text-color, currentColor))" }}>
                    Context Orbit & Flow Deck (Third-Gen)
                  </span>
                </div>
                <p style={{ margin: 0, "font-size": "11.5px", color: "var(--text-secondary, currentColor)", opacity: 0.85, "line-height": 1.45 }}>
                  HUD Context Capsule with Project Pills, Lineage Breadcrumbs, and instant Workspace Orbit Deck (Matrix & Spatial Canvas).
                </p>
              </div>

              <div
                style={{
                  padding: "16px",
                  "border-radius": "var(--radius-md, 8px)",
                  background: designMode() === "standard-tabs"
                    ? "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb), 0.1)))"
                    : "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.04))",
                  border: designMode() === "standard-tabs"
                    ? "1px solid var(--accent-default, var(--accent, #38bdf8))"
                    : "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "box-shadow": designMode() === "standard-tabs" ? "0 0 12px var(--accent-border, rgba(var(--accent-rgb), 0.2))" : "none",
                }}
                onClick={() => props.onPluginSettingsChange({ designMode: "standard-tabs" })}
              >
                <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
                  <LayersIcon size={18} />
                  <span style={{ "font-weight": 600, "font-size": "13px", color: designMode() === "standard-tabs" ? "var(--accent-default, var(--accent, #38bdf8))" : "var(--text-primary, var(--text-color, currentColor))" }}>
                    Classic Horizontal Tab Strip
                  </span>
                </div>
                <p style={{ margin: 0, "font-size": "11.5px", color: "var(--text-secondary, currentColor)", opacity: 0.85, "line-height": 1.45 }}>
                  Traditional browser tabs strip docked at the top with tab titles, favicons, and close buttons.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Tab View Setting */}
          <SwitchToggle
            checked={props.pluginSettings?.compactTabs ?? false}
            onChange={(checked) => props.onPluginSettingsChange({ compactTabs: checked })}
            label="Compact Tab View (Favicons Only)"
            description="Display only website favicons on the tab bar instead of full title and addresses for maximum horizontal space."
            icon={<CompactIcon size={18} />}
          />

          {/* Default Orbit Deck Layout */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Default Orbit Deck Layout Mode
            </label>
            <div style={{ display: "inline-flex", gap: "8px", "flex-wrap": "wrap" }}>
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "6px",
                  padding: "8px 14px",
                  "border-radius": "var(--radius-sm, 6px)",
                  background: orbitLayout() === "matrix" ? "var(--accent-bg-soft, var(--accent-soft))" : "var(--control-bg, rgba(var(--panel-rgb), 0.06))",
                  border: orbitLayout() === "matrix" ? "1px solid var(--accent-default, var(--accent, #38bdf8))" : "1px solid var(--border-color, rgba(128, 128, 128, 0.15))",
                  color: orbitLayout() === "matrix" ? "var(--accent-default, var(--accent, #38bdf8))" : "var(--text-secondary, currentColor)",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  cursor: "pointer",
                }}
                onClick={() => props.onPluginSettingsChange({ orbitDeckLayout: "matrix" })}
              >
                <MatrixIcon size={14} />
                <span>Structured Cluster Matrix</span>
              </button>

              <button
                type="button"
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "6px",
                  padding: "8px 14px",
                  "border-radius": "var(--radius-sm, 6px)",
                  background: orbitLayout() === "spatial" ? "var(--accent-bg-soft, var(--accent-soft))" : "var(--control-bg, rgba(var(--panel-rgb), 0.06))",
                  border: orbitLayout() === "spatial" ? "1px solid var(--accent-default, var(--accent, #38bdf8))" : "1px solid var(--border-color, rgba(128, 128, 128, 0.15))",
                  color: orbitLayout() === "spatial" ? "var(--accent-default, var(--accent, #38bdf8))" : "var(--text-secondary, currentColor)",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  cursor: "pointer",
                }}
                onClick={() => props.onPluginSettingsChange({ orbitDeckLayout: "spatial" })}
              >
                <OrbitIcon size={14} />
                <span>Spatial 2D Orbit Canvas</span>
              </button>
            </div>
          </div>

          {/* Smart Router & Laya Local Model Configuration */}
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "14px",
              padding: "16px",
              background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.06))",
              border: "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
              "border-radius": "var(--radius-md, 8px)",
            }}
          >
            <SwitchToggle
              checked={currentSmartRouter().enabled}
              onChange={(checked) =>
                props.onPluginSettingsChange({
                  smartRouter: {
                    ...currentSmartRouter(),
                    enabled: checked,
                  },
                })
              }
              label="Smart Routing Engine ('Laya')"
              description="Automatically analyze navigated URLs and route tabs to their corresponding workspace."
              icon={<SparklesIcon size={18} />}
            />

            <Show when={currentSmartRouter().enabled}>
              <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
                <div>
                  <label style={{ "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85, display: "block", "margin-bottom": "6px" }}>
                    Select Smart Router Engine
                  </label>
                  <select
                    value={currentSmartRouter().provider}
                    onChange={(e) =>
                      props.onPluginSettingsChange({
                        smartRouter: {
                          ...currentSmartRouter(),
                          provider: e.currentTarget.value as any,
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.12)))",
                      border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                      color: "var(--text-primary, var(--text-color, currentColor))",
                      "border-radius": "var(--radius-sm, 6px)",
                      "font-size": "12px",
                      outline: "none",
                    }}
                  >
                    <option value="heuristic">Option 1: Built-in Zero-Latency Heuristic (Instant, 0ms, 100% Offline)</option>
                    <option value="openai-compatible">Option 2: Connect with OpenAPI/OpenAI-compatible Endpoint (Online or Offline)</option>
                    <option value="laya-offline">Option 3: Download & Setup Laya Completely Offline (On-Device, Zero Setup)</option>
                  </select>
                </div>

                {/* Option 1: Heuristic */}
                <Show when={currentSmartRouter().provider === "heuristic"}>
                  <div
                    style={{
                      padding: "12px 14px",
                      "border-radius": "var(--radius-sm, 6px)",
                      background: "rgba(5, 255, 176, 0.08)",
                      border: "1px solid rgba(5, 255, 176, 0.25)",
                      "font-size": "12px",
                      "line-height": 1.5,
                      color: "var(--text-secondary, currentColor)",
                    }}
                  >
                    <div style={{ display: "flex", "align-items": "center", gap: "6px", "margin-bottom": "4px", color: "#05ffb0", "font-weight": 600 }}>
                      <CheckIcon size={14} />
                      <span>Built-in Fast Heuristic Router Active</span>
                    </div>
                    Deterministic pattern, domain, and keyword classification. Zero network traffic, zero external servers, and instantaneous 0ms response time.
                  </div>
                </Show>

                {/* Option 2: OpenAPI */}
                <Show when={currentSmartRouter().provider === "openai-compatible"}>
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "column",
                      gap: "12px",
                      padding: "14px",
                      "border-radius": "var(--radius-sm, 6px)",
                      background: "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb), 0.08)))",
                      border: "1px solid var(--accent-border, rgba(var(--accent-rgb), 0.25))",
                    }}
                  >
                    <div style={{ "font-size": "12.5px", color: "var(--accent-default, var(--accent, #38bdf8))", "font-weight": 600 }}>
                      OpenAPI / OpenAI-Compatible Endpoint Configuration
                    </div>
                    <div style={{ "font-size": "11.5px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
                      Connect to local offline backends (LM Studio, vLLM, LocalAI, Ollama /v1) or online APIs (OpenRouter, OpenAI, Groq).
                    </div>

                    <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                      <div>
                        <label style={{ "font-size": "11px", color: "var(--text-secondary, currentColor)", opacity: 0.85, display: "block", "margin-bottom": "4px" }}>
                          API Base / Chat URL
                        </label>
                        <input
                          type="text"
                          value={currentSmartRouter().apiEndpointUrl || "http://127.0.0.1:1234/v1"}
                          onInput={(e) =>
                            props.onPluginSettingsChange({
                              smartRouter: {
                                ...currentSmartRouter(),
                                apiEndpointUrl: e.currentTarget.value,
                              },
                            })
                          }
                          placeholder="http://127.0.0.1:1234/v1"
                          style={{
                            width: "100%",
                            padding: "7px 10px",
                            background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.12)))",
                            border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                            color: "var(--text-primary, var(--text-color, currentColor))",
                            "border-radius": "var(--radius-sm, 6px)",
                            "font-size": "12px",
                            "font-family": "var(--font-data, Space Mono, monospace)",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ "font-size": "11px", color: "var(--text-secondary, currentColor)", opacity: 0.85, display: "block", "margin-bottom": "4px" }}>
                          API Key (Optional / Bearer Token)
                        </label>
                        <input
                          type="password"
                          value={currentSmartRouter().apiKey || ""}
                          onInput={(e) =>
                            props.onPluginSettingsChange({
                              smartRouter: {
                                ...currentSmartRouter(),
                                apiKey: e.currentTarget.value,
                              },
                            })
                          }
                          placeholder="Leave blank for local offline endpoints"
                          style={{
                            width: "100%",
                            padding: "7px 10px",
                            background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.12)))",
                            border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                            color: "var(--text-primary, var(--text-color, currentColor))",
                            "border-radius": "var(--radius-sm, 6px)",
                            "font-size": "12px",
                            "font-family": "var(--font-data, Space Mono, monospace)",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ "font-size": "11px", color: "var(--text-secondary, currentColor)", opacity: 0.85, display: "block", "margin-bottom": "4px" }}>
                          Model Name / Identifier
                        </label>
                        <input
                          type="text"
                          value={currentSmartRouter().modelName || "laya"}
                          onInput={(e) =>
                            props.onPluginSettingsChange({
                              smartRouter: {
                                ...currentSmartRouter(),
                                modelName: e.currentTarget.value,
                              },
                            })
                          }
                          placeholder="e.g. laya, qwen2.5, gpt-4o-mini"
                          style={{
                            width: "100%",
                            padding: "7px 10px",
                            background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.12)))",
                            border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                            color: "var(--text-primary, var(--text-color, currentColor))",
                            "border-radius": "var(--radius-sm, 6px)",
                            "font-size": "12px",
                            "font-family": "var(--font-data, Space Mono, monospace)",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    {/* Connection Test Bar */}
                    <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-top": "4px", "flex-wrap": "wrap" }}>
                      <input
                        type="text"
                        value={testEndpointUrl()}
                        onInput={(e) => setTestEndpointUrl(e.currentTarget.value)}
                        placeholder="Test URL (e.g. https://news.ycombinator.com)"
                        style={{
                          flex: "1 1 240px",
                          padding: "6px 10px",
                          background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.12)))",
                          border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                          color: "var(--text-primary, var(--text-color, currentColor))",
                          "border-radius": "var(--radius-sm, 6px)",
                          "font-size": "12px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleTestEndpoint}
                        disabled={isTestingEndpoint()}
                        style={{
                          padding: "6px 14px",
                          background: "var(--accent-bg-soft, var(--accent-soft))",
                          border: "1px solid var(--accent-border)",
                          color: "var(--accent-default, var(--accent, #38bdf8))",
                          "border-radius": "var(--radius-sm, 6px)",
                          "font-size": "11.5px",
                          "font-family": "var(--font-data, Space Mono, monospace)",
                          cursor: "pointer",
                          "font-weight": 600,
                        }}
                      >
                        {isTestingEndpoint() ? "Testing Connection..." : "Test Endpoint"}
                      </button>
                    </div>

                    <Show when={testEndpointResult()}>
                      <div
                        style={{
                          padding: "8px 12px",
                          "border-radius": "var(--radius-sm, 6px)",
                          background: "var(--control-bg, rgba(var(--panel-rgb), 0.2))",
                          border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                          "font-size": "11.5px",
                          "font-family": "var(--font-data, Space Mono, monospace)",
                          color: testEndpointResult()?.startsWith("✓") ? "#05ffb0" : "#ef4444",
                        }}
                      >
                        {testEndpointResult()}
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* Option 3: Laya Offline */}
                <Show when={currentSmartRouter().provider === "laya-offline"}>
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "column",
                      gap: "12px",
                      padding: "14px",
                      "border-radius": "var(--radius-sm, 6px)",
                      background: "rgba(168, 85, 247, 0.08)",
                      border: "1px solid rgba(168, 85, 247, 0.25)",
                    }}
                  >
                    <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                      <div style={{ "font-size": "12.5px", color: "#a855f7", "font-weight": 600 }}>
                        Download & Setup Laya Completely Offline
                      </div>
                      <Show
                        when={layaOfflineReady()}
                        fallback={
                          <span
                            style={{
                              padding: "2px 8px",
                              "border-radius": "12px",
                              background: "rgba(245, 158, 11, 0.15)",
                              color: "#f59e0b",
                              "font-size": "10.5px",
                              "font-family": "var(--font-data, Space Mono, monospace)",
                            }}
                          >
                            ○ Not Downloaded
                          </span>
                        }
                      >
                        <span
                          style={{
                            padding: "2px 8px",
                            "border-radius": "12px",
                            background: "rgba(5, 255, 176, 0.15)",
                            color: "#05ffb0",
                            "font-size": "10.5px",
                            "font-family": "var(--font-data, Space Mono, monospace)",
                          }}
                        >
                          ● Offline Engine Cached
                        </span>
                      </Show>
                    </div>

                    <p style={{ margin: 0, "font-size": "11.5px", color: "var(--text-secondary, currentColor)", opacity: 0.85, "line-height": 1.5 }}>
                      Laya Offline downloads lightweight quantized semantic vector tables (4.8 MB) directly into client storage. It runs 100% on-device inside Flurer without requiring any local daemon or active internet connection.
                    </p>

                    <Show when={isDownloadingLaya()}>
                      <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
                        <div style={{ display: "flex", "justify-content": "space-between", "font-size": "11px", "font-family": "var(--font-data, Space Mono, monospace)" }}>
                          <span style={{ color: "#a855f7" }}>{layaDownloadStage()}</span>
                          <span style={{ color: "var(--text-primary, currentColor)" }}>{layaDownloadProgress()}%</span>
                        </div>
                        <div style={{ height: "6px", width: "100%", background: "var(--border-color, rgba(128, 128, 128, 0.2))", "border-radius": "3px", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${layaDownloadProgress()}%`,
                              background: "linear-gradient(90deg, #a855f7, var(--accent-default, #38bdf8))",
                              transition: "width 0.2s ease-out",
                            }}
                          />
                        </div>
                      </div>
                    </Show>

                    <div style={{ display: "flex", "align-items": "center", gap: "10px", "flex-wrap": "wrap" }}>
                      <Show
                        when={layaOfflineReady()}
                        fallback={
                          <button
                            type="button"
                            onClick={handleDownloadLaya}
                            disabled={isDownloadingLaya()}
                            style={{
                              padding: "8px 16px",
                              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), var(--accent-bg-soft, rgba(56, 189, 248, 0.3)))",
                              border: "1px solid rgba(168, 85, 247, 0.6)",
                              color: "var(--text-primary, currentColor)",
                              "border-radius": "var(--radius-sm, 6px)",
                              "font-size": "12px",
                              "font-weight": 600,
                              cursor: "pointer",
                            }}
                          >
                            {isDownloadingLaya() ? "Downloading & Setting Up..." : "Download & Setup Laya Offline (4.8 MB)"}
                          </button>
                        }
                      >
                        <button
                          type="button"
                          onClick={handleDownloadLaya}
                          disabled={isDownloadingLaya()}
                          style={{
                            padding: "6px 12px",
                            background: "var(--control-bg, rgba(var(--panel-rgb), 0.1))",
                            border: "1px solid var(--border-color, rgba(128, 128, 128, 0.25))",
                            color: "var(--text-primary, currentColor)",
                            "border-radius": "var(--radius-sm, 6px)",
                            "font-size": "11.5px",
                            cursor: "pointer",
                          }}
                        >
                          Re-download / Verify Offline Weights
                        </button>
                        <button
                          type="button"
                          onClick={handleClearLaya}
                          style={{
                            padding: "6px 12px",
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            "border-radius": "var(--radius-sm, 6px)",
                            "font-size": "11.5px",
                            cursor: "pointer",
                          }}
                        >
                          Clear Offline Storage
                        </button>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>
          </div>

          {/* Project Workspaces Manager */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "10px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Configured Project Workspaces ({currentWorkspaces().length})
            </label>

            <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px" }}>
              <For each={currentWorkspaces()}>
                {(ws) => (
                  <div
                    style={{
                      display: "inline-flex",
                      "align-items": "center",
                      gap: "6px",
                      padding: "5px 10px",
                      "border-radius": "var(--radius-sm, 6px)",
                      background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.08))",
                      border: `1px solid ${ws.color}55`,
                      color: "var(--text-primary, var(--text-color, currentColor))",
                      "font-size": "12px",
                    }}
                  >
                    <span style={{ color: ws.color }}>{ws.icon || "✦"}</span>
                    <span style={{ "font-weight": 600 }}>{ws.name}</span>
                    {ws.id !== "general" && (
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-secondary, currentColor)",
                          cursor: "pointer",
                          padding: "0 2px",
                          "font-size": "11px",
                        }}
                        onClick={() => handleRemoveWorkspace(ws.id)}
                        title={`Delete ${ws.name} workspace`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </For>
            </div>

            {/* Inline Add Workspace */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                "align-items": "center",
                "flex-wrap": "wrap",
                "margin-top": "4px",
              }}
            >
              <input
                type="text"
                placeholder="New workspace name..."
                value={newWsName()}
                onInput={(e) => setNewWsName(e.currentTarget.value)}
                style={{
                  padding: "7px 12px",
                  background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                  color: "var(--text-primary, var(--text-color, currentColor))",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  outline: "none",
                  flex: "1 1 140px",
                }}
              />
              <input
                type="text"
                placeholder="Keywords (comma separated)..."
                value={newWsKeywords()}
                onInput={(e) => setNewWsKeywords(e.currentTarget.value)}
                style={{
                  padding: "7px 12px",
                  background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                  color: "var(--text-primary, var(--text-color, currentColor))",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  outline: "none",
                  flex: "2 1 200px",
                }}
              />
              <button
                type="button"
                style={{
                  padding: "7px 16px",
                  background: "var(--accent-bg-soft, var(--accent-soft))",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent-default, var(--accent, #38bdf8))",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  cursor: "pointer",
                  "font-weight": 600,
                }}
                onClick={handleAddWorkspace}
              >
                + Add Workspace
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* ── 3. KEYBOARD SHORTCUTS STUDIO ───────────────────────────────── */}
      <Show when={isVisible("shortcuts", "shortcuts hotkeys keybindings keyboard controls studio")}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "18px",
            background: "var(--card-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.05))",
            border: "1px solid var(--card-border, var(--border-color, rgba(128, 128, 128, 0.12)))",
            "box-shadow": "inset 0 1px 0 0 rgba(var(--panel-rgb, 255, 255, 255), 0.1)",
            padding: "20px 24px",
            "border-radius": "var(--radius-lg, 10px)",
            "backdrop-filter": "blur(var(--surface-blur, 12px))",
            "-webkit-backdrop-filter": "blur(var(--surface-blur, 12px))",
          }}
        >
          <div style={{ display: "flex", "align-items": "flex-start", "justify-content": "space-between", gap: "12px", "flex-wrap": "wrap" }}>
            <div>
              <span
                style={{
                  "font-size": "11px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  "text-transform": "uppercase",
                  "letter-spacing": "0.12em",
                  color: "var(--accent-default, var(--accent, #38bdf8))",
                  display: "block",
                  "margin-bottom": "4px",
                }}
              >
                Keyboard Shortcuts Studio
              </span>
              <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600 }}>
                Interactive Hotkey Customization Map
              </h3>
              <p style={{ margin: "2px 0 0 0", "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
                Click any key combination to record custom hotkeys with live conflict detection.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetAllShortcuts}
              style={{
                background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                padding: "6px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                "font-size": "11.5px",
                "font-family": "var(--font-data, Space Mono, monospace)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Reset All to Defaults
            </button>
          </div>

          {/* Feedback alerts */}
          <Show when={shortcutSuccessNotice()}>
            <div
              style={{
                padding: "10px 14px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "rgba(5, 255, 176, 0.1)",
                border: "1px solid rgba(5, 255, 176, 0.3)",
                color: "#05ffb0",
                "font-size": "12px",
                "font-family": "var(--font-data, Space Mono, monospace)",
              }}
            >
              {shortcutSuccessNotice()}
            </div>
          </Show>

          <Show when={recordingWarning()}>
            <div
              style={{
                padding: "10px 14px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#f59e0b",
                "font-size": "12px",
                "font-family": "var(--font-data, Space Mono, monospace)",
              }}
            >
              ⚠️ {recordingWarning()}
            </div>
          </Show>

          {/* Toolbar: Category tabs + Search Filter */}
          <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", gap: "12px", "flex-wrap": "wrap" }}>
            <div
              style={{
                display: "flex",
                gap: "4px",
                padding: "3px",
                background: "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.1))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
                "border-radius": "var(--radius-sm, 6px)",
              }}
            >
              <For each={["All", "Navigation", "Tabs", "Workspaces", "Tools"]}>
                {(cat) => (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "4px 10px",
                      "border-radius": "4px",
                      border: "none",
                      background: selectedCategory() === cat ? "var(--accent-default, var(--accent, #38bdf8))" : "transparent",
                      color: selectedCategory() === cat ? accentTextColor() : "var(--text-secondary, currentColor)",
                      "font-size": "11px",
                      "font-weight": selectedCategory() === cat ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat}
                  </button>
                )}
              </For>
            </div>

            <div style={{ position: "relative", "min-width": "200px" }}>
              <input
                type="text"
                placeholder="Filter shortcuts..."
                value={shortcutFilter()}
                onInput={(e) => setShortcutFilter(e.currentTarget.value)}
                style={{
                  width: "100%",
                  padding: "5px 10px",
                  background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                  "border-radius": "var(--radius-sm, 6px)",
                  color: "var(--text-primary, var(--text-color, currentColor))",
                  "font-size": "11.5px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Shortcuts Grid */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
            <For each={filteredShortcuts()}>
              {(meta) => {
                const currentSc = () => effectiveShortcuts()[meta.id] || meta.defaultShortcut;
                const isCustomized = () => Boolean(props.pluginSettings.shortcuts?.[meta.id]);
                const isRecording = () => recordingActionId() === meta.id;
                const conflict = () => findShortcutConflict(meta.id, currentSc(), effectiveShortcuts());

                return (
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      padding: "10px 14px",
                      background: isRecording()
                        ? "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb), 0.12)))"
                        : "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.04))",
                      border: isRecording()
                        ? "1px solid var(--accent-default, var(--accent, #38bdf8))"
                        : "1px solid var(--border-color, rgba(128, 128, 128, 0.1))",
                      "border-radius": "var(--radius-sm, 6px)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", "flex-direction": "column", gap: "2px", flex: 1 }}>
                      <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                        <span style={{ "font-size": "13px", "font-weight": 600 }}>
                          {meta.label}
                        </span>
                        <span
                          style={{
                            "font-size": "9.5px",
                            "font-family": "var(--font-data, Space Mono, monospace)",
                            padding: "1px 6px",
                            "border-radius": "3px",
                            background: "var(--control-bg, rgba(var(--panel-rgb), 0.1))",
                            color: "var(--text-secondary, currentColor)",
                            opacity: 0.85,
                          }}
                        >
                          {meta.category.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ "font-size": "11.5px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
                        {meta.description}
                      </span>
                    </div>

                    <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                      <Show when={conflict()}>
                        <span style={{ "font-size": "11px", color: "#f59e0b", "font-family": "var(--font-data, Space Mono, monospace)" }}>
                          ⚠️ Conflicts with {conflict()?.label}
                        </span>
                      </Show>

                      <Show
                        when={!isRecording()}
                        fallback={
                          <div
                            style={{
                              padding: "4px 10px",
                              "border-radius": "4px",
                              background: "var(--accent-bg-soft, var(--accent-soft))",
                              border: "1px dashed var(--accent-default, var(--accent, #38bdf8))",
                              color: "var(--accent-default, var(--accent, #38bdf8))",
                              "font-size": "11px",
                              "font-family": "var(--font-data, Space Mono, monospace)",
                              "font-weight": 600,
                            }}
                          >
                            Press keys... (Esc to cancel)
                          </div>
                        }
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setRecordingActionId(meta.id);
                            setRecordingWarning(null);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "2px 4px",
                            cursor: "pointer",
                          }}
                          title="Click to rebind shortcut"
                        >
                          <KeycapBadge keys={currentSc()} />
                        </button>
                      </Show>

                      <Show when={isCustomized()}>
                        <button
                          type="button"
                          onClick={() => handleResetSingleShortcut(meta.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-secondary, currentColor)",
                            cursor: "pointer",
                            padding: "4px",
                            "font-size": "12px",
                          }}
                          title="Reset to default"
                        >
                          ↺
                        </button>
                      </Show>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>

      {/* ── 4. BROWSER & SYSTEM DEFAULTS ──────────────────────────────── */}
      <Show when={isVisible("browser", "browser default system omnibox search engine home url launch mode child webview")}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            background: "var(--card-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.05))",
            border: "1px solid var(--card-border, var(--border-color, rgba(128, 128, 128, 0.12)))",
            "box-shadow": "inset 0 1px 0 0 rgba(var(--panel-rgb, 255, 255, 255), 0.1)",
            padding: "20px 24px",
            "border-radius": "var(--radius-lg, 10px)",
            "backdrop-filter": "blur(var(--surface-blur, 12px))",
            "-webkit-backdrop-filter": "blur(var(--surface-blur, 12px))",
          }}
        >
          <div>
            <span
              style={{
                "font-size": "11px",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "text-transform": "uppercase",
                "letter-spacing": "0.12em",
                color: "var(--accent-default, var(--accent, #38bdf8))",
                display: "block",
                "margin-bottom": "4px",
              }}
            >
              Browser & System Defaults
            </span>
            <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600 }}>
              Navigation, Omnibox & Windows Association
            </h3>
            <p style={{ margin: "2px 0 0 0", "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
              Configure search engine preferences, startup behaviors, and system default browser registration.
            </p>
          </div>

          {/* Windows Default Browser Highlight Card */}
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "12px",
              padding: "18px 20px",
              background: "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb, 56, 189, 248), 0.08)))",
              border: "1px solid var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.3))",
              "box-shadow": "0 2px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              "border-radius": "var(--radius-md, 8px)",
            }}
          >
            <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", gap: "16px", "flex-wrap": "wrap" }}>
              <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
                <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                  <span style={{ "font-size": "14px", "font-weight": 600, color: "var(--text-primary, var(--text-color, currentColor))" }}>
                    Windows Default Browser
                  </span>
                  <Show
                    when={isDefaultBrowser() !== null}
                    fallback={
                      <span
                        style={{
                          "font-size": "10.5px",
                          "font-family": "var(--font-data, Space Mono, monospace)",
                          padding: "2px 8px",
                          "border-radius": "10px",
                          background: "var(--control-bg, rgba(var(--panel-rgb), 0.1))",
                          color: "var(--text-secondary, currentColor)",
                        }}
                      >
                        ● Checking status...
                      </span>
                    }
                  >
                    <span
                      style={{
                        "font-size": "10.5px",
                        "font-family": "var(--font-data, Space Mono, monospace)",
                        padding: "2px 8px",
                        "border-radius": "10px",
                        background: isDefaultBrowser() ? "rgba(5, 255, 176, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: isDefaultBrowser() ? "#05ffb0" : "#f59e0b",
                        border: isDefaultBrowser() ? "1px solid rgba(5, 255, 176, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                        "font-weight": 600,
                      }}
                    >
                      {isDefaultBrowser() ? "● Active System Default" : "○ Not Registered"}
                    </span>
                  </Show>
                </div>
                <span style={{ "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.9 }}>
                  Register Flurer Web Loader as your default Windows browser handler for HTTP and HTTPS links.
                </span>
              </div>

              <button
                type="button"
                disabled={isRegisteringBrowser() || isDefaultBrowser() === null}
                onClick={handleRegisterDefaultBrowser}
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "8px",
                  padding: "8px 16px",
                  "border-radius": "var(--radius-sm, 6px)",
                  background: isDefaultBrowser()
                    ? "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.15))"
                    : "var(--accent-default, var(--accent, #38bdf8))",
                  color: isDefaultBrowser()
                    ? "var(--text-primary, var(--text-color, currentColor))"
                    : accentTextColor(),
                  border: isDefaultBrowser()
                    ? "1px solid var(--border-color, rgba(128, 128, 128, 0.2))"
                    : "none",
                  "font-weight": 600,
                  "font-size": "12.5px",
                  cursor: "pointer",
                  opacity: isRegisteringBrowser() ? 0.7 : 1,
                  transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                  "box-shadow": isDefaultBrowser() ? "none" : "0 2px 8px var(--accent-border, rgba(var(--accent-rgb), 0.3))",
                }}
              >
                {isRegisteringBrowser()
                  ? "Registering in Windows..."
                  : isDefaultBrowser() === true
                  ? "Manage in Windows Settings"
                  : "Set as Default Browser"}
              </button>
            </div>

            <Show when={browserNotice()}>
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "var(--accent-bg-soft, var(--accent-soft))",
                  border: "1px solid var(--accent-border)",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  color: "var(--accent-default, var(--accent, #38bdf8))",
                }}
              >
                <CheckIcon size={14} />
                <span>{browserNotice()}</span>
              </div>
            </Show>
          </div>

          {/* Omnibox Search Engine */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Default Omnibox Search Engine
            </label>
            <select
              value={currentEngine()}
              onChange={(e) =>
                props.onPluginSettingsChange({ searchEngine: e.currentTarget.value as SearchEngine })
              }
              style={{
                padding: "8px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "12.5px",
                outline: "none",
                "max-width": "340px",
              }}
            >
              <option value="duckduckgo">DuckDuckGo (Privacy Focused)</option>
              <option value="google">Google Search</option>
              <option value="bing">Microsoft Bing</option>
              <option value="brave">Brave Search</option>
            </select>
          </div>

          {/* Default Home URL */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Home Page URL (Leave empty for QuickDial dashboard)
            </label>
            <input
              type="text"
              placeholder="e.g. http://localhost:3000 or https://github.com"
              value={homeUrl()}
              onInput={(e) => props.onPluginSettingsChange({ homeUrl: e.currentTarget.value })}
              style={{
                padding: "8px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "12.5px",
                outline: "none",
                "max-width": "460px",
              }}
            />
          </div>

          {/* Preferred Launch Mode */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Preferred Launch Mode
            </label>
            <select
              value={defaultMode()}
              onChange={(e) =>
                props.onPluginSettingsChange({ defaultMode: e.currentTarget.value as any })
              }
              style={{
                padding: "8px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "12.5px",
                outline: "none",
                "max-width": "380px",
              }}
            >
              <option value="embedded">Docked In-App Viewport (with Pop-out on demand)</option>
              <option value="webviewwindow">Always Launch Dedicated WebviewWindow</option>
            </select>
          </div>

          {/* Browser Behavior Toggles */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "10px" }}>
            <SwitchToggle
              checked={persistTabs()}
              onChange={(checked) => props.onPluginSettingsChange({ persistTabs: checked })}
              label="Restore Open Tabs on Startup"
              description="Automatically recover open tabs and workspaces from your previous session when Flurer starts."
              icon={<LayersIcon size={18} />}
            />

            <SwitchToggle
              checked={props.pluginSettings.dockedChildWebview !== false}
              onChange={(checked) => props.onPluginSettingsChange({ dockedChildWebview: checked })}
              label="Native Docked Child Webview"
              description="Bypasses iframe restrictions and cross-origin security barriers for full web compatibility."
              icon={<GlobeIcon size={18} />}
            />

            <SwitchToggle
              checked={props.pluginSettings.autoLaunchRestricted ?? false}
              onChange={(checked) => props.onPluginSettingsChange({ autoLaunchRestricted: checked })}
              label="Auto-Launch Native Window for Frame-Restricted Sites"
              description="Automatically pops out services that deny embedding (Outlook, GitHub, Google Auth) into isolated windows."
              icon={<ExternalIcon size={18} />}
            />
          </div>
        </div>
      </Show>

      {/* ── 5. PRIVACY & SECURITY ─────────────────────────────────────── */}
      <Show when={isVisible("security", "security privacy incognito login user agent cookies cache purge wipe")}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "20px",
            background: "var(--card-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.05))",
            border: "1px solid var(--card-border, var(--border-color, rgba(128, 128, 128, 0.12)))",
            "box-shadow": "inset 0 1px 0 0 rgba(var(--panel-rgb, 255, 255, 255), 0.1)",
            padding: "20px 24px",
            "border-radius": "var(--radius-lg, 10px)",
            "backdrop-filter": "blur(var(--surface-blur, 12px))",
            "-webkit-backdrop-filter": "blur(var(--surface-blur, 12px))",
          }}
        >
          <div>
            <span
              style={{
                "font-size": "11px",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "text-transform": "uppercase",
                "letter-spacing": "0.12em",
                color: "var(--accent-default, var(--accent, #38bdf8))",
                display: "block",
                "margin-bottom": "4px",
              }}
            >
              Data Privacy & Security
            </span>
            <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600 }}>
              Session Persistence & Storage Invariants
            </h3>
            <p style={{ margin: "2px 0 0 0", "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85 }}>
              Manage authentication storage, private ephemeral mode, user-agent identity, and cached assets.
            </p>
          </div>

          <div style={{ display: "flex", "flex-direction": "column", gap: "10px" }}>
            <SwitchToggle
              checked={persistLogin()}
              onChange={(checked) => props.onPluginSettingsChange({ persistLogin: checked })}
              label="Persistent Logins & Session Cookies"
              description="Preserves authenticated sessions (ChatGPT, Claude, GitHub, Termix) across restarts in the secure user profile."
              icon={<LockIcon size={18} />}
            />

            <SwitchToggle
              checked={incognitoMode()}
              onChange={(checked) => props.onPluginSettingsChange({ incognitoMode: checked })}
              label="Ephemeral / Incognito Mode (Zero Disk Traces)"
              description="Runs Webviews in private ephemeral memory. No cookies, auth tokens, or browsing traces are stored on disk."
              icon={<IncognitoIcon size={18} />}
            />

            <SwitchToggle
              checked={singleWindow()}
              onChange={(checked) => props.onPluginSettingsChange({ singleWindowPerDomain: checked })}
              label="Reuse Existing Window per Service"
              description="Focuses and brings existing service windows to front rather than spawning redundant instances."
              icon={<OrbitIcon size={18} />}
            />
          </div>

          {/* Desktop User-Agent Selector */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "8px", "margin-top": "6px" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Desktop User-Agent Identifier
            </label>
            <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
              <button
                type="button"
                style={{
                  padding: "6px 14px",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  "border-radius": "var(--radius-sm, 6px)",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                  background: customUserAgent() === DEFAULT_DESKTOP_USER_AGENT
                    ? "var(--accent-default, var(--accent, #38bdf8))"
                    : "var(--control-bg, rgba(var(--panel-rgb), 0.08))",
                  color: customUserAgent() === DEFAULT_DESKTOP_USER_AGENT
                    ? accentTextColor()
                    : "var(--text-primary, var(--text-color, currentColor))",
                  cursor: "pointer",
                  "font-weight": customUserAgent() === DEFAULT_DESKTOP_USER_AGENT ? 600 : 400,
                  transition: "all 0.15s ease",
                }}
                onClick={() => props.onPluginSettingsChange({ customUserAgent: DEFAULT_DESKTOP_USER_AGENT })}
              >
                Edge Desktop (Recommended)
              </button>
              <button
                type="button"
                style={{
                  padding: "6px 14px",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  "border-radius": "var(--radius-sm, 6px)",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                  background: customUserAgent() === CHROME_DESKTOP_USER_AGENT
                    ? "var(--accent-default, var(--accent, #38bdf8))"
                    : "var(--control-bg, rgba(var(--panel-rgb), 0.08))",
                  color: customUserAgent() === CHROME_DESKTOP_USER_AGENT
                    ? accentTextColor()
                    : "var(--text-primary, var(--text-color, currentColor))",
                  cursor: "pointer",
                  "font-weight": customUserAgent() === CHROME_DESKTOP_USER_AGENT ? 600 : 400,
                  transition: "all 0.15s ease",
                }}
                onClick={() => props.onPluginSettingsChange({ customUserAgent: CHROME_DESKTOP_USER_AGENT })}
              >
                Chrome Desktop
              </button>
            </div>
            <input
              type="text"
              value={customUserAgent()}
              onInput={(e) => props.onPluginSettingsChange({ customUserAgent: e.currentTarget.value })}
              style={{
                padding: "8px 12px",
                "border-radius": "var(--radius-sm, 6px)",
                background: "var(--input-bg, var(--control-bg, rgba(var(--panel-rgb), 0.08)))",
                border: "1px solid var(--border-color, rgba(128, 128, 128, 0.18))",
                color: "var(--text-primary, var(--text-color, currentColor))",
                "font-family": "var(--font-data, Space Mono, monospace)",
                "font-size": "12px",
                outline: "none",
                "max-width": "640px",
              }}
            />
          </div>

          {/* Data Security & Privacy Controls (Danger Zone) */}
          <div
            style={{
              "margin-top": "10px",
              padding: "18px",
              background: isLightMode() ? "rgba(220, 38, 38, 0.06)" : "rgba(239, 68, 68, 0.06)",
              border: `1px solid ${isLightMode() ? "rgba(220, 38, 38, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
              "border-radius": "var(--radius-md, 8px)",
              display: "flex",
              "flex-direction": "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
              <TrashIcon size={16} />
              <span style={{ "font-size": "13px", "font-weight": 600, color: isLightMode() ? "#dc2626" : "#f87171" }}>
                Session Data & Storage Purge
              </span>
            </div>
            <p style={{ margin: 0, "font-size": "12px", color: "var(--text-secondary, currentColor)", opacity: 0.85, "line-height": 1.45 }}>
              Purge all stored session tokens, cookies, indexedDB databases, and cached web assets from disk.
            </p>

            <Show when={securityStatus()}>
              <div
                style={{
                  padding: "8px 12px",
                  background: "var(--accent-bg-soft, var(--accent-soft))",
                  border: "1px solid var(--accent-border)",
                  "border-radius": "var(--radius-sm, 6px)",
                  color: "var(--text-primary, var(--text-color, currentColor))",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                }}
              >
                {securityStatus()}
              </div>
            </Show>

            <div style={{ display: "flex", gap: "10px", "flex-wrap": "wrap" }}>
              <button
                type="button"
                disabled={isWiping()}
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  "font-weight": 600,
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  cursor: isWiping() ? "wait" : "pointer",
                  opacity: isWiping() ? 0.6 : 1,
                  transition: "opacity 0.15s ease",
                }}
                onClick={async () => {
                  setIsWiping(true);
                  setSecurityStatus("Purging all webview data...");
                  const res = await clearAllBrowsingData();
                  setIsWiping(false);
                  if (res.success) {
                    setSecurityStatus("✓ All webview cookies, cache & local data purged successfully.");
                  } else {
                    setSecurityStatus(`⚠️ Notice: ${res.error || "Cleared"}`);
                  }
                  setTimeout(() => setSecurityStatus(""), 5000);
                }}
              >
                <TrashIcon size={14} />
                {isWiping() ? "Purging..." : "Purge All Browsing Data (Cookies & Cache)"}
              </button>

              <button
                type="button"
                style={{
                  display: "inline-flex",
                  "align-items": "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "var(--control-bg, rgba(var(--panel-rgb), 0.1))",
                  color: "var(--text-primary, var(--text-color, currentColor))",
                  border: "1px solid var(--border-color, rgba(128, 128, 128, 0.2))",
                  "border-radius": "var(--radius-sm, 6px)",
                  "font-size": "12px",
                  "font-family": "var(--font-data, Space Mono, monospace)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  clearHistory();
                  setSecurityStatus("✓ Browsing history cleared.");
                  setTimeout(() => setSecurityStatus(""), 4000);
                }}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
