require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};
