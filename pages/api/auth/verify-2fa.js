import { getDb } from '../utils/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code } = req.body;

  const db = await getDb();
  const pendingUser = await db.collection('pending-users').findOne({ email });

  if (!pendingUser)
    return res.status(400).json({ error: 'No signup session found.' });

  if (pendingUser.twoFactorToken !== code || new Date() > pendingUser.twoFactorExpiry)
    return res.status(400).json({ error: 'Invalid or expired code.' });

  // Create user
  const newUser = {
    email: pendingUser.email,
    password: pendingUser.password,
    username: email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 1000),
    name: '',
    avatar: '',
    links: [],
    discordId: null,
    role: 'user',
    verified: true,
    createdAt: new Date(),
  };

  const result = await db.collection('users').insertOne(newUser);
  await db.collection('pending-users').deleteOne({ email });

  const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token, user: { email, username: newUser.username, discordId: null } });
}
