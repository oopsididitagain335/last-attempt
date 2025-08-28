// pages/dashboard.js
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    if (!token) return setError('Not logged in');

    fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setLinks(data.user.links || []);
        } else {
          setError(data.error || 'Failed to load profile');
        }
      })
      .catch(() => setError('Failed to load data'));
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
    .then(() => alert('Saved!'));
  };

  const addLink = () => setLinks([...links, { label: 'New Link', url: 'https://example.com' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  if (error) return <div style={styles.error}>{error}</div>;
  if (!user) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🛠️ Dashboard</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <h2 style={styles.h2}>Your Links</h2>
      {links.map((link, i) => (
        <div key={i} style={styles.row}>
          <input
            value={link.label}
            onChange={e => { link.label = e.target.value; setLinks([...links]); }}
            style={{ ...styles.input, width: '40%' }}
          />
          <input
            value={link.url}
            onChange={e => { link.url = e.target.value; setLinks([...links]); }}
            style={{ ...styles.input, width: '40%' }}
          />
          <button onClick={() => removeLink(i)} style={styles.removeBtn}>✖</button>
        </div>
      ))}
      <button onClick={addLink} style={styles.btn}>+ Add Link</button>
      <button onClick={save} style={styles.saveBtn}>💾 Save</button>
      <a href={`/u/${user.username}`} style={styles.viewBtn}>👉 View Page</a>
      <a href="/api/auth/logout" style={styles.logoutBtn}>Logout</a>
    </div>
  );
}

// Utility: Get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

// Inline styles
const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
  },
  h1: { fontSize: '28px', color: '#1a1a1a', marginBottom: '20px' },
  h2: { fontSize: '20px', color: '#333', margin: '30px 0 10px' },
  input: {
    padding: '12px',
    margin: '6px 0',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
  },
  row: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  removeBtn: {
    padding: '10px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  btn: {
    padding: '12px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  saveBtn: {
    ...styles.btn,
    background: '#5865F2',
  },
  viewBtn: {
    display: 'block',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#2ecc71',
    color: 'white',
    textAlign: 'center',
    borderRadius: '6px',
    textDecoration: 'none',
  },
  logoutBtn: {
    display: 'block',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#9b59b6',
    color: 'white',
    textAlign: 'center',
    borderRadius: '6px',
    textDecoration: 'none',
  },
  error: {
    padding: '16px',
    margin: '20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '6px',
    textAlign: 'center',
  }
};
