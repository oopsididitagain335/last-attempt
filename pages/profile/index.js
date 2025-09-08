// pages/profile/index.js
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data on mount (client-side only)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust based on your auth method
        if (!token) throw new Error('No token found');

        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch user');

        setName(data.user.name || '');
        setLinks(data.user.links || []);
      } catch (err) {
        setError(err.message);
      }
    };

    // Only run on client-side
    if (typeof window !== 'undefined') {
      fetchUser();
    }
  }, []);

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth method
      if (!token) throw new Error('No token found');

      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, links }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user');

      setSuccess(data.message || 'Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new link input field
  const addLink = () => {
    setLinks([...links, '']);
  };

  // Update a specific link
  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  // Remove a link
  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Update Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Links:</label>
          {links.map((link, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
              <input
                type="url"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder="Enter a link"
                style={{ flex: 1, padding: '8px' }}
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                style={{ padding: '8px', background: '#ff4d4d', color: 'white' }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            style={{ padding: '8px', background: '#4CAF50', color: 'white', margin: '8px 0' }}
          >
            Add Link
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white' }}
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
