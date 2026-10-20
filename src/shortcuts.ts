import { ShortcutActionId, CustomShortcuts } from "./types";

export interface ShortcutMeta {
  id: ShortcutActionId;
  label: string;
  description: string;
  category: "Tabs" | "Navigation" | "View & Bookmarks";
  defaultShortcut: string;
  secondaryDefaults?: string[];
}

export const SHORTCUT_STORAGE_KEY = "flurer_web_loader_shortcuts";

export const DEFAULT_SHORTCUTS: Record<ShortcutActionId, string> = {
  newTab: "Ctrl+T",
  closeTab: "Ctrl+W",
  nextTab: "Ctrl+Tab",
  prevTab: "Ctrl+Shift+Tab",
  newWorkspace: "Ctrl+Shift+G",
  toggleCompact: "Ctrl+Shift+C",
  focusOmnibox: "Ctrl+L",
  reload: "Ctrl+R",
  quickSwitcher: "Ctrl+P",
  orbitDeck: "Ctrl+E",
  zoomIn: "Ctrl+=",
  zoomOut: "Ctrl+-",
  resetZoom: "Ctrl+0",
  toggleBookmark: "Ctrl+D",
};

export const SHORTCUT_METADATA: ShortcutMeta[] = [
  {
    id: "newTab",
    label: "New Tab",
    description: "Open a new blank tab and auto-focus omnibox",
    category: "Tabs",
    defaultShortcut: "Ctrl+T",
  },
  {
    id: "closeTab",
    label: "Close Tab",
    description: "Close the currently active tab",
    category: "Tabs",
    defaultShortcut: "Ctrl+W",
  },
  {
    id: "nextTab",
    label: "Next Tab",
    description: "Switch to next tab in the current group",
    category: "Tabs",
    defaultShortcut: "Ctrl+Tab",
  },
  {
    id: "prevTab",
    label: "Previous Tab",
    description: "Switch to previous tab in the current group",
    category: "Tabs",
    defaultShortcut: "Ctrl+Shift+Tab",
  },
  {
    id: "newWorkspace",
    label: "New Group / Workspace",
    description: "Create and switch to a new tab group",
    category: "Tabs",
    defaultShortcut: "Ctrl+Shift+G",
  },
  {
    id: "toggleCompact",
    label: "Toggle Compact Tabs",
    description: "Toggle icon-only compact tab bar layout",
    category: "Tabs",
    defaultShortcut: "Ctrl+Shift+C",
  },
  {
    id: "focusOmnibox",
    label: "Focus Address Bar",
    description: "Focus search bar to enter URL or query",
    category: "Navigation",
    defaultShortcut: "Ctrl+L",
    secondaryDefaults: ["Alt+D"],
  },
  {
    id: "reload",
    label: "Reload Page",
    description: "Refresh the currently active web page",
    category: "Navigation",
    defaultShortcut: "Ctrl+R",
    secondaryDefaults: ["F5"],
  },
  {
    id: "quickSwitcher",
    label: "Quick Tab Switcher",
    description: "Open floating tab search and jump palette",
    category: "Navigation",
    defaultShortcut: "Ctrl+P",
    secondaryDefaults: ["Ctrl+O", "Ctrl+Shift+A"],
  },
  {
    id: "orbitDeck",
    label: "Orbit Canvas Deck",
    description: "Toggle spatial workspace orbit overview",
    category: "Navigation",
    defaultShortcut: "Ctrl+E",
    secondaryDefaults: ["Ctrl+K"],
  },
  {
    id: "zoomIn",
    label: "Zoom In",
    description: "Increase webpage viewport scale (+10%)",
    category: "View & Bookmarks",
    defaultShortcut: "Ctrl+=",
    secondaryDefaults: ["Ctrl++"],
  },
  {
    id: "zoomOut",
    label: "Zoom Out",
    description: "Decrease webpage viewport scale (-10%)",
    category: "View & Bookmarks",
    defaultShortcut: "Ctrl+-",
  },
  {
    id: "resetZoom",
    label: "Reset Zoom",
    description: "Reset webpage viewport scale to 100%",
    category: "View & Bookmarks",
    defaultShortcut: "Ctrl+0",
  },
  {
    id: "toggleBookmark",
    label: "Toggle Bookmark",
    description: "Add or remove current page from bookmarks",
    category: "View & Bookmarks",
    defaultShortcut: "Ctrl+D",
  },
];

