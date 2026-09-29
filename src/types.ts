export type SearchEngine = "duckduckgo" | "google" | "bing" | "brave";

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  zoom: number;
  mode: "embedded" | "webviewwindow";
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: "dev" | "docs" | "ai" | "custom";
  icon?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

export interface WebPluginSettings {
  searchEngine?: SearchEngine;
  homeUrl?: string;
  defaultMode?: "embedded" | "webviewwindow";
  persistTabs?: boolean;
  savedTabs?: { title: string; url: string }[];
  savedActiveTabUrl?: string;
  bookmarks?: Bookmark[];
  surfaceOpacity?: number;
  surfaceBlur?: number;
  customUserAgent?: string;
  persistLogin?: boolean;
  incognitoMode?: boolean;
  singleWindowPerDomain?: boolean;
  strictUrlSanitization?: boolean;
}

export interface MainPanelProps {
  currentPath: string;
  navigateTo: (path: string) => void;
  searchQuery: string;
  focusPath: any;
  active: boolean;
  dataBgLightness: string;
  settingsLoaded: boolean;
  baseSurfaceOpacity: number;
  baseSurfaceBlur: number;
  pluginSettings: WebPluginSettings;
  onPluginSettingsChange: (patch: Partial<WebPluginSettings>) => void;
}

export interface SettingsPanelProps {
  dataBgLightness: string;
  pluginSettings: WebPluginSettings;
  onPluginSettingsChange: (patch: Partial<WebPluginSettings>) => void;
}
