# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JobsTrack is a job-search management app. It has two services:

- `frontend/` — Next.js 16 (React 19), TypeScript, TailwindCSS v4, shadcn/ui
- `backend/` — FastAPI (Python 3.10), Supabase (PostgreSQL), uvicorn

## Development Commands

### Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

Required env vars (see `backend/.env.example`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — Supabase project credentials (service role key, not anon)
- `JSEARCH_API_KEY` — RapidAPI key for the JSearch endpoint
- `FRONTEND_URL` — CORS origin (default `http://localhost:3000`)

### Frontend

```bash
cd frontend
npm run dev      # development server
npm run build    # production build
npx tsc --noEmit # type-check only
```

Required env var: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000` in `frontend/lib/api.ts`).

## Architecture

### Authentication

The app is fully anonymous — there is no login. A UUID is generated on first visit and stored in `localStorage` as `jt_user_id`. Every API call sends it as the `X-User-Id` header. The backend uses this to scope all Supabase queries to that user.

### Backend structure

- `main.py` — FastAPI app, CORS config, router registration
- `database.py` — singleton Supabase client (`get_db()`)
- `models.py` — Pydantic request/response models
- `routers/jobs.py` — `GET /api/jobs?company=` — fetches from JSearch, caches in `jobs_cache` for 6 hours (shared across users, keyed by company slug)
- `routers/watchlist.py` — `GET/POST/DELETE /api/watchlist` — per-user pinned companies
- `routers/tracker.py` — `GET/POST/PUT/DELETE /api/tracker`, `GET /api/progress` — job applications
- `services/jsearch.py` — HTTP client for the RapidAPI JSearch endpoint
- `services/follow_up.py` — `compute_flags()` — adds `flagged`/`flag_reason` to applications based on status age (no DB writes; called in the GET tracker route which then persists the flags)

### Database schema (Supabase)

Three tables (run `backend/schema.sql` in Supabase SQL editor to initialize):
- `companies` — watchlist, PK is `(id, user_id)`
- `applications` — tracker; `status_history` is a JSONB array appended on every status change
- `jobs_cache` — JSearch cache, PK is `company_id` (slug)

### Frontend structure

- `lib/api.ts` — single typed API client; all fetch calls go through here
- `hooks/` — TanStack Query wrappers (`useWatchlist`, `useJobs`, `useTracker`, `useProgress`); mutations invalidate the relevant query key on success
- `types/index.ts` — shared TypeScript types and the `COLUMNS`/`COLUMN_LABELS` constants for the tracker kanban
- `app/` — Next.js App Router pages: `/` (dashboard), `/feed` (job feed), `/tracker` (kanban), `/companies`, `/watchlist`, `/progress`
- `components/providers.tsx` — wraps the app in `QueryClientProvider`
- `components/layout/shell.tsx` — sidebar + main layout

### Key data flows

- **Job feed**: `useJobs` fans out one TanStack Query per watchlisted company (`staleTime: 6h`), merges results sorted by `posted_at`, and tracks a `jt_last_visit` timestamp in localStorage to compute `newCount`.
- **Tracker flags**: on every `GET /api/tracker` the backend runs `compute_flags()` and upserts `flagged`/`flag_reason` back to Supabase.
- **Status history**: every status change appends `{status, at}` to the `status_history` JSONB array — the array is the source of truth for timeline views.

## Next.js Version Note

This project uses Next.js 16 which has breaking changes from earlier versions. Before writing any Next.js-specific code, consult `frontend/node_modules/next/dist/docs/` for the current API and conventions.
