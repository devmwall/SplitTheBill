// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Remove the /upload path from origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add other methods if needed
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 204
}));


// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', urlRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});