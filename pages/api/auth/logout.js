// /pages/api/auth/logout.js
export default function handler(req, res) {
  // Clear the token cookie
  res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0');

  // Redirect to login
  res.redirect('/login');
}
