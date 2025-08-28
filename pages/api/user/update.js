import { getDb } from '../utils/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const update = req.body;

    const db = await getDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: update }
    );

    if (!result.matchedCount) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Update error:', err);
    res.status(401).json({ error: 'Invalid session' });
  }
}
