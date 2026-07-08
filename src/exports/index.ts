import { UmamiTracker } from '../UmamiTracker';
import type { UmamiTrackerProps } from '../types';

// Anchor: without a real "use" of every symbol, bunup's DCE drops the
// function bodies even with `splitting: false`, producing a 27-byte
// phantom dist that just re-exports the name without defining it.
// The const initializer reads every binding, so DCE keeps the bodies.
// See `lib-bundling-bunup` memory, item 11.
const _exports: {
  UmamiTracker: typeof UmamiTracker;
} = { UmamiTracker };
export default _exports;
export { UmamiTracker };
export type { UmamiTrackerProps };
