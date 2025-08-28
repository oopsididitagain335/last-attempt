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
        {error && <p style={styles.error}>{error}</p>}
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

// Add styles object here
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f9fc',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  btnPrimary: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5865F2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};
