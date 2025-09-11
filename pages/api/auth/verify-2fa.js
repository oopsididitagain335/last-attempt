// /pages/api/auth/verify-2fa.js
import { getDb } from '../../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });

  const db = await getDb();
  const record = await db.collection('2fa-codes').findOne({ email });

  if (!record || record.code !== code || record.expiry < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired 2FA code' });
  }

  // ✅ SUCCESS: Issue JWT token as HTTP-only cookie
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set cookie — HttpOnly, Secure (in prod), Path=/, Max-Age=3600
  res.setHeader(
    'Set-Cookie',
    `token=${token}; Path=/; HttpOnly; Max-Age=3600; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
  );

  // Optional: Clear 2FA code after use (security best practice)
  await db.collection('2fa-codes').deleteOne({ email });

  // Return token in body too for client-side routing (optional)
  res.status(200).json({ token, message: 'Login successful' });
}
