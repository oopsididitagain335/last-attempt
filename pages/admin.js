import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data.users) setUsers(data.users);
      else setError(data.error);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h1>🛡️ Admin Panel</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Discord Linked</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name || '–'}</td>
              <td>{u.email}</td>
              <td>{u.discordId ? '✅' : '❌'}</td>
              <td>{u.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/" style={styles.btn}>← Home</a>
    </div>
  );
}

const getCookie = (name) => document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];

const styles = {
  container: { padding: '40px', fontFamily: 'Arial' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  btn: { padding: '10px 16px', background: '#5865F2', color: 'white', textDecoration: 'none', borderRadius: '6px', display: 'inline-block' }
};
