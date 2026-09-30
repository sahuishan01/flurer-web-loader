import { ProjectWorkspace, TabIntent, SmartRouterConfig } from "./types";
import { getDomain } from "./utils";

export const DEFAULT_WORKSPACES: ProjectWorkspace[] = [
  {
    id: "flurer",
    name: "Flurer",
    color: "#38bdf8", // Sky blue
    icon: "✦",
    keywords: ["flurer", "tauri", "plugin", "desktop", "file-manager", "windows"],
    description: "Flurer core desktop file manager, plugins, and native shell",
  },
  {
    id: "dev-tools",
    name: "Dev & Code",
    color: "#05ffb0", // Neon emerald
    icon: "⚡",
    keywords: [
      "github",
      "gitlab",
      "npm",
      "crates",
      "localhost",
      "127.0.0.1",
      "termix",
      "podman",
      "git",
      "stack",
      "debugger",
      "code",
      "build",
    ],
    description: "Source code repositories, pull requests, servers, and dev tools",
  },
  {
    id: "ai-workflows",
    name: "AI & Models",
    color: "#a855f7", // Violet
    icon: "❖",
    keywords: [
      "claude",
      "chatgpt",
      "openai",
      "huggingface",
      "perplexity",
      "deepseek",
      "anthropic",
      "cohere",
      "ollama",
      "laya",
      "gemini",
      "model",
      "prompt",
    ],
    description: "AI assistants, model playgrounds, prompt engineering, and agent flows",
  },
  {
    id: "research-docs",
    name: "Docs & Specs",
    color: "#f59e0b", // Amber
    icon: "📖",
    keywords: [
      "docs",
      "api",
      "rust",
      "solid",
      "mdn",
      "arxiv",
      "wiki",
      "reference",
      "manual",
      "guide",
      "documentation",
      "specification",
    ],
    description: "Official documentation, API references, research papers, and technical specs",
  },
  {
    id: "general",
    name: "General",
    color: "#94a3b8", // Slate
    icon: "○",
    keywords: [],
    description: "General web browsing, media, and unassigned tabs",
  },
];

export const INTENT_COLORS: Record<TabIntent, string> = {
  dev: "#05ffb0",
  docs: "#f59e0b",
  ai: "#a855f7",
  research: "#38bdf8",
  leisure: "#ec4899",
  general: "#94a3b8",
};

export const INTENT_LABELS: Record<TabIntent, string> = {
  dev: "Dev & Code",
  docs: "Documentation",
  ai: "AI & Models",
  research: "Research",
  leisure: "Media & Leisure",
  general: "General",
};

export interface RouteDecision {
  projectId: string;
  intent: TabIntent;
  confidence: number;
  engineUsed: "laya-local" | "heuristic";
  suggestedNewCategory?: string;
  reason?: string;
}

/**
 * Instant Zero-Latency Heuristic Classifier
 */
