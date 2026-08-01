const { readTasks, writeTasks } = require("../storage/fileStorage");
const taskEvents = require("./taskEvents")

const getTasks = async () => {  
  const tasks = await readTasks();
  return tasks;
};

const getTaskByID = async (id) => {
  const tasks = await readTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return null;
  }
  return task;
};

const addTask = async (task) => {
  const tasks = await readTasks();
  if(!task.title){ throw new Error("Text is required"); }
  const newTask = { id: Date.now(), title: task.title, done: false };
  tasks.push(newTask);
  await writeTasks(tasks);
  taskEvents.emit("task:created", newTask);
  return newTask;
};

const updateTask = async (id, updates) => {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === id);
    if(!task){return null;}
    if(updates.title){
        task.title = updates.title;
    }
    if(typeof updates.done === 'boolean'){
        task.done = updates.done
    }
    await writeTasks(tasks)
    taskEvents.emit("task:updated", task)
    return task;
}

const deleteTask = async (id) => {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex === -1) {return null}
    const removed = tasks.splice(taskIndex, 1)[0];
    await writeTasks(tasks);
    taskEvents.emit("task:deleted", { id })
    return removed;
}

module.exports = {getTasks, getTaskByID, addTask, updateTask, deleteTask}