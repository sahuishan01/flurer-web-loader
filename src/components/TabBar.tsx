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
              <GlobeIcon size={17} />
              <span style={S.tabTitle}>{tab.title || "New Tab"}</span>
              <button
                type="button"
                class="icon-btn"
                style={S.tabCloseBtn}
                title="Close Tab"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onCloseTab(tab.id);
                }}
              >
                <CloseIcon size={15} />
              </button>
            </div>
          );
        }}
      </For>

      <button
        type="button"
        class="icon-btn"
        style={{
          ...S.iconBtn,
          width: "34px",
          height: "34px",
        }}
        onClick={props.onNewTab}
        title={`Open New Tab (${mod}+T)`}
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
}
