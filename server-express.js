const express = require("express");
const taskRoutes = require("./routes/taskRoutes");


const app = express();

app.use(express.json())

app.use("/tasks", taskRoutes);


const port = 8080;
const handler = () => {
  console.log(`Server is listening on http://localhost:${port}`);
};

app.listen(port, handler);
