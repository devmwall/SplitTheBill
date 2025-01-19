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
      receipt.receiptClaims = {
        claims: {},
        overrides: {},
        calculateTax: false
      };
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
    
    // Validate input parameters
    if (!receiptId || !index) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Find and verify receipt exists
    const receipt = await Receipt.findOne({ receiptId });
    console.log("Receipt before modification: ", JSON.stringify(receipt, null, 2));
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Initialize receiptClaims if it doesn't exist
    console.log("receipt claims", receipt.receiptClaims);
    if (!receipt.receiptClaims) {
      receipt.receiptClaims = {
        claims: {},
        overrides: {},
        calculateTax: false
      };
    }

 

    // Ensure nested objects exist using MongoDB $set operator
    receipt.markModified('receiptClaims');

    // Handle claim toggle
    if (receipt.receiptClaims.claims && receipt.receiptClaims.claims[index]) {
            // If unclaiming, maintain the overrides but remove the claim
      delete receipt.receiptClaims.claims[index];
    } else {
      // If claiming, set both claim and override percentage
      const claimPercentage = percentage || 100;
      
      receipt.receiptClaims.claims[index] = {
        claimed: true,
        percentage: claimPercentage
      };

      receipt.receiptClaims.overrides[index] = {
        ...(receipt.receiptClaims.overrides[index] || {}),
        percentage: claimPercentage
      };
    }

    console.log("Receipt before save: ", JSON.stringify(receipt, null, 2));
    
    // Explicitly mark the nested object as modified
    receipt.markModified('receiptClaims.claims');
    receipt.markModified('receiptClaims.overrides');
    
    // Save with validation
    await receipt.save({ validateBeforeSave: true });

    res.json({
      claims: receipt.receiptClaims.claims,
      overrides: receipt.receiptClaims.overrides,
      calculateTax: receipt.receiptClaims.calculateTax
    });

  } catch (error) {
    console.error('Error in toggle claim:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
      receipt.receiptClaims = {
        claims: {},
        overrides: {},
        calculateTax: false
      };
    }

    receipt.receiptClaims.calculateTax = calculateTax;
    await receipt.save();

    res.json(receipt.receiptClaims);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;