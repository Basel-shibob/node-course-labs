const task = [];
const args = process.argv.slice(2);


if (args.length === 0){	
	
console.log("Usage: node index.js <add|list> [text]")


}else{
	if (args[0] === "add"){
		const newTask = {id: task.length + 1, text: args[1], done:false};
		task.push(newTask);
		console.log("Task added:", task);
	}
	if (args[0] === "list"){
		if (task.length === 0){
			console.log("No tasks yet")
		}else{
			console.log(task);
		}	
	}
}
