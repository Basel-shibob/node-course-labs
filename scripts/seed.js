require("dotenv").config();
const { connectDB } = require("../storage/db");
const { create } = require("../storage/mongoStorage");

const seed = async () => {
  await connectDB();
  for (let i = 0; i < 3; i++) {
    await create({ title: `seed-${i}` });
  }
  process.exit(0);
};

seed();
