const fs = require("fs").promises

async function loadData() {
	try {
		const configRaw = await fs.readFile("config.json", "utf8");
		const config = JSON.parse(configRaw);
		
		const userRaw = await fs.readFile(config.usersFile, "utf8");
		const users = JSON.parse(userRaw)

		console.log("Loaded", users.length, "Users")
	}catch{
		console.error("Errot: ", err)
	}
}

loadData();


// fs.readFile("config.json", "utf8")
//	.then((configRaw) => {
// 		return JSON.parse(configRaw);
//	})
//	.then((config) => {
//        	return fs.readFile(config.usersFile, "utf8");
//	})
//	.then((usersRaw) => {
//		const users = JSON.parse(usersRaw);
//		console.log("Loaded", users.length, "Users");
//	})
//	.catch((err) => {
//		console.error(err);
//	});




//fs.readFile("config.json","utf8", (err,raw) =>{
//	if(err) return console.error(err);
//	const config = JSON.parse(raw);
//	fs.readFile(config.usersFile, "utf8",(err,rawUsers) =>{
//		if(err) return console.error(err);
//		const users = JSON.parse(rawUsers);
//		console.log("Loaded", users.length, "Users");
//	});
// });
