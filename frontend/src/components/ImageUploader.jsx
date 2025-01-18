import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader ({onUrlAdded}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);



  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Here is data: " + response.data.ocrResult.receiptId)
      const newReceipt = `/receipt/${response.data.ocrResult.receiptId}`
      onUrlAdded(newReceipt);
      setUrl('');
      // Handle successful upload (e.g., display uploaded image)
      
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
        />
        <button 
          type="submit" 
          disabled={loading || !file}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {file && (
        <div>
          <h4>Selected File:</h4>
          <p>{file.name}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;