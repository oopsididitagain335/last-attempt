// /app/layout.js
"use client"; // 👈 CRITICAL: This makes it a client component

import { useState, useEffect } from "react";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      console.error("Error Boundary Caught an Error");
    }
  }, [hasError]);

  return hasError ? (
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      Something went wrong. Please try again.
    </div>
  ) : (
    children
  );
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("token");
      if (token) {
        await fetchProfile(token);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setTwoFactorRequired(false);
      } else if (data.twoFactor) {
        setTwoFactorRequired(true);
        setTempToken(token);
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      setTwoFactorRequired(false);
      setUser(null);
    }
  };

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
