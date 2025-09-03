import { getDb } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    const db = await getDb();
    const user = await db.collection('users').findOne({ tempToken: token });

    if (!user) return res.status(400).json({ error: 'Invalid token' });

    await db.collection('users').updateOne({ _id: user._id }, { $set: { discordLinked: true } });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
