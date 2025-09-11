// /pages/api/user/update.js
import { getDb } from '../utils/db'; // ← Fixed path
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, links } = req.body;

    if (!name && !links) {
      return res.status(400).json({ error: 'Name or links required' });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim() || '';
    if (links !== undefined) updateData.links = Array.isArray(links) ? links : [];

    const result = await db.collection('users').updateOne(
      { email: decoded.email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
}
