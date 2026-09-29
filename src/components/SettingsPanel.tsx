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
import { ShieldIcon, TrashIcon, LockIcon, IncognitoIcon } from "../icons";
import { clearAllBrowsingData, clearHistory, DEFAULT_DESKTOP_USER_AGENT, CHROME_DESKTOP_USER_AGENT } from "../utils";

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
