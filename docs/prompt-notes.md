# Prompt notes: Nike Pegasus 43 phone page

These notes cover the prompts I gave to build the page and make it pass the Slow 4G mobile launch check, why I wrote each one the way I did, and what came back. The local trace results are in `trace-report.md` and the live Vercel results are in `live-lighthouse-report.md`.

## The problem I was solving

On a slow phone connection a shoe page loads in pieces. A part with no reserved space grows when it finishes loading and pushes everything below it down. If that happens as a runner taps her size, she can tap the wrong size or think nothing happened. That leads to abandoned carts and wrong-size returns. My approach: give every part a fixed height from the first paint, and render the size buttons first, so the size grid never moves.

## Prompt 1: the plan doc (Claude)

**What I asked for:** a phone shoe page plan, written from my own decisions and the Pegasus 43 size and stock list.

**What I told it:**
- The screen is 375 px wide. Order of parts, top to bottom: photo, name and price, size buttons, add to bag, reviews, tech copy.
- Every part has a fixed height. The photo is a 4:3 box (375 × 281 px), cropped to fit and never stretched.
- The size buttons are 3 columns by 9 rows in the stock list's order, each at least 44 × 44 px.
- Sold-out sizes stay in place at full size, faded with a line through them and not tappable. Low-stock sizes stay tappable with a small mark that doesn't change the button's size.

**Why:**
- Reviews come before tech copy because shoppers trust other runners more than specs, and both sit below the size buttons so she can buy first.
- The list has 26 sizes, which is about 496 px of buttons. I checked that against the first screen and shortened the photo from a square to 4:3 so the first sizes show without scrolling.
- Name, colorway ($140, Black/White-Volt) are the same for all 26 sizes, so they sit once in one 88 px block under the photo and not on every button.

**Correction I made:** the first version of the plan said sizes 17 to 26 had no EU size. I rechecked the list, found EU sizes for all 26, and fixed the plan.

## Prompt 2: the build (Antigravity)

**What I asked for:** the page as a working Next.js app (App Router, TypeScript) with Tailwind CSS, reading the sizes from the JSON and not hard-coding them.

**Key instructions:**
- All 26 buttons render on the server in the first response, so they appear before any JavaScript loads.
- System font stack only, so a font swap can't resize text above the grid.
- Reviews and tech copy load lazily and come last.
- The instruction "tapping a size highlights it immediately, with no network request."
- A hand-back section: a project I can run with `npm install` and `npm run dev`, and a README with how to run it, assumptions and results.

**Why:** a page that only reserves space in CSS but loads its sizes with JavaScript afterward would still fail on a slow connection. Server rendering is what keeps the buttons from arriving late.

## Prompt 3: the speed budget, the trace and the fixes (Antigravity)

**Source:** Diego Salazar's `Web_Platform_Slow_4G_Mobile_Check_Profile.yaml`. I told the agent to read it first and use its values, not its own numbers.

**What I asked for:**
1. `speed-budget.json` at the repo root with exactly three keys: `performance_score_min: 90`, `size_grid_shift_px_max: 0`, `size_button_min_px: 44`. These are the required values. I may go stricter but never looser, and no key may be missing or extra.
2. Five `data-testid` attributes, because the check fails if it can't find them: `size-grid`, `size-button`, `size-button-sold-out` (sold-out buttons use this one), `main-photo` and `price`.
3. A trace under the profile's settings: 375 × 812 viewport at 3x with mobile on, Slow 4G (150 ms round trip, 562.5 ms request latency, 1474.56 Kbps down, 675 Kbps up) and a 4x CPU slowdown, on the production build and not the dev server.
4. Every layout shift, with its cause named by `data-testid`, then a fix for each, then the measurement again.
5. A report with the settings applied, results before and after, shifts found, changes made, and anything unmeasured.

**Correction I made:** my first test brief used slow 3G. The profile specifies Slow 4G, so I replaced it. A trace under other settings wouldn't match the launch check.

## Prompt 4: the 8 December snapshot, sold-out clarity, Vercel deploy and live Lighthouse runs (Antigravity)

