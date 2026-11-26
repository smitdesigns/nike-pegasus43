# Slow 4G Mobile Launch Check Report — Nike Pegasus 43

Target URL: `http://localhost:3000/pegasus-43` (production server via `npm run build` + `npm start`)
Profile: `Web_Platform_Slow_4G_Mobile_Check_Profile.yaml`

---

## 1. Settings Used and Confirmation Each Was Applied

### Chrome DevTools Protocol (CDP) Trace Settings
Applied on a fresh page with cache disabled (`Network.setCacheDisabled({ cacheDisabled: true })`) and page reload (`page.reload`):

| Setting | Profile Requirement | Applied & Confirmed Value |
| --- | --- | --- |
| Viewport | `375 × 812` CSS px | `window.innerWidth === 375`, `window.innerHeight === 812` |
| Device Pixel Ratio | `3` | `window.devicePixelRatio === 3` |
| Mobile Emulation & Touch | `mobile: true`, touch on | `Emulation.setDeviceMetricsOverride({ mobile: true })`, `navigator.maxTouchPoints === 5`, `(pointer: coarse): true` |
| Slow 4G Network | `requestLatencyMs: 562.5`, `downloadThroughputKbps: 1474.56`, `uploadThroughputKbps: 675` | `Network.emulateNetworkConditions({ latency: 562.5, downloadThroughput: 184320 B/s, uploadThroughput: 84375 B/s })` |
| CPU Slowdown | `4×` | `Emulation.setCPUThrottlingRate({ rate: 4 })` |
| Cache | Disabled | `Network.setCacheDisabled({ cacheDisabled: true })` |

### Lighthouse Mobile Run Settings
Confirmed in `lhr.configSettings`:
- `formFactor`: `"mobile"`
- `throttlingMethod`: `"simulate"`
- `throttling`: `rttMs: 150`, `throughputKbps: 1638.4`, `requestLatencyMs: 562.5`, `downloadThroughputKbps: 1474.56`, `uploadThroughputKbps: 675`, `cpuSlowdownMultiplier: 4`
- `screenEmulation`: `width: 375`, `height: 812`, `deviceScaleFactor: 3`, `mobile: true`, `disabled: false`

---

## 2. Results Before and After

| Metric / Budget Check | Required | Before (`trace-before.json`) | After (`trace-after.json`) | Status |
| --- | --- | --- | --- | --- |
| `[data-testid="size-grid"]` vertical movement | `<= 0 px` | `0 px` (`top = 369 px` at `load`/`fully-loaded`; pre-CSS DOM-parse sampler missed `document.documentElement` at `document-start`, intermediate run measured `71.875 px` pre-CSS shift) | `0 px` (`top = 369 px` across all `23` samples from DOM mutation through `fully-loaded`) | **PASS** |
| Cumulative Layout Shift (CLS) | `0` | `0` (`0` `LayoutShift` events in `19,038` trace events) | `0` (`0` `LayoutShift` events in trace; `0` in Lighthouse) | **PASS** |
| Lighthouse mobile Performance score | `>= 90` | `100` (`FCP 755 ms`, `LCP 1719 ms`, `TBT 14 ms`, `CLS 0`, `SI 755 ms`) | `100` (`FCP 629 ms`, `LCP 1724 ms`, `TBT 19 ms`, `CLS 0`, `SI 629 ms`) | **PASS** |
| Smallest size button dimension | `>= 44 CSS px` | `48 px` (`109 × 48 px` across all 26 buttons) | `48 px` (`109 × 48 px` across all 26 buttons) | **PASS** |
| Button count breakdown | `26` total (`4` sold out, `5` low stock, `17` in stock) | `26` total (`4` `size-button-sold-out`, `22` `size-button`: `5` low + `17` in stock) | `26` total (`4` `size-button-sold-out`, `22` `size-button`: `5` low + `17` in stock) | **PASS** |
| All 5 `data-testid` watched elements present | All 5 present | All 5 present (`size-grid`, `size-button`, `size-button-sold-out`, `main-photo`, `price`) | All 5 present (`size-grid`, `size-button`, `size-button-sold-out`, `main-photo`, `price`) | **PASS** |
| `main-photo` 3× DPR sizing | `1125 × 843` natural px inside `375 × 281` CSS px | `750 × 562` natural px (2×), `fetchPriority="low"` | `1125 × 843` natural px (3×), `fetchPriority="high"` | **PASS** |

