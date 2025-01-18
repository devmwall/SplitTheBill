import React from 'react'

function UrlList({ urls }) {


  return (
    <div className="url-list">
      <h2>Check List</h2>
      {urls.length === 0 ? (
        <p>No URLs shortened yet</p>
      ) : (
        <ul>
          {urls.map((url, index) => (
            <li key={index}>
              <div>
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                  {url.shortUrl}
                </a>
              </div>
              <div>
                {shareButton(url)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function shareButton(url) {
  const shareUrl = url.shortUrl; // Your website URL

  const shareText = "Check out this great article!"; // Text to share
  return (
    <div>
    <a href={url}>Your rendered receipt</a>
    <br></br>

    <button

      url={shareUrl}

      title={shareText}

      // Other options like media, quote, etc. can be added here

      className="share-button"

      onClick={(event) => Share(shareUrl)}

    >

      <span>Share via SMS</span>

    </button>
    </div>
  )
}

function Share(url) {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: "Hello World",
      url: window.location.href
    })
      .then(() => console.log('Successful share'))
      .catch(error => console.log('Error sharing:', error));
  }
}


export default UrlList