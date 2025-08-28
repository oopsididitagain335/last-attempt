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

    // Check if email already exists
    const existing = await db.collection('users').findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 2FA code
    const twoFactorToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-digit
    const twoFactorExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store user temporarily
    await db.collection('pending-users').insertOne({
      email,
      password: hashedPassword,
      twoFactorToken,
      twoFactorExpiry,
      createdAt: new Date(),
    });

    // Send 2FA email
    await send2FACode(email, twoFactorToken);

    res.status(200).json({ success: true, tempToken: email });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
