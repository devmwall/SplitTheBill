const mongoose = require('mongoose');

const receiptSite = new mongoose.Schema({
  guid: {
    type: String,
    required: true,
    unique: true
  },
  receipt: {
    type: Object,
    required: true,
  },
  claims: {
    type: Object,
    expires: 86400 // Automatically delete after 24 hours
  }
});

module.exports = mongoose.model('Receipt', receiptSite);
