const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const WebSocket = require('ws'); 
const http = require('http');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.onmessage = (message) => {
        console.log('Received:', message.data);
    };

    ws.onclose = () => {
        console.log('Client disconnected');
    };
});

server.listen(config.server.port, (err) => {
    if (err) {
        process.exit(1);
    }
    require('./lib/database');

    fs.readdirSync(path.join(__dirname, './routes')).map(file => {
        require('./routes/' + file)(app);
    });

    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path && r.route.stack.method) {
            console.log(r.route.stack.method + "    " + r.route.path);
        }
    });
});

module.exports = {
    app,
    wss
};
