import { defineConfig, type DefineConfigItem } from 'bunup'

export default defineConfig({
  entry: ['src/exports/*'],
  sourceBase: 'src',
  format: ['esm'],
  clean: true,
  // Required: with the default `splitting: true`, shim files that re-export
  // symbols (e.g. `export { UmamiTracker } from '../UmamiTracker'`) produce
  // a phantom dist — the entry re-exports the name but the function body
  // never gets emitted. With splitting off, every symbol inlines into its
  // entry file. See `lib-bundling-bunup` memory, items 1, 6, 11.
  splitting: false,
  dts: { inferTypes: true },
  // Force production JSX runtime. Without explicit `development: false` bunup
  // emits `jsxDEV` calls from `react/jsx-dev-runtime` — those don't exist in
  // production Next.js runtime, so the prerender crashes with
  // "jsxDEV is not a function".
  jsx: {
    runtime: 'automatic',
    importSource: 'react',
    development: false,
  },
  external: [
    /node:/,
    /^react$/,
    /^react\//,
    /^react-dom/,
  ],
}) as DefineConfigItem
