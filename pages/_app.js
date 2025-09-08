import { useState, useEffect } from "react";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      console.error("Error Boundary Caught an Error");
    }
  }, [hasError]);

  return hasError ? (
    <div>Something went wrong. Please try again.</div>
  ) : (
    children
  );
}

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = getCookie("token");
        if (token) {
          await fetchProfile(token);
        }
        setLoading(false);
      }
    };
    checkAuth();
  }, []); // Empty dependency array as token check is initial only

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
      setTwoFactorRequired(false); // Fallback to unauthenticated state
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
    return <div>Loading...</div>; // Prevent rendering until auth is checked
  }

  return (
    <ErrorBoundary>
      <Component
        {...pageProps}
        user={user}
        setUser={setUser}
        twoFactorRequired={twoFactorRequired}
        tempToken={tempToken}
      />
    </ErrorBoundary>
  );
}
