import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.tempToken) {
        router.push(`/verify-2fa?token=${data.tempToken}`);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { width: '90%', maxWidth: '400px', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  btnPrimary: { padding: '12px', background: '#5865F2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};
