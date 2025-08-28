import { getDb } from '../utils/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();

    const query = req.query.username
      ? { username: req.query.username }
      : { _id: new ObjectId(decoded.id) };

    const user = await db.collection('users').findOne(query, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
}
