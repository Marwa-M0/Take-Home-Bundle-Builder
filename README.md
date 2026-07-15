# Security System Builder

A two-column "build your system" experience: a 4-step accordion builder on the left and a live
**Your security system** review panel on the right, matching the provided Figma design.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # oxlint
```

Stack: React 19 + Vite. No UI libraries — styling is hand-written CSS (`src/index.css`) with
design tokens sampled directly from the Figma export.

## How it works

- **Data-driven:** everything renders from [`src/data/products.json`](src/data/products.json) —
  steps (title, icon, which category they show), products (pricing, badge, variants, seed
  quantities), plans, and the shipping row. Adding a product to the JSON adds it to the builder
  and the review panel with no component changes.
- **State model:** quantities are stored per `productId:variantId` key. Each color variant has
  its own count; the card's stepper is bound to the currently selected chip, and every variant
  with a count above zero gets its own review-panel line.
- **Seed state** is derived from the JSON (`seedQty`, `seeded` plan) so the app loads exactly
  like the design: Cam v4 ×1, Cam Pan v3 ×2, Motion Sensor ×2, Sense Hub ×1 (required,
  steppers disabled), MicroSD ×2, Cam Unlimited plan.
- **Persistence:** "Save my system for later" writes the full configuration to
  `localStorage` (`wyze_system_config_v1`); it is restored on the next visit. Corrupt or missing
  data falls back to the seed state.
- **Checkout** is a placeholder (toast), as allowed by the brief.

## Design decisions & known deviations

- **Product imagery** is cropped from the supplied Figma export PNGs (`public/images/`). The
  sensor/accessory images only appear at thumbnail size in the design, so those crops are small;
  swap in real product photography when available.
- **Cam Pan v3 pricing:** the design is internally inconsistent — the card shows
  ~~$39.98~~ $34.98/unit while the review panel's line implies $23.99/unit (total $187.89).
  The card price was kept as the source of truth, so the seeded total computes to **$209.87**.
  The savings figure ($50.92) matches the design either way.
- **Steps 2–4 expanded states** are not shown in the provided design exports; they reuse the
  step-1 card language (plan cards behave as a radio group).
- **"as low as $X/mo"** is computed as total ÷ 12; the design's $19.19 doesn't correspond to a
  derivable formula.
- **Variant chip thumbnails** reuse the product image for every color (the design uses a
  per-color thumbnail; only one photo per product exists in the exports).
- Collapsed steps hide the "N selected" count on desktop and show it on mobile, matching the
  desktop and mobile mocks respectively.
