const { logRequest } = require("../logger");

const requestLogger = (req, res, next) => {
    logRequest(req);
    next()
};

module.exports = requestLogger;
