import { getDb } from '../../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, code } = req.body;

  const db = await getDb();
  const stored = await db.collection('2fa-codes').findOne({ email });
  if (!stored || stored.code !== code || new Date() > stored.expiry)
    return res.status(400).json({ error: 'Invalid or expired code.' });

  const user = await db.collection('users').findOne({ email });
  await db.collection('2fa-codes').deleteOne({ email });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, user: { email, username: user.username, discordId: user.discordId } });
}