export function classifyHeuristic(
  url: string,
  title: string = "",
  workspaces: ProjectWorkspace[] = DEFAULT_WORKSPACES,
  currentProjectId?: string
): RouteDecision {
  if (!url || url === "about:blank") {
    return {
      projectId: currentProjectId || "general",
      intent: "general",
      confidence: 1.0,
      engineUsed: "heuristic",
    };
  }

  const domain = getDomain(url).toLowerCase();
  const fullText = `${url} ${title} ${domain}`.toLowerCase();

  // 1. Detect Intent
  let detectedIntent: TabIntent = "general";
  let intentReason = "General browsing pattern";

  if (
    domain.includes("openai") ||
    domain.includes("claude.ai") ||
    domain.includes("chatgpt") ||
    domain.includes("anthropic") ||
    domain.includes("perplexity") ||
    domain.includes("huggingface") ||
    domain.includes("deepseek") ||
    domain.includes("cohere") ||
    domain.includes("groq")
  ) {
    detectedIntent = "ai";
    intentReason = `Known AI provider domain: ${domain}`;
  } else if (
    domain.startsWith("docs.") ||
    domain.startsWith("api.") ||
    domain.includes("readthedocs") ||
    domain.includes("developer.mozilla") ||
    domain.includes("solidjs.com") ||
    domain.includes("tauri.app") ||
    domain.includes("vitejs.dev") ||
    domain.includes("devdocs.io") ||
    domain.includes("rust-lang.org")
  ) {
    detectedIntent = "docs";
    intentReason = `Technical documentation domain: ${domain}`;
  } else if (
    domain.includes("github.com") ||
    domain.includes("gitlab.com") ||
    domain.includes("stackoverflow.com") ||
    domain.includes("npmjs.com") ||
    domain.includes("crates.io") ||
    domain.includes("localhost") ||
    domain.includes("127.0.0.1") ||
    domain.includes("termix") ||
    domain.includes("podman")
  ) {
    detectedIntent = "dev";
    intentReason = `Developer & code workspace: ${domain}`;
  } else if (
    domain.includes("arxiv.org") ||
    domain.includes("scholar.google") ||
    domain.includes("wikipedia.org") ||
    domain.includes("researchgate") ||
    domain.includes("paperswithcode")
  ) {
    detectedIntent = "research";
    intentReason = `Research / academic reference: ${domain}`;
  } else if (
    domain.includes("youtube.com") ||
    domain.includes("netflix.com") ||
    domain.includes("twitch.tv") ||
    domain.includes("reddit.com") ||
    domain.includes("twitter.com") ||
    domain.includes("x.com") ||
    domain.includes("spotify.com")
  ) {
    detectedIntent = "leisure";
    intentReason = `Media / leisure platform: ${domain}`;
  }

  // 2. Detect Project / Workspace
  let matchedProject: ProjectWorkspace | undefined;
  let highestScore = 0;

  for (const ws of workspaces) {
    if (ws.id === "general") continue;
    let score = 0;

    // Check workspace name match
    if (fullText.includes(ws.name.toLowerCase())) {
      score += 3;
    }

    // Check workspace keywords match
    if (ws.keywords && ws.keywords.length > 0) {
      for (const kw of ws.keywords) {
        if (fullText.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      matchedProject = ws;
    }
  }

  // If high score found, route to matched project
  if (matchedProject && highestScore >= 2) {
    return {
      projectId: matchedProject.id,
      intent: detectedIntent,
      confidence: Math.min(0.95, 0.6 + highestScore * 0.1),
      engineUsed: "heuristic",
      reason: `Matched project keywords for ${matchedProject.name} (${intentReason})`,
    };
  }

  // If intent matches a dedicated project (like AI -> ai-workflows, Docs -> research-docs)
  if (detectedIntent === "ai" && workspaces.some((w) => w.id === "ai-workflows")) {
    return {
      projectId: "ai-workflows",
      intent: "ai",
      confidence: 0.88,
      engineUsed: "heuristic",
      reason: intentReason,
    };
  }
  if (detectedIntent === "docs" && workspaces.some((w) => w.id === "research-docs")) {
    return {
      projectId: "research-docs",
      intent: "docs",
      confidence: 0.85,
      engineUsed: "heuristic",
      reason: intentReason,
    };
  }
  if (detectedIntent === "dev" && workspaces.some((w) => w.id === "dev-tools")) {
    return {
      projectId: "dev-tools",
      intent: "dev",
      confidence: 0.85,
      engineUsed: "heuristic",
      reason: intentReason,
    };
  }

  // If current project exists and user navigated from it, keep user in current project
  if (currentProjectId && currentProjectId !== "general") {
    return {
      projectId: currentProjectId,
      intent: detectedIntent,
      confidence: 0.7,
      engineUsed: "heuristic",
      reason: `Inherited current active workspace: ${currentProjectId}`,
    };
  }

  // Fallback to general workspace
  return {
    projectId: "general",
    intent: detectedIntent,
    confidence: 0.6,
    engineUsed: "heuristic",
    reason: intentReason,
  };
}

/**
 * On-Device Laya / Local Model Router
 * Queries on-device local model endpoint (e.g. Ollama / LLaMA / local engine at 127.0.0.1:11434).
 * If unavailable or slow, transparently falls back to heuristic engine.
 */
export async function routeTabViaLaya(
  url: string,
  title: string,
  config?: SmartRouterConfig,
  workspaces: ProjectWorkspace[] = DEFAULT_WORKSPACES,
  currentProjectId?: string
): Promise<RouteDecision> {
  const heuristicFallback = classifyHeuristic(url, title, workspaces, currentProjectId);

  if (!config || !config.enabled || config.provider !== "laya-local") {
    return heuristicFallback;
  }

  const endpoint = config.localEndpointUrl || "http://127.0.0.1:11434";
  const modelName = config.modelName || "laya-router";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200); // 1.2s strict budget to avoid UI lag

    const prompt = `You are Laya, an on-device web workspace routing model.
Categorize the following web page into the most appropriate workspace and intent.
Available Workspaces: ${workspaces.map((w) => `${w.id} (${w.name})`).join(", ")}
Available Intents: dev, docs, ai, research, leisure, general

Page URL: ${url}
Page Title: ${title}

Respond ONLY with valid JSON:
{"projectId": "<id>", "intent": "<intent>", "suggestedNewCategory": "<optional new project name if none fit>"}`;

    const response = await fetch(`${endpoint}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,
        format: "json",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return heuristicFallback;
    }

    const data = await response.json();
    const parsed = JSON.parse(data.response);

    const validProject = workspaces.find((w) => w.id === parsed.projectId);
    const validIntent: TabIntent = [
      "dev",
      "docs",
      "ai",
      "research",
      "leisure",
      "general",
    ].includes(parsed.intent)
      ? parsed.intent
      : heuristicFallback.intent;

    return {
      projectId: validProject ? validProject.id : heuristicFallback.projectId,
      intent: validIntent,
      confidence: 0.95,
      engineUsed: "laya-local",
      suggestedNewCategory: parsed.suggestedNewCategory,
      reason: `Routed by On-Device Laya Model (${modelName})`,
    };
  } catch {
    // Graceful fallback to zero-latency heuristic
    return heuristicFallback;
  }
}
