const express = require("express");
const {
  getTasks,
  getTaskByID,
  addTask,
  updateTask,
  deleteTask,
} = require("./services/taskService");

const app = express();

app.use(express.json())

app.get("/tasks", async (req, rse) => {
  const tasks = await getTasks();
  rse.status(200).json({ tasks: tasks });
});

app.post("/tasks", async (req, res) =>{
  const { text } = req.body;
  if(!text) {
    return res.status(400).json({error: "Bad request"});
  }
  const newTask = await addTask({text});
  return res.status(201).json({message: "Task created successfully !", newTask});
});

app.get("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await getTaskByID(id);
  res.status(200).json({ task });
});

app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const removedTask = await deleteTask(id);
  res.status(200).json({ message: "Deleted !!", removedTask });
});

app.patch("/tasks/:id", async (req, res) =>{
  const id = Number(req.params.id);
  const updates = req.body;
  const task = await updateTask(id, updates);
  return res.status(200).json({message: "task updated !", task});
});

const port = 8080;
const handler = () => {
  console.log(`Server is listening on http://localhost:${port}`);
};

app.listen(port, handler);
