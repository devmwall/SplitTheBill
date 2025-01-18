// backend/routes/claimRoutes.js
const express = require('express');
const router = express.Router();
const Receipt = require('../models/receipt');

// Get claims for a receipt
router.get('/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const receipt = await Receipt.findOne({ receiptId });
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt.receiptClaims || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update claims
router.post('/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const claimsData = req.body;

    const receipt = await Receipt.findOne({ receiptId });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    receipt.receiptClaims = claimsData;
    await receipt.save();

    res.json(receipt.receiptClaims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update specific claim
router.put('/:receiptId/:index', async (req, res) => {
  try {
    console.log("Updating CLIAM!")
    const { receiptId, index } = req.params;
    const updateData = req.body;

    const receipt = await Receipt.findOne({ receiptId });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (!receipt.receiptClaims) {
      receipt.receiptClaims = {};
    }

    // Update specific parts of the claims
    if (updateData.overrides) {
      receipt.receiptClaims.overrides = receipt.receiptClaims.overrides || {};
      receipt.receiptClaims.overrides[index] = updateData.overrides;
    }

    if (updateData.claim) {
      receipt.receiptClaims.claims = receipt.receiptClaims.claims || {};
      receipt.receiptClaims.claims[index] = updateData.claim;
    }

    await receipt.save();
    res.json(receipt.receiptClaims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Toggle claim status
router.post('/:receiptId/:index/toggle', async (req, res) => {
    try {
      const { receiptId, index } = req.params;
      const { percentage } = req.body;
  
      const receipt = await Receipt.findOne({ receiptId });
      if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
      }
  
      if (!receipt.receiptClaims) {
        receipt.receiptClaims = { 
          claims: {},
          overrides: {},
          calculateTax: false 
        };
      }
  
      // Ensure overrides object exists
      receipt.receiptClaims.overrides = receipt.receiptClaims.overrides || {};
      receipt.receiptClaims.claims = receipt.receiptClaims.claims || {};
  
      if (receipt.receiptClaims.claims[index]) {
        // If unclaiming, maintain the overrides
        delete receipt.receiptClaims.claims[index];
      } else {
        // If claiming, set both claim and ensure override percentage
        receipt.receiptClaims.claims[index] = {
          claimed: true,
          percentage: percentage || 100
        };
        
        // Keep existing overrides if any
        receipt.receiptClaims.overrides[index] = {
          ...(receipt.receiptClaims.overrides[index] || {}),
          percentage: percentage || 100
        };
      }
  
      await receipt.save();
      res.json({
        claims: receipt.receiptClaims.claims,
        overrides: receipt.receiptClaims.overrides,
        calculateTax: receipt.receiptClaims.calculateTax
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Update tax calculation setting
router.put('/:receiptId/tax/calculate', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const { calculateTax } = req.body;

    const receipt = await Receipt.findOne({ receiptId });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (!receipt.receiptClaims) {
      receipt.receiptClaims = {};
    }

    receipt.receiptClaims.calculateTax = calculateTax;
    await receipt.save();

    res.json(receipt.receiptClaims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;