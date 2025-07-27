// signaling-server/server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const clients = {};

console.log('✅ Signaling Server started on ws://localhost:3000');

wss.on('connection', (ws) => {
  console.log('🔗 New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { type, from, to, payload } = data;

    // 클라이언트 등록
    if (type === 'register') {
      clients[from] = ws;
      console.log(`👤 Registered: ${from}`);
    }

    // 메시지 전달
    if (type === 'signal' && clients[to]) {
      clients[to].send(JSON.stringify({ from, payload }));
      console.log(`📡 Relayed from ${from} to ${to}`);
    }
  });

  ws.on('close', () => {
    for (const id in clients) {
      if (clients[id] === ws) {
        delete clients[id];
        console.log(`❌ Disconnected: ${id}`);
        break;
      }
    }
  });
});
