import { For, Show, createSignal, createEffect, onMount, onCleanup } from "solid-js";
import {
  Tab,
  ProjectWorkspace,
  TabIntent,
  OrbitLayoutMode,
  SmartRouterConfig,
} from "../types";
import { S } from "../styles";
import {
  OrbitIcon,
  MatrixIcon,
  CloseIcon,
  PlusIcon,
  GlobeIcon,
  PopoutIcon,
  ExternalIcon,
  BranchIcon,
  SparklesIcon,
  PinIcon,
  GripIcon,
  LayersIcon,
} from "../icons";
import { getDomain, getModifierKey } from "../utils";
import {
  INTENT_COLORS,
  INTENT_LABELS,
  classifyHeuristic,
  routeTabViaLaya,
} from "../smartRouter";

interface ContextOrbitDeckProps {
  tabs: Tab[];
  activeTabId: string;
  workspaces: ProjectWorkspace[];
  currentWorkspace: ProjectWorkspace;
  layoutMode: OrbitLayoutMode;
  smartRouterConfig?: SmartRouterConfig;
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string, parentId?: string, projectId?: string) => void;
  onPopoutTab: (url: string, title?: string) => void;
  onOpenExternal: (url: string) => void;
  onSwitchWorkspace: (workspaceId: string) => void;
  onAddWorkspace: (name: string, color: string, keywords: string[]) => void;
  onUpdateTabProject: (tabId: string, projectId: string) => void;
  onUpdateTabPosition: (tabId: string, x: number, y: number) => void;
  onToggleLayoutMode: (mode: OrbitLayoutMode) => void;
  onUpdateSmartRouter: (patch: Partial<SmartRouterConfig>) => void;
}

