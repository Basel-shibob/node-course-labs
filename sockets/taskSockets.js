const taskEvents = require("../services/taskEvents");

function initTaskSockets(io) {
    // --- Domain events -> broadcasts (registered ONCE, at startup) ---------
    taskEvents.on("task:created", (task) => {
        console.log("Broadcasting task:created", task);
        io.emit("task:created", task)
    });
    taskEvents.on("task:updated", (task) => io.emit("task:updated", task));
    taskEvents.on("task:deleted", (payload) => io.emit("task:deleted", payload));

    // --- per-connection lifecycle -------------------------------------------
    io.on("connection", (socket) => {
        console.log("socket connected:", socket.id);

        socket.on("disconnect:", (reason) => {
            console.log("socket disconnected:", socket.id, reason);
        });
    });
}

module.exports = initTaskSockets;