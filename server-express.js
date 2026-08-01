const express = require("express");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");
const { logRequest } = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;
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

app.listen(PORT, handler);
