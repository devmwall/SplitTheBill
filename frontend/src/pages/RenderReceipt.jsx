import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import UrlList from '../components/UrlList'
import ImageUploader from '../components/ImageUploader'
import axios from 'axios';


function RenderReceipt() {
  const [urls, setUrls] = useState([])
  const { id } = useParams();
  const [jsonData, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLoad = async (e) => {
      try {
        console.log('Making request to:', `${import.meta.env.VITE_API_URL}/receiptData`);
        
        const response = await axios({
          method: 'get',
          url: `${import.meta.env.VITE_API_URL}/receiptData`,
          params: { id },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response:', response);
      } catch (error) {
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          requestURL: error.config?.url
        });
      }
    };

    handleLoad();
  }, []); 
  
  return (
    <div className="container">
      <h1>Receipt</h1>
      <p>{id}</p>
    </div>
  )
}

export default RenderReceipt