// const fs = require("fs");
const fs = require("fs").promises;
const path = require("path");

const FILE = path.join(__dirname, "tasks.json");

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

async function saveTasks(tasks){
	try {
		const data = JSON.stringify(tasks, null, 2)
		await fs.writeFile(FILE, data)

		return true;
	} catch (err) {
		console.error("Failed to save tasks:", err)
		
		return false;
	}
}

async function run(){
	try {
		const args = process.argv.slice(2);
		const command = args[0]
		const n = parseInt(args[1], 10)

		if (!command) {
			console.log("Usage: node index.js <add|list> [text]")
		}
		let tasks = await loadTasks();
		if (command === "add") {
			const newTask = {id: tasks.length + 1, text: args[1], done:false}
			tasks.push(newTask)
			await saveTasks(tasks)
			console.log("Task added:", tasks);
		} else if (command === "list") {
			if (tasks.length === 0) {
				console.log("No tasks yet")
			} else {
				console.log(tasks)
			}
		} else if (command === "remove" ){
			if(Number.isNaN(n) || n < 1 || n > tasks.length){
				if(tasks.length === 0){
					console.log("NO tasks yet")
				} else {
					console.log("Invalid task number. Please pess a number between 1 and", tasks.length)
				} 
			} else {
				tasks.splice(n-1, 1)
				await saveTasks(tasks)
				console.log(`Removed task ${n}`)
		}} else if (command === "make-done"){
			if (Number.isNaN(n) || n < 1 || n > tasks.length){
				if(tasks.length === 0) {
					console.log("No tasks yet")
				} else {
					console.log("Invalid task number. Please pass a number between 1 and", tsaks.length)
				}
			} else {
				tasks[n - 1].done = true;
				
				await saveTasks(tasks)
				console.log(`Task ${n} marked as done! ✅`)
			}
		}
	} catch (err) {
		console.error("An unexpected error occurred", err);
	}
}

run()

// function loadTasks(){
//	if (fs.existsSync(FILE)){
//		let reads = fs.readFileSync(FILE, "utf8");
//		return JSON.parse(reads);
//	}else{
//		return [];
//	}
// }

//function saveTasks(tasks){
//	return fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
//}

//const args = process.argv.slice(2);

//if (args.length === 0){	
	
//console.log("Usage: node index.js <add|list> [text]")

//}else{
//	if (args[0] === "add"){
//		let tasks = await loadTasks()
//		const newTask = {id:tasks.length + 1, text: args[1] , done:false}
//		tasks.push(newTask);
//		saveTasks(tasks)
//		console.log("Task added:", tasks);
//	}
//	if (args[0] === "list"){
//		let tasks = await loadTasks()
//		if (tasks.length === 0){
//			console.log("No tasks yet")
//		}else{
//			console.log(tasks);
//		}	
//	}
//	if (args[0] === "remove") {
//		const n = parseInt(args[1], 10)
//		let tasks = await loadTasks()
//		if (Number.isNaN(n) || n < 1 || n > tasks.length) {
//			if (tasks.length === 0) { 
//				console.log("No Tasks yet") 
//			}
//			else{
//			console.log("Invalid task number. Please pess a number between 1 and", tasks.length);}
//		} else {
//			tasks.splice(n-1, 1)
//			saveTasks(tasks)
//			console.log(`Removed task ${n}`)
//		}
//	}
//}
