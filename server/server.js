import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
dotenv.config({ path: "../.env" });

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  console.log(`New client connected from ${req.socket.remoteAddress}`);
  ws.send('Welcome to the Websocket server!');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Server received: ${message}`);
  });
  ws.on('close', () => {
    console.log('Clinet disconnected');
  });
});

app.post("/api/token", async (req, res) => {

  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.REACT_APP_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.get('/', (req, res) => {
  res.send({
    message: 'Why hello there!'
  });
});

server.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
