import { getDb } from '../utils/db';
import { send2FACode } from '../utils/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const twoFactorToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const twoFactorExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.collection('2fa-codes').updateOne(
      { email },
      { $set: { code: twoFactorToken, expiry: twoFactorExpiry } },
      { upsert: true }
    );

    await send2FACode(email, twoFactorToken);

    res.status(200).json({ requires2FA: true, email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
