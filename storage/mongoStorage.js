const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

const toTask = (doc) => ({
  id: doc._id.toString(),
  title: doc.title,
  done: doc.done,
});

const getAll = async () => {
  const data = await Task.find();
  return data.map((t) => toTask(t));
};

const getById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const data = await Task.findById(id);
  if (!data) return null;
  return toTask(data);
};

const create = async (data) => {
  const newData = await Task.create(data);
  return toTask(newData);
};

const update = async (id, updates) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const updatedData = await Task.findByIdAndUpdate(id, updates, { returnDocument: "after" });
  if (!updatedData) return null;
  return toTask(updatedData);
};

const remove = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const deletedData = await Task.findByIdAndDelete(id);
  if (!deletedData) return null;
  return toTask(deletedData);
};

module.exports = { getAll, getById, create, update, remove };
