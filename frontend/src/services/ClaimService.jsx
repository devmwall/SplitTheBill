// src/services/claimService.js
import axios from 'axios';

class ClaimService {
  // Get claims for a receipt
  async getClaims(receiptId) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/claims/${receiptId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // If claims don't exist, generate and create them
        const initialClaims = this.generateInitialClaims();
        return this.saveClaims(receiptId, initialClaims);
      }
      throw error;
    }
  }

  // Generate initial claims structure
  generateInitialClaims() {
    return {
      items: [],
      calculateTax: false,
      overrides: {},
      claims: {}
    };
  }

  // Save claims (create or update)
  async saveClaims(receiptId, claimsData) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/claims/${receiptId}`, claimsData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to save claims: ${error.message}`);
    }
  }

  // Update a specific claim
  async updateClaim(receiptId, index, claimData) {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/claims/${receiptId}/${index}`, claimData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update claim: ${error.message}`);
    }
  }

  // Toggle claim status
  async toggleClaim(receiptId, index, percentage) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/claims/${receiptId}/${index}/toggle`, { percentage });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to toggle claim: ${error.message}`);
    }
  }

  // Update tax calculation setting
  async updateTaxCalculation(receiptId, calculateTax) {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/claims/${receiptId}/tax/calculate`, { calculateTax });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update tax calculation: ${error.message}`);
    }
  }
}

export default new ClaimService();