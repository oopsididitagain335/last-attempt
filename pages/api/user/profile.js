import { getDb } from '../utils/db';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1] ||
                req.query.token;

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = await db.collection('users').findOne(
      req.query.username ? { username: req.query.username } : { _id: decoded.id },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
