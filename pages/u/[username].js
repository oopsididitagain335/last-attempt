import { useState, useEffect } from 'react';

export default function UserBio({ username }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/profile?username=${username}`)
      .then(r => r.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div style={styles.container}>
      {user.avatar && <img src={user.avatar} style={styles.avatar} />}
      <h1>{user.name || user.username}</h1>
      <p>@{user.username}</p>
      {user.links?.map((link, i) => (
        <a
          key={i}
          href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { username: params.username } };
}

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '60px 20px',
    backgroundColor: '#f8f9fc'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '16px'
  },
  link: {
    display: 'block',
    margin: '12px auto',
    width: '80%',
    maxWidth: '300px',
    padding: '14px',
    backgroundColor: '#5865F2',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '500',
    transition: 'transform 0.2s',
  }
};
