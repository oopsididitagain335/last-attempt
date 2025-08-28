import { getDb } from '../utils/db';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();

    const admin = await db.collection('users').findOne({ _id: decoded.id });
    if (admin.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();

    res.status(200).json({ users });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
