import { SettingsPanelProps, SearchEngine } from "../types";
import { S } from "../styles";

export function SettingsPanel(props: SettingsPanelProps) {
  const currentEngine = () => props.pluginSettings.searchEngine ?? "duckduckgo";
  const homeUrl = () => props.pluginSettings.homeUrl ?? "";
  const defaultMode = () => props.pluginSettings.defaultMode ?? "embedded";
  const persistTabs = () => props.pluginSettings.persistTabs ?? true;
  const surfaceOpacity = () => props.pluginSettings.surfaceOpacity ?? 0.75;
  const surfaceBlur = () => props.pluginSettings.surfaceBlur ?? 12;

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "24px",
        padding: "24px",
        color: "var(--text-primary, #f8fafc)",
        "font-family": "system-ui, -apple-system, sans-serif",
      }}
    >
      <div>
        <h3
          style={{
            margin: "0 0 4px 0",
            "font-size": "16px",
            "font-weight": 600,
          }}
        >
          Web Loader Settings
        </h3>
        <p
          style={{
            margin: 0,
            "font-size": "12px",
            "font-family": "Space Mono, monospace",
            color: "var(--text-secondary, #94a3b8)",
          }}
        >
          Configure default search engine, home address, and appearance.
        </p>
      </div>

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
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "var(--text-primary, #f8fafc)",
            "font-family": "Space Mono, monospace",
            "font-size": "13px",
            outline: "none",
            "max-width": "300px",
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
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
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
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "var(--text-primary, #f8fafc)",
            "font-family": "Space Mono, monospace",
            "font-size": "13px",
            outline: "none",
            "max-width": "300px",
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

      <hr style={{ border: "none", "border-top": "1px solid rgba(255, 255, 255, 0.08)", margin: "4px 0" }} />

      {/* Translucency & Blur Appearance */}
      <div>
        <h4 style={{ margin: "0 0 12px 0", "font-size": "14px", "font-weight": 600 }}>
          Plugin Appearance & Blur
        </h4>
        <div style={{ display: "flex", "flex-direction": "column", gap: "16px", "max-width": "400px" }}>
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
              onInput={(e) => props.onPluginSettingsChange({ surfaceOpacity: parseFloat(e.currentTarget.value) })}
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
              onInput={(e) => props.onPluginSettingsChange({ surfaceBlur: parseInt(e.currentTarget.value, 10) })}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
