# Prompt notes: Nike Pegasus 43 phone page

These notes cover the prompts I gave to build the page and make it pass the Slow 4G mobile launch check, why I wrote each one the way I did, and what came back. The trace results are in `trace-report.md`.

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

## What came back

Details are in `trace-report.md`. In short, all three budget keys pass: performance score 100, size grid movement 0 px, and a smallest button of 48 px (all 26 buttons are 109 × 48). The 4 sold-out, 5 low-stock and 17 in-stock counts match the stock list. The fixes were the five `data-testid` attributes, a 3x-sized photo loaded at high priority inside its fixed 281 px box, and inlining the CSS so the header can't use default margins before the stylesheet arrives.

## What I checked and what I didn't

- The "before" trace showed 0 px of grid movement. The 71.875 px shift the agent found happened earlier, before first paint, in an intermediate check. The launch check measures from first paint, so that shift probably wouldn't have failed it. Inlining the CSS is still a worthwhile change.
- The agent couldn't connect to Chrome DevTools MCP, so it ran headless Chrome with the profile's settings instead.
- All measurements are from `localhost`. The profile says the check reads the live Vercel page, so I still need to deploy and rerun it.
- `inlineCss` is an experimental Next.js setting. I need to confirm the Vercel production build keeps it.
- I didn't ask for EU sizes on the buttons. Whether to show them is still a design decision.