**What I asked for:**
1. Replace the size data with `Pegasus_Size_and_Stock_Snapshot__8_December_2026.json` (`26` sizes: `9` sold out, `7` low stock, `10` in stock), keeping `display_order` and not hard-coding any size, status or count.
2. Make sold-out sizes clear without relying on colour alone: keep each at full size (`109 × 48 px`), faded with a line through the label and readable contrast, add visually hidden `"sold out"` text inside the button plus an `aria-label` ending in `"sold out"`, keep `aria-disabled="true"`, `tabIndex={-1}`, no click handler, no `"low"` mark, and `data-testid="size-button-sold-out"`.
3. Confirm `npm run build` passes, `experimental: { inlineCss: true }` stays in `next.config.ts`, and all five `data-testid` attributes are present, then commit and push to GitHub without secrets.
4. Deploy to production on Vercel (`nike-pegasus43`) and confirm `/pegasus-43` returns `200` with no Deployment Protection block.
5. Run Lighthouse CLI 3 times against the live URL using the exact settings in `Web_Platform_Slow_4G_Mobile_Check_Profile.yaml`, confirm `configSettings` matched the profile, report all 3 scores and the median, and check the live page against `speed-budget.json` (plus tap checks on sold-out and in-stock buttons).
6. Hand back `docs/live-lighthouse-report.md`, the 3 Lighthouse JSON files, a 375 px live screenshot, and `docs/phone-test.md` for a real-phone check before submission.

## What came back

Local trace details are in `trace-report.md`, and live Vercel results are in `live-lighthouse-report.md`. On the live URL (`https://nike-pegasus43.vercel.app/pegasus-43`, deployment `dpl_4Q3gPp8oJKdUtHTooZuAWxXXwMB7`), all three budget keys pass:
- `performance_score_min`: **100** across all 3 Lighthouse CLI runs (`100`, `100`, `100`; median **100**; required `>= 90`).
- `size_grid_shift_px_max`: **0 px** (`top = 369 px` across all 24 Slow 4G samples, `CLS = 0`; required `<= 0 px`).
- `size_button_min_px`: **48 CSS px** (`109 × 48 px` across all 26 buttons: `9` `size-button-sold-out`, `17` `size-button` with `7` low stock and `10` in stock; required `>= 44 CSS px`).
- Sold-out buttons use `#52525B` text on `#F5F5F7` (`~7.0:1` contrast) with a dashed `#D1D1D6` border, `1.5 px` strikethrough, `<span className="sr-only">, sold out</span>`, and `aria-label` ending in `"sold out"`.

## What I checked and what I didn't

- The earlier "before" trace showed 0 px of grid movement, while an intermediate pre-CSS check caught a `71.875 px` shift before first paint. Inlining CSS (`experimental: { inlineCss: true }`) fixed that pre-paint shift as well.
- The agent couldn't connect to Chrome DevTools MCP, so it ran Lighthouse CLI and headless Chrome via CDP with the profile's exact settings instead.
- All live measurements are from `https://nike-pegasus43.vercel.app/pegasus-43` (HTTP `200`, deployment `dpl_4Q3gPp8oJKdUtHTooZuAWxXXwMB7`): 3 Lighthouse CLI runs all scored `100` (median `100`), `[data-testid="size-grid"]` vertical movement was `0 px`, `CLS` was `0`, and the smallest button dimension was `48 CSS px`.
- Confirmed the Vercel production build kept `experimental: { inlineCss: true }` (CSS is inlined in `<head>` in the live response and `size-grid` stays at `369 px` from the first DOM mutation).
- `docs/phone-test.md` now records the real-phone check on `https://nike-pegasus43.vercel.app/pegasus-43`: confirmed everything looks great on mobile with no jumps or layout shifts.
- Added `.github/workflows/lighthouse-budget.yml` and `scripts/check-speed-budget.mjs` so every pull request and Vercel deploy automatically checks Lighthouse and `size-grid` shift against `speed-budget.json`.
- I didn't ask for EU sizes on the buttons. Whether to show them is still a design decision.
