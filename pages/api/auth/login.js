// /pages/api/auth/login.js
import { getDb } from '../../utils/db';
import bcrypt from 'bcryptjs';
import { send2FACode } from '../../utils/mailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate 6-digit numeric code (more user-friendly than hex)
    const code = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store code in DB (upsert)
    await db.collection('2fa-codes').updateOne(
      { email },
      { $set: { code, expiry } },
      { upsert: true }
    );

    // Send via email (your mailer should handle this)
    await send2FACode(email, code);

    // Respond without exposing user data
    res.status(200).json({ requires2FA: true, email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
