# WORKLIENT

**Every opportunity. One place.**

WORKLIENT is a job & freelance opportunity aggregator. It collects opportunities from multiple sources (currently mock/demo data standing in for 9 real sources) and presents them in one fast, beautiful, searchable web app — so you stop tab-hopping between Upwork, LinkedIn, Mostaql, Reddit, and everywhere else opportunities get posted.

No login required. No paid APIs. No scraping that bypasses auth, CAPTCHAs, or paywalls.

---

## Idea

Freelancers and job seekers waste time checking the same 5–10 sites every day for new opportunities. WORKLIENT normalizes opportunities from every source into one schema, ranks them by relevance, and lets you search, filter, and save the ones you care about — anonymously, with zero setup.

## Architecture

```
WORKLIENT/
├── backend/           FastAPI + SQLAlchemy 2 + SQLite
│   └── app/
│       ├── api/routes/     jobs, saved, sources endpoints
│       ├── models/         Job, SavedJob (SQLAlchemy models)
│       ├── schemas/        Pydantic v2 request/response shapes
│       ├── services/       search/filter/sort, match scoring, stats, source registry
│       ├── scripts/        init_db.py, seed.py
│       └── database/       SQLAlchemy session/engine
└── frontend/           React + Vite + TypeScript
    └── src/
        ├── api/            fetch client + endpoint modules
        ├── components/      JobCard, layout, filters, dashboard widgets, UI primitives
        ├── hooks/           TanStack Query hooks, toast system, debounce, recently-viewed
        ├── pages/           Home, Search, Job Details, Dashboard, 404
        ├── styles/          global design tokens (Tailwind v4 @theme)
        └── types/           shared TypeScript interfaces matching backend schemas
```

**Data flow:** the backend seeds 48 realistic mock opportunities across 9 sources into SQLite. The frontend queries `/api/jobs` with filters/search/sort, gets back paginated results with a computed `match_score` (0–100) and `match_reason`, and renders them as cards. Saving is anonymous — a UUID `client_id` is generated in `localStorage` on first visit and sent as the `X-Client-ID` header on every request, so saved jobs persist per-browser with no sign-up.

## Tech stack

- **Backend:** Python, FastAPI, SQLAlchemy 2, Pydantic v2, SQLite
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, TanStack Query, Framer Motion, lucide-react

## Run it locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.scripts.init_db
python -m app.scripts.seed
uvicorn app.main:app --reload --port 8000
```

The API is now live at `http://127.0.0.1:8000` — try `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app is now live at `http://127.0.0.1:5173`. Vite proxies `/api/*` to the backend at `127.0.0.1:8000`, so both need to be running.

### Production build

```bash
cd frontend
npm run build   # tsc -b && vite build → outputs to frontend/dist
```

## Features

- **Home** — hero with a 3D-tilt search bar, popular search chips, and a live feed of the newest opportunities.
- **Search** — full-text search (debounced), filters (source, job type, remote, location, min salary, posted-within), sort (Newest / Best Match / Highest Budget), pagination, and a mobile filter drawer.
- **Job details** — full opportunity info, a "Why this opportunity?" match explanation, save/unsave, and a link to the original posting. Recently-viewed jobs are tracked in `localStorage`.
- **Dashboard** — stat cards, saved opportunities, recently viewed, personalized recommendations (top match not yet saved), and a pure CSS/SVG top-sources bar chart (no charting library).
- **Command palette** (`Ctrl+K` / `Cmd+K`) — quick search and page navigation from anywhere.
- Toasts, skeleton loading states, empty states, error states with retry, and full keyboard/focus/ARIA support throughout.

## Roadmap

- **Authentication** — replace anonymous `client_id` with real accounts so saved jobs and preferences follow you across devices.
- **Real source adapters** — replace mock data with live, ToS-compliant integrations (official APIs and RSS/public feeds where available) for each of the 9 sources.
- **Alerts** — email or push notifications when a new opportunity matches a saved search.
- **Smarter matching** — move beyond keyword-based scoring toward embeddings-based relevance, still without paid AI APIs (e.g. a local/open-source model).
- **PostgreSQL in production** — swap `DATABASE_URL` to Postgres for concurrent writes at scale (the backend already reads it from an env var, so this is a config change, not a code change).
