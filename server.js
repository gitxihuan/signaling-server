const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'register') {
      clients.set(data.id, ws);
    } else if (data.to && clients.has(data.to)) {
      clients.get(data.to).send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    for (const [id, client] of clients.entries()) {
      if (client === ws) clients.delete(id);
    }
  });
});

console.log("✅ WebSocket signaling server running at ws://localhost:3000");
