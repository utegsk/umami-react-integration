# AGENTS.md — umami-react-integration

Lightweight React component for [Umami Analytics](https://umami.is) with first-class control over the recorder script (heatmaps + replays) and every other `data-*` attribute Umami exposes.

## Where to start

- [`src/UmamiTracker.tsx`](src/UmamiTracker.tsx) — the single exported component.
- [`src/useScript.ts`](src/useScript.ts) — internal: head-injected `<script>` lifecycle, no double-injection.
- [`src/types.ts`](src/types.ts) — `UmamiTrackerProps`.
- [`tests/UmamiTracker.test.tsx`](tests/UmamiTracker.test.tsx) — vitest + jsdom + @testing-library/react.

## Hard rules for editing

- **Zero runtime deps.** Lib ships nothing but its own code. Only `react`/`react-dom` are peer deps.
- **The recorder prop is the differentiator.** `recorder={true}` switches `<host>/script.js` → `<host>/recorder.js`. Replays and heatmaps are NOT separately controllable at the client level — both come from the same script; the Umami dashboard has per-website toggles for which to display.
- **`scriptAttributes` is the escape hatch.** Any `data-*` we didn't name (e.g. `data-before-send`) goes through there. Don't add props for one-off attributes.
- **JSX runtime MUST be `development: false`.** Without it, bunup emits `react/jsx-dev-runtime` and Next.js prod crashes with `jsxDEV is not a function`. Don't touch the bunup config.
- **No `useUmami` hook in v1.** User asked for "simple one react component". Programmatic tracking can ship as v2 if needed.
- **`umami-react` vs `umami-react-integration`.** Repo and package are both `umami-react-integration`; do not split the names.

## Build / test

```sh
bun install
bun run build       # bunup
bun run test        # vitest
bun run typecheck   # tsc --noEmit
```

## Release

- Conventional commits on `main` auto-bump via `.github/workflows/bump-version.yml`.
- Tag like `@utegsk/umami-react-integration@1.2.3` (with JSON annotation `{"deployTargets":["npm"]}`) triggers publish via `.github/workflows/publish-npm-on-tag.yml`.
- Tag without annotation is treated as a legacy tag and gates on `check-publishable` instead.

## What this repo is NOT

- Not a `@payloadcms/*` plugin — generic React, no Payload dependency.
- Not a full Umami SDK — only the tracker-script-injection concern. Programmatic tracking (`umami.track`, `umami.identify`) needs a separate `useUmami` hook, deferred to v2.
- Not a multi-package monorepo — single package, single `package.json`.
