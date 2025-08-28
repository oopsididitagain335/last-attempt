import { getDb } from '../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, code } = req.body; // token = email from signup
  if (!token || !code) return res.status(400).json({ error: 'Token and code required' });

  try {
    const db = await getDb();

    const pending = await db.collection('pending-users').findOne({ email: token });
    if (!pending) return res.status(400).json({ error: 'Invalid or expired token' });

    if (pending.twoFactorToken !== code || pending.twoFactorExpiry < new Date())
      return res.status(400).json({ error: 'Invalid or expired 2FA code' });

    // Move user to main users collection
    await db.collection('users').insertOne({
      email: pending.email,
      password: pending.password,
      createdAt: new Date(),
    });

    // Remove from pending
    await db.collection('pending-users').deleteOne({ email: token });

    // Issue JWT token for session
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
