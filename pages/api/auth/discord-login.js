// pages/api/auth/discord-login.js

/**
 * Redirects user to Discord OAuth2 login page
 */

export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.BASE_URL}/api/auth/discord-callback`);
  const scope = encodeURIComponent('identify email');
  const discordOauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&prompt=consent`;

  res.redirect(discordOauthUrl);
}
