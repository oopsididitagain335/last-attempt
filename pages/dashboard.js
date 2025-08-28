import { useState, useEffect } from 'react';

export default function Dashboard({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [links, setLinks] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      setUser(data.user);
      setName(data.user.name || '');
      setLinks(data.user.links || []);
    });
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
    }).then(r => r.json())
    .then(data => {
      if (data.success) alert('Saved!');
      else setError('Save failed');
    });
  };

  const addLink = () => setLinks([...links, { label: 'New Link', url: 'https://example.com' }]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));

  return (
    <div style={styles.container}>
      <h1>🛠️ Dashboard</h1>
      <input placeholder="Display Name" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
      
      <h3>🔗 Your Links</h3>
      {links.map((link, i) => (
        <div key={i} style={styles.linkRow}>
          <input value={link.label} onChange={e => {
            links[i].label = e.target.value;
            setLinks([...links]);
          }} style={{ ...styles.input, width: '40%' }} />
          <input value={link.url} onChange={e => {
            links[i].url = e.target.value;
            setLinks([...links]);
          }} style={{ ...styles.input, width: '40%' }} />
          <button onClick={() => removeLink(i)} style={{ ...styles.btn, background: 'red' }}>❌</button>
        </div>
      ))}
      <button onClick={addLink} style={styles.btn}>+ Add Link</button>
      <button onClick={save} style={styles.btnPrimary}>💾 Save Profile</button>

      <div style={styles.spacer} />
      <a href={`/u/${user.username}`} target="_blank" style={styles.btn}>👉 View My Bio Link</a>
      <a href="/api/auth/logout" style={styles.btnOutline}>Logout</a>
    </div>
  );
}

function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

const styles = {
  container: { padding: '40px', fontFamily: 'Arial' },
  input: { padding: '10px', margin: '8px 0', width: '100%', border: '1px solid #ddd', borderRadius: '6px' },
  linkRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' },
  btn: { padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnPrimary: { background: '#5865F2', color: 'white', ...styles.btn },
  btnOutline: { background: 'white', border: '1px solid #5865F2', color: '#5865F2', ...styles.btn },
  spacer: { height: '40px' }
};
