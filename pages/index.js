"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🔗 TheBioLink</h1>
        <nav>
          <Link href="/login" style={styles.btn}>
            Login
          </Link>
          <Link href="/signup" style={styles.btnPrimary}>
            Sign Up
          </Link>
        </nav>
      </header>
      <main style={styles.main}>
        <h2>Your Personal Link Hub</h2>
        <p>One bio link. Infinite possibilities.</p>
        <Link href="/signup" style={styles.btnPrimary}>
          Get Started
        </Link>
      </main>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: "#f9f9fb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#5865F2",
  },
  btn: {
    padding: "10px 16px",
    margin: "0 5px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#555",
    fontSize: "14px",
  },
  btnPrimary: {
    padding: "10px 16px",
    margin: "0 5px",
    background: "#5865F2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },
  main: {
    textAlign: "center",
    marginTop: "100px",
  },
};
