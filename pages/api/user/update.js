import { getDb } from '../utils/db';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const update = req.body;

    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: decoded.id },
      { $set: update }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(401).json({ error: 'Invalid session' });
  }
}
