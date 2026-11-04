import { createSignal, createRoot } from "solid-js";

export type ThemeMode = "auto" | "preset" | "custom";

export type PresetThemeId =
  | "auto"
  | "grounded-warmth"
  | "deep-space"
  | "minimal-dark"
  | "midnight-oled"
  | "tokyo-night"
  | "nordic-frost"
  | "paper-light";

export interface ThemeColors {
  panelRgb: string;
  panelBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  inputBg: string;
  accent: string;
  accentRgb: string;
  cardBg: string;
  cardBorder: string;
}

export interface PresetDef {
  id: PresetThemeId;
  name: string;
  description: string;
  colors: ThemeColors;
}

export interface ThemeConfig {
  mode: ThemeMode;
  preset: PresetThemeId;
  customColors?: Partial<ThemeColors>;
  surfaceOpacity?: number;
  surfaceBlur?: number;
}

export const PRESET_THEMES: Record<Exclude<PresetThemeId, "auto">, PresetDef> = {
  "grounded-warmth": {
    id: "grounded-warmth",
    name: "Grounded Warmth",
    description: "Matte cool charcoal with warm amber accents",
    colors: {
      panelRgb: "26, 29, 36",
      panelBg: "#1a1d24",
      textPrimary: "#fef3c7",
      textSecondary: "#d1d5db",
      textMuted: "#9ca3af",
      border: "rgba(245, 158, 11, 0.2)",
      inputBg: "rgba(0, 0, 0, 0.35)",
      accent: "#f59e0b",
      accentRgb: "245, 158, 11",
      cardBg: "rgba(26, 29, 36, 0.65)",
      cardBorder: "rgba(245, 158, 11, 0.15)",
    },
  },
  "deep-space": {
    id: "deep-space",
    name: "Deep Space Cyber",
    description: "Obsidian slate with vibrant electric cyan",
    colors: {
      panelRgb: "8, 13, 26",
      panelBg: "#080d1a",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      border: "rgba(0, 240, 255, 0.2)",
      inputBg: "rgba(0, 0, 0, 0.4)",
      accent: "#00f0ff",
      accentRgb: "0, 240, 255",
      cardBg: "rgba(15, 23, 42, 0.6)",
      cardBorder: "rgba(0, 240, 255, 0.15)",
    },
  },
  "minimal-dark": {
    id: "minimal-dark",
    name: "Minimal Slate",
    description: "Clean monochrome slate chrome with subtle contrast",
    colors: {
      panelRgb: "15, 23, 42",
      panelBg: "#0f172a",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      border: "rgba(255, 255, 255, 0.1)",
      inputBg: "rgba(0, 0, 0, 0.3)",
      accent: "#38bdf8",
      accentRgb: "56, 189, 248",
      cardBg: "rgba(255, 255, 255, 0.04)",
      cardBorder: "rgba(255, 255, 255, 0.08)",
    },
  },
  "midnight-oled": {
    id: "midnight-oled",
    name: "Midnight OLED",
    description: "Pure true black contrast with bright white chrome",
    colors: {
      panelRgb: "0, 0, 0",
      panelBg: "#000000",
      textPrimary: "#ffffff",
      textSecondary: "#a1a1aa",
      textMuted: "#71717a",
      border: "rgba(255, 255, 255, 0.18)",
      inputBg: "#0a0a0a",
      accent: "#ffffff",
      accentRgb: "255, 255, 255",
      cardBg: "rgba(20, 20, 20, 0.75)",
      cardBorder: "rgba(255, 255, 255, 0.14)",
    },
  },
  "tokyo-night": {
    id: "tokyo-night",
    name: "Tokyo Night",
    description: "Deep indigo dusk with soft lavender and blue tones",
    colors: {
      panelRgb: "26, 27, 38",
      panelBg: "#1a1b26",
      textPrimary: "#c0caf5",
      textSecondary: "#9aa5ce",
      textMuted: "#565f89",
      border: "rgba(122, 162, 247, 0.2)",
      inputBg: "rgba(0, 0, 0, 0.35)",
      accent: "#7aa2f7",
      accentRgb: "122, 162, 247",
      cardBg: "rgba(36, 40, 59, 0.6)",
      cardBorder: "rgba(122, 162, 247, 0.15)",
    },
  },
  "nordic-frost": {
    id: "nordic-frost",
    name: "Nordic Frost",
    description: "Polar night slate with icy arctic cyan highlights",
    colors: {
      panelRgb: "46, 52, 64",
      panelBg: "#2e3440",
      textPrimary: "#eceff4",
      textSecondary: "#d8dee9",
      textMuted: "#4c566a",
      border: "rgba(136, 192, 208, 0.2)",
      inputBg: "rgba(0, 0, 0, 0.3)",
      accent: "#88c0d0",
      accentRgb: "136, 192, 208",
      cardBg: "rgba(59, 66, 82, 0.6)",
      cardBorder: "rgba(136, 192, 208, 0.15)",
    },
  },
  "paper-light": {
    id: "paper-light",
    name: "Paper Sepia",
    description: "Warm off-white paper with terracotta ink and sepia accents",
    colors: {
      panelRgb: "250, 246, 238",
      panelBg: "#faf6ee",
      textPrimary: "#3b2f22",
      textSecondary: "#6f5d47",
      textMuted: "#8a7a68",
      border: "rgba(176, 90, 26, 0.2)",
      inputBg: "rgba(255, 255, 255, 0.8)",
      accent: "#b05a1a",
      accentRgb: "176, 90, 26",
      cardBg: "rgba(255, 255, 255, 0.7)",
      cardBorder: "rgba(176, 90, 26, 0.25)",
    },
  },
};

