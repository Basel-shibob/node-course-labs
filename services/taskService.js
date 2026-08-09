const {getAll, getById, create, update, remove} = require("../storage/fileStorage");
const taskEvents = require("./taskEvents")

const getTasks = async () => {  
  const tasks = await getAll()
  return tasks;
};

const getTaskByID = async (id) => {
  return await getById(id);
};

const addTask = async (task) => {
  if(!task.title){ throw new Error("Title is required"); }
  const newTask = await create(task);
  taskEvents.emit("task:created", newTask);
  return newTask;
};

const updateTask = async (id, updates) => {
  const updated = await update(id,updates);
  if(updated === null) return null; 
  taskEvents.emit("task:updated", updated);
  return updated;
}

const deleteTask = async (id) => {
    const removed = await remove(id);
    if(removed === null) return null;
    taskEvents.emit("task:deleted", { id });
    return removed;
}

module.exports = {getTasks, getTaskByID, addTask, updateTask, deleteTask}