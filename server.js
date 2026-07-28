const { readTasks, writeTasks } = require("./storage/fileStorage")

const http = require("node:http");

const server = http.createServer(async (req,res) => {
	try{
		const reqUrl = new URL(req.url, `http://${req.headers.host}`);
		const tasks = await readTasks();
		
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
					await writeTasks(tasks);
					
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
		console.error("Unhandled error:", err);
		res.writeHead(500);
		res.end(JSON.stringify( {error: "Internal Server Error"} ));
	}
	
});

const port = 8080;
const handler = () => {
	console.log(`Server is listening on http://localhost:${port}`)
}; 

server.listen(port, handler);
