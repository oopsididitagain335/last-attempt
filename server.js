const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let discordBot;
if (process.env.ENABLE_DISCORD_BOT !== 'false') {
  try {
    discordBot = require('./pages/api/utils/discord-bot');
  } catch (err) {
    console.error('Discord bot failed:', err.message);
  }
}

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  const httpServer = createServer(server);

  // Handle all Next.js requests
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    if (discordBot) console.log('🤖 Discord bot is running');
  });

  process.on('SIGINT', () => {
    console.log('🛑 Shutting down...');
    if (discordBot?.client) discordBot.client.destroy();
    process.exit(0);
  });
});
