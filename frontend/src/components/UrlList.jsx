import React from 'react'

function UrlList({ urls }) {
  return (
    <div className="url-list">
      <h2>Shortened URLs</h2>
      {urls.length === 0 ? (
        <p>No URLs shortened yet</p>
      ) : (
        <ul>
          {urls.map((url, index) => (
            <li key={index}>
              <div>Original: {url.originalUrl}</div>
              <div>
                Shortened: 
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                  {url.shortUrl}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UrlList