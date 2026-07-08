import { useEffect, useRef } from 'react';

type ScriptOptions = {
  src: string;
  websiteId: string;
  attributes: Record<string, string | boolean | undefined>;
  enabled: boolean;
  debug?: boolean;
};

const DATA_ATTR_PREFIX = 'data-';

function toDataAttrs(attrs: Record<string, string | boolean | undefined>): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null) continue;
    // Note: explicit `false` is preserved and serialized as 'false'.
    // The Umami tracker reads `data-auto-track="false"` to disable auto-tracking,
    // so the value matters. Undefined props are filtered by the caller, not here.
    const attrName = key.startsWith(DATA_ATTR_PREFIX) ? key : `${DATA_ATTR_PREFIX}${key}`;
    out.push([attrName, String(value)]);
  }
  return out;
}

function findExistingScript(websiteId: string, src: string): HTMLScriptElement | null {
  const scripts = document.querySelectorAll<HTMLScriptElement>(`script[data-website-id="${websiteId}"]`);
  for (const s of scripts) {
    if (s.src === src) return s;
  }
  return null;
}

export function useScript({ src, websiteId, attributes, enabled, debug }: ScriptOptions): void {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;
    if (injectedRef.current) return;

    const existing = findExistingScript(websiteId, src);
    if (existing) {
      injectedRef.current = true;
      if (debug) console.debug('[umami] script already present, skipping injection');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = src;
    script.setAttribute('data-website-id', websiteId);

    for (const [name, value] of toDataAttrs(attributes)) {
      script.setAttribute(name, value);
    }

    if (debug) console.debug('[umami] injecting', src, { websiteId, attributes });

    document.head.appendChild(script);
    injectedRef.current = true;
  }, [enabled, src, websiteId, attributes, debug]);
}
