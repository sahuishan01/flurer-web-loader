export type SearchEngine = "duckduckgo" | "google" | "bing" | "brave";

export type TabIntent = "dev" | "docs" | "ai" | "research" | "leisure" | "general";

export interface ProjectWorkspace {
  id: string;
  name: string;
  color: string;
  icon?: string;
  keywords?: string[];
  description?: string;
}

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

  // Context Orbit (The Third Design) metadata:
  projectId?: string;
  intent?: TabIntent;
  parentId?: string; // Lineage: ID of tab from which this was opened
  parentTitle?: string;
  lineageDepth?: number;
  tags?: string[];
  pinned?: boolean;
  position?: { x: number; y: number }; // Spatial canvas coordinates
  createdAt?: number;
  lastActiveAt?: number;
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

export type NavDesignMode = "context-orbit" | "standard-tabs";
export type OrbitLayoutMode = "matrix" | "spatial";

export interface SmartRouterConfig {
  enabled: boolean;
  provider: "heuristic" | "laya-local" | "custom-endpoint";
  localEndpointUrl?: string; // e.g. "http://127.0.0.1:11434"
  modelName?: string; // e.g. "laya-router", "llama3.2:1b"
  autoCreateCategories: boolean;
  isModelDownloaded?: boolean;
}

export interface SavedTabRecord {
  title: string;
  url: string;
  projectId?: string;
  intent?: TabIntent;
  parentId?: string;
  parentTitle?: string;
  pinned?: boolean;
  position?: { x: number; y: number };
}

export interface WebPluginSettings {
  searchEngine?: SearchEngine;
  homeUrl?: string;
  defaultMode?: "embedded" | "webviewwindow";
  dockedChildWebview?: boolean;
  persistTabs?: boolean;
  savedTabs?: SavedTabRecord[];
  savedActiveTabUrl?: string;
  bookmarks?: Bookmark[];
  surfaceOpacity?: number;
  surfaceBlur?: number;
  customUserAgent?: string;
  persistLogin?: boolean;
  incognitoMode?: boolean;
  singleWindowPerDomain?: boolean;
  strictUrlSanitization?: boolean;

  // Third Design Customization Settings:
  designMode?: NavDesignMode;
  orbitDeckLayout?: OrbitLayoutMode;
  workspaces?: ProjectWorkspace[];
  smartRouter?: SmartRouterConfig;
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
