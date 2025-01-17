import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import UrlList from '../components/UrlList'
import ImageUploader from '../components/ImageUploader'


function RenderReceipt() {
  const [urls, setUrls] = useState([])
  const { id } = useParams();

  const addUrl = (newUrl) => {
    setUrls([newUrl, ...urls])
  }

  return (
    <div className="container">
      <h1>Receipt</h1>
      <p>{id}</p>
    </div>
  )
}

export default RenderReceipt