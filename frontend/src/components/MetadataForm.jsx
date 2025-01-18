import React, { useState } from 'react';
import ClaimSummary from './ClaimSummary';

const MetadataForm = ({ metadata }) => {
  const [overrides, setOverrides] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState({});
  const [calculateTax, setCalculateTax] = useState(false);

  const handleOverride = (index, field, value) => {
    setOverrides(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }));

    if (claims[index] && field === 'percentage') {
      setClaims(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          percentage: value
        }
      }));
    }
  };

  const handleClaim = async (index) => {
    setLoading(true);
    setError('');
    try {
      if (claims[index]) {
        setClaims(prev => {
          const newClaims = { ...prev };
          delete newClaims[index];
          return newClaims;
        });
      } else {
        const itemOverrides = overrides[index] || {};
        const percentage = itemOverrides.percentage || 100;
        
        setClaims(prev => ({
          ...prev,
          [index]: {
            claimed: true,
            percentage: percentage
          }
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPercentage = (index) => {
    if (!claims[index]) return null;
    const itemOverrides = overrides[index] || {};
    return itemOverrides.percentage || claims[index].percentage;
  };

  const getItemTotal = (item, overridePrice) => {
    const price = overridePrice || item.price;
    return price * (item.quantity || 1);
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
              onChange={(e) => setCalculateTax(e.target.checked)}
            />
          </label>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {metadata.items.map((item, index) => {
          const itemOverrides = overrides[index] || {};
          const claimStatus = claims[index];
          const currentPercentage = getCurrentPercentage(index);
          const totalPrice = getItemTotal(item, itemOverrides.price);
          
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
                    value={itemOverrides.quantity || item.quantity}
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
          overrides={overrides}
          claims={claims}
          calculateTax={calculateTax}
        />
      </div>
    </div>
  );
};

export default MetadataForm;