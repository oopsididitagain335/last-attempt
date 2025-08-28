import { useEffect, useState } from 'react';

export default function BioLink({ username }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/user/profile?username=${username}`)
      .then(r => r.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <img src={user.avatar || "https://via.placeholder.com/100"} style={styles.avatar} />
      <h2>{user.name || username}</h2>
      {user.links?.map((link, i) => (
        <a key={i} href={link.url} target="_blank" style={styles.link}>
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
  container: { textAlign: 'center', padding: '40px', fontFamily: 'Arial' },
  avatar: { width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px' },
  link: { display: 'block', margin: '10px 0', padding: '10px', backgroundColor: '#5865F2', color: 'white', textDecoration: 'none', borderRadius: '6px' }
};
