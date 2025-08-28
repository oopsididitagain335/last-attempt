// discord-bot-runner.js
require('./pages/api/utils/discord-bot.js')({}, {
  json: () => {},
  status: () => ({ end: () => {} })
});
