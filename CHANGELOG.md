# Changelog

## 0.1.0

Initial release.

- `<UmamiTracker />` component with typed props for every Umami `data-*` attribute
- `recorder` prop switches between `script.js` and `recorder.js` to enable heatmap + replay data capture
- `scriptAttributes` escape hatch for any attribute not exposed as a first-class prop
- Env-var fallback for `url` and `websiteId` (`UMAMI_URL` / `NEXT_PUBLIC_UMAMI_URL`, `UMAMI_ID` / `NEXT_PUBLIC_UMAMI_ID`)
- `lazyLoad` defers injection until first user interaction
- `onlyInProduction` (default `true`) skips dev builds
- Zero runtime dependencies
- React 18 + 19 peer dep
