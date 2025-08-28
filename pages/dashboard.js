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
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setLinks(data.user.links || []);
        } else {
          setError(data.error || 'Failed to load');
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
    .then(r => r.json())
    .then(() => alert('Saved!'));
  };

  const addLink = () => setLinks([...links, { label: 'New', url: 'https://example.com' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  if (error) return <Error msg={error} />;
  if (!user) return <Loading />;

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>🛠️ Dashboard</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <h2 style={styles.h2}>🔗 Links</h2>
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
          <button onClick={() => removeLink(i)} style={{ ...styles.btn, bg: '#e74c3c' }}>✖</button>
        </div>
      ))}
      <button onClick={addLink} style={styles.btn}>+ Add</button>
      <button onClick={save} style={styles.btnPrimary}>💾 Save</button>
      <a href={`/u/${user.username}`} style={styles.btn}>👉 View</a>
      <a href="/api/auth/logout" style={styles.btnOutline}>Logout</a>
    </div>
  );
}

function Loading() {
  return <div style={styles.container}>Loading...</div>;
}

function Error({ msg }) {
  return <div style={styles.error}>{msg}</div>;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const styles = {
  container: { padding: '40px', fontFamily: 'Arial', textAlign: 'center' },
  h1: { fontSize: '28px', margin: '10px 0' },
  h2: { fontSize: '20px', margin: '20px 0 10px' },
  input: { padding: '12px', margin: '5px', width: '100%', border: '1px solid #ddd', borderRadius: '6px' },
  row: { display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '5px 0' },
  btn: { padding: '10px', margin: '5px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnPrimary: { ...styles.btn, background: '#5865F2', color: 'white' },
  btnOutline: { ...styles.btn, background: 'white', border: '1px solid #5865F2', color: '#5865F2' },
  error: { color: 'white', background: '#e74c3c', padding: '16px', borderRadius: '6px', margin: '20px' }
};
