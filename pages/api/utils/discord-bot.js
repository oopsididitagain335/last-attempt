// pages/api/utils/discord-bot.js

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
      console.log(`🤖 Discord Bot: ${client.user.tag} is online and ready!`);
    });

    client.on('messageCreate', async (message) => {
      // Ignore bots and non-commands
      if (message.author.bot) return;
      if (message.content.trim() !== '!link') return;

      // Must be in your server
      if (!message.guild || message.guild.id !== process.env.DISCORD_SERVER_ID) return;

      try {
        const db = await getDb();

        // Check if already linked
        const existingUser = await db.collection('users').findOne({ discordId: message.author.id });
        if (existingUser) {
          return message.reply({
            content: '✅ Your Discord is already linked to a TheBioLink account!',
          });
        }

        // Generate secure one-time token
        const linkToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

        await db.collection('discord_link_tokens').insertOne({
          token: linkToken,
          discordId: message.author.id,
          createdAt: new Date(),
          expiresAt,
        });

        const linkUrl = `${process.env.BASE_URL}/link/${linkToken}`;

        // Send DM to user
        await message.author.send({
          content: `🔗 Click below to link your Discord to your TheBioLink account:\n${linkUrl}\n\nThis link expires in 15 minutes.`,
        });

        // Reply in server
        await message.reply({
          content: '📨 I sent you a private message with a link to connect your account!',
          allowedMentions: { users: [message.author.id] },
        });
      } catch (err) {
        console.error('Error in !link command:', err);
        try {
          await message.author.send('❌ Failed to send link. Please try again later.');
        } catch (dmErr) {
          // If DM fails (e.g., DMs disabled)
          await message.reply({
            content: `<@${message.author.id}> I couldn't send you a DM. Please enable server DMs and try again.`,
            allowedMentions: { users: [message.author.id] },
          });
        }
      }
    });

    // Login to Discord
    client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
      console.error('❌ Failed to log in Discord bot:', err);
    });
  }

  // Optional: health check
  if (res) {
    res.status(200).json({ status: 'Discord bot worker is running' });
  }
}

// Auto-start bot (for background workers like on Render)
handler();
