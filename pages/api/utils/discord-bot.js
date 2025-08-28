import { Client, GatewayIntentBits } from 'discord.js';
import { getDb } from './db';

let client;

export default async function handler(req, res) {
  if (!client) {
    client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    client.on('ready', () => {
      console.log(`🤖 Discord bot (${client.user.tag}) is live!`);
    });

    client.on('messageCreate', async (message) => {
      if (message.author.bot || message.content !== '!link') return;
      if (message.guild?.id !== process.env.DISCORD_SERVER_ID) return;

      const db = await getDb();
      const existing = await db.collection('users').findOne({ discordId: message.author.id });
      if (existing) {
        return message.reply('✅ Your Discord is already linked to an account.');
      }

      const token = require('crypto').randomBytes(32).toString('hex');
      await db.collection('link_tokens').insertOne({ token, discordId: message.author.id, createdAt: new Date() });

      message.reply(
        `Click to link your account:\n${process.env.BASE_URL}/link/${token}`
      );
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
  }

  res?.status?.(200).json?.({ status: 'Bot started' });
}

// Auto-start on import (for background worker)
handler();
