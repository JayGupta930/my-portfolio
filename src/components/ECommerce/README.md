# Illustrated e-commerce case study

Route: `/ecommerce`. Existing portfolio navigation, contact links, actual project previews, and Back to Projects are preserved.

## Reading paths

The default page presents three concise illustrated overview steps: Problem, Storefront, and Admin. Each has a numbered label, one-sentence explanation, meaningful annotations, and an optional link into the detailed chapter. The overview remains complete when all detailed chapters are closed.

“Want to See How It All Comes Together?” contains three native, keyboard-accessible details elements. They hold the five illustrated problems, the working storefront, and the working admin dashboard. Fragment links open enclosing accordions before scrolling and moving focus. Actual Weebster and Fox Creation project previews remain separate below the conceptual story.

## Components

- `../../pages/ECommerceCaseStudy.jsx`: overview structure, expandable chapters, fragment navigation, chapter tracking, local orders, and actual-project previews.
- `Overview.css`: compact overview compositions and detailed chapter styles.
- `Illustrations.jsx`: existing hand-drawn SVG building blocks.
- `CommerceDemo.jsx` / `PremiumDemo.css`: overview UI illustrations plus the working fictional Little Store and control room, consistently styled in navy, purple, and lavender.
- `Storytelling.jsx` / `Storytelling.css`: scattered-chat overview illustration, five distinct problem scenes, ecosystem transition, journey, admin explanations, and before/after scenes.
- `projectData.js`: separate actual-project screenshots and verified link fields.

No new runtime dependencies or image assets. All conceptual visuals use SVG, CSS, and React.

## Local demonstration

Choose S/M/L/XL for a garment, add to the bag, and place a sample order. Different sizes remain separate lines. Following the order opens the admin chapter, where Overview and Orders display it. Orders can be processed and reset. Closing/reopening a chapter preserves state; leaving/reloading resets it.

Six dashboard views contain fictional orders, products, stock, customer records, and read-only settings. Date controls update the sample chart; chart points expose values by hover and keyboard focus. Overview and full-dashboard counters animate once when their respective panels enter the viewport, over 1.1 seconds. Closed chapters do not trigger counters. Reduced motion shows final values immediately. All business metrics and stock counts are illustrative; demo orders do not change these fixed snapshots. No backend, personal data collection, or payment processing.

## Verification — 2026-10-11

- Production build passed; targeted case-study ESLint passed.
- Full repository lint still reports 22 pre-existing errors and 25 warnings in unrelated files.
- Chromium checks at 320, 390, 768, and 1440 pixels passed: collapsed-by-default detail chapters, three overview steps/anchors, active chapter tracking, heading offsets, no horizontal page overflow, keyboard accordion activation, size-aware cart, sample checkout, automatic dashboard reveal, processing/reset, all six admin views, and keyboard chart values.
- Counters verified before/after viewport entry, with collapsed detail chapters, after reopening, and under reduced motion.
- Direct entry to `/ecommerce#storefront-demo` opens and reveals the interactive storefront.
- Desktop, tablet, and mobile overview and storefront screenshots visually reviewed.
- QA scripts: `.ecommerce-qa/refinement-verify.mjs` and `.ecommerce-qa/refinement-visual.mjs`.
