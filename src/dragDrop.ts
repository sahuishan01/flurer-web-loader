import { createSignal, createRoot } from "solid-js";

export const TAB_DRAG_MIME = "application/x-flurer-tab";
export const WORKSPACE_DRAG_MIME = "application/x-flurer-workspace";

export const [draggedTabId, setDraggedTabId] = createRoot(() => createSignal<string | null>(null));
export const [draggedWorkspaceId, setDraggedWorkspaceId] = createRoot(() => createSignal<string | null>(null));
