import { useState } from 'react';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      document.cookie = `token=${data.token}; path=/; max-age=3600`;
      setUser(data.user);
      location.href = '/dashboard';
    } else {
      setError(data.error);
    }
  };

  const handleDiscordLogin = () => {
    const { DISCORD_CLIENT_ID } = process.env;
    const REDIRECT = encodeURIComponent('http://localhost:3000/api/auth/discord-callback');
    window.location = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=code&scope=identify&prompt=consent`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleEmailLogin} style={styles.form}>
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
          <button type="submit" style={styles.btnPrimary}>Login</button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center' }}>— or —</div>

        <button onClick={handleDiscordLogin} style={{ ...styles.btn, background: '#5865F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf90ed4294370c_icon_clyde_white_RGB.png" width="20" /> Login with Discord
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { width: '90%', maxWidth: '400px', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  btn: { padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
  btnPrimary: { ...styles.btn, background: '#5865F2', color: 'white' },
};
