import logo from './logo.svg';
import './App.css';

import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          My example react page
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

connectDisocrd();

console.log("We here rn");
const ws = new WebSocket(`wss://${disocrdSdk.instanceId}.discordsays.com/.proxy/api`);
ws.onopen = () => {
  console.log('Connected to server');
}

async function connectDisocrd() {
  setupDiscordSdk().then(() => {
    console.log("Discord SDK is authenticated");
});
}


async function setupDiscordSdk() {
  let auth;
  const discordSdk = new DiscordSDK(process.env.REACT_APP_DISCORD_CLIENT_ID, {
    urlMappings: [
      {
      prefix: "/api",
      target: "https://friendly-feud.onrender.com",
      },
    ],
  });
  await discordSdk.ready();
  console.log("Discord SDK is ready");

  // Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: process.env.REACT_APP_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: [
      "identify",
      "guilds",
      "applications.commands"
    ],
  });

  // Retrieve an access_token from your activity's server
  const response = await fetch("/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const { access_token } = await response.json();

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });

  if (auth == null) {
    throw new Error("Authenticate command failed");
  }
}
//cloudflared tunnel --url http://localhost:3000


export default App;
