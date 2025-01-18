// backend/routes/urlRoutes.js
const express = require('express');
const { nanoid } = require('nanoid');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Url = require('../models/url');
const limiter = require('../middleware/rateLimiter');
const ReceiptService = require('../services/receiptService');
const Receipt = require('../models/receipt');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb)  {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max-size
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

///receiptData`
router.get('/receiptData', async (req, res) => {
  try {
    const { id } = req.query;

    const receiptData = await Receipt.findOne({ receiptId:id });
    if (receiptData) {
      return res.json(receiptData.receiptObject);
    }
    return res.status(300).json({ error: 'Receipt Data not found' });
  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Shorten URL endpoint with error handling
router.post('/shorten', limiter, async (req, res) => {
  console.log('Received request:', req.body);
  try {
    const { url } = req.body;
    
    if (!url) {
      console.log('No URL provided');
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Generating short code for:', url);
    const shortCode = nanoid(8);
    
    const newUrl = new Url({
      originalUrl: url,
      shortCode
    });

    console.log('Saving to database...');
    await newUrl.save();
    
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    console.log('Generated short URL:', shortUrl);
    
    res.json({
      shortUrl,
      originalUrl: url
    });
  } catch (error) {
    console.error('Error in /shorten:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Redirect shortened URLs
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (url) {
      return res.redirect(url.originalUrl);
    }
    return res.status(404).json({ error: 'URL not found' });
  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




function parseContent(content) {
  // Remove the ```json and ``` markers
  const cleanedContent = content.replace(/```json\n/, '').replace(/```$/, '');

  // Parse the JSON string
  try {
      const parsed = JSON.parse(cleanedContent);
      return parsed;
  } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
  }
}

const receiptService = new ReceiptService();
// Modified upload route with multer
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Validating request...');

    // Check if there was a file validation error
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    // Check if there's any file in the request
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }


    const imageReturnObject = await receiptService.processImage(req.file);
    const returnUrl = await receiptService.generateUrl(imageReturnObject);
    
    
    res.status(200).json({
      success: true,
      ocrResult: returnUrl,
      message: 'File processed successfully',
      fileName: req.file.filename
    });
  } catch (error) {
    console.error('Error in upload:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
});

module.exports = router;