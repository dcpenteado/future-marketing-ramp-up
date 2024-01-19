const bunyan = require('bunyan');
const fs = require('fs');

//CRIANDO DIRETÓRIOS NECESSÁRIOS CASO NÃO EXISTAM
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./data/log')) fs.mkdirSync('./data/log');

let log = bunyan.createLogger({
    name: "backend",
    streams: [{
        type: 'rotating-file',
        path: './data/log/log.log',
        period: '1w',
        count: 12
    }]
});

const emit = (type, message) => {
    if (process.env.NODE_ENV != 'prod') console.log(`${type}: ${message}`);

    if (!type) return log.info(message);
    if (log[type]) return log[type](message);
}

module.exports = { emit };