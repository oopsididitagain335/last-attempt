export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'token=; path=/; max-age=0');
  res.status(200).json({ success: true });
}
