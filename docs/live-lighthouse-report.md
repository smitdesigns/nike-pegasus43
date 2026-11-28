# Live Production Lighthouse & Slow 4G Report — Nike Pegasus 43

- **Production URL**: `https://nike-pegasus43.vercel.app/pegasus-43` (root `https://nike-pegasus43.vercel.app` redirects to `/pegasus-43`)
- **Deployment URL**: `https://nike-pegasus43-2itadhxno-zero-985a.vercel.app`
- **Deployment ID**: `dpl_3CXfd8wqqQTJMJtCFp6BF178Ddsq`
- **HTTP Verification**: `HTTP/1.1 200 OK` (`X-Matched-Path: /pegasus-43`, `X-Nextjs-Prerender: 1`)
- **Profile**: `Web_Platform_Slow_4G_Mobile_Check_Profile.yaml`

---

## 1. Settings Used and Confirmation Each Matched the Profile

Read back from `lhr.configSettings` in [lighthouse-live-1.json](lighthouse-live-1.json), [lighthouse-live-2.json](lighthouse-live-2.json), and [lighthouse-live-3.json](lighthouse-live-3.json):

| Setting | Profile Value | Measured `configSettings` | Match |
| --- | --- | --- | --- |
| `formFactor` | `mobile` | `"mobile"` | Yes |
| `throttlingMethod` | `simulate` | `"simulate"` | Yes |
| `throttling.rttMs` | `150` | `150` | Yes |
| `throttling.throughputKbps` | `1638.4` | `1638.4` | Yes |
| `throttling.requestLatencyMs` | `562.5` | `562.5` | Yes |
| `throttling.downloadThroughputKbps` | `1474.56` | `1474.56` | Yes |
| `throttling.uploadThroughputKbps` | `675` | `675` | Yes |
| `throttling.cpuSlowdownMultiplier` | `4` | `4` | Yes |
| `screenEmulation.width` | `375` | `375` | Yes |
| `screenEmulation.height` | `812` | `812` | Yes |
| `screenEmulation.deviceScaleFactor` | `3` | `3` | Yes |
| `screenEmulation.mobile` | `true` | `true` | Yes |
| `screenEmulation.disabled` | `false` | `false` | Yes |

The live Slow 4G CDP verification also confirmed `window.innerWidth === 375`, `window.innerHeight === 812`, `window.devicePixelRatio === 3`, `navigator.maxTouchPoints === 5`, `Network.setCacheDisabled(true)`, Slow 4G network (`562.5 ms` latency, `1474.56 Kbps` down, `675 Kbps` up), and `4×` CPU slowdown.

---

## 2. Three Lighthouse Runs and Median

| Run | Performance Score | FCP | LCP | TBT | CLS | Speed Index | JSON Artifact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Run 1 | **100** | `1135 ms` | `1259 ms` | `6 ms` | `0` | `1376 ms` | [lighthouse-live-1.json](lighthouse-live-1.json) |
| Run 2 | **100** | `802 ms` | `1436 ms` | `17 ms` | `0` | `802 ms` | [lighthouse-live-2.json](lighthouse-live-2.json) |
| Run 3 | **100** | `798 ms` | `924 ms` | `24 ms` | `0` | `798 ms` | [lighthouse-live-3.json](lighthouse-live-3.json) |
| **Median** | **100** | **`802 ms`** | **`1259 ms`** | **`17 ms`** | **`0`** | **`802 ms`** | — |

---

## 3. Live Page Budget & Element Verification

| Check | Required | Measured on Live Page | Result |
| --- | --- | --- | --- |
| `performance_score_min` | `>= 90` | **100** (median across 3 runs: `100, 100, 100`) | **PASS** |
| `size_grid_shift_px_max` | `<= 0 px` | **0 px** (`top = 369 px` across all 24 samples from DOM mutation to fully loaded) | **PASS** |
| `size_button_min_px` | `>= 44 CSS px` | **48 CSS px** (`109 × 48 CSS px` across all 26 buttons) | **PASS** |
| Layout shift score (CLS) | `0` | **0** (`0` shifts in CDP + all 3 Lighthouse runs) | **PASS** |
| All 5 `data-testid` elements present | All 5 | `size-grid`, `size-button`, `size-button-sold-out`, `main-photo`, `price` all present | **PASS** |
| Size button counts | `26` total (`9` sold out, `7` low stock, `10` in stock) | `26` total (`9` `size-button-sold-out`, `17` `size-button`: `7` low stock + `10` in stock) | **PASS** |
| Sold-out tap test (`M 9 / W 10.5`) | No selection, bag disabled, `0 px` grid shift | `aria-checked="false"`, Add to bag disabled (`"Add to bag"`), `gridTop = 369 px` | **PASS** |
| In-stock tap test (`M 9.5 / W 11`) | Highlights immediately, bag reads `"Add size M 9.5 / W 11 to bag"`, `0 px` grid shift | `aria-checked="true"`, Add to bag enabled (`"Add size M 9.5 / W 11 to bag"`), `gridTop = 369 px` | **PASS** |

Live 375 px screenshot: [live-pegasus-375.png](live-pegasus-375.png)

---

## 4. Layout Shifts Found and Causes

- **None**: `0` layout shifts were observed across all 3 Lighthouse runs (`CLS = 0`) and across all `24` DOM/paint/load samples on the live Slow 4G CDP run (`gridTopMin = 369 px`, `gridTopMax = 369 px`).

---

## 5. What Was Changed

- `data/pegasus-sizes.json`: Replaced size snapshot with the 8 December 2026 inventory (`26` sizes: `9` sold out, `7` low stock, `10` in stock).
- `src/components/SizePickerAndBag.tsx`: Improved sold-out text contrast to `#52525B` on `#F4F4F5` (`~7.0:1`), added a dashed `#D4D4D8` border, `1.5 px` strikethrough, and `<span className="sr-only">, sold out</span>` inside sold-out buttons while keeping `aria-label` ending in `"sold out"`, `aria-disabled="true"`, `tabIndex={-1}`, and `data-testid="size-button-sold-out"`.
- `.gitignore`: Added `.vercel` and `.env*` so deployment metadata and secrets are never committed.

---

## 6. Assumptions and Anything Unmeasured or Unfixed

- **Assumptions**:
  - Deployed to Vercel production (`--prod`) under the signed-in Vercel account (`smitdoesdesign-1518`, team `zero-985a`, project `nike-pegasus43`), connected to GitHub repository `https://github.com/smitdesigns/nike-pegasus43`.
  - Used `#52525B` text on `#F4F4F5` (`~7.0:1` WCAG contrast) plus a dashed `#D4D4D8` border and strikethrough so sold-out buttons remain visibly muted yet readable outdoors in daylight without relying on colour alone.
  - Because `docs/live-lighthouse-report.md`, `docs/phone-test.md`, `docs/live-pegasus-375.png`, and the three Lighthouse JSON artifacts are generated after deploying and testing the live URL, committing these documentation files to GitHub does not alter application code (`src/`, `data/`, `public/`, `speed-budget.json`, `next.config.ts`).
- **Anything unmeasured or unfixed**: `none`.
