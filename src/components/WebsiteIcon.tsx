import { createSignal, createEffect, Show } from "solid-js";
import { GlobeIcon } from "../icons";
import { getDomain } from "../utils";

export interface WebsiteIconProps {
  url?: string;
  favicon?: string;
  size?: number;
  class?: string;
  style?: any;
}

export function WebsiteIcon(props: WebsiteIconProps) {
  const size = () => props.size || 16;
  const [imgFailed, setImgFailed] = createSignal(false);

  // Reset failure state whenever URL or favicon changes
  createEffect(() => {
    props.url;
    props.favicon;
    setImgFailed(false);
  });

  const resolvedIconUrl = () => {
    if (imgFailed()) return null;
    if (props.favicon) return props.favicon;

    const url = props.url;
    if (!url || url === "about:blank" || url.startsWith("about:") || url.startsWith("javascript:")) {
      return null;
    }

    try {
      const domain = getDomain(url);
      if (!domain) return null;

      // For local network / development servers, attempt root favicon
      if (
        domain === "localhost" ||
        domain.startsWith("127.0.0.1") ||
        domain.startsWith("192.168.") ||
        domain.startsWith("10.") ||
        domain.endsWith(".local")
      ) {
        try {
          const parsed = new URL(url);
          return `${parsed.protocol}//${parsed.host}/favicon.ico`;
        } catch {
          return null;
        }
      }

      // For standard public web domains, use Google's high-resolution favicon service
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Show
      when={resolvedIconUrl()}
      fallback={<GlobeIcon size={size()} />}
    >
      {(src) => (
        <img
          src={src()}
          alt=""
          width={size()}
          height={size()}
          class={props.class}
          style={{
            width: `${size()}px`,
            height: `${size()}px`,
            "min-width": `${size()}px`,
            "min-height": `${size()}px`,
            "border-radius": "3px",
            "object-fit": "contain",
            "flex-shrink": 0,
            display: "inline-block",
            ...(props.style || {}),
          }}
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      )}
    </Show>
  );
}
