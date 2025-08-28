// pages/dashboard.js
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    if (!token) return setError('Not logged in');

    fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setLinks(data.user.links || []);
        } else {
          setError('Failed to load profile');
        }
      })
      .catch(() => setError('Network error'));
  }, []);

  const save = () => {
    const token = getCookie('token');
    fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, links })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) alert('Saved!');
      else setError('Save failed');
    });
  };

  const addLink = () => setLinks([...links, { label: 'New Link', url: 'https://example.com' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  if (error) return <div style={styles.error}>{error}</div>;
  if (!user) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🛠️ Dashboard</h1>
      <input
        placeholder="Display Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />

      <h2 style={styles.h2}>🔗 Your Links</h2>
      {links.map((link, i) => (
        <div key={i} style={styles.linkRow}>
          <input
            value={link.label}
            onChange={e => {
              links[i].label = e.target.value;
              setLinks([...links]);
            }}
            style={{ ...styles.input, width: '40%' }}
          />
          <input
            value={link.url}
            onChange={e => {
              links[i].url = e.target.value;
              setLinks([...links]);
            }}
            style={{ ...styles.input, width: '40%' }}
          />
          <button onClick={() => removeLink(i)} style={{ ...styles.btn, background: '#e74c3c' }}>
            ✖
          </button>
        </div>
      ))}
      <button onClick={addLink} style={styles.btn}>+ Add Link</button>
      <button onClick={save} style={styles.btnPrimary}>💾 Save</button>

      <div style={styles.spacer} />
      <a href={`/u/${user.username}`} target="_blank" style={styles.btn}>👉 View My Page</a>
      <a href="/api/auth/logout" style={styles.btnOutline}>Logout</a>
    </div>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  },
  h1: { fontSize: '28px', color: '#2c3e50', marginBottom: '20px' },
  h2: { fontSize: '20px', color: '#34495e', marginTop: '30px' },
  input: {
    padding: '12px',
    margin: '8px 0',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  linkRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '10px 16px',
    margin: '5px 0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    background: '#95a5a6',
    color: 'white',
  },
  btnPrimary: {
    background: '#5865F2',
    ...styles.btn,
  },
  btnOutline: {
    background: 'white',
    border: '1px solid #5865F2',
    color: '#5865F2',
    ...styles.btn,
  },
  spacer: {
    height: '40px',
  },
  error: {
    padding: '16px',
    margin: '20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
  },
};
