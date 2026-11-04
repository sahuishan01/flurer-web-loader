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
          ? "rgba(var(--accent-rgb, 56, 189, 248), 0.06)"
          : "rgba(255, 255, 255, 0.025)",
        border: props.checked
          ? "1px solid rgba(var(--accent-rgb, 56, 189, 248), 0.3)"
          : "1px solid var(--border-color, rgba(255, 255, 255, 0.08))",
        "border-radius": "8px",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ display: "flex", gap: "12px", "align-items": "flex-start", flex: "1 1 auto" }}>
        {props.icon && (
          <div
            style={{
              color: props.checked ? "var(--accent-default, #38bdf8)" : "var(--text-secondary, #94a3b8)",
              "margin-top": "2px",
              transition: "color 0.2s ease",
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
              color: props.checked ? "var(--text-primary, #f8fafc)" : "var(--text-secondary, #e2e8f0)",
              transition: "color 0.2s ease",
            }}
          >
            {props.label}
          </span>
          {props.description && (
            <span
              style={{
                "font-size": "11.5px",
                color: "var(--text-secondary, #94a3b8)",
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
            ? "var(--accent-default, #38bdf8)"
            : "rgba(255, 255, 255, 0.15)",
          padding: "2px",
          "box-sizing": "border-box",
          position: "relative",
          transition: "background 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          "box-shadow": props.checked
            ? "0 0 10px rgba(var(--accent-rgb, 56, 189, 248), 0.35)"
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
            background: props.checked ? "#0f172a" : "#ffffff",
            transform: props.checked ? "translateX(16px)" : "translateX(0)",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease",
            "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.4)",
          }}
        />
      </div>
    </div>
  );
}
