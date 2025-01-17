import React, { useState } from 'react'
import UrlList from '../components/UrlList'
import ImageUploader from '../components/ImageUploader'


function Main() {
  const [urls, setUrls] = useState([])

  const addUrl = (newUrl) => {
    setUrls([newUrl, ...urls])
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <ImageUploader/>
      <UrlList urls={urls} />
    </div>
  )
}

export default Main