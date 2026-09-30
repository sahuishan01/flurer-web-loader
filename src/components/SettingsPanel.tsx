import { For, Show, createSignal } from "solid-js";
import { SettingsPanelProps, SearchEngine } from "../types";
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
  BranchIcon,
  LayersIcon,
} from "../icons";
import {
  DEFAULT_WORKSPACES,
  isLayaOfflineDownloaded,
  downloadAndSetupLayaOffline,
  clearLayaOfflineStorage,
  getLayaOfflineMetadata,
  routeTab,
} from "../smartRouter";
import {
  clearAllBrowsingData,
  clearHistory,
  DEFAULT_DESKTOP_USER_AGENT,
  CHROME_DESKTOP_USER_AGENT,
} from "../utils";

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

export function SettingsPanel(props: SettingsPanelProps) {
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

  const [isDownloadingLaya, setIsDownloadingLaya] = createSignal(false);
  const [layaDownloadProgress, setLayaDownloadProgress] = createSignal(0);
  const [layaDownloadStage, setLayaDownloadStage] = createSignal("");
  const [layaOfflineReady, setLayaOfflineReady] = createSignal(isLayaOfflineDownloaded());
  const [testEndpointResult, setTestEndpointResult] = createSignal<string | null>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = createSignal(false);
  const [testEndpointUrl, setTestEndpointUrl] = createSignal("https://news.ycombinator.com");

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
        `✓ [${decision.engineUsed.toUpperCase()}] Routed to Workspace: ${decision.projectId} (${decision.intent}) - ${Math.round(decision.confidence * 100)}% confidence. ${decision.reason || ""}`
      );
    } catch (e: any) {
      setTestEndpointResult(`✗ Error: ${e?.message || "Failed to reach endpoint"}`);
    } finally {
      setIsTestingEndpoint(false);
    }
  };

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

  const [securityStatus, setSecurityStatus] = createSignal("");
  const [isWiping, setIsWiping] = createSignal(false);

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

  return (
    <div
      style={{
        ...effectiveTheme(),
        display: "flex",
        "flex-direction": "column",
        gap: "28px",
        padding: "24px 32px",
        color: "var(--text-primary, #f8fafc)",
        "font-family": "system-ui, -apple-system, sans-serif",
        "max-width": "900px",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 4px 0", "font-size": "18px", "font-weight": 600 }}>
          Web Loader Settings & Theming Studio
        </h3>
        <p
          style={{
            margin: 0,
            "font-size": "12px",
            "font-family": "Space Mono, monospace",
            color: "var(--text-secondary, #94a3b8)",
          }}
        >
          Fully customize browser chrome appearance, themes, search behavior, and window defaults.
        </p>
      </div>

      {/* THEME & APPEARANCE STUDIO */}
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "16px",
          background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
          border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
          padding: "20px",
          "border-radius": "10px",
        }}
      >
        <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
          <div>
            <span
              style={{
                "font-size": "11px",
                "font-family": "Space Mono, monospace",
                "text-transform": "uppercase",
                "letter-spacing": "0.12em",
                color: "var(--accent-default, #38bdf8)",
              }}
            >
              Theming & Palette Mode
            </span>
            <h4 style={{ margin: "4px 0 0 0", "font-size": "14px", "font-weight": 600 }}>
              Visual Layout Styling
            </h4>
          </div>

          <button
            type="button"
            onClick={handleResetToAuto}
            style={{
              background: "transparent",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.15))",
              color: "var(--text-secondary, #cbd5e1)",
              padding: "4px 10px",
              "border-radius": "6px",
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              cursor: "pointer",
            }}
          >
            Reset to Flurer Auto
          </button>
        </div>

        {/* Mode Segmented Pills */}
        <div style={{ display: "inline-flex", gap: "6px", padding: "4px", background: "rgba(0, 0, 0, 0.25)", "border-radius": "8px", "align-self": "flex-start" }}>
          <button
            type="button"
            onClick={() => handleSelectMode("auto")}
            style={{
              padding: "6px 14px",
              "border-radius": "6px",
              border: "none",
              background: currentThemeMode() === "auto" ? "var(--accent-default, #38bdf8)" : "transparent",
              color: currentThemeMode() === "auto" ? "#0f172a" : "var(--text-secondary, #cbd5e1)",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
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
              background: currentThemeMode() === "preset" ? "var(--accent-default, #38bdf8)" : "transparent",
              color: currentThemeMode() === "preset" ? "#0f172a" : "var(--text-secondary, #cbd5e1)",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
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
              background: currentThemeMode() === "custom" ? "var(--accent-default, #38bdf8)" : "transparent",
              color: currentThemeMode() === "custom" ? "#0f172a" : "var(--text-secondary, #cbd5e1)",
              "font-family": "Space Mono, monospace",
              "font-size": "12px",
              "font-weight": 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Custom Studio
          </button>
        </div>

        {/* AUTO MODE EXPLANATION */}
        <Show when={currentThemeMode() === "auto"}>
          <div
            style={{
              padding: "14px 18px",
              "border-radius": "8px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px dashed var(--border-color, rgba(255, 255, 255, 0.12))",
              "font-size": "12.5px",
              "line-height": 1.5,
              color: "var(--text-secondary, #cbd5e1)",
            }}
          >
            <strong>Automatic Flurer Sync:</strong> Web Loader dynamically inherits Flurer's native tokens (<code>--panel-rgb</code>, <code>--text-primary</code>, <code>--accent-default</code>, <code>--surface-blur</code>) and adjusts contrast automatically when Flurer toggles light/dark mode.
          </div>
        </Show>

        {/* PRESETS GALLERY */}
        <Show when={currentThemeMode() === "preset"}>
          <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
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
                      padding: "12px 14px",
                      "border-radius": "8px",
                      background: p.colors.panelBg,
                      border: isSelected()
                        ? `2px solid ${p.colors.accent}`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      "box-shadow": isSelected() ? `0 0 12px ${p.colors.accent}40` : "none",
                    }}
                  >
                    <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                      <span style={{ "font-size": "13px", "font-weight": 600, color: p.colors.textPrimary }}>
                        {p.name}
                      </span>
                      {isSelected() && (
                        <span style={{ "font-size": "10px", "font-family": "Space Mono, monospace", color: p.colors.accent }}>
                          ● ACTIVE
                        </span>
                      )}
                    </div>
                    <span style={{ "font-size": "11px", color: p.colors.textMuted }}>
                      {p.description}
                    </span>
                    <div style={{ display: "flex", gap: "6px", "margin-top": "4px" }}>
                      <div style={{ width: "16px", height: "16px", "border-radius": "4px", background: p.colors.accent }} title="Accent" />
                      <div style={{ width: "16px", height: "16px", "border-radius": "4px", background: `rgb(${p.colors.panelRgb})` }} title="Panel" />
                      <div style={{ width: "16px", height: "16px", "border-radius": "4px", background: p.colors.textPrimary }} title="Text" />
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>

        {/* CUSTOM STUDIO */}
        <Show when={currentThemeMode() === "custom"}>
          <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
            {/* Accent Color */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <label style={{ "font-size": "12.5px", "font-weight": 500 }}>
                Custom Accent Color
              </label>
              <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
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
                    padding: "6px 10px",
                    "border-radius": "6px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
                    color: "var(--text-primary, #f8fafc)",
                    "font-family": "Space Mono, monospace",
                    "font-size": "12px",
                    width: "110px",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", "align-items": "center" }}>
                  <For each={QUICK_ACCENTS}>
                    {(acc) => (
                      <button
                        type="button"
                        onClick={() => handleCustomAccent(acc.hex)}
                        style={{
                          width: "22px",
                          height: "22px",
                          "border-radius": "999px",
                          background: acc.hex,
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          cursor: "pointer",
                        }}
                        title={acc.name}
                      />
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Background Tint */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <label style={{ "font-size": "12.5px", "font-weight": 500 }}>
                Panel Background Tint
              </label>
              <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                <For each={QUICK_PANELS}>
                  {(panel) => (
                    <button
                      type="button"
                      onClick={() => handleCustomPanel(panel.rgb)}
                      style={{
                        padding: "6px 12px",
                        "border-radius": "6px",
                        background: panel.hex,
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#f8fafc",
                        "font-size": "11px",
                        "font-family": "Space Mono, monospace",
                        cursor: "pointer",
                      }}
                    >
                      {panel.name}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>

        {/* Translucency Sliders */}
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", "margin-top": "8px" }}>
          <div>
            <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", "margin-bottom": "4px" }}>
              <span>Surface Opacity</span>
              <span style={{ "font-family": "Space Mono, monospace" }}>{Math.round(surfaceOpacity() * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={surfaceOpacity()}
              onInput={(e) => updateTheme({ surfaceOpacity: parseFloat(e.currentTarget.value) })}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", "margin-bottom": "4px" }}>
              <span>Surface Blur</span>
              <span style={{ "font-family": "Space Mono, monospace" }}>{surfaceBlur()}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={surfaceBlur()}
              onInput={(e) => updateTheme({ surfaceBlur: parseInt(e.currentTarget.value, 10) })}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* WORKSPACE NAVIGATION & THE THIRD DESIGN */}
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "18px",
          background: "var(--card-bg, rgba(255, 255, 255, 0.04))",
          border: "1px solid var(--card-border, rgba(255, 255, 255, 0.08))",
          padding: "20px",
          "border-radius": "10px",
        }}
      >
        <div>
          <span
            style={{
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              "text-transform": "uppercase",
              "letter-spacing": "0.12em",
              color: "var(--accent-default, #38bdf8)",
            }}
          >
            Tab Architecture & Workspaces
          </span>
          <h4 style={{ margin: "4px 0 2px 0", "font-size": "15px", "font-weight": 600 }}>
            Navigation Paradigm & Smart Router (The Third Design)
          </h4>
          <p
            style={{
              margin: 0,
              "font-size": "12px",
              color: "var(--text-secondary, #94a3b8)",
              "line-height": 1.45,
            }}
          >
            Replaces conventional horizontal and vertical tabs with a native Context Capsule HUD and an extensible Workspace Orbit Deck with on-device routing.
          </p>
        </div>

        {/* Paradigm Selection */}
        <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <label style={{ "font-size": "13px", "font-weight": 500 }}>
            Active Navigation Paradigm
          </label>
          <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
            <div
              style={{
                padding: "14px",
                "border-radius": "8px",
                background: designMode() === "context-orbit" ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border: designMode() === "context-orbit" ? "1px solid var(--accent-default, #38bdf8)" : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onClick={() => props.onPluginSettingsChange({ designMode: "context-orbit" })}
            >
              <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
                <OrbitIcon size={18} />
                <span style={{ "font-weight": 600, "font-size": "13px", color: designMode() === "context-orbit" ? "var(--accent-default, #38bdf8)" : "#f8fafc" }}>
                  Context Orbit & Flow Deck (Third-Gen)
                </span>
              </div>
              <p style={{ margin: 0, "font-size": "11px", color: "var(--text-secondary, #94a3b8)", "line-height": 1.4 }}>
                HUD Context Capsule with Project Pills, Lineage Breadcrumbs, and instant Workspace Orbit Deck (Matrix & 2D Spatial Canvas).
              </p>
            </div>

            <div
              style={{
                padding: "14px",
                "border-radius": "8px",
                background: designMode() === "standard-tabs" ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.03)",
                border: designMode() === "standard-tabs" ? "1px solid var(--accent-default, #38bdf8)" : "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onClick={() => props.onPluginSettingsChange({ designMode: "standard-tabs" })}
            >
              <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
                <span style={{ "font-size": "14px" }}>📋</span>
                <span style={{ "font-weight": 600, "font-size": "13px", color: designMode() === "standard-tabs" ? "var(--accent-default, #38bdf8)" : "#f8fafc" }}>
                  Classic Horizontal Tab Strip
                </span>
              </div>
              <p style={{ margin: 0, "font-size": "11px", color: "var(--text-secondary, #94a3b8)", "line-height": 1.4 }}>
                Traditional browser tabs strip docked at the top with tab titles and close buttons.
              </p>
            </div>
          </div>
        </div>

        {/* Default Orbit Deck Layout */}
        <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
          <label style={{ "font-size": "13px", "font-weight": 500 }}>
            Default Orbit Deck Layout Mode
          </label>
          <div style={{ display: "inline-flex", gap: "8px" }}>
            <button
              type="button"
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "6px",
                padding: "6px 14px",
                "border-radius": "6px",
                background: orbitLayout() === "matrix" ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.05)",
                border: orbitLayout() === "matrix" ? "1px solid var(--accent-default, #38bdf8)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: orbitLayout() === "matrix" ? "#38bdf8" : "var(--text-secondary, #cbd5e1)",
                "font-size": "12px",
                "font-family": "Space Mono, monospace",
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
                padding: "6px 14px",
                "border-radius": "6px",
                background: orbitLayout() === "spatial" ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.05)",
                border: orbitLayout() === "spatial" ? "1px solid var(--accent-default, #38bdf8)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: orbitLayout() === "spatial" ? "#38bdf8" : "var(--text-secondary, #cbd5e1)",
                "font-size": "12px",
                "font-family": "Space Mono, monospace",
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
            gap: "12px",
            padding: "14px",
            background: "rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            "border-radius": "8px",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
            <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
              <SparklesIcon size={18} />
              <span style={{ "font-size": "13px", "font-weight": 600, color: "#a855f7", "font-family": "Space Mono, monospace" }}>
                Smart Routing Engine ("Laya")
              </span>
            </div>
            <label style={{ display: "inline-flex", "align-items": "center", gap: "8px", cursor: "pointer", "font-size": "12px" }}>
              <input
                type="checkbox"
                checked={currentSmartRouter().enabled}
                onChange={(e) =>
                  props.onPluginSettingsChange({
                    smartRouter: {
                      ...currentSmartRouter(),
                      enabled: e.currentTarget.checked,
                    },
                  })
                }
              />
              <span>Enable Smart Routing</span>
            </label>
          </div>

          <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
            <div>
              <label style={{ "font-size": "12px", color: "var(--text-secondary, #94a3b8)", display: "block", "margin-bottom": "6px" }}>
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
                  padding: "8px 10px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#f8fafc",
                  "border-radius": "6px",
                  "font-size": "12px",
                }}
              >
                <option value="heuristic">Option 1: Built-in Zero-Latency Heuristic (Instant, 0ms, 100% Offline)</option>
                <option value="openai-compatible">Option 2: Connect with OpenAPI/OpenAI-compatible Endpoint (Online or Offline)</option>
                <option value="laya-offline">Option 3: Download & Setup Laya Completely Offline (On-Device, Zero Setup)</option>
              </select>
            </div>

            {/* OPTION 1: Built-in Heuristic */}
            <Show when={currentSmartRouter().provider === "heuristic"}>
              <div
                style={{
                  padding: "10px 12px",
                  "border-radius": "6px",
                  background: "rgba(5, 255, 176, 0.06)",
                  border: "1px solid rgba(5, 255, 176, 0.2)",
                  "font-size": "12px",
                  "line-height": 1.5,
                  color: "var(--text-secondary, #cbd5e1)",
                }}
              >
                <div style={{ display: "flex", "align-items": "center", gap: "6px", "margin-bottom": "4px", color: "#05ffb0", "font-weight": 600 }}>
                  <span>✓ Built-in Fast Heuristic Router Active</span>
                </div>
                Deterministic pattern, domain, and keyword classification. Zero network traffic, zero external servers, and instantaneous 0ms response time.
              </div>
            </Show>

            {/* OPTION 2: OpenAPI-compatible Endpoint */}
            <Show when={currentSmartRouter().provider === "openai-compatible"}>
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "12px",
                  padding: "12px",
                  "border-radius": "6px",
                  background: "rgba(56, 189, 248, 0.05)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                }}
              >
                <div style={{ "font-size": "12px", color: "#38bdf8", "font-weight": 600 }}>
                  OpenAPI / OpenAI-Compatible Endpoint Configuration
                </div>
                <div style={{ "font-size": "11px", color: "var(--text-secondary, #94a3b8)" }}>
                  Connect to local offline backends (LM Studio, vLLM, LocalAI, Ollama /v1) or online APIs (OpenRouter, OpenAI, Groq).
                </div>

                <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                  <div>
                    <label style={{ "font-size": "11px", color: "var(--text-secondary, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
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
                      placeholder="http://127.0.0.1:1234/v1 or https://openrouter.ai/api/v1"
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        background: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#f8fafc",
                        "border-radius": "6px",
                        "font-size": "12px",
                        "font-family": "Space Mono, monospace",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ "font-size": "11px", color: "var(--text-secondary, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
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
                        background: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#f8fafc",
                        "border-radius": "6px",
                        "font-size": "12px",
                        "font-family": "Space Mono, monospace",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ "font-size": "11px", color: "var(--text-secondary, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
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
                        background: "rgba(0, 0, 0, 0.4)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#f8fafc",
                        "border-radius": "6px",
                        "font-size": "12px",
                        "font-family": "Space Mono, monospace",
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
                      background: "rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#f8fafc",
                      "border-radius": "6px",
                      "font-size": "12px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleTestEndpoint}
                    disabled={isTestingEndpoint()}
                    style={{
                      padding: "6px 14px",
                      background: "rgba(56, 189, 248, 0.2)",
                      border: "1px solid rgba(56, 189, 248, 0.5)",
                      color: "#38bdf8",
                      "border-radius": "6px",
                      "font-size": "11px",
                      "font-family": "Space Mono, monospace",
                      cursor: "pointer",
                    }}
                  >
                    {isTestingEndpoint() ? "Testing Connection..." : "Test Endpoint"}
                  </button>
                </div>

                <Show when={testEndpointResult()}>
                  <div
                    style={{
                      padding: "8px 10px",
                      "border-radius": "6px",
                      background: "rgba(0, 0, 0, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "font-size": "11px",
                      "font-family": "Space Mono, monospace",
                      color: testEndpointResult()?.startsWith("✓") ? "#05ffb0" : "#ef4444",
                    }}
                  >
                    {testEndpointResult()}
                  </div>
                </Show>
              </div>
            </Show>

            {/* OPTION 3: Download & Setup Laya Completely Offline */}
            <Show when={currentSmartRouter().provider === "laya-offline"}>
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "12px",
                  padding: "12px",
                  "border-radius": "6px",
                  background: "rgba(168, 85, 247, 0.06)",
                  border: "1px solid rgba(168, 85, 247, 0.25)",
                }}
              >
                <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
                  <div style={{ "font-size": "12px", color: "#a855f7", "font-weight": 600 }}>
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
                          "font-size": "10px",
                          "font-family": "Space Mono, monospace",
                        }}
                      >
                        Not Downloaded
                      </span>
                    }
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        "border-radius": "12px",
                        background: "rgba(5, 255, 176, 0.15)",
                        color: "#05ffb0",
                        "font-size": "10px",
                        "font-family": "Space Mono, monospace",
                      }}
                    >
                      ✓ Offline Engine Cached
                    </span>
                  </Show>
                </div>

                <p style={{ margin: 0, "font-size": "11px", color: "var(--text-secondary, #94a3b8)", "line-height": 1.5 }}>
                  Laya Offline downloads lightweight quantized semantic vector tables (4.8 MB) directly into client storage. It runs 100% on-device inside Flurer without requiring any local daemon, background server, or active internet connection.
                </p>

                <Show when={isDownloadingLaya()}>
                  <div style={{ display: "flex", "flex-direction": "column", gap: "6px" }}>
                    <div style={{ display: "flex", "justify-content": "space-between", "font-size": "11px", "font-family": "Space Mono, monospace" }}>
                      <span style={{ color: "#a855f7" }}>{layaDownloadStage()}</span>
                      <span style={{ color: "#f8fafc" }}>{layaDownloadProgress()}%</span>
                    </div>
                    <div style={{ height: "6px", width: "100%", background: "rgba(255, 255, 255, 0.1)", "border-radius": "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${layaDownloadProgress()}%`,
                          background: "linear-gradient(90deg, #a855f7, #38bdf8)",
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
                          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(56, 189, 248, 0.3))",
                          border: "1px solid rgba(168, 85, 247, 0.6)",
                          color: "#f8fafc",
                          "border-radius": "6px",
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
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#f8fafc",
                        "border-radius": "6px",
                        "font-size": "11px",
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
                        "border-radius": "6px",
                        "font-size": "11px",
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
        </div>

        {/* Project Workspaces Manager */}
        <div style={{ display: "flex", "flex-direction": "column", gap: "10px" }}>
          <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
            <label style={{ "font-size": "13px", "font-weight": 500 }}>
              Configured Project Workspaces ({currentWorkspaces().length})
            </label>
          </div>

          <div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px" }}>
            <For each={currentWorkspaces()}>
              {(ws) => (
                <div
                  style={{
                    display: "inline-flex",
                    "align-items": "center",
                    gap: "6px",
                    padding: "4px 10px",
                    "border-radius": "6px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${ws.color}55`,
                    color: "var(--text-primary, #f8fafc)",
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
                        color: "var(--text-muted, #94a3b8)",
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
                padding: "6px 10px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#f8fafc",
                "border-radius": "6px",
                "font-size": "12px",
                flex: "1 1 140px",
              }}
            />
            <input
              type="text"
              placeholder="Keywords (comma separated)..."
              value={newWsKeywords()}
              onInput={(e) => setNewWsKeywords(e.currentTarget.value)}
              style={{
                padding: "6px 10px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#f8fafc",
                "border-radius": "6px",
                "font-size": "12px",
                flex: "2 1 200px",
              }}
            />
            <button
              type="button"
              style={{
                padding: "6px 14px",
                background: "rgba(56, 189, 248, 0.2)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#38bdf8",
                "border-radius": "6px",
                "font-size": "12px",
                "font-family": "Space Mono, monospace",
                cursor: "pointer",
              }}
              onClick={handleAddWorkspace}
            >
              + Add Workspace
            </button>
          </div>
        </div>
      </div>

      {/* BROWSER SETTINGS */}
      <div style={{ display: "flex", "flex-direction": "column", gap: "18px" }}>
        <h4 style={{ margin: "0", "font-size": "14px", "font-weight": 600 }}>
          Navigation & Behavior
        </h4>

        {/* Search Engine */}
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
              "border-radius": "6px",
              background: "var(--input-bg, rgba(255, 255, 255, 0.06))",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
              color: "var(--text-primary, #f8fafc)",
              "font-family": "Space Mono, monospace",
              "font-size": "13px",
              outline: "none",
              "max-width": "320px",
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
              "border-radius": "6px",
              background: "var(--input-bg, rgba(255, 255, 255, 0.06))",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
              color: "var(--text-primary, #f8fafc)",
              "font-family": "Space Mono, monospace",
              "font-size": "13px",
              outline: "none",
              "max-width": "450px",
            }}
          />
        </div>

        {/* Default Launch Mode */}
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
              "border-radius": "6px",
              background: "var(--input-bg, rgba(255, 255, 255, 0.06))",
              border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
              color: "var(--text-primary, #f8fafc)",
              "font-family": "Space Mono, monospace",
              "font-size": "13px",
              outline: "none",
              "max-width": "320px",
            }}
          >
            <option value="embedded">Docked In-App Viewport (with Pop-out on demand)</option>
            <option value="webviewwindow">Always Launch Dedicated WebviewWindow</option>
          </select>
        </div>

        {/* Tab Persistence */}
        <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="persist-tabs"
            checked={persistTabs()}
            onChange={(e) => props.onPluginSettingsChange({ persistTabs: e.currentTarget.checked })}
          />
          <label for="persist-tabs" style={{ "font-size": "13px", cursor: "pointer" }}>
            Restore open tabs on startup
          </label>
        </div>

        {/* Docked Child Webview Toggle */}
        <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="docked-child"
            checked={props.pluginSettings.dockedChildWebview !== false}
            onChange={(e) => props.onPluginSettingsChange({ dockedChildWebview: e.currentTarget.checked })}
          />
          <label for="docked-child" style={{ "font-size": "13px", cursor: "pointer" }}>
            Enable Native Docked Child Webview (bypasses iframe restrictions)
          </label>
        </div>

        {/* --- Security, Persistent Login & Privacy Systems --- */}
        <div style={{ "margin-top": "16px", "padding-top": "20px", "border-top": "1px solid var(--border-color, rgba(255, 255, 255, 0.1))" }}>
          <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
            <ShieldIcon size={18} />
            <h3 style={{ margin: 0, "font-size": "15px", "font-weight": 600, color: "var(--text-primary, #f8fafc)" }}>
              Data Security & Persistent Login
            </h3>
          </div>
          <p style={{ margin: "0 0 16px 0", "font-size": "12.5px", color: "var(--text-secondary, #94a3b8)" }}>
            Configure authentication session persistence, private browsing, and Webview2 security invariants.
          </p>

          <div style={{ display: "flex", "flex-direction": "column", gap: "14px" }}>
            {/* Persistent Login Toggle */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
              <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="persist-login"
                  checked={persistLogin()}
                  onChange={(e) => props.onPluginSettingsChange({ persistLogin: e.currentTarget.checked })}
                />
                <label for="persist-login" style={{ "font-size": "13px", "font-weight": 600, cursor: "pointer" }}>
                  Persistent Logins & Session Cookies
                </label>
              </div>
              <span style={{ "font-size": "12px", color: "var(--text-muted, #94a3b8)", "margin-left": "24px" }}>
                Preserves authenticated sessions (ChatGPT, Claude, GitHub, Termix, etc.) in the secure profile across Flurer restarts.
              </span>
            </div>

            {/* Incognito Default Toggle */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
              <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="incognito-mode"
                  checked={incognitoMode()}
                  onChange={(e) => props.onPluginSettingsChange({ incognitoMode: e.currentTarget.checked })}
                />
                <label for="incognito-mode" style={{ "font-size": "13px", "font-weight": 600, cursor: "pointer" }}>
                  Ephemeral / Incognito Mode (Zero Disk Traces)
                </label>
              </div>
              <span style={{ "font-size": "12px", color: "var(--text-muted, #94a3b8)", "margin-left": "24px" }}>
                Runs WebviewWindows in ephemeral memory. No cookies, auth tokens, or cache are stored on disk.
              </span>
            </div>

            {/* Single Window per Service Toggle */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
              <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="single-window"
                  checked={singleWindow()}
                  onChange={(e) => props.onPluginSettingsChange({ singleWindowPerDomain: e.currentTarget.checked })}
                />
                <label for="single-window" style={{ "font-size": "13px", "font-weight": 600, cursor: "pointer" }}>
                  Reuse Existing Window per Service
                </label>
              </div>
              <span style={{ "font-size": "12px", color: "var(--text-muted, #94a3b8)", "margin-left": "24px" }}>
                Focuses and brings existing service windows to front rather than spawning redundant instances.
              </span>
            </div>

            {/* Desktop User-Agent Selector */}
            <div style={{ display: "flex", "flex-direction": "column", gap: "6px", "margin-top": "6px" }}>
              <label style={{ "font-size": "13px", "font-weight": 500 }}>
                Desktop User-Agent Identifier
              </label>
              <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
                <button
                  type="button"
                  style={{
                    padding: "6px 12px",
                    "font-size": "12px",
                    "font-family": "Space Mono, monospace",
                    "border-radius": "6px",
                    border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
                    background: customUserAgent() === DEFAULT_DESKTOP_USER_AGENT ? "var(--accent-default, #38bdf8)" : "rgba(255, 255, 255, 0.05)",
                    color: customUserAgent() === DEFAULT_DESKTOP_USER_AGENT ? "#0f172a" : "var(--text-primary, #f8fafc)",
                    cursor: "pointer",
                  }}
                  onClick={() => props.onPluginSettingsChange({ customUserAgent: DEFAULT_DESKTOP_USER_AGENT })}
                >
                  Edge Desktop (Recommended)
                </button>
                <button
                  type="button"
                  style={{
                    padding: "6px 12px",
                    "font-size": "12px",
                    "font-family": "Space Mono, monospace",
                    "border-radius": "6px",
                    border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
                    background: customUserAgent() === CHROME_DESKTOP_USER_AGENT ? "var(--accent-default, #38bdf8)" : "rgba(255, 255, 255, 0.05)",
                    color: customUserAgent() === CHROME_DESKTOP_USER_AGENT ? "#0f172a" : "var(--text-primary, #f8fafc)",
                    cursor: "pointer",
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
                  "border-radius": "6px",
                  background: "var(--input-bg, rgba(255, 255, 255, 0.06))",
                  border: "1px solid var(--border-color, rgba(255, 255, 255, 0.12))",
                  color: "var(--text-primary, #f8fafc)",
                  "font-family": "Space Mono, monospace",
                  "font-size": "11.5px",
                  outline: "none",
                  "max-width": "600px",
                }}
              />
            </div>

            {/* Data Security & Privacy Controls */}
            <div
              style={{
                "margin-top": "10px",
                padding: "16px",
                background: "rgba(239, 68, 68, 0.06)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                "border-radius": "8px",
                display: "flex",
                "flex-direction": "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                <TrashIcon size={16} />
                <span style={{ "font-size": "13px", "font-weight": 600, color: "#f87171" }}>
                  Data Security & Session Purge
                </span>
              </div>
              <p style={{ margin: 0, "font-size": "12px", color: "var(--text-secondary, #94a3b8)", "line-height": 1.4 }}>
                Purge all stored session tokens, cookies, indexedDB databases, and cached web assets from disk.
              </p>

              {securityStatus() && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    "border-radius": "6px",
                    color: "var(--text-primary, #f8fafc)",
                    "font-size": "12px",
                    "font-family": "Space Mono, monospace",
                  }}
                >
                  {securityStatus()}
                </div>
              )}

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
                    "border-radius": "6px",
                    "font-size": "12px",
                    "font-weight": 600,
                    "font-family": "Space Mono, monospace",
                    cursor: isWiping() ? "wait" : "pointer",
                    opacity: isWiping() ? 0.6 : 1,
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
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "var(--text-primary, #f8fafc)",
                    border: "1px solid var(--border-color, rgba(255, 255, 255, 0.15))",
                    "border-radius": "6px",
                    "font-size": "12px",
                    "font-family": "Space Mono, monospace",
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
        </div>
      </div>
    </div>
  );
}
