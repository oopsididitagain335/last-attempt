import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempToken, setTempToken] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    if (token) fetchProfile(token);
  }, []);

  const fetchProfile = async (token) => {
    const res = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setTwoFactorRequired(false);
    } else if (data.twoFactor) {
      setTwoFactorRequired(true);
      setTempToken(token);
    }
  };

  const getCookie = (name) => {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  };

  return (
    <Component
      {...pageProps}
      user={user}
      setUser={setUser}
      twoFactorRequired={twoFactorRequired}
      tempToken={tempToken}
    />
  );
}
