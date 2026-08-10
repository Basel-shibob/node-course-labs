# Task API

A Node.js task manager built incrementally across a course — starting as a
CLI tool, evolving into a REST API, then a full Express app with a browser
frontend, real-time updates via Socket.IO, and finally a MongoDB-backed
store behind a clean repository interface.

## Tech Stack
- Node.js + Express
- **MongoDB via Mongoose** for persistence (file storage kept behind the same
  interface for reference)
- Socket.IO for real-time updates
- `dotenv` for configuration, `nodemon` for the dev workflow
- Vanilla JS frontend (`public/`)

## Project Structure
```
task-cli/
├── server-express.js     # Entry point — wires everything, /health, graceful shutdown
├── logger.js             # Stream-based request logging
├── nodemon.json          # Dev auto-restart config (ignores logs/, data/, public/)
├── .vscode/
│   └── launch.json       # VS Code debugger config
├── routes/
│   └── taskRoutes.js     # Express Router — HTTP layer
├── services/
│   ├── taskService.js    # Business logic — validation, task rules
│   └── taskEvents.js     # Shared EventEmitter (service announces facts)
├── storage/
│   ├── mongoStorage.js   # MongoDB repository (active engine)
│   ├── fileStorage.js    # File repository — same interface (reference)
│   └── db.js             # connectDB / disconnectDB
├── sockets/
│   └── taskSockets.js    # Bridges domain events -> Socket.IO broadcasts
├── scripts/
│   ├── seed.js           # Seeds sample tasks via the repository
│   └── stress.js         # Concurrent-write stress test
├── public/               # Browser frontend (index.html, app.js, styles.css)
├── data/                 # tasks.json (gitignored, file engine only)
└── logs/                 # server.log (gitignored)
```
## Architecture
Three layers, each with a single responsibility:
- **Routes** — HTTP request/response handling only
- **Service** — business rules, knows nothing about HTTP or the storage engine
- **Storage** — a repository interface (`getAll / getById / create / update /
  remove`); knows nothing about HTTP or validation

Both `mongoStorage.js` and `fileStorage.js` implement the **same** interface, so
switching engines is a one-line `require` change in the service — Mongo details
(`mongoose`, `_id`) never leak past the storage layer. Adding a second transport
like Socket.IO (Day 4) or swapping the database (Day 5) doesn't require touching
the other layers.

## Progress Log

### Day 1 — CLI
Basic add/list/remove task manager using synchronous file I/O.

### Day 2 — HTTP Server & REST API
Rebuilt as a REST API using Node's built-in `http` module — no framework.
Introduced `fs/promises`, async/await, and manual routing.

### Day 3 — Modular Architecture, Streams & Express
- Refactored into Routes → Services → Storage layers
- Migrated from raw `http` to Express
- Added `express.Router()` for modular routes
- Added stream-based request logging (`logger.js`)
- Centralized error handling

### Day 4 — Real-Time with Socket.IO ✅
- Lab 1: Browser UI using `express.static` + REST (`fetch`) — proved the
  gap: other tabs don't auto-update without a manual refresh
- Lab 2: Attached Socket.IO to an explicit `httpServer` (not `app.listen`),
  confirmed the WebSocket upgrade handshake
- Lab 3: Decoupled the service from the transport — `services/taskEvents.js`
  (a shared `EventEmitter`) lets `taskService.js` announce facts without
  knowing Socket.IO exists; `sockets/taskSockets.js` bridges those events
  to `io.emit(...)` broadcasts
- Lab 4: Live Board — UI renders only from socket events, not from local
  mutation calls, so every tab (including the one that made the change)
  shows one consistent, server-confirmed state
- Lab 5: Presence — live "N online" counter via connect/disconnect lifecycle
  and `io.engine.clientsCount`

**Architecture holdup, confirmed:** adding Socket.IO required zero changes
to `routes/` or `storage/` — only three `emit()` calls inside the service
and one new bridge file. Exactly what the Day 3 layering promised.

### Day 5 — MongoDB, Debugging & Production Practices ✅
- Lab 1: Stress test — proved the file store silently **loses updates** under
  concurrent writes (send 10, only 1–3 survive)
- Lab 2: Connected MongoDB — `storage/db.js` (`connectDB`), `dotenv`, and a
  fail-fast boot that exits if `MONGODB_URI` is missing or unreachable
- Lab 3: Repository refactor — storage now owns all data mechanics behind a clean
  interface (`getAll / getById / create / update / remove`); the service became
  thin (validation + events only)
- Lab 4: Mongo repository + the swap — `storage/mongoStorage.js` implements the
  same interface via Mongoose; switching engines was **one `require` line**, and
  the concurrency race is gone (stress test reads 10/10)
- Lab 5: Debugging & dev tooling — `nodemon` auto-restart (ignoring the folders
  the app writes to) and a VS Code debugger config
- Lab 6: Production hardening — `/health` with event-loop lag, a centralised
  error handler, and graceful shutdown (SIGINT/SIGTERM close the server + DB)

**Payoff, confirmed:** because Lab 3 put a clean interface in front of storage,
the Lab 4 database migration was a one-line change instead of a rewrite.

## Running Locally
```bash
npm install

# configure MongoDB (see .env.example) — requires a running mongod
# .env must define MONGODB_URI

node scripts/seed.js   # optional: insert sample tasks
npm run dev            # development: nodemon auto-restart
npm start              # production-style: plain node
# http://localhost:3000
```

## API Endpoints
```
| Method | Path         | Description                       |
|--------|--------------|-----------------------------------|
| GET    | /tasks       | List all tasks                    |
| GET    | /tasks/:id   | Get one task (404 if not found)   |
| POST   | /tasks       | Create a task                     |
| PATCH  | /tasks/:id   | Update a task (404 if not found)  |
| DELETE | /tasks/:id   | Delete a task (404 if not found)  |
| GET    | /health      | Status, uptime, event-loop lag    |
```
