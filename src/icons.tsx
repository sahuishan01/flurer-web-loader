export function GlobeIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function ArrowLeftIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArrowRightIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ReloadIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.73-6.19" />
    </svg>
  );
}

export function HomeIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function PopoutIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

export function ExternalIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function NewTabIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
      <line x1="13" y1="11" x2="21" y2="11" />
      <line x1="17" y1="7" x2="17" y2="15" />
    </svg>
  );
}

export function PlusIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function CloseIcon(props: { size?: number }) {
  const s = () => props.size || 16;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function StarIcon(props: { size?: number; filled?: boolean }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill={props.filled ? "currentColor" : "none"} stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function LockIcon(props: { size?: number }) {
  const s = () => props.size || 16;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ShieldIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function HistoryIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function TrashIcon(props: { size?: number }) {
  const s = () => props.size || 18;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function IncognitoIcon(props: { size?: number }) {
  const s = () => props.size || 20;
  return (
    <svg width={s()} height={s()} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style={{ "flex-shrink": "0", display: "block" }}>
      <path d="M2 12h20" />
      <path d="M20 12l-2-7H6l-2 7" />
      <circle cx="7.5" cy="16.5" r="3.5" />
      <circle cx="16.5" cy="16.5" r="3.5" />
      <path d="M11 16.5h2" />
    </svg>
  );
}
