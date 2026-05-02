# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Artifacts

### `artifacts/fishbowl-roulette` (`@workspace/fishbowl-roulette`)

Landing page for the Fishbowl Roulette podcast at fishbowlroulette.com. Pure React + Vite frontend, talks to `@workspace/api-server` for episode list (`/api/podcast/episodes`).

- Warm cinematic brand: Playfair Display (serif headings), Lato (body)
- Brand palette: dark espresso backgrounds (#1a1210, #241816), warm parchment neutrals (#f1e3d3), burgundy (#8f2f2a), gold (#c49a6c)
- **Section order (top → bottom)**: Header → Hero → Episodes → Cards (Pull a Question) → About (I'm Sandra) → Email capture / Follow → Footer
- **Header nav**: links are `Listen to All Episodes` / `About` / `Follow` (no duplicate Episodes link). While the header is unscrolled it floats over the always-dark tavern hero, so nav text and the mobile hamburger render cream-on-dark in BOTH themes (with a subtle text-shadow). Once scrolled past the hero, the header gains a themed background and the nav reverts to theme-aware colours (warm cream in dark mode, deep brown in light mode).
- **Hero**: cinematic tavern-bokeh photo background (`public/images/tavern-bg.png`, used in both light and dark mode with a dark gradient overlay for legibility); left column = headline + intro + red `Listen to All Episodes` CTA (scrolls to `#episodes` AND expands every episode card via `openPlayerAndScroll()` → `setAllExpanded(true)`) + cream `Follow the Show` CTA (`#join`); right column = animated `<RouletteWheel size="min(440px, 82vw)" />`
- **Episodes section** (`#episodes`): heading "CHOOSE YOUR EPISODE". Single collapsible list (collapsed by default). Top red `Listen to All Episodes / Collapse All` toggle expands/collapses every card via `expandedGuids: Set<string>` state. Per-card chevron also toggles individually. Audio uses native `<audio controls preload="metadata">` — **no autoPlay anywhere** (playback is always user-initiated). Each card shows episode number, category badge, pub date (via `formatPubDate`), and duration; expanded body shows full description + audio player + Podbean link. Loading/error states preserved.
- **Try Your Luck section** (`#cards`): tavern-bg background (matches hero) with cream-on-dark text. Header eyebrow "TRY YOUR LUCK" + "Try Your Luck" headline + subhead about pulling/submitting questions. Two pill CTAs: red `Pull a Question` (calls `handlePullQuestion()`) + cream outline `Submit a Question` (anchors to `#join`). Below: animated reveal panel (Framer Motion `AnimatePresence`, keyed on question text) shows the pulled question in a parchment card with a colored bowl badge + "Pull another"/"Close" buttons. Below that: the existing fishbowl image (now a `<motion.button>` with aria-label — clicking it pulls a question) flanked by 3 parchment category cards (Beliefs / Relationships / Wildcards centered below). Footer block: "HOW IT WORKS" divider + 3 numbered steps (01 We sit down, 02 We pull a question, 03 We answer it). Question pool is an inline `QUESTION_BOWLS` constant — 5 bowls (Beliefs, Hot Topics, Relationships, Wildcards, Personal) × 5 questions each — with a `pickRandomQuestion(prevText)` helper that retries to avoid immediate repeats.
- Pull-a-Question, email signup, Privacy page, social links — all preserved untouched.
- Host photo at `public/images/sandra-portrait.png` (AI generated placeholder; replace with real photo)
- Framer Motion animations, responsive mobile-first design
- `previewPath: "/"`

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
