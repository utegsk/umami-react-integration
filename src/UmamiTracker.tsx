'use client';

import { useEffect, useMemo, useState } from 'react';
import { useScript } from './useScript';
import type { UmamiTrackerProps } from './types';

const DEFAULT_URL = 'https://cloud.umami.is';

const LAZY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

// Read process.env at runtime via globalThis to defeat bundler inlining.
// bunup DCE eliminates `process.env.NODE_ENV !== 'production'` when the lib
// is built with `NODE_ENV=production`, so the dev-skip branch becomes dead
// code in the dist. Going through `globalThis.process?.env` keeps the access
// dynamic and lets the host's runtime NODE_ENV drive the check.
function getRuntimeNodeEnv(): string | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.NODE_ENV;
}

function readEnv(...keys: string[]): string | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  if (!env) return undefined;
  for (const key of keys) {
    const value = env[key];
    if (value) return value;
  }
  return undefined;
}

function resolveUrl(prop?: string): string {
  const candidate = prop ?? readEnv('UMAMI_URL', 'NEXT_PUBLIC_UMAMI_URL');
  if (candidate) return candidate.replace(/\/+$/, '');
  return DEFAULT_URL;
}

function resolveWebsiteId(prop?: string): string | undefined {
  return prop ?? readEnv('UMAMI_ID', 'NEXT_PUBLIC_UMAMI_ID');
}

function scriptUrl(url: string, recorder: boolean): string {
  return recorder ? `${url}/recorder.js` : `${url}/script.js`;
}

export function UmamiTracker(props: UmamiTrackerProps) {
  const {
    websiteId: websiteIdProp,
    url: urlProp,
    hostUrl,
    recorder = false,
    domains,
    doNotTrack,
    excludeSearch,
    excludeHash,
    autoTrack = true,
    tag,
    trackPerformance,
    lazyLoad = false,
    onlyInProduction = true,
    debug = false,
    scriptAttributes,
  } = props;

  const websiteId = resolveWebsiteId(websiteIdProp);
  const url = resolveUrl(urlProp);

  if (onlyInProduction && getRuntimeNodeEnv() !== 'production') {
    return null;
  }

  const [lazyReady, setLazyReady] = useState(!lazyLoad);

  useEffect(() => {
    if (!lazyLoad) return;
    const onInteract = () => {
      setLazyReady(true);
    };
    for (const event of LAZY_EVENTS) {
      window.addEventListener(event, onInteract, { once: true, passive: true });
    }
    return () => {
      for (const event of LAZY_EVENTS) {
        window.removeEventListener(event, onInteract);
      }
    };
  }, [lazyLoad]);

  const dataAttributes = useMemo<Record<string, string | boolean | undefined>>(
    () => ({
      'host-url': hostUrl,
      'auto-track': autoTrack,
      'do-not-track': doNotTrack,
      'exclude-search': excludeSearch,
      'exclude-hash': excludeHash,
      domains: domains && domains.length > 0 ? domains.join(',') : undefined,
      tag,
      performance: trackPerformance,
      ...scriptAttributes,
    }),
    [
      hostUrl,
      autoTrack,
      doNotTrack,
      excludeSearch,
      excludeHash,
      domains,
      tag,
      trackPerformance,
      scriptAttributes,
    ],
  );

  const finalWebsiteId = websiteId ?? '';
  const src = scriptUrl(url, recorder);

  useScript({
    src,
    websiteId: finalWebsiteId,
    attributes: dataAttributes,
    enabled: lazyReady,
    debug,
  });

  return null;
}

export default UmamiTracker;
