// backend/routes/urlRoutes.js
const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
const Url = require('../models/url');
const limiter = require('../middleware/rateLimiter');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Shorten URL endpoint with error handling
router.post('/shorten', limiter, async (req, res) => {
  console.log('Received request:', req.body); // Debug log

  try {
    const { url } = req.body;
    
    if (!url) {
      console.log('No URL provided'); // Debug log
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Generating short code for:', url); // Debug log
    const shortCode = nanoid(8);
    
    const newUrl = new Url({
      originalUrl: url,
      shortCode
    });

    console.log('Saving to database...'); // Debug log
    await newUrl.save();
    
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    console.log('Generated short URL:', shortUrl); // Debug log
    
    res.json({
      shortUrl,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error in /shorten:', error); // Debug log
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;