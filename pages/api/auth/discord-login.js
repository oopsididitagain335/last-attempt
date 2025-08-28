// pages/api/auth/discord-login.js

export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${process.env.BASE_URL}/api/auth/discord-callback`);
  const scope = encodeURIComponent('identify email guilds');
  const discordOauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&prompt=consent`;

  res.redirect(discordOauthUrl);
}
