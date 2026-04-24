const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "tasks.json");


function loadTasks(){
	if (fs.existsSync(FILE)){
		let reads = fs.readFileSync(FILE, "utf8");
		return JSON.parse(reads);
	}else{
		return [];
	}
}

function saveTasks(tasks){
	return fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}


const args = process.argv.slice(2);


if (args.length === 0){	
	
console.log("Usage: node index.js <add|list> [text]")


}else{
	if (args[0] === "add"){
		let tasks = loadTasks()
		const newTask = {id:tasks.length + 1, text: args[1] , done:false}
		tasks.push(newTask);
		saveTasks(tasks)
		console.log("Task added:", tasks);
	}
	if (args[0] === "list"){
		let tasks = loadTasks()
		if (tasks.length === 0){
			console.log("No tasks yet")
		}else{
			console.log(tasks);
		}	
	}
}
