import { Client, GatewayIntentBits } from 'discord.js';
import { getDb } from './db';

let client;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!client) {
    client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    client.on('ready', () => {
      console.log(`🤖 Discord bot ${client.user.tag} is ready!`);
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (message.content.trim() !== '!link') return;
      if (!message.guild || message.guild.id !== process.env.DISCORD_SERVER_ID) return;

      const db = await getDb();
      const user = await db.collection('users').findOne({ discordId: message.author.id });
      if (user) {
        message.reply('❌ You already linked your Discord account.');
        return;
      }

      const tempToken = require('crypto').randomBytes(32).toString('hex');
      await db.collection('link_tokens').insertOne({
        token: tempToken,
        discordId: message.author.id,
        createdAt: new Date(),
      });

      message.reply(
        `✅ Run this command on TheBioLink site to link:\n` +
        `\`\`\`link ${tempToken}\`\`\`\n` +
        `Or click: [https://thebiolink.vercel.app/link/${tempToken}]`
      );
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
  }

  res.status(200).json({ status: 'Discord bot is running' });
}
