const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB disconnected");
};

module.exports = { connectDB, disconnectDB };
