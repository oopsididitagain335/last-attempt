import { getDb } from '../utils/db'; // Fixed import path
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, links } = req.body;
    const db = await getDb();
    await db.collection('users').updateOne(
      { email: decoded.email },
      { $set: { name: name || '', links: links || [] } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
