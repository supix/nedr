# Express + Angular + NGINX (Docker Compose)

Scaffold completo con:
- Backend Express 5 (Node 22) esposto internamente su porta 3000.
- Frontend Angular (app fornita nella cartella `frontend/`) costruito in produzione e servito da NGINX.
- NGINX fa da reverse proxy per le richieste `/api` verso il backend Express.
- Tutto containerizzato con Dockerfile dedicati e orchestrato via Docker Compose.

## Requisiti
- Docker Desktop (con Docker Compose v2)

## Struttura del progetto
```
.
├─ server/                # Backend Express 5
│  ├─ src/index.js        # Endpoint /api/health
│  ├─ package.json
│  └─ Dockerfile          # Node 22 Alpine
├─ frontend/              # App Angular fornita
│  ├─ angular.json        # outputPath: dist/frontend
│  ├─ package.json        # Angular 19.x
│  └─ Dockerfile          # Multi-stage: build Angular, serve con NGINX
├─ nginx/
│  └─ nginx.conf          # Reverse proxy /api -> server:3000, SPA fallback
└─ docker-compose.yml     # Orchestrazione servizi
```

## Cosa viene eseguito
- Backend: Express 5 su Node.js, endpoint `/api/health` per health-check.
- Frontend: la tua app Angular (in `frontend/`) viene buildata per produzione e servita da NGINX.
- Proxy: NGINX inoltra `/api/*` a `server:3000` e gestisce il fallback SPA su `index.html`.

## Avvio
1. Build delle immagini:
   ```powershell
   docker compose build
   ```
2. Avvio dei servizi:
   ```powershell
   docker compose up -d
   ```
3. Navigazione:
   - Frontend: http://localhost/
   - API Health: http://localhost/api/health

Log:
```powershell
docker compose logs -f server
docker compose logs -f web
```

Arresto:
```powershell
docker compose down
```

## Dettagli tecnici
- `frontend/Dockerfile` (multi-stage):
  - Stage build: Node 20 Alpine installa dipendenze e `npm run build -- --configuration production`.
  - Stage runtime: `nginx:alpine` serve i file statici da `/usr/share/nginx/html` e usa `nginx/nginx.conf`.
  - Copia dalla build: `dist/frontend/` (come definito in `angular.json`).
- `nginx/nginx.conf`:
  - Serve i file Angular (SPA) e applica `try_files ... /index.html` per routing client-side.
  - Proxy `/api` verso `http://server:3000` con header necessari.
- `server/Dockerfile`:
  - Node 22 Alpine, dipendenze prod, espone porta 3000.
- `docker-compose.yml`:
  - Servizio `server` (Express) e `web` (NGINX + Angular buildata).
  - `web` dipende dalla salute di `server` (`depends_on` con healthcheck).

## Sviluppo locale (nota)
Questo setup è orientato alla modalità produzione (build statica). Per hot-reload con `ng serve`, si può aggiungere un servizio separato in Compose e far puntare NGINX a tale servizio per le route non-`/api` in ambiente di sviluppo.

## Comandi utili
- Rebuild forzato:
  ```powershell
  docker compose build --no-cache web
  ```
- Test API:
  ```powershell
  curl http://localhost/api/health
  ```

## Licenza
MIT (o quella che preferisci).
