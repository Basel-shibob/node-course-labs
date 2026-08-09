const fsPromises = require("node:fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const filePath = path.join(__dirname, "../data/tasks.json");

// Ensure the file is areadly exist
const ensureFile = async () => {
  try {
    await fsPromises.mkdir(dataDir, {
      recursive: true,
    });
    await fsPromises.access(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return await fsPromises.writeFile(filePath, "[]");
    }
    throw error;
  }
};

// Read the tasks the in file
const readTasks = async () => {
  try {
    await ensureFile();
    const reads = await fsPromises.readFile(filePath, "utf8");
    if (!reads.trim()) {
      return [];
    }
    return JSON.parse(reads);
  } catch (error) {
    console.log("Corrupted tasks.json — returning empty array");
    return [];
  }
};

// Write tasks in the file
const writeTasks = async (task) => {
  try {
    await ensureFile();
    const data = JSON.stringify(task, null, 2);
    await fsPromises.writeFile(filePath, data);
    return true;
  } catch (error) {
    console.log("Failed to save task", error);
    return false;
  }
};

const getAll = async () =>{
  return await readTasks();
}

const getById = async (id) =>{
  const tasks = await readTasks();
  const t = tasks.find((t) => String(t.id) === String(id))
  if(!t) return null;
  return t;
}

const create = async (data) =>{
  const tasks = await readTasks();
  const title = data.title
  const newTask = { id: Date.now(), title: title, done: false}
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask
}

const update = async (id, updates) =>{
  const tasks = await readTasks();
  const task = tasks.find((t) => String(t.id) === String(id));
  if(!task) return null;
  if(updates.title) {
    task.title = updates.title;
  }
  if(typeof updates.done === 'boolean'){
    task.done = updates.done;
  }
  await writeTasks(tasks);
  return task
}

const remove = async (id) =>{
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(t => String(t.id) === String(id));
  if(taskIndex === -1) return null;
  const removed = tasks.splice(taskIndex, 1)[0];
  await writeTasks(tasks);
  return removed;
}

module.exports = {getAll, getById, create, update, remove}