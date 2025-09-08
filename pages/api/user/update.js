import { getDb } from '../utils/db'; // Correct import path
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Restrict to POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Validate request body
    const { name, links } = req.body;
    if (!name && !links) {
      return res.status(400).json({ error: 'Name or links required' });
    }

    // Connect to database
    const db = await getDb();

    // Check if user exists
    const user = await db.collection('users').findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    const updateData = {};
    if (name !== undefined) updateData.name = name || '';
    if (links !== undefined) updateData.links = Array.isArray(links) ? links : [];

    const result = await db.collection('users').updateOne(
      { email: decoded.email },
      { $set: updateData }
    );

    // Check if update was successful
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(401).json({ error: 'Invalid token or server error' });
  }
}
