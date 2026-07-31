const fs = require("node:fs");
const path = require("node:path");

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logStream = fs.createWriteStream(path.join(logDir, "server.log"), {
  flags: "a",
  encoding: "utf8",
});

const logRequest = (req) => {
  const line = `${new Date().toISOString()} ${req.method} ${req.url}\n`;
  logStream.write(line);
  process.stdout.write(line);
};

module.exports = { logRequest };