### Screenshots & Trace Files
- Before trace: [trace-before.json](trace-before.json)
- Before screenshots: [before-first-paint.png](before-first-paint.png) (first paint), [before-fully-loaded.png](before-fully-loaded.png) (fully loaded)
- After trace: [trace-after.json](trace-after.json)
- After screenshots: [after-first-paint.png](after-first-paint.png) (first paint), [after-fully-loaded.png](after-fully-loaded.png) (fully loaded)

---

## 3. Every Layout Shift Found

- **Post-paint / CLS layout shifts**: **None** (`0` `layout-shift` PerformanceObserver entries and `0` Chrome trace `LayoutShift` events with score > 0 in both `trace-before.json` and `trace-after.json`).
- **Pre-CSS DOM-parse shift caught during intermediate verification**:
  - **Time**: During initial HTML parsing before external stylesheet download completed (prior to `first-paint`).
  - **Size**: `71.875 px` (`size-grid` `top` measured `440.875 px` during raw unstyled HTML parse, then snapped up to `369 px` once external Tailwind CSS arrived).
  - **Cause by `data-testid`**: `price` header block (`h1` + `p` + `data-testid="price"`) temporarily rendered with browser default element margins (`~160 px` total) instead of its Tailwind `h-[88px]` + Preflight margin reset while the external `<link rel="stylesheet">` was still in flight over Slow 4G.
  - **Status after fix**: Eliminated completely (`gridShiftMaxPx = 0`, `23` samples all at `369 px`).

---

## 4. Changes Made to Fix Each Finding

- `speed-budget.json`: Created repo-root budget file with `performance_score_min: 90`, `size_grid_shift_px_max: 0`, and `size_button_min_px: 44`.
- `src/app/pegasus-43/page.tsx`: Added `data-testid="main-photo"` on the hero `<img>`, `data-testid="price"` on the `$140` price element, and updated `fetchPriority="high"` on `main-photo` so the LCP image is prioritized without blocking SSR HTML.
- `src/components/SizePickerAndBag.tsx`: Added `data-testid="size-grid"` on the radiogroup container, `data-testid="size-button"` on all 22 available (in-stock and low-stock) buttons, and `data-testid="size-button-sold-out"` exclusively on the 4 sold-out buttons.
- `public/pegasus-43.svg`: Updated root SVG intrinsic dimensions from `750 × 562` to `1125 × 843` (keeping `viewBox="0 0 750 562"`) so `main-photo` is sized for a `3×` DPR `375 × 281` CSS px container.
- `next.config.ts`: Enabled `experimental: { inlineCss: true }` so Tailwind CSS is inlined directly into `<head>`, eliminating external stylesheet blocking and bringing `size-grid` pre-paint vertical movement down from `71.875 px` to `0 px` (and reducing FCP from `755 ms` to `629 ms`).

---

## 5. Assumptions and Anything Unmeasured or Unfixed

- **Assumptions**:
  - `data-testid="main-photo"` was placed on the `<img>` element (inside its fixed `h-[281px]` gray container) so Lighthouse and the check track the actual LCP image element.
  - Sold-out buttons (`data-testid="size-button-sold-out"`) keep `aria-disabled="true"` and no `onClick` handler (plus `tabIndex={-1}`) per the original brief while preserving full `109 × 48 px` dimensions inside the grid.
  - Because the interactive `chrome_devtools` MCP server could not attach to a pre-existing user Chrome `DevToolsActivePort` in this session, CDP tracing (`Tracing.start` / `Tracing.end` with exact Slow 4G + `4×` CPU + `375×812 @ 3×` emulation) and official Lighthouse audits (`throttlingMethod: "simulate"`, matching `Web_Platform_Slow_4G_Mobile_Check_Profile.yaml`) were executed programmatically against local headless Google Chrome driving `npm start`.
- **Anything unmeasured or unfixed**: `none`.
