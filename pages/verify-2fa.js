import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Verify2FA() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Wait for router to be ready before using query
  useEffect(() => {
    if (router.isReady) {
      setToken(router.query.token || '');
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError('Invalid session. Please go back and try again.');

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code }),
      });
      const data = await res.json();

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=3600`;
        router.push('/dashboard');
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }

    setLoading(false);
  };

  if (!token) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Enter 2FA Code</h2>
        <p>Check your email for the 2FA code.</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="123456"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { width: '90%', maxWidth: '400px', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white', textAlign: 'center' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', marginBottom: '12px', width: '100%' },
  btnPrimary: { padding: '12px', background: '#5865F2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }
};
