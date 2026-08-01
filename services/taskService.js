const { readTasks, writeTasks } = require("../storage/fileStorage");

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
  if(!task.text){ throw new Error("Text is required"); }
  const newTask = { id: Date.now(), text: task.text, done: false };
  tasks.push(newTask);
  await writeTasks(tasks)
  return newTask;
};

const updateTask = async (id, updates) => {
    const tasks = await readTasks();
    const task = tasks.find((t) => t.id === id);
    if(!task){return null;}
    if(updates.text){
        task.text = updates.text;
    }
    if(typeof updates.done === 'boolean'){
        task.done = updates.done
    }
    await writeTasks(tasks)
    return task;
}

const deleteTask = async (id) => {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex === -1) {return null}
    const removed = tasks.splice(taskIndex, 1)[0];
    await writeTasks(tasks);
    return removed;
}

module.exports = {getTasks, getTaskByID, addTask, updateTask, deleteTask}