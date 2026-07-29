const {
  getTasks,
  getTaskByID,
  addTask,
  updateTask,
  deleteTask,
} = require("./services/taskService");

const http = require("node:http");

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const parts = reqUrl.pathname.split("/").filter(Boolean);
    res.setHeader("Content-Type", "application/json");

    // (Routing)
    if (req.method === "GET" && reqUrl.pathname === "/") {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          message: "Welcome to Task Server! Go to /tasks to see your list.",
        })
      );
      return;
    }
    if (req.method === "GET" && reqUrl.pathname === "/tasks") {
      const tasks = await getTasks();
      console.log(tasks);
      res.writeHead(200);
      res.end(JSON.stringify(tasks));
      return;
    }
    if (req.method === "GET" && parts[0] === "tasks" && parts[1]) {
      const id = Number(parts[1]);
      const task = await getTaskByID(id);
      if (task === null) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "task not found" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify({ task: task }));
      return;
    }
    if (req.method === "POST" && reqUrl.pathname === "/tasks") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const parsedBody = JSON.parse(body);
          const taskText = parsedBody.text;
          const newTask = await addTask({ text: taskText });
          res.writeHead(200);
          res.end(JSON.stringify({ message: "Task added", task: newTask }));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      return;
    }
    if (req.method === "DELETE" && parts[0] === "tasks" && parts[1]) {
      const id = Number(parts[1]);
      const removed = await deleteTask(id);
      if (!removed) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not Found" }));
        return;
      }
      res.writeHead(204);
      res.end(JSON.stringify({ message: "No Content" }));
      console.log(removed);
      return;
    }
    if (req.method === "PATCH" && parts[0] === "tasks" && parts[1]) {
      const id = Number(parts[1]);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const parsedBody = JSON.parse(body);
          const updats = await updateTask(id, parsedBody);
          if (!updats) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "task not found" }));
            return;
          }
          res.writeHead(200);
          res.end(JSON.stringify({ message: "updated", task: updats }));
          return;
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: error.message }));
          return;
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  } catch (err) {
    console.error("Unhandled error:", err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

const port = 8080;
const handler = () => {
  console.log(`Server is listening on http://localhost:${port}`);
};

server.listen(port, handler);
