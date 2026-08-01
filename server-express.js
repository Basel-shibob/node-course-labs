const express = require("express");
const path = require("path");
const http = require("node:http")
const { Server } = require("socket.io")
const taskRoutes = require("./routes/taskRoutes");
const { logRequest } = require("./logger");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id)

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected:", socket.id, reason);
  });
})

const handler = () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) =>{
  logRequest(req);
  next()
});

app.use("/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

httpServer.listen(PORT, handler);
