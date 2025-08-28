// server.js
const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Import your Discord bot (optional: run in same process or separate)
let discordBot;
if (process.env.ENABLE_DISCORD_BOT !== 'false') {
  try {
    // This will run the bot in the same process
    discordBot = require('./pages/api/utils/discord-bot');
  } catch (err) {
    console.error('Failed to start Discord bot:', err.message);
  }
}

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // Parse incoming request
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Custom routes can be added here
    // Example: server.get('/custom', (req, res) => { ... })

    // Handle all other routes with Next.js
    return handle(req, res, parsedUrl);
  });

  const port = process.env.PORT || 3000;

  httpServer.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📘 Next.js is running in ${dev ? 'development' : 'production'} mode`);
    if (discordBot) console.log(`🤖 Discord bot is running`);
  });

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    if (discordBot?.client) {
      discordBot.client.destroy();
      console.log('🤖 Discord bot disconnected');
    }
    process.exit(0);
  });
}).catch(err => {
  console.error('An error occurred, unable to start the server', err);
});
