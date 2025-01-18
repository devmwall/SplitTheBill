const mongoose = require('mongoose');

const receiptSite = new mongoose.Schema({
  receiptId: {
    type: String,
    required: true,
    unique: true
  },
  receiptObject: {
    type: Object,
    required: true,
  },
  receiptClaims: {
    type: Object,
    expires: 86400 // Automatically delete after 24 hours
  }
});

module.exports = mongoose.model('Receipt', receiptSite);
