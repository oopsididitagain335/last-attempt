// /pages/verify-2fa.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Verify2FA() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // Use email, not token
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract email from query (sent from login)
  useEffect(() => {
    if (router.isReady) {
      const { email } = router.query;
      if (email) {
        setEmail(decodeURIComponent(email)); // Decode URL-encoded email
      } else {
        router.push('/login'); // Redirect if no email
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Invalid session. Please go back and log in.');

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.token) {
        // ✅ Server sets HttpOnly cookie via Set-Cookie header!
        // No need to touch document.cookie — just redirect
        router.push('/dashboard');
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }

    setLoading(false);
  };

  if (!email) return <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Enter 2FA Code</h2>
        <p>Check your email for the 6-digit code sent to:</p>
        <strong style={{ display: 'block', margin: '10px 0', color: '#333' }}>{email}</strong>
        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength="6"
            required
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <a href="/login" style={{ color: '#5865F2', textDecoration: 'none' }}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f8f9fc', padding: '20px' },
  card: { width: '90%', maxWidth: '400px', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white', textAlign: 'center' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', marginBottom: '12px', width: '100%', textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  btnPrimary: { padding: '12px', background: '#5865F2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: '600', fontSize: '16px' },
};
