require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("node:http");
const { Server } = require("socket.io");
const taskRoutes = require("./routes/taskRoutes");
const { logRequest } = require("./logger");
const initTaskSockets = require("./sockets/taskSockets");
const { connectDB, disconnectDB } = require("./storage/db");
const { monitorEventLoopDelay } = require("node:perf_hooks");

const eventLoopMonitor = monitorEventLoopDelay();
eventLoopMonitor.enable();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

initTaskSockets(io);

const handler = () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  logRequest(req);
  next();
});

app.use("/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    eventLoopLagMs: eventLoopMonitor.mean / 1e6,
  });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, handler);
  } catch (error) {
    console.error(
      "startup failed — could not connect to MongoDB, check MONGODB_URI in .env",
      error.message
    );
    process.exit(1);
  }
};

start();

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  httpServer.close(async () => {
    // close mongoose
    await disconnectDB();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
