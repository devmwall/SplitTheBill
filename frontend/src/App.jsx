import React, { useState } from 'react'
import UrlForm from './components/UrlForm'
import UrlList from './components/UrlList'
import UploadFile from './components/UploadFile'

function App() {
  const [urls, setUrls] = useState([])

  const addUrl = (newUrl) => {
    setUrls([newUrl, ...urls])
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <UploadFile onUrlAdded={addUrl}></UploadFile>
      <UrlList urls={urls} />
    </div>
  )
}

export default App