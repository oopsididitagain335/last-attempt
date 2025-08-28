// pages/link/[token].js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LinkDiscord() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (!token) return;

    fetch('/api/auth/link-discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setStatus(data.error);
        }
      })
      .catch(() => setStatus('Failed to connect.'));
  }, [token]);

  return (
    <div style={styles.container}>
      <h1>Linking Discord...</h1>
      <p>{status === 'verifying' ? 'Checking token...' : status === 'success' ? '✅ Linked! Redirecting...' : status}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '60px',
    fontFamily: 'Arial, sans-serif',
  },
};
