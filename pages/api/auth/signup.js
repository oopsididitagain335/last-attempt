import { getDb } from '../utils/db';
import { send2FACode } from '../utils/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const db = await getDb();
  const existing = await db.collection('users').findOne({ email });
  if (existing)
    return res.status(400).json({ error: 'Email already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const twoFactorToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-digit code
  const twoFactorExpiry = new Date(Date.now() + 900000); // 15 min

  // Temp store user with 2FA token
  await db.collection('pending-users').insertOne({
    email,
    password: hashedPassword,
    twoFactorToken,
    twoFactorExpiry,
    createdAt: new Date(),
  });

  // Send 2FA code
  await send2FACode(email, twoFactorToken);

  res.status(200).json({ success: 'Check your email for the 2FA code.' });
}
