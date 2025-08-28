import { useState } from 'react';

export default function Verify2FA({ tempToken }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tempToken, code })
    });
    const data = await res.json();
    if (data.token) {
      document.cookie = `token=${data.token}; path=/; max-age=3600`;
      location.href = '/dashboard';
    } else {
      setError(data.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Enter 2FA Code</h2>
        <p>We sent a code to your email.</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="123456"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.btnPrimary}>Verify</button>
        </form>
      </div>
    </div>
  );
}
