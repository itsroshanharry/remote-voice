const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
  console.log('A user connected');

  ws.on('message', (message) => {
    const command = message.toString();
    console.log('Received command:', command);
    executeCommand(command);
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

function executeCommand(command) {
  // This is a simple example. In a real application, you'd want to sanitize inputs and use a more robust command parsing system.
  switch(command.toLowerCase()) {
    case 'open chrome':
      exec('start chrome');
      break;
    case 'open notepad':
      exec('start notepad');
      break;
    case 'shutdown':
      exec('shutdown /s /t 0');
      break;
    default:
      console.log('Unknown command:', command);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});