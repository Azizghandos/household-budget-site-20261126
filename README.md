# household-budget-site-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Azizghandos/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Azizghandos/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**RumahBudget** — a working household budget site for a fictional Indonesian family — the Santosos of Bandung — for November 2026. All amounts are in Indonesian rupiah (Rp) and every figure is internally consistent: income Rp 12,500,000 = spending Rp 9,800,000 + savings Rp 2,700,000, and each category total equals the sum of its transactions.

## What it covers

- **Overview** — income, spending, savings, savings rate, budget health, a spending-by-category donut chart, upcoming bills, latest transactions.
- **Budget planner** — monthly budget per category with planned-vs-spent bars and remaining amounts; edit any budget and the bars update live.
- **Transactions** — the full November ledger (34 entries) with search, category filter, sortable columns, and an add-transaction form that updates every total.
- **Bills & subscriptions** — recurring bills with due dates and working mark-paid toggles.
- **Savings goals** — emergency fund, children's education, family holiday, new motorcycle, each with target, progress and monthly contribution.
- **Reports** — six months of income vs spending (Jun–Nov 2026), a savings-rate trend line, a category trend table, and the 50/30/20 rule against this household's real split.

## How to run

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser or on a phone. No build step, no network requests: the site is static files under `app/` (system fonts only, charts are hand-drawn inline SVG).

## Files

- `app/index.html`, `app/style.css` — shell and styling
- `app/data.js` — all figures (the single source of truth)
- `app/charts.js` — SVG donut, bar and line chart builders
- `app/views.js` — hash-router pages
- `app/main.js` — boot and controls (search, filter, sort, add, edit, mark paid)
- `app/shots.js` — deterministic screenshot scenes via `?shot=…`
- `main.ts` — hand-in program (`mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`)

## Data note

The Santoso household is fictional. Figures are realistic, rounded examples for November 2026 — not any real family's finances.

<sub>Entered on [make.fun](https://make.fun/?ref=660zm28c&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
