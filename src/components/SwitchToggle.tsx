import { JSX } from "solid-js";

export interface SwitchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  icon?: JSX.Element;
  disabled?: boolean;
}

export function SwitchToggle(props: SwitchToggleProps) {
  return (
    <div
      role="switch"
      aria-checked={props.checked}
      tabIndex={props.disabled ? -1 : 0}
      onClick={() => {
        if (!props.disabled) props.onChange(!props.checked);
      }}
      onKeyDown={(e) => {
        if (!props.disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
      style={{
        display: "flex",
        "align-items": "flex-start",
        "justify-content": "space-between",
        gap: "16px",
        padding: "14px 16px",
        background: props.checked
          ? "var(--accent-bg-soft, var(--accent-soft, rgba(var(--accent-rgb, 56, 189, 248), 0.08)))"
          : "var(--control-bg, rgba(var(--panel-rgb, 128, 128, 128), 0.04))",
        border: props.checked
          ? "1px solid var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.35))"
          : "1px solid var(--border-color, rgba(128, 128, 128, 0.12))",
        "border-radius": "var(--radius-md, 8px)",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", gap: "12px", "align-items": "flex-start", flex: "1 1 auto" }}>
        {props.icon && (
          <div
            style={{
              color: props.checked
                ? "var(--accent-default, var(--accent, #38bdf8))"
                : "var(--text-secondary, currentColor)",
              "margin-top": "2px",
              transition: "color 0.18s ease",
              "flex-shrink": 0,
            }}
          >
            {props.icon}
          </div>
        )}
        <div style={{ display: "flex", "flex-direction": "column", gap: "3px" }}>
          <span
            style={{
              "font-size": "13px",
              "font-weight": 600,
              color: "var(--text-primary, var(--text-color, currentColor))",
              transition: "color 0.18s ease",
            }}
          >
            {props.label}
          </span>
          {props.description && (
            <span
              style={{
                "font-size": "11.5px",
                color: "var(--text-secondary, currentColor)",
                opacity: 0.85,
                "line-height": 1.45,
              }}
            >
              {props.description}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          width: "38px",
          height: "22px",
          "min-width": "38px",
          "border-radius": "11px",
          background: props.checked
            ? "var(--accent-default, var(--accent, #38bdf8))"
            : "var(--border-strong, rgba(128, 128, 128, 0.28))",
          padding: "2px",
          "box-sizing": "border-box",
          position: "relative",
          transition: "background 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          "box-shadow": props.checked
            ? "0 0 10px var(--accent-border, rgba(var(--accent-rgb, 56, 189, 248), 0.35))"
            : "none",
          "flex-shrink": 0,
          "margin-top": "2px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            "border-radius": "50%",
            background: "#ffffff",
            transform: props.checked ? "translateX(16px)" : "translateX(0)",
            transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.35)",
          }}
        />
      </div>
    </div>
  );
}
