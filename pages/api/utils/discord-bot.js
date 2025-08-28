import { Client, GatewayIntentBits } from 'discord.js';
import { getDb } from './db';

let client;

export default async function handler(req, res) {
  if (!client) {
    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.on('ready', () => {
      console.log(`🤖 Discord Bot: ${client.user.tag} is ready!`);
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot || message.content !== '!link') return;
      if (message.guild?.id !== process.env.DISCORD_SERVER_ID) return;

      const db = await getDb();
      const existing = await db.collection('users').findOne({ discordId: message.author.id });
      if (existing) {
        return message.reply('✅ Your Discord is already linked.');
      }

      const token = require('crypto').randomBytes(32).toString('hex');
      await db.collection('discord_link_tokens').insertOne({
        token,
        discordId: message.author.id,
        expiresAt: new Date(Date.now() + 900000),
      });

      try {
        await message.author.send(`🔗 Link your account: ${process.env.BASE_URL}/link/${token}`);
        await message.reply('📨 Check your DMs!');
      } catch (err) {
        await message.reply('❌ Enable DMs to receive the link.');
      }
    });

    client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
  }

  if (res) res.status(200).json({ running: true });
}

handler();