const THEME_STORAGE_KEY = "flurer-web-loader-theme-config";

function getSavedThemeConfig(): ThemeConfig {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          mode: parsed.mode || "auto",
          preset: parsed.preset || "auto",
          customColors: parsed.customColors || {},
          surfaceOpacity: parsed.surfaceOpacity,
          surfaceBlur: parsed.surfaceBlur,
        };
      }
    }
  } catch {}
  return {
    mode: "auto",
    preset: "auto",
    customColors: {},
  };
}

export function saveThemeConfig(config: ThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export const [themeConfig, setThemeConfig] = createRoot(() =>
  createSignal<ThemeConfig>(getSavedThemeConfig())
);

export function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return "56, 189, 248";
}

export function getEffectiveThemeStyles(
  config: ThemeConfig = themeConfig(),
  dataBgLightness: string = "dark",
  baseOpacity: number = 0.75,
  baseBlur: number = 12
): Record<string, string> {
  const opacity = config.surfaceOpacity ?? baseOpacity;
  const blur = config.surfaceBlur ?? baseBlur;

  if (config.mode === "auto") {
    // Mode: Auto (Inherits Flurer's native CSS custom properties directly from the document cascade)
    // Avoid setting overriding color variables inline so Flurer's active theme (Light, Dark, Midnight, Ocean, Nord, Paper)
    // applies automatically to all text, borders, accents, and surfaces.
    const styles: Record<string, string> = {};
    if (config.surfaceOpacity !== undefined) {
      styles["--plugin-surface-opacity"] = `${opacity}`;
    }
    if (config.surfaceBlur !== undefined) {
      styles["--surface-blur"] = `${blur}px`;
    }
    return styles;
  }

  if (config.mode === "preset" && config.preset !== "auto") {
    const preset = PRESET_THEMES[config.preset] || PRESET_THEMES["minimal-dark"];
    const c = preset.colors;
    return {
      "--panel-rgb": c.panelRgb,
      "--panel-bg": c.panelBg,
      "--popover-bg": `rgba(${c.panelRgb}, 0.95)`,
      "--text-primary": c.textPrimary,
      "--text-secondary": c.textSecondary,
      "--text-muted": c.textMuted,
      "--border-color": c.border,
      "--border-strong": `rgba(${c.accentRgb}, 0.35)`,
      "--hover-bg": `rgba(${c.accentRgb}, 0.12)`,
      "--input-bg": c.inputBg,
      "--accent-default": c.accent,
      "--accent-rgb": c.accentRgb,
      "--card-bg": c.cardBg,
      "--card-border": c.cardBorder,
      "--surface-blur": `${blur}px`,
      "--plugin-surface-opacity": `${opacity}`,
    };
  }

  // Mode: Custom
  const basePreset = PRESET_THEMES["deep-space"].colors;
  const custom = config.customColors || {};
  const accent = custom.accent || basePreset.accent;
  const accentRgb = custom.accentRgb || hexToRgb(accent);
  const panelRgb = custom.panelRgb || basePreset.panelRgb;

  return {
    "--panel-rgb": panelRgb,
    "--panel-bg": custom.panelBg || `rgba(${panelRgb}, 0.9)`,
    "--popover-bg": `rgba(${panelRgb}, 0.95)`,
    "--text-primary": custom.textPrimary || basePreset.textPrimary,
    "--text-secondary": custom.textSecondary || basePreset.textSecondary,
    "--text-muted": custom.textMuted || basePreset.textMuted,
    "--border-color": custom.border || `rgba(${accentRgb}, 0.25)`,
    "--border-strong": `rgba(${accentRgb}, 0.35)`,
    "--hover-bg": `rgba(${accentRgb}, 0.12)`,
    "--input-bg": custom.inputBg || basePreset.inputBg,
    "--accent-default": accent,
    "--accent-rgb": accentRgb,
    "--card-bg": custom.cardBg || `rgba(${panelRgb}, 0.65)`,
    "--card-border": custom.cardBorder || `rgba(${accentRgb}, 0.18)`,
    "--surface-blur": `${blur}px`,
    "--plugin-surface-opacity": `${opacity}`,
  };
}
