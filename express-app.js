const fs = require("fs/promises");
const path = require("path");
const express = require("express");

const app = express();

app.use(express.json());

let users = [
	{
    	"id": 1,
    	"name": "Basel",
    	"age": 25
  	},
 	{
    	"id": 2,
    	"name": "Farid",
    	"age": 10
  	},
 	{
    	"id": 3,
    	"name": "Youssef",
    	"age": 6
	}
];

app.get("/users", (req, res) => {
	res.json(users);
});

app.post("/add", (req, res) => {
	const user = req.body;
	users.push(user);
	res.json(users);
});

app.delete("/users/:id", (req, res) => {
	const id = parseInt(req.params.id);

	users = users.filter(user => user.id !== id);
	res.json(users);
});


const PORT = 8080;
const handler = () => {
	console.log(`server listening on host : http://localhost:${PORT}`);
};

app.listen(PORT, handler);
