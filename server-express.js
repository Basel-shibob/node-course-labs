require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("node:http");
const { Server } = require("socket.io");
const taskRoutes = require("./routes/taskRoutes");
const { logRequest } = require("./logger");
const initTaskSockets = require("./sockets/taskSockets");
const { connectDB } = require("./storage/db");

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
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

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
