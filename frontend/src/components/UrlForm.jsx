// frontend/src/components/UrlForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function UrlForm({ onUrlAdded }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_URL}/shorten`,
        data: { url },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      onUrlAdded(response.data);
      setUrl('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          disabled={loading}
          required
          className="flex-1 p-2 border rounded"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

export default UrlForm;