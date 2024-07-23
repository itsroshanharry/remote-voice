const express = require('express');
const https = require('https');
const selfsigned = require('selfsigned');
const WebSocket = require('ws');
const { exec } = require('child_process');


const app = express();

// Generate a self-signed certificate
function generateCertificate() {
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, { days: 365 });
  return { key: pems.private, cert: pems.cert };
}

const { key, cert } = generateCertificate();

const server = https.createServer({ key, cert }, app);
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
  if (command.toLowerCase().startsWith('search for ')) {
    const searchQuery = encodeURIComponent(command.slice(11));
    exec(`start chrome https://www.google.com/search?q=${searchQuery}`);
  } else {
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
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});