# CLAUDE.md — Portfolio Web

AI assistant context for this project. Read this before touching code.

---

## What This Project Is

Single-owner portfolio website. One user account (the site owner). Public visitors browse the portfolio; the owner manages content through `/admin`.

---

## Key Docs to Read First

| Doc | When to read |
|-----|-------------|
| [README.md](./README.md) | Tech stack, project structure, env vars |
| [docs/api/README.md](./docs/api/README.md) | API conventions and all route groups |
| [docs/database/README.md](./docs/database/README.md) | MongoDB collections and relationships |
| [docs/api-design.md](./docs/api-design.md) | Response format standards (GET/POST/PATCH/DELETE/Upload) |

---

## Architecture Decisions

### Route Groups

- `(public)` — public-facing pages (SSR, no auth)
- `(admin)/admin` — dashboard (session-protected, client-heavy)
- `api/v1/` — REST API; `admin/*` requires NextAuth session

### Module Structure

Each feature lives in `src/modules/{public|admin}/{feature}/`. Admin modules contain:
- `components/` — React components
- `hooks/` — React Query hooks (`useXxxQueries.ts`)

### API Response Format

Always follow `docs/api-design.md`. Key rules:
- Paginated GET → `{ payload, total_count, page_size, page }`
- Non-paginated GET → return entity directly (no wrapper)
- Mutations → `{ success: true }` or `{ success: false, message }`
- Upload → `{ success: true, payload: { imageId, url } }`

### Image Flow

1. User picks file → `POST /api/v1/admin/upload` → returns `{ imageId, url }`
2. Form stores `imageId` in form state
3. On form save → `imageId` is sent to the resource API (project, user, etc.)
4. Image `isPending` stays `true` until linked; orphans are cleanup candidates

### Auth

NextAuth v5. Session provided via `SessionProvider` in `AdminProviders`. Server layout passes `session` to avoid an extra client round-trip.

---

## Gotchas

- `globals.css` sets `body { overflow: hidden }` for the public scroll container. Admin content scrolls inside `<main>` which has `height: calc(100dvh - 64px); overflow-y: auto`.
- All timestamps are Unix seconds (`dayjs().unix()`), not milliseconds.
- `slug` on Tag/Stack is generated at creation via pinyin-pro and never updated.
- `password` field on User has `select: false` — never returned in queries.

---

## Current Branch

`feat/migration-dashboard-merge` — Phase 4 (cleanup) steps 1–5 complete:
- Removed unused deps (`@emotion/styled`, `jose`)
- Deleted dead code (`proxy.ts`, `rate-limit.ts`, `types/api.ts`, stale TODO comment)
- Cleaned env vars (`.env.example`, `README`)
- Updated `README.md` (env vars, project structure)

Remaining: Step 6 — Full Flow Test (public + admin).  
See `todos/20260405_portfolio-merge-phases.md` for checklist.
