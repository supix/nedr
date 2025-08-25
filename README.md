# MEAN POC: Synonyms search + file download + resilient frontend behind HAProxy (Docker Compose)

Full‑stack POC with:
- Express backend (Node 20) + MongoDB: synonyms search on the `terms` collection, static file download.
- Angular frontend (PrimeNG + PrimeFlex): hero background, search, results, frontend instance badge.
- Edge HAProxy: load balances 2 frontend replicas and proxies `/api` to the backend, custom error page if all FE replicas are down, monitoring page at `/haproxy?stats`.

## Requirements
- Docker Desktop (Compose v2)

## Project structure
```
.
├─ server/                 # Express backend (TypeScript)
│  ├─ src/app.ts          # Express app, /api/* routing, Mongo seed
│  ├─ src/routes/*.ts     # health, synonyms, download
│  ├─ src/models/Term.ts  # Mongoose model
│  ├─ src/seed/seedTerms.ts
│  ├─ public/files/       # sample.pdf (optional; if missing, inline PDF fallback)
│  └─ Dockerfile
├─ frontend/               # Angular 19 + PrimeNG
│  ├─ public/assets/       # background.svg, app-config.json
│  ├─ src/app/...          # AppComponent, Search, Results, InstanceBadge, service
│  └─ Dockerfile           # Build + Nginx static server (generates app-config.json)
├─ edge/                   # HAProxy reverse proxy (LB FE replicas, proxy /api, stats)
│  ├─ haproxy.cfg
│  ├─ errors/fe-down.http
│  └─ Dockerfile
└─ docker-compose.yml
```

## Main endpoints
- GET `/api/health` → `{ status: "ok", uptime, ts }`
- GET `/api/synonyms?query=<text>` → case‑insensitive match on `term` or `synonyms` (prefix) with unique synonyms aggregation
- GET `/api/download` → sends `sample.pdf` (or inline PDF fallback) with proper headers

## Run (POC production)
1) Build and start:
```powershell
docker compose up --build -d
```
2) Open:
- App: http://localhost:8080
- API Health (through edge to backend): http://localhost:8080/api/health

Useful logs:
```powershell
docker compose logs -f edge
docker compose logs -f server
docker compose logs -f frontend1
docker compose logs -f frontend2
```

### HAProxy monitoring
- Stats page: http://localhost:8080/haproxy?stats
- Credentials (basic auth): admin / admin
- Health checks:
  - Backend API: HTTP GET /api/health → 200
  - Frontend replicas: HTTP GET / → 200

Shutdown:
```powershell
docker compose down -v
```

## Frontend resiliency test
- With two FE replicas up, the app serves normally.
- Stop one replica:
```powershell
docker compose stop frontend1
```
  The app keeps working, and the badge may change according to the serving instance.
- Stop the second replica as well:
```powershell
docker compose stop frontend2
```
  Edge will show the custom page: "All frontend replicas are offline".
- Start the replicas again:
```powershell
docker compose start frontend1 frontend2
```

## Data and MongoDB seed
On startup, if `SEED_ON_START=true`, the backend performs an idempotent seed with sample terms (`auto`, `felice`, `grande`).

## Notes
- FE instance badge: generated at frontend container build into `/assets/app-config.json` with `{ instanceId, appName }`.
- The background image uses `public/assets/background.svg` as a lightweight placeholder; you can replace it with `background.jpg` keeping the path in `src/styles.scss`.

## Possible extensions
- Validate `query` with zod/joi.
- Unit tests for routes and services.
