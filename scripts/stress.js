const TASKS_URL = "http://localhost:3000/tasks";

const stress = async (i) => {
  const response = await fetch(TASKS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: `stress-${i}` }),
  });
  const data = await response.json();
};

async function run() {
  const promises = [];
  const COUNT = 10;
  for (let i = 0; i < COUNT; i++) {
    promises.push(stress(i));
  }
  await Promise.all(promises);
  const response = await fetch(TASKS_URL);
  const data = await response.json();
  const tasks = data.tasks;
  console.log("Sent:", COUNT);
  console.log("Survived:",tasks.length);

}

run()