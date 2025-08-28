import { getDb } from '../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, code } = req.body;

  if (typeof token !== 'string' || !token.trim())
    return res.status(400).json({ error: 'Token is required' });

  if (typeof code !== 'string' || !code.trim())
    return res.status(400).json({ error: '2FA code is required' });

  try {
    const db = await getDb();

    const pending = await db.collection('pending-users').findOne({ email: token });
    if (!pending) return res.status(400).json({ error: 'Invalid or expired token' });

    if (pending.twoFactorToken !== code || pending.twoFactorExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired 2FA code' });
    }

    // Move user to main users collection
    await db.collection('users').insertOne({
      email: pending.email,
      password: pending.password,
      createdAt: new Date(),
    });

    // Remove from pending
    await db.collection('pending-users').deleteOne({ email: token });

    // Issue JWT token
    const jwtToken = jwt.sign(
      { email: pending.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error('2FA verification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
