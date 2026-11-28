# Live Production Lighthouse & Slow 4G Report — Nike Pegasus 43

- **Production URL**: `https://nike-pegasus43.vercel.app/pegasus-43` (root `https://nike-pegasus43.vercel.app` redirects to `/pegasus-43`)
- **Deployment URL**: `https://nike-pegasus43-4rdoalmrr-zero-985a.vercel.app`
- **Deployment ID**: `dpl_4Q3gPp8oJKdUtHTooZuAWxXXwMB7`
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
| Run 1 | **100** | `768 ms` | `782 ms` | `5 ms` | `0` | `768 ms` | [lighthouse-live-1.json](lighthouse-live-1.json) |
| Run 2 | **100** | `792 ms` | `1427 ms` | `11 ms` | `0` | `792 ms` | [lighthouse-live-2.json](lighthouse-live-2.json) |
| Run 3 | **100** | `780 ms` | `1080 ms` | `5 ms` | `0` | `2057 ms` | [lighthouse-live-3.json](lighthouse-live-3.json) |
| **Median** | **100** | **`780 ms`** | **`1080 ms`** | **`5 ms`** | **`0`** | **`792 ms`** | — |

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
- `public/pegasus-43.svg`: Upgraded the `1125 × 843` (`3×` DPR) studio vector illustration with multi-stop studio lighting, sculpted ReactX midsole grooves, Flywire lace accents, waffle lugs, and heel stabilizer.
- `src/app/pegasus-43/page.tsx`: Refined editorial header typography (`#111111` / `#6E6E73`, `tabular-nums` `$140`) and `#EBEBED` studio backdrop inside the fixed `281 px` and `88 px` slots.
- `src/components/SizePickerAndBag.tsx`: Upgraded tiles to `rounded-[14px]` with subtle surface depth, `touch-manipulation`, refined Volt `LOW` pills, high-contrast `#52525B` on `#F5F5F7` (`~7.0:1`) sold-out tiles with dashed border, `1.5 px` strikethrough, and `<span className="sr-only">, sold out</span>`, plus a Nike-style Add to bag pill with shopping bag & Volt checkmark states.
- `src/components/ReviewsSection.tsx`, `src/components/TechCopySection.tsx`, `src/components/SectionSkeletons.tsx`: Refined Pinterest-style `rounded-[18px]` `#F5F5F7` editorial cards and 2×2 spec bento grid with vector micro-icons and matching fixed-height skeletons.
- `.gitignore`: Added `.vercel` and `.env*` so deployment metadata and secrets are never committed.

---

## 6. Assumptions and Anything Unmeasured or Unfixed

- **Assumptions**:
  - Deployed to Vercel production (`--prod`) under the signed-in Vercel account (`smitdoesdesign-1518`, team `zero-985a`, project `nike-pegasus43`), connected to GitHub repository `https://github.com/smitdesigns/nike-pegasus43`.
  - Used `#52525B` text on `#F5F5F7` (`~7.0:1` WCAG contrast) plus a dashed `#D1D1D6` border and strikethrough so sold-out buttons remain visibly muted yet readable outdoors in daylight without relying on colour alone.
  - Because `docs/live-lighthouse-report.md`, `docs/live-pegasus-375.png`, and the three Lighthouse JSON artifacts are generated after deploying and testing the live URL, committing these documentation files to GitHub does not alter application code.
- **Anything unmeasured or unfixed**: `none`.
