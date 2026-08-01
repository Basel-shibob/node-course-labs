const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("title-input");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty-state");
const socket = io();

socket.on("connect", () => {
  console.log("connected as", socket.id);
});

socket.on("task:created", (task) => {
  loadTasks();
});
socket.on("task:updated", (task) => {
  loadTasks();
});
socket.on("task:deleted", (payload) => {
  loadTasks();
});
socket.on("presence:update", (data) => {
  const presenceEl = document.getElementById("presence");
  presenceEl.textContent = `${data.online} online`;
});

function renderTasks(tasks) {
  listEl.innerHTML = "";

  if (tasks.length === 0) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () =>
      toggleDone(task.id, checkbox.checked)
    );

    const span = document.createElement("span");
    span.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, deleteBtn);
    listEl.append(li);
  }
}

async function loadTasks() {
  const res = await fetch("/tasks");
  const data = await res.json();
  renderTasks(data.tasks);
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;

  await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  inputEl.value = "";
});

async function toggleDone(id, done) {
  await fetch(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  });
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, {
    method: "DELETE",
  });
}

loadTasks();
