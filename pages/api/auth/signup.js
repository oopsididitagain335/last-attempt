import { getDb } from '../../utils/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const db = await getDb();
  const exists = await db.collection('users').findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const username = crypto.randomBytes(4).toString('hex');

  await db.collection('users').insertOne({ email, password: hashed, username, links: [] });
  const tempToken = crypto.randomBytes(16).toString('hex');
  res.status(200).json({ success: true, tempToken });
}
