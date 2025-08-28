export default function Home({ user }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🔗 TheBioLink</h1>
        <nav>
          {user ? (
            <>
              <a href="/dashboard" style={styles.btn}>Dashboard</a>
              <a href="/api/auth/logout" style={styles.btnOutline}>Logout</a>
            </>
          ) : (
            <>
              <a href="/login" style={styles.btn}>Login</a>
              <a href="/signup" style={styles.btnPrimary}>Sign Up</a>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        <h2>One Link, All Your Content</h2>
        <p>Custom bio page. Connect your socials, store, music, and more.</p>
        <a href="/signup" style={styles.btnPrimary}>Get Your Link →</a>
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Segoe UI, sans-serif', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' },
  logo: { fontSize: '28px', fontWeight: 'bold', color: '#5865F2' },
  btn: { padding: '10px 16px', margin: '0 8px', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' },
  btnPrimary: { background: '#5865F2', color: 'white', ...styles.btn },
  btnOutline: { borderColor: '#5865F2', color: '#5865F2', ...styles.btn },
  main: { textAlign: 'center', marginTop: '80px' },
};
