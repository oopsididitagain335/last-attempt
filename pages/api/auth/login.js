import { getDb } from '../utils/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { send2FACode } from '../utils/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const db = await getDb();
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  // Create 2FA code
  const twoFactorToken = crypto.randomBytes(3).toString('hex').toUpperCase();
  const twoFactorExpiry = new Date(Date.now() + 900000); // 15 min

  await db.collection('2fa-codes').updateOne(
    { email },
    { $set: { code: twoFactorToken, expiry: twoFactorExpiry } },
    { upsert: true }
  );

  // Send 2FA email
  await send2FACode(email, twoFactorToken);

  res.status(200).json({ requires2FA: true, email });
}
