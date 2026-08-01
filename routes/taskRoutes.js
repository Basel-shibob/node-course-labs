const express = require("express");
const {
    getTasks,
    getTaskByID,
    addTask,
    updateTask,
    deleteTask,
  } = require("../services/taskService");
  
const router = express.Router();

router.get("/", async (req, rse) => {
  const tasks = await getTasks();
  rse.status(200).json({ tasks: tasks });
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Bad request" });
  }
  const newTask = await addTask({ title });
  return res
    .status(201)
    .json({ message: "Task created successfully !", newTask });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const task = await getTaskByID(id);
  res.status(200).json({ task });
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const removedTask = await deleteTask(id);
  res.status(200).json({ message: "Deleted !!", removedTask });
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;
  const task = await updateTask(id, updates);
  return res.status(200).json({ message: "task updated !", task });
});

module.exports = router;
