// pages/api/auth/discord-callback.js

import { getDb } from '../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.BASE_URL}/api/auth/discord-callback`,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch token', details: tokenData });
    }

    const { access_token } = tokenData;

    // Step 2: Get user data from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordUser = await userResponse.json();

    if (!userResponse.ok) {
      return res.status(400).json({ error: 'Failed to fetch Discord user' });
    }

    // Step 3: Check if this Discord ID is linked to a TheBioLink account
    const db = await getDb();
    const localUser = await db.collection('users').findOne({ discordId: discordUser.id });

    if (!localUser) {
      return res.status(401).json({
        error: 'Discord not linked. Please sign up with email first, then link your Discord using !link in the server.',
      });
    }

    // Step 4: Generate JWT
    const token = jwt.sign({ id: localUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set secure cookie (HttpOnly, SameSite)
    res.setHeader('Set-Cookie', [
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    ]);

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Discord callback error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
