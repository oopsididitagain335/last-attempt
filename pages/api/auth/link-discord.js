// pages/api/auth/link-discord.js

import { getDb } from '../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;
  const sessionToken = req.cookies.token; // Logged-in user's JWT

  if (!sessionToken) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    const db = await getDb();

    // Validate link token
    const linkRecord = await db.collection('discord_link_tokens').findOne({ token });
    if (!linkRecord || new Date() > linkRecord.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired link.' });
    }

    // Update user with Discord ID
    await db.collection('users').updateOne(
      { _id: decoded.id },
      { $set: { discordId: linkRecord.discordId } }
    );

    // Delete used token
    await db.collection('discord_link_tokens').deleteOne({ token });

    res.status(200).json({ success: 'Discord account linked!' });
  } catch (err) {
    console.error('Link error:', err);
    res.status(500).json({ error: 'Link failed' });
  }
}
