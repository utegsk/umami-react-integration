export type UmamiTrackerProps = {
  /** Required. Your Umami website ID. Falls back to `UMAMI_ID` / `NEXT_PUBLIC_UMAMI_ID`. */
  websiteId: string;

  /** Script host URL. Falls back to `UMAMI_URL` / `NEXT_PUBLIC_UMAMI_URL`, then Umami Cloud. */
  url?: string;

  /** `data-host-url` — where captured data is sent. May differ from `url`. */
  hostUrl?: string;

  /**
   * When `true`, loads `recorder.js` instead of `script.js`. The recorder is the
   * heavier script that captures the data feeding both **heatmaps** and **replays**
   * (the Umami dashboard has separate toggles for which of the two to display).
   *
   * Default: `false` (loads `script.js`, analytics only).
   */
  recorder?: boolean;

  /** `data-domains` — comma-separated hostnames the tracker is allowed to run on. */
  domains?: string[];

  /** `data-do-not-track` — respect the browser's `Do Not Track` setting. */
  doNotTrack?: boolean;

  /** `data-exclude-search` — strip query string from collected URLs. */
  excludeSearch?: boolean;

  /** `data-exclude-hash` — strip URL hash from collected URLs. */
  excludeHash?: boolean;

  /** `data-auto-track` — automatically track pageviews. Default: `true`. */
  autoTrack?: boolean;

  /** `data-tag` — group events under a named tag for A/B testing. */
  tag?: string;

  /** `data-performance` — collect Core Web Vitals from visitors' browsers. */
  trackPerformance?: boolean;

  /** Defer script load until the user's first interaction. */
  lazyLoad?: boolean;

  /** Skip loading the script in non-production builds. Default: `true`. */
  onlyInProduction?: boolean;

  /** Log debug info to the console. */
  debug?: boolean;

  /** Escape hatch — additional `data-*` attributes merged into the script tag. */
  scriptAttributes?: Record<string, string>;
};
