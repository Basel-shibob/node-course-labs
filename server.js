const fs = require("node:fs").promises;
const path = require("path");

const FILE = path.join(__dirname, "tasks.json");

const http = require("node:http");

async function loadTasks() {
	try {
		const reads = await fs.readFile(FILE, "utf8")
		return JSON.parse(reads)

	} catch (err) {
		if(err.code === "ENOENT"){
			return []
		}else {
			console.error("Critical Error: ", err);
			return []
		}
	}
}

async function saveTasks(task){
	try {
		const data = JSON.stringify(task, null, 2);
		await fs.writeFile(FILE, data);

		return true;
	}catch(err) {
		console.error("Failed to save task", err);

		return false;
	}
};


const server = http.createServer(async (req,res) => {
	try{
		const reqUrl = new URL(req.url, `http://${req.headers.host}`);
		const tasks = await loadTasks();
		
		res.setHeader("Content-Type", "application/json");
		
		// (Routing)
		if (reqUrl.pathname === "/tasks" && req.method === "GET") {
			console.log(tasks);

			res.writeHead(200);
			res.end(JSON.stringify(tasks));
			return;
		}else if (reqUrl.pathname === "/" && req.method === "GET") {
			res.writeHead(200);
			res.end(JSON.stringify({message: "Welcome to Task Server! Go to /tasks to see your list."}));


		}else if (req.method === "POST" && reqUrl.pathname === "/add") {
			let body = "";

			req.on("data", (chunk) =>{
				body += chunk.toString();
			});

			req.on("end", async () => {
				try {
					const parsedBody = JSON.parse(body);
					const taskText = parsedBody.text;

					if (!taskText) {
						res.writeHead(400);
						res.end(JSON.stringify({error : "Task text is required"}));
						return;
					}	
					
					const newTask = {id: tasks.length + 1, text: taskText, done: false};
					tasks.push(newTask);					
					await saveTasks(tasks);
					
					res.writeHead(200);
					res.end(JSON.stringify({ message: "Task added", task: newTask }));
				}catch {
					res.writeHead(400)
					res.end(JSON.stringify({ error: "Invalid JSON inside request body"}));
				}
			});
			
			return;
		}

			// const task = reqUrl.searchParams.get("task")
			
			// res.writeHead(200);
			// res.end(JSON.stringify({message: `Task added ${newTask}`}));
			// return;
	
		res.writeHead(404);
		res.end(JSON.stringify( {error: "Route not found"} ));
	} catch (err) {

	}
	
});

const port = 8080;
const handler = () => {
	console.log(`Server is listening on http://localhost:${port}`)
}; 

server.listen(port, handler);