export function ContextOrbitDeck(props: ContextOrbitDeckProps) {
  const mod = getModifierKey();
  const [filterQuery, setFilterQuery] = createSignal("");
  const [selectedIntentFilter, setSelectedIntentFilter] = createSignal<string>("all");
  const [showNewWsModal, setShowNewWsModal] = createSignal(false);
  const [newWsName, setNewWsName] = createSignal("");
  const [newWsColor, setNewWsColor] = createSignal("#38bdf8");
  const [newWsKeywords, setNewWsKeywords] = createSignal("");

  const [showRouterDrawer, setShowRouterDrawer] = createSignal(false);
  const [testUrlInput, setTestUrlInput] = createSignal("https://docs.rs/tauri");
  const [testRouteResult, setTestRouteResult] = createSignal<string | null>(null);
  const [isTestingRoute, setIsTestingRoute] = createSignal(false);

  // Dragging state for Spatial Canvas
  const [draggingTabId, setDraggingTabId] = createSignal<string | null>(null);
  const [dragOffset, setDragOffset] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasPan, setCanvasPan] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasZoom, setCanvasZoom] = createSignal(1.0);
  const [isPanningCanvas, setIsPanningCanvas] = createSignal(false);
  const [panStart, setPanStart] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });

  // Escape key handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.isOpen) {
      props.onClose();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  // Filtered tabs
  const filteredTabs = () => {
    const q = filterQuery().toLowerCase().trim();
    const intent = selectedIntentFilter();
    return props.tabs.filter((t) => {
      const matchesQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.url.toLowerCase().includes(q) ||
        getDomain(t.url).toLowerCase().includes(q) ||
        (t.intent && t.intent.toLowerCase().includes(q));

      const matchesIntent = intent === "all" || t.intent === intent;
      return matchesQ && matchesIntent;
    });
  };

  // Group tabs by Workspace
  const tabsByWorkspace = () => {
    const grouped = new Map<string, Tab[]>();
    for (const ws of props.workspaces) {
      grouped.set(ws.id, []);
    }
    grouped.set("general", grouped.get("general") || []);

    for (const t of filteredTabs()) {
      const wsId = t.projectId || "general";
      if (!grouped.has(wsId)) {
        grouped.set(wsId, []);
      }
      grouped.get(wsId)!.push(t);
    }
    return grouped;
  };

  // Spatial node coordinates helper
  const getNodePos = (tab: Tab, index: number, total: number) => {
    if (tab.position && (tab.position.x !== 0 || tab.position.y !== 0)) {
      return tab.position;
    }
    // Default circular constellation layout by workspace
    const wsIdx = props.workspaces.findIndex((w) => w.id === (tab.projectId || "general"));
    const wsOffsetAngle = (Math.max(0, wsIdx) / Math.max(1, props.workspaces.length)) * Math.PI * 2;
    const radius = 260 + (index % 4) * 80;
    const tabAngle = wsOffsetAngle + ((index % 6) / 6) * (Math.PI / 1.5) - 0.5;
    return {
      x: 500 + Math.cos(tabAngle) * radius,
      y: 350 + Math.sin(tabAngle) * radius,
    };
  };

  // Canvas auto-cluster functions
  const handleClusterByProject = () => {
    const wsMap = tabsByWorkspace();
    let col = 0;
    wsMap.forEach((wTabs, wsId) => {
      if (wTabs.length === 0) return;
      const baseX = 120 + col * 280;
      wTabs.forEach((tab, row) => {
        const baseY = 140 + row * 130;
        props.onUpdateTabPosition(tab.id, baseX, baseY);
      });
      col++;
    });
  };

  const handleClusterByDomain = () => {
    const domainMap = new Map<string, Tab[]>();
    for (const tab of props.tabs) {
      const d = getDomain(tab.url);
      if (!domainMap.has(d)) domainMap.set(d, []);
      domainMap.get(d)!.push(tab);
    }
    let col = 0;
    domainMap.forEach((dTabs) => {
      const baseX = 120 + col * 280;
      dTabs.forEach((tab, row) => {
        const baseY = 140 + row * 130;
        props.onUpdateTabPosition(tab.id, baseX, baseY);
      });
      col++;
    });
  };

  const handleClusterByIntent = () => {
    const intents: TabIntent[] = ["dev", "docs", "ai", "research", "leisure", "general"];
    intents.forEach((intent, col) => {
      const matching = props.tabs.filter((t) => (t.intent || "general") === intent);
      const baseX = 120 + col * 280;
      matching.forEach((tab, row) => {
        const baseY = 140 + row * 130;
        props.onUpdateTabPosition(tab.id, baseX, baseY);
      });
    });
  };

  const handleFitToView = () => {
    setCanvasPan({ x: 0, y: 0 });
    setCanvasZoom(1.0);
  };

  // Dragging cards on Spatial Canvas
  const handleNodePointerDown = (tabId: string, e: PointerEvent) => {
    e.stopPropagation();
    const tab = props.tabs.find((t) => t.id === tabId);
    if (!tab) return;
    const currentPos = tab.position || { x: 300, y: 200 };
    setDraggingTabId(tabId);
    setDragOffset({
      x: e.clientX / canvasZoom() - currentPos.x,
      y: e.clientY / canvasZoom() - currentPos.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleNodePointerMove = (e: PointerEvent) => {
    const id = draggingTabId();
    if (!id) return;
    const newX = Math.round(e.clientX / canvasZoom() - dragOffset().x);
    const newY = Math.round(e.clientY / canvasZoom() - dragOffset().y);
    props.onUpdateTabPosition(id, newX, newY);
  };

  const handleNodePointerUp = (e: PointerEvent) => {
    if (draggingTabId()) {
      setDraggingTabId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Canvas Background Panning
  const handleCanvasPointerDown = (e: PointerEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains("spatial-bg")) return;
    setIsPanningCanvas(true);
    setPanStart({ x: e.clientX - canvasPan().x, y: e.clientY - canvasPan().y });
  };

  const handleCanvasPointerMove = (e: PointerEvent) => {
    if (draggingTabId()) {
      handleNodePointerMove(e);
      return;
    }
    if (!isPanningCanvas()) return;
    setCanvasPan({
      x: e.clientX - panStart().x,
      y: e.clientY - panStart().y,
    });
  };

  const handleCanvasPointerUp = (e: PointerEvent) => {
    if (draggingTabId()) {
      handleNodePointerUp(e);
    }
    setIsPanningCanvas(false);
  };

  const handleTestRoute = async () => {
    setIsTestingRoute(true);
    setTestRouteResult(null);
    try {
      const decision = await routeTabViaLaya(
        testUrlInput(),
        getDomain(testUrlInput()),
        props.smartRouterConfig,
        props.workspaces
      );
      const ws = props.workspaces.find((w) => w.id === decision.projectId);
      setTestRouteResult(
        `Routed to Workspace [${ws?.name || decision.projectId}] with Intent [${INTENT_LABELS[decision.intent]}] via ${decision.engineUsed} (Confidence: ${Math.round(decision.confidence * 100)}%)`
      );
    } finally {
      setIsTestingRoute(false);
    }
  };

  const handleCreateWorkspace = (e: Event) => {
    e.preventDefault();
    if (!newWsName().trim()) return;
    const keywords = newWsKeywords()
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    props.onAddWorkspace(newWsName().trim(), newWsColor(), keywords);
    setNewWsName("");
    setNewWsKeywords("");
    setShowNewWsModal(false);
  };

  if (!props.isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        "z-index": 9999,
        background: "rgba(10, 15, 30, 0.88)",
        "backdrop-filter": "blur(24px)",
        "-webkit-backdrop-filter": "blur(24px)",
        display: "flex",
        "flex-direction": "column",
        color: "var(--text-primary, #f8fafc)",
        "user-select": "none",
        animation: "web-loader-card-enter 0.24s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Top Orbit Header Bar */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          padding: "12px 20px",
          border: "none",
          "border-bottom": "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(15, 23, 42, 0.7)",
          gap: "14px",
          "flex-shrink": 0,
        }}
      >
        {/* Left: Branding & Metrics */}
        <div style={{ display: "flex", "align-items": "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              "align-items": "center",
              gap: "8px",
              color: "var(--accent-default, #38bdf8)",
            }}
          >
            <OrbitIcon size={22} />
            <span
              style={{
                "font-size": "15px",
                "font-weight": 700,
                "font-family": "Space Mono, monospace",
                "letter-spacing": "0.05em",
                color: "#ffffff",
              }}
            >
              WORKSPACE ORBIT
            </span>
          </div>

          <div
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "4px 10px",
              "border-radius": "999px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              color: "var(--text-secondary, #94a3b8)",
            }}
          >
            <span>{props.workspaces.length} Workspaces</span>
            <span>•</span>
            <span style={{ color: "var(--accent-default, #38bdf8)" }}>{props.tabs.length} Tabs active</span>
          </div>
        </div>

        {/* Center: Search & Filter Omnibar */}
        <div style={{ display: "flex", "align-items": "center", gap: "8px", flex: "1 1 380px", "max-width": "500px" }}>
          <div
            style={{
              display: "flex",
              "align-items": "center",
              gap: "8px",
              padding: "6px 12px",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              "border-radius": "8px",
              width: "100%",
            }}
          >
            <span style={{ color: "var(--text-muted, #94a3b8)", "font-size": "13px" }}>🔍</span>
            <input
              type="text"
              placeholder="Filter tabs, domains, intents (dev, docs, ai)..."
              value={filterQuery()}
              onInput={(e) => setFilterQuery(e.currentTarget.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary, #f8fafc)",
                "font-size": "12px",
                width: "100%",
                "font-family": "system-ui, sans-serif",
              }}
            />
            {filterQuery() && (
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "0 2px",
                }}
                onClick={() => setFilterQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: View Mode Toggle ("both"), Smart Router Status, and Close */}
        <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
          {/* Layout Mode Switcher ("both") */}
          <div
            style={{
              display: "inline-flex",
              padding: "2px",
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "border-radius": "8px",
            }}
          >
            <button
              type="button"
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "6px",
                padding: "5px 10px",
                "border-radius": "6px",
                border: "none",
                background:
                  props.layoutMode === "matrix"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
                color:
                  props.layoutMode === "matrix"
                    ? "var(--accent-default, #38bdf8)"
                    : "var(--text-muted, #94a3b8)",
                "font-size": "11px",
                "font-family": "Space Mono, monospace",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() => props.onToggleLayoutMode("matrix")}
              title="Structured Cluster Matrix View"
            >
              <MatrixIcon size={14} />
              <span>Matrix</span>
            </button>

            <button
              type="button"
              style={{
                display: "inline-flex",
                "align-items": "center",
                gap: "6px",
                padding: "5px 10px",
                "border-radius": "6px",
                border: "none",
                background:
                  props.layoutMode === "spatial"
                    ? "rgba(56, 189, 248, 0.2)"
                    : "transparent",
                color:
                  props.layoutMode === "spatial"
                    ? "var(--accent-default, #38bdf8)"
                    : "var(--text-muted, #94a3b8)",
                "font-size": "11px",
                "font-family": "Space Mono, monospace",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() => props.onToggleLayoutMode("spatial")}
              title="Interactive Spatial 2D Orbit Canvas View"
            >
              <OrbitIcon size={14} />
              <span>Spatial Orbit</span>
            </button>
          </div>

          {/* Smart Router Status Pill */}
          <button
            type="button"
            class="web-loader-action-btn"
            style={{
              display: "inline-flex",
              "align-items": "center",
              gap: "6px",
              padding: "5px 10px",
              "border-radius": "8px",
              background: "rgba(168, 85, 247, 0.12)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              color: "#a855f7",
              "font-size": "11px",
              "font-family": "Space Mono, monospace",
              cursor: "pointer",
            }}
            onClick={() => setShowRouterDrawer(!showRouterDrawer())}
            title="Configure Smart Router & Laya Local Model"
          >
            <SparklesIcon size={14} />
            <span>
              {props.smartRouterConfig?.provider === "laya-local"
                ? "Laya AI: Active"
                : "Smart Router"}
            </span>
          </button>

          {/* Close Deck Button */}
          <button
            type="button"
            class="icon-btn web-loader-icon-btn"
            style={{
              ...S.iconBtn,
              width: "32px",
              height: "32px",
              "border-radius": "8px",
              background: "rgba(255, 255, 255, 0.08)",
            }}
            onClick={props.onClose}
            title={`Close Orbit Deck (Esc / ${mod}+E)`}
          >
            <CloseIcon size={16} />
          </button>
        </div>
      </div>

      {/* Laya / Smart Router Config Drawer (Slide down) */}
      <Show when={showRouterDrawer()}>
        <div
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            "border-bottom": "1px solid rgba(168, 85, 247, 0.3)",
            padding: "12px 20px",
            display: "flex",
            "flex-direction": "column",
            gap: "10px",
            animation: "web-loader-card-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
            <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
              <SparklesIcon size={18} />
              <span style={{ "font-size": "13px", "font-weight": 600, color: "#a855f7", "font-family": "Space Mono, monospace" }}>
                LAYA ON-DEVICE ROUTER & CATEGORY ENGINE
              </span>
            </div>
            <button
              type="button"
              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              onClick={() => setShowRouterDrawer(false)}
            >
              ✕
            </button>
          </div>

          <p style={{ margin: 0, "font-size": "12px", color: "var(--text-secondary, #94a3b8)", "line-height": 1.5 }}>
            Laya routes new web pages automatically to the right workspace and intent (Dev, Docs, AI, Research, Leisure) or dynamically suggests new categories.
          </p>

          <div style={{ display: "flex", "align-items": "center", gap: "12px", "flex-wrap": "wrap" }}>
            {/* Engine Selector */}
            <label style={{ display: "flex", "align-items": "center", gap: "6px", "font-size": "12px" }}>
              <span style={{ "font-family": "Space Mono, monospace", color: "var(--text-muted, #94a3b8)" }}>Engine:</span>
              <select
                value={props.smartRouterConfig?.provider || "heuristic"}
                onChange={(e) =>
                  props.onUpdateSmartRouter({
                    provider: e.currentTarget.value as any,
                  })
                }
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#f8fafc",
                  padding: "4px 8px",
                  "border-radius": "6px",
                  "font-size": "12px",
                }}
              >
                <option value="heuristic">Zero-Latency Heuristic (Built-in, 0ms, Offline)</option>
                <option value="laya-local">On-Device Laya Model (Ollama / Local LLM at 127.0.0.1:11434)</option>
              </select>
            </label>

            {/* Test Route Bar */}
            <div style={{ display: "flex", "align-items": "center", gap: "6px", flex: "1 1 300px" }}>
              <input
                type="text"
                value={testUrlInput()}
                onInput={(e) => setTestUrlInput(e.currentTarget.value)}
                placeholder="Test URL or domain..."
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#f8fafc",
                  padding: "4px 8px",
                  "border-radius": "6px",
                  "font-size": "12px",
                  flex: "1 1 auto",
                }}
              />
              <button
                type="button"
                style={{
                  padding: "4px 10px",
                  "border-radius": "6px",
                  background: "rgba(168, 85, 247, 0.2)",
                  border: "1px solid rgba(168, 85, 247, 0.4)",
                  color: "#a855f7",
                  "font-size": "11px",
                  "font-family": "Space Mono, monospace",
                  cursor: "pointer",
                }}
                onClick={handleTestRoute}
                disabled={isTestingRoute()}
              >
                {isTestingRoute() ? "Routing..." : "Test Route"}
              </button>
            </div>
          </div>

          <Show when={testRouteResult()}>
            <div
              style={{
                padding: "6px 10px",
                "border-radius": "6px",
                background: "rgba(5, 255, 176, 0.1)",
                border: "1px solid rgba(5, 255, 176, 0.3)",
                color: "#05ffb0",
                "font-size": "11px",
                "font-family": "Space Mono, monospace",
              }}
            >
              ✓ {testRouteResult()}
            </div>
          </Show>
        </div>
      </Show>

      {/* Main Body: Mode 1: Structured Cluster Matrix */}
      <Show when={props.layoutMode === "matrix"}>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
            display: "flex",
            gap: "18px",
            "align-items": "flex-start",
          }}
        >
          <For each={props.workspaces}>
            {(ws) => {
              const wsTabs = () => tabsByWorkspace().get(ws.id) || [];
              return (
                <div
                  style={{
                    display: "flex",
                    "flex-direction": "column",
                    width: "320px",
                    "min-width": "300px",
                    "max-height": "100%",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: `1px solid rgba(255, 255, 255, 0.08)`,
                    "border-top": `3px solid ${ws.color}`,
                    "border-radius": "12px",
                    overflow: "hidden",
                    "box-shadow": "0 8px 24px rgba(0, 0, 0, 0.3)",
                    "flex-shrink": 0,
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const tabId = e.dataTransfer?.getData("text/plain");
                    if (tabId) {
                      props.onUpdateTabProject(tabId, ws.id);
                    }
                  }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      padding: "10px 14px",
                      background: "rgba(255, 255, 255, 0.03)",
                      "border-bottom": "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
                      <span style={{ color: ws.color, "font-size": "14px" }}>{ws.icon || "✦"}</span>
                      <span style={{ "font-size": "13px", "font-weight": 600, color: "var(--text-primary, #f8fafc)" }}>
                        {ws.name}
                      </span>
                      <span
                        style={{
                          "font-size": "10px",
                          "font-family": "Space Mono, monospace",
                          color: "var(--text-muted, #94a3b8)",
                          background: "rgba(0, 0, 0, 0.3)",
                          padding: "1px 6px",
                          "border-radius": "999px",
                        }}
                      >
                        {wsTabs().length}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="icon-btn web-loader-icon-btn"
                      style={{
                        ...S.iconBtn,
                        width: "26px",
                        height: "26px",
                        "min-width": "26px",
                        "min-height": "26px",
                        "border-radius": "6px",
                      }}
                      onClick={() => props.onNewTab("about:blank", undefined, ws.id)}
                      title={`Open new tab in ${ws.name}`}
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>

                  {/* Cards List in this Workspace */}
                  <div
                    style={{
                      display: "flex",
                      "flex-direction": "column",
                      gap: "8px",
                      padding: "10px",
                      overflow: "auto",
                      flex: 1,
                    }}
                  >
                    <Show
                      when={wsTabs().length > 0}
                      fallback={
                        <div
                          style={{
                            padding: "24px 12px",
                            "text-align": "center",
                            color: "var(--text-muted, #94a3b8)",
                            "font-size": "12px",
                            "font-style": "italic",
                          }}
                        >
                          Drag tabs here or click + to add
                        </div>
                      }
                    >
                      <For each={wsTabs()}>
                        {(tab) => {
                          const isActive = () => tab.id === props.activeTabId;
                          const intent = (): TabIntent => tab.intent || "general";
                          const badgeColor = () => INTENT_COLORS[intent()];

                          return (
                            <div
                              class="web-loader-card"
                              style={{
                                display: "flex",
                                "flex-direction": "column",
                                gap: "6px",
                                padding: "10px",
                                "border-radius": "8px",
                                background: isActive()
                                  ? "rgba(56, 189, 248, 0.16)"
                                  : "rgba(255, 255, 255, 0.05)",
                                border: isActive()
                                  ? "1px solid rgba(56, 189, 248, 0.5)"
                                  : "1px solid rgba(255, 255, 255, 0.08)",
                                "box-shadow": isActive()
                                  ? "0 0 16px rgba(56, 189, 248, 0.25)"
                                  : "none",
                                cursor: "pointer",
                                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                props.onSelectTab(tab.id);
                                props.onClose();
                              }}
                            >
                              {/* Card Header: Favicon + Domain + Intent Chip + Close */}
                              <div
                                style={{
                                  display: "flex",
                                  "align-items": "center",
                                  "justify-content": "space-between",
                                  gap: "6px",
                                }}
                              >
                                <div style={{ display: "flex", "align-items": "center", gap: "6px", "min-width": 0 }}>
                                  <GlobeIcon size={14} />
                                  <span
                                    style={{
                                      "font-size": "11px",
                                      "font-family": "Space Mono, monospace",
                                      color: "var(--text-secondary, #94a3b8)",
                                      overflow: "hidden",
                                      "text-overflow": "ellipsis",
                                      "white-space": "nowrap",
                                    }}
                                  >
                                    {getDomain(tab.url)}
                                  </span>
                                </div>

                                <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
                                  {/* Intent Pill */}
                                  <span
                                    style={{
                                      padding: "1px 6px",
                                      "border-radius": "4px",
                                      background: `rgba(${
                                        badgeColor() === "#05ffb0"
                                          ? "5, 255, 176"
                                          : badgeColor() === "#f59e0b"
                                          ? "245, 158, 11"
                                          : badgeColor() === "#a855f7"
                                          ? "168, 85, 247"
                                          : "56, 189, 248"
                                      }, 0.15)`,
                                      color: badgeColor(),
                                      "font-size": "9px",
                                      "font-family": "Space Mono, monospace",
                                      "font-weight": 600,
                                    }}
                                  >
                                    {intent().toUpperCase()}
                                  </span>

                                  {/* Close Tab */}
                                  <button
                                    type="button"
                                    class="icon-btn web-loader-icon-btn web-loader-tab-close"
                                    style={{
                                      ...S.tabCloseBtn,
                                      width: "18px",
                                      height: "18px",
                                      "min-width": "18px",
                                      "min-height": "18px",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      props.onCloseTab(tab.id);
                                    }}
                                    title="Close Tab"
                                  >
                                    <CloseIcon size={12} />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <div
                                style={{
                                  "font-size": "12px",
                                  "font-weight": isActive() ? 600 : 500,
                                  color: isActive() ? "#38bdf8" : "var(--text-primary, #f8fafc)",
                                  overflow: "hidden",
                                  "text-overflow": "ellipsis",
                                  display: "-webkit-box",
                                  "-webkit-line-clamp": 2,
                                  "-webkit-box-orient": "vertical",
                                  "line-height": 1.35,
                                }}
                              >
                                {tab.title || "New Tab"}
                              </div>

                              {/* Card Footer: Lineage & Action Buttons */}
                              <div
                                style={{
                                  display: "flex",
                                  "align-items": "center",
                                  "justify-content": "space-between",
                                  gap: "6px",
                                  "margin-top": "2px",
                                }}
                              >
                                {/* Lineage breadcrumb if child */}
                                <Show
                                  when={tab.parentTitle}
                                  fallback={
                                    <span style={{ "font-size": "10px", color: "var(--text-muted, #94a3b8)" }}>
                                      {isActive() ? "● ACTIVE FOCUS" : ""}
                                    </span>
                                  }
                                >
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      "align-items": "center",
                                      gap: "3px",
                                      "font-size": "10px",
                                      "font-family": "Space Mono, monospace",
                                      color: "#00f0ff",
                                      overflow: "hidden",
                                      "text-overflow": "ellipsis",
                                      "white-space": "nowrap",
                                      "max-width": "160px",
                                    }}
                                    title={`Opened from: ${tab.parentTitle}`}
                                  >
                                    <BranchIcon size={10} />
                                    ↳ {tab.parentTitle}
                                  </span>
                                </Show>

                                <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
                                  {/* Popout button */}
                                  <button
                                    type="button"
                                    class="icon-btn web-loader-icon-btn"
                                    style={{
                                      ...S.iconBtn,
                                      width: "22px",
                                      height: "22px",
                                      "min-width": "22px",
                                      "min-height": "22px",
                                      border: "none",
                                      background: "transparent",
                                      color: "var(--text-muted, #94a3b8)",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      props.onPopoutTab(tab.url, tab.title);
                                    }}
                                    title="Open in Native WebviewWindow"
                                  >
                                    <PopoutIcon size={12} />
                                  </button>

                                  {/* Open in external browser */}
                                  <button
                                    type="button"
                                    class="icon-btn web-loader-icon-btn"
                                    style={{
                                      ...S.iconBtn,
                                      width: "22px",
                                      height: "22px",
                                      "min-width": "22px",
                                      "min-height": "22px",
                                      border: "none",
                                      background: "transparent",
                                      color: "var(--text-muted, #94a3b8)",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      props.onOpenExternal(tab.url);
                                    }}
                                    title="Open in System Browser"
                                  >
                                    <ExternalIcon size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </For>
                    </Show>
                  </div>
                </div>
              );
            }}
          </For>

          {/* Add Workspace Action Card */}
          <div
            style={{
              width: "260px",
              "min-width": "260px",
              padding: "20px",
              "border-radius": "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px dashed rgba(255, 255, 255, 0.2)",
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "justify-content": "center",
              gap: "10px",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onClick={() => setShowNewWsModal(true)}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                "border-radius": "50%",
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
            >
              <PlusIcon size={20} />
            </div>
            <span style={{ "font-size": "13px", "font-weight": 600 }}>Create New Workspace</span>
            <span style={{ "font-size": "11px", color: "var(--text-muted, #94a3b8)", "text-align": "center" }}>
              Categorize tabs with custom keywords and color branding
            </span>
          </div>
        </div>
      </Show>

      {/* Main Body: Mode 2: Spatial 2D Orbit Canvas ("both") */}
      <Show when={props.layoutMode === "spatial"}>
        <div
          class="spatial-bg"
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            cursor: isPanningCanvas() ? "grabbing" : "grab",
            background: "radial-gradient(ellipse at 50% 50%, rgba(20, 30, 60, 0.4) 0%, rgba(10, 15, 30, 0.95) 100%)",
          }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
        >
          {/* Canvas Floating HUD Controls */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "16px",
              "z-index": 10,
              display: "flex",
              "align-items": "center",
              gap: "8px",
              padding: "6px 12px",
              background: "rgba(15, 23, 42, 0.8)",
              "backdrop-filter": "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              "border-radius": "10px",
              "box-shadow": "0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            <button
              type="button"
              class="web-loader-secondary-btn"
              style={{ padding: "4px 8px", "font-size": "11px", "border-radius": "6px", cursor: "pointer" }}
              onClick={handleClusterByProject}
              title="Auto-organize nodes grouped by Project Workspaces"
            >
              Cluster: Project
            </button>
            <button
              type="button"
              class="web-loader-secondary-btn"
              style={{ padding: "4px 8px", "font-size": "11px", "border-radius": "6px", cursor: "pointer" }}
              onClick={handleClusterByDomain}
              title="Auto-organize nodes grouped by Websites/Domains"
            >
              Cluster: Domain
            </button>
            <button
              type="button"
              class="web-loader-secondary-btn"
              style={{ padding: "4px 8px", "font-size": "11px", "border-radius": "6px", cursor: "pointer" }}
              onClick={handleClusterByIntent}
              title="Auto-organize nodes grouped by Intent (Dev, Docs, AI)"
            >
              Cluster: Intent
            </button>
            <div style={{ width: "1px", height: "16px", background: "rgba(255, 255, 255, 0.15)" }} />
            <button
              type="button"
              class="web-loader-secondary-btn"
              style={{ padding: "4px 8px", "font-size": "11px", "border-radius": "6px", cursor: "pointer" }}
              onClick={handleFitToView}
              title="Center and Reset Pan"
            >
              Fit View
            </button>
          </div>

          {/* SVG Connection Lines Layer (Lineage & Project Edges) */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              "pointer-events": "none",
              transform: `translate(${canvasPan().x}px, ${canvasPan().y}px) scale(${canvasZoom()})`,
              "transform-origin": "0 0",
            }}
          >
            <defs>
              <linearGradient id="lineageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#a855f7" stop-opacity="0.8" />
              </linearGradient>
            </defs>

            {/* Draw Lineage Lines between Parent and Child Tabs */}
            <For each={filteredTabs()}>
              {(childTab, idx) => {
                if (!childTab.parentId) return null;
                const parentTab = props.tabs.find((p) => p.id === childTab.parentId);
                if (!parentTab) return null;

                const parentPos = getNodePos(parentTab, 0, props.tabs.length);
                const childPos = getNodePos(childTab, idx(), props.tabs.length);

                const startX = parentPos.x + 120;
                const startY = parentPos.y + 40;
                const endX = childPos.x + 120;
                const endY = childPos.y + 40;

                const midX = (startX + endX) / 2;

                return (
                  <g>
                    <path
                      d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="url(#lineageGradient)"
                      stroke-width="2.5"
                      stroke-dasharray="4 4"
                      stroke-linecap="round"
                    />
                    <circle cx={endX} cy={endY} r="4" fill="#00f0ff" />
                  </g>
                );
              }}
            </For>
          </svg>

          {/* Canvas Nodes Layer (Draggable Cards) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transform: `translate(${canvasPan().x}px, ${canvasPan().y}px) scale(${canvasZoom()})`,
              "transform-origin": "0 0",
            }}
          >
            <For each={filteredTabs()}>
              {(tab, idx) => {
                const pos = () => getNodePos(tab, idx(), props.tabs.length);
                const isActive = () => tab.id === props.activeTabId;
                const ws = () => props.workspaces.find((w) => w.id === (tab.projectId || "general"));
                const wsColor = () => ws()?.color || "#94a3b8";
                const intent = (): TabIntent => tab.intent || "general";
                const badgeColor = () => INTENT_COLORS[intent()];

                return (
                  <div
                    class="web-loader-card"
                    style={{
                      position: "absolute",
                      left: `${pos().x}px`,
                      top: `${pos().y}px`,
                      width: "240px",
                      background: isActive()
                        ? "rgba(15, 23, 42, 0.95)"
                        : "rgba(20, 28, 48, 0.88)",
                      "backdrop-filter": "blur(12px)",
                      border: isActive()
                        ? `2px solid ${wsColor()}`
                        : "1px solid rgba(255, 255, 255, 0.12)",
                      "border-left": `4px solid ${wsColor()}`,
                      "border-radius": "10px",
                      padding: "8px 10px",
                      "box-shadow": isActive()
                        ? `0 0 24px rgba(56, 189, 248, 0.35)`
                        : "0 6px 18px rgba(0, 0, 0, 0.3)",
                      cursor: "pointer",
                      "z-index": isActive() ? 5 : 2,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      props.onSelectTab(tab.id);
                      props.onClose();
                    }}
                  >
                    {/* Node Header */}
                    <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", gap: "6px" }}>
                      <div
                        style={{ display: "flex", "align-items": "center", gap: "6px", "min-width": 0, cursor: "grab" }}
                        onPointerDown={(e) => handleNodePointerDown(tab.id, e)}
                        title="Drag to reposition card on canvas"
                      >
                        <GripIcon size={12} />
                        <span
                          style={{
                            "font-size": "10px",
                            "font-family": "Space Mono, monospace",
                            color: wsColor(),
                            "font-weight": 600,
                          }}
                        >
                          {ws()?.name || "General"}
                        </span>
                      </div>

                      <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
                        <span
                          style={{
                            padding: "1px 5px",
                            "border-radius": "4px",
                            background: "rgba(255, 255, 255, 0.08)",
                            color: badgeColor(),
                            "font-size": "9px",
                            "font-family": "Space Mono, monospace",
                          }}
                        >
                          {intent().toUpperCase()}
                        </span>
                        <button
                          type="button"
                          class="icon-btn web-loader-icon-btn web-loader-tab-close"
                          style={{
                            ...S.tabCloseBtn,
                            width: "16px",
                            height: "16px",
                            "min-width": "16px",
                            "min-height": "16px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            props.onCloseTab(tab.id);
                          }}
                        >
                          <CloseIcon size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Node Title */}
                    <div
                      style={{
                        "font-size": "12px",
                        "font-weight": 600,
                        color: isActive() ? "#38bdf8" : "#f8fafc",
                        margin: "4px 0",
                        overflow: "hidden",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap",
                      }}
                    >
                      {tab.title || "New Tab"}
                    </div>

                    {/* Domain & Lineage indicator */}
                    <div
                      style={{
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "space-between",
                        "font-size": "10px",
                        color: "var(--text-muted, #94a3b8)",
                        "font-family": "Space Mono, monospace",
                      }}
                    >
                      <span>{getDomain(tab.url)}</span>
                      {tab.parentId && <span style={{ color: "#00f0ff" }}>↳ linked</span>}
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>

      {/* Modal: Create Workspace */}
      <Show when={showNewWsModal()}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            "z-index": 10000,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
          }}
          onClick={() => setShowNewWsModal(false)}
        >
          <form
            onSubmit={handleCreateWorkspace}
            style={{
              width: "380px",
              background: "rgba(15, 23, 42, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              "border-radius": "14px",
              padding: "20px",
              display: "flex",
              "flex-direction": "column",
              gap: "14px",
              "box-shadow": "0 20px 50px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
              <span style={{ "font-size": "14px", "font-weight": 700, "font-family": "Space Mono, monospace" }}>
                CREATE WORKSPACE
              </span>
              <button
                type="button"
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                onClick={() => setShowNewWsModal(false)}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ "font-size": "11px", color: "var(--text-muted, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
                Workspace Name
              </label>
              <input
                type="text"
                required
                value={newWsName()}
                onInput={(e) => setNewWsName(e.currentTarget.value)}
                placeholder="e.g. Kaizeng, Trader, Research..."
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  "border-radius": "6px",
                  color: "#f8fafc",
                  "font-size": "12px",
                  "box-sizing": "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ "font-size": "11px", color: "var(--text-muted, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
                Accent Color
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["#38bdf8", "#05ffb0", "#a855f7", "#f59e0b", "#ec4899", "#10b981", "#eab308"].map((c) => (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      "border-radius": "50%",
                      background: c,
                      cursor: "pointer",
                      border: newWsColor() === c ? "2px solid #ffffff" : "2px solid transparent",
                      "box-shadow": newWsColor() === c ? `0 0 8px ${c}` : "none",
                    }}
                    onClick={() => setNewWsColor(c)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ "font-size": "11px", color: "var(--text-muted, #94a3b8)", display: "block", "margin-bottom": "4px" }}>
                Routing Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={newWsKeywords()}
                onInput={(e) => setNewWsKeywords(e.currentTarget.value)}
                placeholder="e.g. kaizeng, nextjs, react, portfolio"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  "border-radius": "6px",
                  color: "#f8fafc",
                  "font-size": "12px",
                  "box-sizing": "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", "justify-content": "flex-end", gap: "8px", "margin-top": "6px" }}>
              <button
                type="button"
                style={{ ...S.secondaryBtn, padding: "6px 14px", "font-size": "12px", cursor: "pointer" }}
                onClick={() => setShowNewWsModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ ...S.actionBtn, padding: "6px 14px", "font-size": "12px", cursor: "pointer" }}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </Show>
    </div>
  );
}
