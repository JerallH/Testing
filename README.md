# Pocket

A calm, mobile-friendly personal budget tracker built with React 19, TypeScript, Tailwind CSS 4, Vite, Lucide icons, and Recharts. No account or backend required.

## Run locally

Use **Node.js 22 or newer** and npm.

```bash
cd Testing
npm ci
npm run dev
```

Open **http://localhost:5173**. If you are already in the repository folder, skip `cd Testing`. Vite prints the actual URL if the port is busy. For a production build:

```bash
npm run build
npm run preview
```

Preview serves the built app at http://localhost:4173. Use a consistent host and port to keep using the same browser data.

## What’s included

- Monthly overview: income, expenses, net savings, and total budget remaining.
- Transaction create, edit, delete, search (description/category/notes), type and category filters. Navigate months to browse past entries.
- The standard categories plus custom categories in Settings.
- Independent category budgets for each month, progress bars, and overspending warnings. Set a category’s budget again or use Adjust to replace its monthly limit.
- Category spending donut and cumulative expense chart. The time chart includes the whole selected month, so the line stays flat on days without expenses.
- Savings goals with a target, amount saved, and deadline. Goal balances are manual, separate from transaction cash flow. Monthly net savings means income minus expenses, not goal contributions.
- Monthly recurring expenses. Due entries post once in the **current month** on app open, or while the app remains open (checked every minute). No backfilling of missed months. Days 29–31 use the last day for shorter months. Edits affect future entries; deleting a schedule keeps existing transactions. Deleting a posted transaction does not repost it.
- Transaction CSV export/import with quoted fields, validation before saving, duplicate detection, and automatic creation of imported categories. Transaction-view export uses current filters; Settings exports all months.
- SGD currency, dark mode, responsive navigation, keyboard focus, and accessible form controls.

## Sample data and storage

The first visit seeds realistic sample transactions, budgets, goals, and a subscription for the current month. A visible banner identifies them. Choose **Make it yours → Settings → Clear all data & samples** for a clean start. This clears **all financial data**, including anything you entered, after confirmation. Sample data is not automatically recreated after clearing.

All app data lives in **browser localStorage**, under the key **`pocket-budget-v1`**. This includes transactions, categories, budgets, savings goals, recurring schedules/posting history, appearance, and the sample-data flag. Nothing is sent to a server. There are no API keys, environment variables, or sign-in requirements.

Storage is scoped to the browser profile and site origin (scheme, host, port). Different browsers, devices, `localhost` vs `127.0.0.1`, or development vs preview ports have separate data. Clearing site data or using private browsing may erase your data. Keep exports before clearing storage. Multiple tabs do not merge concurrent edits; use one tab for editing.

**CSV backs up transactions only**, not budgets, goals, schedules, or preferences. For a complete manual backup, copy the localStorage entry using your browser’s developer tools. Browser storage is not encrypted; use a trusted device.

### CSV format

```csv
date,amount,type,category,description,notes
2026-10-17,18.50,expense,Food,Lunch,"Ramen, with a friend"
2026-10-01,4200,income,Salary,Monthly salary,
```

Dates must be valid `YYYY-MM-DD` dates; amounts must be positive and at least 0.01; type must be `income` or `expense`. Required fields are date, amount, type, category, and description. Notes are optional. Exact duplicates across these fields are skipped. An invalid row rejects the whole import without changing saved data. Imports can include any month; switch to that month to view them.

## Verify

```bash
npx playwright install chromium
npm test
npm run build
```

The Playwright suite runs desktop and mobile projects, covering transaction CRUD and persistence, category budgets and warnings, chart rendering and month navigation, savings-goal editing, custom categories, CSV import/export and duplicate detection, dark mode, sample removal, recurring posting, and page width.

If Chromium is already installed, use it instead of downloading a browser:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

In the provided cloud workspace, npm’s default cache directory may be unavailable. Use `npm ci --cache /workspace/.npm-cache` in that case.

## Folder structure

```text
src/
  components/Charts.tsx   # Spending donut and time chart
  lib/data.ts            # Types, sample data, storage, recurring posting
  lib/csv.ts             # CSV parsing, validation, export
  App.tsx                # Views, forms, navigation and state
  main.tsx               # Bootstrap and storage error boundary
  index.css              # Tailwind, visual theme and responsive styles
tests/flows.spec.ts       # End-to-end user flows
playwright.config.ts
```

This first version needs the local server to load the app; it does not install a service worker or support cloud synchronization.
