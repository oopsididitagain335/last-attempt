export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🔗 TheBioLink</h1>
        <nav>
          <a href="/login" style={styles.btn}>Login</a>
          <a href="/signup" style={styles.btnPrimary}>Sign Up</a>
        </nav>
      </header>

      <main style={styles.main}>
        <h2>Your Personal Link Hub</h2>
        <p>One bio link. Infinite possibilities.</p>
        <a href="/signup" style={styles.btnPrimary}>Get Started</a>
      </main>
    </div>
  );
}

const styles = {
  container: { 
    fontFamily: 'Segoe UI, sans-serif', 
    padding: '20px', 
    minHeight: '100vh', 
    backgroundColor: '#f9f9fb' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px 0' 
  },
  logo: { 
    fontSize: '28px', 
    fontWeight: 'bold', 
    color: '#5865F2' 
  },
  btn: { 
    padding: '10px 16px', 
    margin: '0 5px', 
    border: '1px solid #ddd', 
    borderRadius: '6px', 
    textDecoration: 'none', 
    color: '#555', 
    fontSize: '14px' 
  },
  btnPrimary: { 
    background: '#5865F2', 
    color: 'white', 
    border: 'none' 
  },
  main: { 
    textAlign: 'center', 
    marginTop: '100px' 
  }
};
