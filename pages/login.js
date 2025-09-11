// /pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  // Check URL for errors (e.g., from Discord)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }
  }, []);

  // Step 1: Submit email + password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.requires2FA) {
        setIs2FA(true); // Move to 2FA step
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit 2FA code
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-login-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.token) {
        // ✅ Server set the cookie automatically via Set-Cookie header!
        // Just redirect — no need to touch document.cookie
        router.push('/dashboard'); // Next.js client-side nav
      } else {
        setError(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Login to TheBioLink</h1>

        {!is2FA ? (
          <>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                disabled={isLoading}
              />
              <button type="submit" style={styles.btnPrimary} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Continue'}
              </button>
            </form>

            <div style={styles.or}>— or —</div>

            {/* Discord Login Button */}
            <a href="/api/auth/discord-login" style={styles.discordBtn}>
              <svg style={styles.discordIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="white" d="M20.317 4.475a19.88 19.88 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.587 18.587 0 0 0-5.586 0 9.746 9.746 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.882 19.882 0 0 0 3.682 4.475a.07.07 0 0 0-.032.027C.533 9.16.17 13.827 1.01 18.44a.08.08 0 0 0 .038.055 19.9 19.9 0 0 0 5.9 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 2.38-3.38.076.076 0 0 0-.041-.106.078.078 0 0 0-.046.011 13.106 13.106 0 0 1-1.02-.505.077.077 0 0 1-.008-.128 10.626 10.626 0 0 0 .329-.212.076.076 0 0 1 .078-.007c3.928 2.11 8.16 2.11 11.895 0a.077.077 0 0 1 .078.007c.11.072.22.144.329.212a.077.077 0 0 1-.008.128 14.548 14.548 0 0 1-1.02.505.077.077 0 0 0-.042.106 15.826 15.826 0 0 0 2.38 3.38.077.077 0 0 0 .084.028 17.655 17.655 0 0 0 5.9-3.03.078.078 0 0 0 .038-.055c.84-4.613.476-9.28-.64-13.958a.07.07 0 0 0-.032-.027zM8.02 15.33c-1.182 0-2.157-1.095-2.157-2.43 0-1.34.956-2.445 2.157-2.445 1.21 0 2.176 1.105 2.157 2.445 0 1.335-.956 2.43-2.157 2.43zm7.975 0c-1.182 0-2.157-1.095-2.157-2.43 0-1.34.956-2.445 2.157-2.445 1.21 0 2.176 1.105 2.157 2.445 0 1.335-.956 2.43-2.157 2.43z"/>
              </svg>
              Login with Discord
            </a>

            <p style={styles.footer}>
              Don’t have an account? <a href="/signup" style={styles.link}>Sign up</a>
            </p>
          </>
        ) : (
          // 2FA Verification Form
          <>
            <h2 style={styles.title}>📧 Enter 2FA Code</h2>
            <p>We sent a code to <strong>{email}</strong></p>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handle2FASubmit} style={styles.form}>
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                required
                style={styles.input}
                disabled={isLoading}
              />
              <button type="submit" style={styles.btnPrimary} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
            <p style={styles.footer}>
              <a href="#" onClick={() => setIs2FA(false)} style={styles.link}>Back to login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Inline CSS Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fc',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1a1a1a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '10px',
  },
  input: {
    padding: '14px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  btnPrimary: {
    padding: '14px',
    backgroundColor: '#5865F2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  discordBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px',
    backgroundColor: '#5865F2',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '16px',
  },
  discordIcon: {
    width: '20px',
    height: '20px',
  },
  or: {
    margin: '24px 0',
    color: '#888',
    fontSize: '14px',
  },
  footer: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#5865F2',
    textDecoration: 'none',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '14px',
  },
};
