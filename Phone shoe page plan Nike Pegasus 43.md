# Phone shoe page plan: Nike Pegasus 43

Prepared for Hope Rivera. Screen width planned: 375 pixels. Product: Nike Pegasus 43, Black/White-Volt, style HV7521-001, $140, launching 2026-12-10.

## Goal

A runner opens the page on her phone, sees the shoe and its price, picks her size without anything moving, and adds it to her bag. This plan sets what she sees, in what order, and how much space each part gets, before anyone writes code.

## The problem this plan solves

On a slow connection the page loads in pieces. If a part is still loading and has no reserved space, everything below it jumps. When that happens just as a runner taps a size, she can tap the wrong size or think nothing happened. That leads to abandoned carts and wrong-size returns. The fix is that every part has a fixed height from the first moment, so the size buttons never move.

## Order of parts, top to bottom

1. Photo
2. Name and price
3. Size buttons
4. Add to bag
5. Reviews
6. Tech copy

Why this order: she sees the shoe first, then what it is and costs, then does the one thing she came to do. Reviews come before tech copy because most shoppers trust other runners more than specs. Both sit below the size buttons, so she has what she needs to buy before she scrolls.

## Fixed height for each part

All heights are proposed starting points to confirm in design.

| Part | Width | Fixed height | While loading |
| --- | --- | --- | --- |
| Photo | 375 px | 281 px (4:3 box) | Gray box, same size. Image is cropped to fill, never stretched. |
| Name and price | 375 px | 88 px | Gray bars for name and price. |
| Size buttons | 375 px | About 496 px (9 rows) | All 26 buttons drawn at full size right away. |
| Add to bag | 375 px | 56 px | Button shown, disabled until a size is picked. |
| Reviews | 375 px | Fixed box, set in design | Gray rows. |
| Tech copy | 375 px | Fixed box, set in design | Gray rows. |

Why a 4:3 photo and not a square: a 375 px square photo would push the size buttons almost off the first screen. The shorter photo brings the first rows of sizes into view on the first screen, so she can start picking without scrolling. This should be checked on a real phone before it is final.

## Size buttons

There are 26 sizes, shown in the order of the stock list (smallest to largest) and never reordered.

- Layout: 3 columns, 9 rows. Each label shows both men's and women's sizing (for example, M 9 / W 10.5), which needs about 110 px of width. Four columns would be too tight.
- Tap size: every button is at least 44 px tall, with 8 px gaps.
- In stock (17 sizes): normal button.
- Low stock (5 sizes, 5 or fewer left): still tappable. A small "low" mark sits inside the button. It must not change the button's height or width.
- Sold out (4 sizes): stays in its place at full tap size, faded with a line through it, and cannot be tapped. The grid never reshuffles, so a sold-out size never shifts the others.
- When she taps a size, it highlights right away, even before the network catches up, and the add to bag button reads "Add size \[size\] to bag".

### All 26 sizes

| # | Size (US) | EU | Status | Left |
| --- | --- | --- | --- | --- |
| 1 | M 3.5 / W 5 | 35.5 | Sold out | 0 |
| 2 | M 4 / W 5.5 | 36 | Low stock | 4 |
| 3 | M 4.5 / W 6 | 36.5 | In stock | 18 |
| 4 | M 5 / W 6.5 | 37.5 | In stock | 26 |
| 5 | M 5.5 / W 7 | 38 | In stock | 34 |
| 6 | M 6 / W 7.5 | 38.5 | In stock | 47 |
| 7 | M 6.5 / W 8 | 39 | In stock | 63 |
| 8 | M 7 / W 8.5 | 40 | In stock | 88 |
| 9 | M 7.5 / W 9 | 40.5 | In stock | 112 |
| 10 | M 8 / W 9.5 | 41 | In stock | 164 |
| 11 | M 8.5 / W 10 | 42 | In stock | 198 |
| 12 | M 9 / W 10.5 | 42.5 | Low stock | 3 |
| 13 | M 9.5 / W 11 | 43 | Low stock | 2 |
| 14 | M 10 / W 11.5 | 44 | Sold out | 0 |
| 15 | M 10.5 / W 12 | 44.5 | In stock | 212 |
| 16 | M 11 / W 12.5 | 45 | Low stock | 5 |
| 17 | M 11.5 / W 13 | unlisted | In stock | 176 |
| 18 | M 12 / W 13.5 | unlisted | In stock | 138 |
| 19 | M 12.5 / W 14 | unlisted | In stock | 84 |
| 20 | M 13 / W 14.5 | unlisted | In stock | 71 |
| 21 | M 13.5 / W 15 | unlisted | In stock | 36 |
| 22 | M 14 / W 15.5 | unlisted | In stock | 29 |
| 23 | M 14.5 / W 16 | unlisted | In stock | 14 |
| 24 | M 15 / W 16.5 | unlisted | Low stock | 1 |
| 25 | M 15.5 / W 17 | unlisted | Sold out | 0 |
| 26 | M 16 / W 17.5 | unlisted | Sold out | 0 |

## Reviews and tech copy

Reviews and tech copy both sit below add to bag, reviews first. A runner needs to scroll to reach them. An optional small star rating next to the price can give a quick trust signal without adding any height to the size area, with the full reviews staying lower down.

## What loads first on a slow connection

1. The page skeleton with every reserved box.
2. The size buttons and add to bag, so she can act early.
3. The photo, then the name and price text.
4. Reviews and tech copy last.

## How we will know it works

- Layout shift around the size buttons on a throttled slow connection (target: none).
- How often a runner taps more than one size before adding to bag.
- Add-to-bag rate on the shoe page.
- Returns for wrong size.

## Decisions for Hope

- Confirm the 4:3 photo height of 281 px, or choose another.
- Confirm the low-stock mark style.
- Confirm that sold-out sizes stay in place.
- The stock list has no EU size for sizes 17 to 26, so decide whether to show EU sizes at all.
