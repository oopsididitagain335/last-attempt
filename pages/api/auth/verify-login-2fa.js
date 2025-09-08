import { getDb } from '../../../db'; // Fixed import path
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
 
  const { email, code } = req.body;
  try {
    const db = await getDb();
    const stored = await db.collection('2fa-codes').findOne({ email });
   
    if (!stored || stored.code !== code || new Date() > stored.expiry)
      return res.status(400).json({ error: 'Invalid or expired code.' });
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
   
    await db.collection('2fa-codes').deleteOne({ email });
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        username: user.username,
        discordId: user.discordId
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