export function getSavedShortcuts(): CustomShortcuts {
  try {
    const raw = localStorage.getItem(SHORTCUT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveShortcuts(shortcuts: CustomShortcuts): void {
  try {
    localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(shortcuts));
  } catch {}
}

export function getEffectiveShortcuts(custom?: CustomShortcuts): Record<ShortcutActionId, string> {
  const saved = getSavedShortcuts();
  return {
    ...DEFAULT_SHORTCUTS,
    ...saved,
    ...(custom || {}),
  };
}

export function parseShortcut(str: string): {
  modRequired: boolean;
  shiftRequired: boolean;
  altRequired: boolean;
  key: string;
} {
  const parts = str.split("+").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const hasCtrl = parts.includes("ctrl") || parts.includes("control");
  const hasCmd = parts.includes("cmd") || parts.includes("meta") || parts.includes("command");
  const modRequired = hasCtrl || hasCmd;
  const shiftRequired = parts.includes("shift");
  const altRequired = parts.includes("alt") || parts.includes("option");

  const nonMod = parts.filter(
    (p) => !["ctrl", "control", "cmd", "meta", "command", "shift", "alt", "option"].includes(p)
  );

  return {
    modRequired,
    shiftRequired,
    altRequired,
    key: nonMod.join("+"),
  };
}

export function normalizeShortcutString(str: string): string {
  const { modRequired, shiftRequired, altRequired, key } = parseShortcut(str);
  const parts: string[] = [];
  if (modRequired) parts.push("Ctrl");
  if (altRequired) parts.push("Alt");
  if (shiftRequired) parts.push("Shift");
  if (key) {
    if (/^f\d+$/i.test(key)) {
      parts.push(key.toUpperCase());
    } else if (key.length === 1) {
      parts.push(key.toUpperCase());
    } else {
      parts.push(key.charAt(0).toUpperCase() + key.slice(1));
    }
  }
  return parts.join("+");
}

export function matchesShortcut(
  shortcutStr: string,
  k: string,
  code: string,
  isMod: boolean,
  isShift: boolean,
  isAlt: boolean
): boolean {
  if (!shortcutStr) return false;
  const parsed = parseShortcut(shortcutStr);
  if (!parsed.key) return false;

  if (isMod !== parsed.modRequired) return false;
  if (isAlt !== parsed.altRequired) return false;

  const targetKey = parsed.key.toLowerCase();
  const eventKey = (k || "").toLowerCase();
  const eventCode = (code || "").toLowerCase();

  // Shift matching:
  // If targetKey is '=' or '+', shift might or might not be pressed depending on keyboard layout
  if (targetKey === "=" || targetKey === "+") {
    // Tolerant shift for + / =
  } else if (isShift !== parsed.shiftRequired) {
    return false;
  }

  // Exact key match
  if (eventKey === targetKey) return true;

  // Code match (e.g. "KeyT", "Digit1", "NumpadAdd")
  if (eventCode === `key${targetKey}`) return true;
  if (eventCode === `digit${targetKey}`) return true;
  if (eventCode === `numpad${targetKey}`) return true;
  if (eventCode === targetKey) return true;

  // Specific symbol key/code variants
  if ((targetKey === "=" || targetKey === "+") && (eventCode === "equal" || eventCode === "numpadadd")) return true;
  if (targetKey === "-" && (eventCode === "minus" || eventCode === "numpadsubtract")) return true;
  if (targetKey === "0" && (eventCode === "digit0" || eventCode === "numpad0")) return true;
  if (targetKey === "tab" && eventCode === "tab") return true;

  return false;
}

export function matchesAction(
  actionId: ShortcutActionId,
  effectiveShortcuts: Record<ShortcutActionId, string>,
  key: string,
  code: string,
  isMod: boolean,
  isShift: boolean,
  isAlt: boolean
): boolean {
  const primary = effectiveShortcuts[actionId];
  if (primary && matchesShortcut(primary, key, code, isMod, isShift, isAlt)) {
    return true;
  }

  // Check secondary defaults (if not reassigned to another action)
  const meta = SHORTCUT_METADATA.find((m) => m.id === actionId);
  if (meta?.secondaryDefaults) {
    for (const sec of meta.secondaryDefaults) {
      const assignedToOther = Object.entries(effectiveShortcuts).some(
        ([id, sc]) => id !== actionId && normalizeShortcutString(sc).toLowerCase() === normalizeShortcutString(sec).toLowerCase()
      );
      if (!assignedToOther && matchesShortcut(sec, key, code, isMod, isShift, isAlt)) {
        return true;
      }
    }
  }

  return false;
}

export function eventToShortcutString(e: KeyboardEvent): string | null {
  const isMod = e.ctrlKey || e.metaKey;
  const isAlt = e.altKey;
  const isShift = e.shiftKey;
  const key = e.key;

  // Ignore if only a modifier key is pressed
  if (["Control", "Shift", "Alt", "Meta"].includes(key)) {
    return null;
  }

  // Require a modifier or a Function key / navigation key
  const isFunctionKey = /^F\d+$/i.test(key);
  if (!isMod && !isAlt && !isFunctionKey) {
    return null;
  }

  const parts: string[] = [];
  if (isMod) parts.push("Ctrl");
  if (isAlt) parts.push("Alt");
  if (isShift) parts.push("Shift");

  if (isFunctionKey) {
    parts.push(key.toUpperCase());
  } else if (key === " ") {
    parts.push("Space");
  } else if (key === "Tab") {
    parts.push("Tab");
  } else if (key === "Enter") {
    parts.push("Enter");
  } else if (key === "Escape") {
    parts.push("Escape");
  } else if (e.code.startsWith("Key")) {
    parts.push(e.code.replace("Key", "").toUpperCase());
  } else if (e.code.startsWith("Digit")) {
    parts.push(e.code.replace("Digit", ""));
  } else if (e.code === "Equal" || e.code === "NumpadAdd") {
    parts.push("=");
  } else if (e.code === "Minus" || e.code === "NumpadSubtract") {
    parts.push("-");
  } else if (key.length === 1) {
    parts.push(key.toUpperCase());
  } else {
    parts.push(key.charAt(0).toUpperCase() + key.slice(1));
  }

  return parts.join("+");
}

export function findShortcutConflict(
  actionId: ShortcutActionId,
  shortcut: string,
  allShortcuts: Record<ShortcutActionId, string>
): ShortcutMeta | null {
  const normalized = normalizeShortcutString(shortcut).toLowerCase();
  for (const [id, sc] of Object.entries(allShortcuts)) {
    if (id !== actionId && normalizeShortcutString(sc).toLowerCase() === normalized) {
      return SHORTCUT_METADATA.find((m) => m.id === id) || null;
    }
  }
  return null;
}

export function formatShortcutParts(shortcutStr: string): string[] {
  return shortcutStr.split("+").map((s) => s.trim()).filter(Boolean);
}
