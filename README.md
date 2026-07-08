# @utegsk/umami-react-integration

Lightweight React component for [Umami Analytics](https://umami.is) — every `data-*` attribute Umami exposes, mapped to
a typed prop, with first-class control over the recorder script that powers **heatmaps** and **replays**.

Zero runtime dependencies. Full TypeScript. Works with React 18 and 19.

## Install

```sh
bun add @utegsk/umami-react-integration
# or
npm install @utegsk/umami-react-integration
```

## Quick start

```tsx
import { UmamiTracker } from '@utegsk/umami-react-integration';

export default function RootLayout({ children }) {
  return (
    <html>
    <body>
    <UmamiTracker websiteId="your-website-id" url="https://umami.example.com"/>
    {children}
    </body>
    </html>
  );
}
```

The component renders `null` — it only injects the Umami tracking script into `<head>`.

## Props

| Prop               | Type                     | Default                                        | Description                                                                                                                                                                 |
|--------------------|--------------------------|------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `websiteId`        | `string`                 | env `UMAMI_ID`                                 | Your website tracking ID.                                                                                                                                                   |
| `url`              | `string`                 | env `UMAMI_URL`, then `https://cloud.umami.is` | Where the tracker script is loaded from.                                                                                                                                    |
| `hostUrl`          | `string`                 | —                                              | `data-host-url` — where captured data is **sent**. May differ from `url` (load from CDN, send to your own instance).                                                        |
| `recorder`         | `boolean`                | `false`                                        | When `true`, loads `recorder.js` instead of `script.js`. Captures the data feeding both **heatmaps** and **replays** (dashboard has separate toggles for which to display). |
| `domains`          | `string[]`               | —                                              | `data-domains` — restrict tracking to these hostnames.                                                                                                                      |
| `doNotTrack`       | `boolean`                | —                                              | `data-do-not-track` — respect browser DNT.                                                                                                                                  |
| `excludeSearch`    | `boolean`                | —                                              | `data-exclude-search` — strip `?query=…` from collected URLs.                                                                                                               |
| `excludeHash`      | `boolean`                | —                                              | `data-exclude-hash` — strip `#hash` from collected URLs.                                                                                                                    |
| `autoTrack`        | `boolean`                | `true`                                         | `data-auto-track` — auto pageview tracking.                                                                                                                                 |
| `tag`              | `string`                 | —                                              | `data-tag` — group events for A/B testing.                                                                                                                                  |
| `trackPerformance` | `boolean`                | —                                              | `data-performance` — collect Core Web Vitals.                                                                                                                               |
| `lazyLoad`         | `boolean`                | `false`                                        | Defer script load until first user interaction.                                                                                                                             |
| `onlyInProduction` | `boolean`                | `true`                                         | Skip injection outside production builds.                                                                                                                                   |
| `debug`            | `boolean`                | `false`                                        | Log debug info to the console.                                                                                                                                              |
| `scriptAttributes` | `Record<string, string>` | —                                              | Escape hatch — additional `data-*` attributes (e.g. `data-before-send`).                                                                                                    |

## Heatmaps & replays

Umami has two tracker scripts at the same host:

| Script               | Captures                                                                          |
|----------------------|-----------------------------------------------------------------------------------|
| `<host>/script.js`   | Pageviews, events, link clicks — analytics only                                   |
| `<host>/recorder.js` | All of the above + DOM mutations, mouse, scroll — feeds both replays and heatmaps |

```tsx
// analytics only (default)
<UmamiTracker websiteId="abc" url="https://umami.example.com"/>

// capture data for heatmaps + replays
<UmamiTracker websiteId="abc" url="https://umami.example.com" recorder/>
```

Then toggle heatmaps and/or replays on in your website settings in the Umami dashboard. Loading `recorder.js` is the
client-side requirement; the dashboard decides what to do with the captured data.

## Env fallback

Both `url` and `websiteId` fall back to env vars. Mirrors the convention used by most Umami setups:

```env
UMAMI_URL=https://umami.example.com
UMAMI_ID=your-website-id
# also: NEXT_PUBLIC_UMAMI_URL, NEXT_PUBLIC_UMAMI_ID
```

## Why this exists

The reference packages on npm only know about `script.js` and force you to set `data-host-url` or other attributes via a
generic `scriptAttributes` escape hatch. This one makes every Umami feature a typed prop and exposes the recorder switch
as a first-class concern.

## Development

```sh
bun install
bun run build       # bunup
bun run test        # vitest
bun run typecheck
```

