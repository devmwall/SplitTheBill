import React, { useState, useEffect } from 'react';
import ClaimSummary from './ClaimSummary';
import claimService from '../services/ClaimService';

const MetadataForm = ({ id,metadata }) => {
  const [overrides, setOverrides] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState({});
  const [calculateTax, setCalculateTax] = useState(false);

  // Load initial claims data
  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        const claimsData = await claimService.getClaims(id);
        setOverrides(claimsData.overrides || {});
        setClaims(claimsData.claims || {});
        setCalculateTax(claimsData.calculateTax || false);
      } catch (err) {
        setError('Failed to load claims data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClaims();
    }
  }, [id]);

  const handleOverride = async (index, field, value) => {
    try {
      const newOverrides = {
        ...overrides,
        [index]: {
          ...overrides[index],
          [field]: value
        }
      };
      setOverrides(newOverrides);

      // Update claims percentage if item is claimed
      if (claims[index] && field === 'percentage') {
        const newClaims = {
          ...claims,
          [index]: {
            ...claims[index],
            percentage: value
          }
        };
        setClaims(newClaims);

        if(field === 'percentage') return;
        // Save to backend
        await claimService.updateClaim(id, index, {
          overrides: newOverrides[index],
          claim: newClaims[index]
        });
      } else {
        // Save just the override
        await claimService.saveClaims(id, {
          overrides: newOverrides,
          claims,
          calculateTax
        });
      }
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    }
  };

  const handleClaim = async (index) => {
    setLoading(true);
    setError('');
    try {
      const currentOverrides = overrides || {};
      const itemOverrides = currentOverrides[index] || {};
      const percentage = itemOverrides.percentage || 100;
      
      const response = await claimService.toggleClaim(id, index, percentage);
      
      // Ensure we have valid objects before setting state
      setClaims(response.claims || {});
      setOverrides(response.overrides || {});
      if (response.calculateTax !== undefined) {
        setCalculateTax(response.calculateTax);
      }
    } catch (err) {
      setError('Failed to toggle claim status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaxChange = async (checked) => {
    try {
      setCalculateTax(checked);
      await claimService.updateTaxCalculation(id, checked);
    } catch (err) {
      setError('Failed to update tax calculation');
      console.error(err);
    }
  };

  const getCurrentPercentage = (index) => {
    if (!claims[index]) return null;
    const itemOverrides = (overrides || {})[index] || {};
    return itemOverrides.percentage || claims[index].percentage;
  };

  if (!metadata?.items?.length) {
    return <div>No items available</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: '1' }}>
        <div style={{ 
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>Calculate Tax (${metadata.tax})</span>
            <input
              type="checkbox"
              checked={calculateTax}
              onChange={(e) => handleTaxChange(e.target.checked)}
            />
          </label>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {metadata.items.map((item, index) => {
          const itemOverrides = (overrides || {})[index] || {};
          const claimStatus = claims[index];
          const currentPercentage = getCurrentPercentage(index);
          const quantity = itemOverrides.quantity || item.quantity || 1;
          const price = itemOverrides.price || item.price;
          const totalPrice = price * quantity;
          
          return (
            <div key={index} style={{ 
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ccc',
              position: 'relative'
            }}>
              {claimStatus && (
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: 'green'
                }}>
                  Claimed {currentPercentage}%
                </div>
              )}
              
              <div>
                <label>
                  Name:
                  <input
                    type="text"
                    value={itemOverrides.name || item.name}
                    onChange={(e) => handleOverride(index, 'name', e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  Price (per unit):
                  <input
                    type="number"
                    value={itemOverrides.price || item.price}
                    onChange={(e) => handleOverride(index, 'price', e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={itemOverrides.quantity || item.quantity || 1}
                    onChange={(e) => handleOverride(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </label>
              </div>

              <div>
                <label>
                  Total: ${totalPrice.toFixed(2)}
                </label>
              </div>

              <div>
                <label>
                  Percentage:
                  <input
                    type="number"
                    value={itemOverrides.percentage || 100}
                    onChange={(e) => handleOverride(index, 'percentage', e.target.value)}
                    min="0"
                    max="100"
                  />
                </label>
              </div>

              <button 
                onClick={() => handleClaim(index)}
                disabled={loading}
                style={{ 
                  backgroundColor: claimStatus ? '#ff4444' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Processing...' : claimStatus ? 'Unclaim' : 'Claim'}
              </button>
            </div>
          );
        })}
      </div>
      
      <div style={{ width: '300px' }}>
        <ClaimSummary 
          metadata={metadata} 
          overrides={overrides || {}}
          claims={claims || {}}
          calculateTax={calculateTax}
        />
      </div>
    </div>
  );
};

export default MetadataForm;