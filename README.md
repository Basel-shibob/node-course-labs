# Task API

A Node.js task manager built incrementally across a course — starting as a
CLI tool, evolving into a REST API, then a full Express app with a browser
frontend, and soon real-time updates via Socket.IO.

## Tech Stack
- Node.js (no framework initially, then Express)
- `fs/promises` for file-based persistence (`data/tasks.json`)
- Vanilla JS frontend (`public/`)

## Project Structure
```
task-cli/
├── server-express.js # Entry point — wires everything together
├── logger.js # Stream-based request logging
├── routes/
│ └── taskRoutes.js # Express Router — HTTP layer
├── services/
│ └── taskService.js # Business logic — validation, task rules
├── storage/
│ └── fileStorage.js # Reads/writes data/tasks.json
├── public/ # Browser frontend (index.html, app.js, styles.css)
├── data/ # tasks.json (gitignored)
└── logs/ # server.log (gitignored)
├── sockets/
│   └── taskSockets.js   # Bridges domain events -> Socket.IO broadcasts
```
## Architecture
Three layers, each with a single responsibility:
- **Routes** — HTTP request/response handling only
- **Service** — business rules, knows nothing about HTTP or the filesystem
- **Storage** — reads/writes `tasks.json`, knows nothing about HTTP or validation

This means swapping the storage layer for a database (planned: Day 5) or
adding a second transport like Socket.IO (Day 4) doesn't require touching
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

## Running Locally
```bash
npm install
npm start
# http://localhost:3000
```

## API Endpoints
```
| Method | Path         | Description       |
|--------|--------------|--------------------|
| GET    | /tasks       | List all tasks     |
| POST   | /tasks       | Create a task      |
| PATCH  | /tasks/:id   | Update a task      |
| DELETE | /tasks/:id   | Delete a task      |
```
