import { For } from "solid-js";
import { Tab } from "../types";
import { S } from "../styles";
import { PlusIcon, CloseIcon, GlobeIcon } from "../icons";
import { getModifierKey } from "../utils";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
}

export function TabBar(props: TabBarProps) {
  const mod = getModifierKey();

  return (
    <div style={S.tabRow}>
      <For each={props.tabs}>
        {(tab) => {
          const isActive = () => tab.id === props.activeTabId;
          return (
            <div
              style={{
                ...S.tab,
                ...(isActive() ? S.tabActive : {}),
              }}
              onClick={() => props.onSelectTab(tab.id)}
              title={tab.url}
            >
              <GlobeIcon size={16} />
              <span style={S.tabTitle}>{tab.title || "New Tab"}</span>
              <button
                type="button"
                style={S.tabCloseBtn}
                title="Close Tab"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onCloseTab(tab.id);
                }}
              >
                <CloseIcon size={14} />
              </button>
            </div>
          );
        }}
      </For>

      <button
        type="button"
        style={{
          ...S.iconBtn,
          width: "30px",
          height: "30px",
        }}
        onClick={props.onNewTab}
        title={`Open New Tab (${mod}+T)`}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
