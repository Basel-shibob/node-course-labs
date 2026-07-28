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

module.exports = {ensureFile, readTasks, writeTasks}