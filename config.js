const fs = require('fs'), path = require('path');

const config = {};

Object.assign(config, process.env);

if (fs.existsSync(path.join(__dirname, 'config.json'))) {
    Object.assign(config, require('./config.json'));
}

module.exports = config;