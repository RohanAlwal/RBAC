const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'logs', 'access.logs');

const logUnauthorizedAccess = (userId, endpoint, reason) => {
    const entry = `[${new Date().toISOString()}] User ${userId} blocked at ${endpoint} - Reason ${reason}\n`;
    fs.appendFileSync(logPath, entry);
};

module.exports = { logUnauthorizedAccess };