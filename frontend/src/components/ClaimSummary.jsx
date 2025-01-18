import React from 'react';

const ClaimSummary = ({ metadata, overrides, claims, calculateTax }) => {
  const getItemTotal = (item, index) => {
    const itemOverrides = overrides[index] || {};
    const price = Number(itemOverrides.price || item.price);
    const quantity = Number(itemOverrides.quantity || item.quantity || 1);
    return price * quantity;
  };

  const calculateTotals = () => {
    // First calculate total value to determine tax rate
    const totalBaseValue = metadata.items.reduce((sum, item, index) => {
      return sum + getItemTotal(item, index);
    }, 0);

    // Calculate effective tax rate
    const effectiveTaxRate = (metadata.tax / totalBaseValue) * 100;

    // Now calculate all totals including tax
    const totals = metadata.items.reduce((acc, item, index) => {
      const itemTotal = getItemTotal(item, index);
      const claimStatus = claims[index];
      const claimedPercentage = claimStatus ? Number(overrides[index]?.percentage || claimStatus.percentage) : 0;
      const claimedValue = itemTotal * claimedPercentage / 100;
      
      // Calculate tax if enabled
      const taxAmount = calculateTax ? (claimedValue * effectiveTaxRate / 100) : 0;
      
      return {
        totalValue: acc.totalValue + itemTotal,
        claimedValue: acc.claimedValue + claimedValue,
        totalTax: acc.totalTax + taxAmount,
        totalItems: acc.totalItems + 1,
        claimedItems: acc.claimedItems + (claimStatus ? 1 : 0),
        effectiveTaxRate: effectiveTaxRate
      };
    }, { 
      totalValue: 0, 
      claimedValue: 0, 
      totalTax: 0, 
      totalItems: 0, 
      claimedItems: 0,
      effectiveTaxRate: 0
    });

    return {
      ...totals,
      totalWithTax: totals.claimedValue + totals.totalTax
    };
  };

  const totals = calculateTotals();
  const percentageClaimed = totals.totalValue ? ((totals.claimedValue / totals.totalValue) * 100) : 0;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Claim Summary</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p>Items Claimed: {totals.claimedItems} / {totals.totalItems}</p>
        <p>Total Value: ${totals.totalValue.toFixed(2)}</p>
        <p>Claimed Value (pre-tax): ${totals.claimedValue.toFixed(2)}</p>
        {calculateTax && (
          <>
            <p>Effective Tax Rate: {totals.effectiveTaxRate.toFixed(2)}%</p>
            <p>Tax Amount: ${totals.totalTax.toFixed(2)}</p>
            <p>Claimed Value (with tax): ${totals.totalWithTax.toFixed(2)}</p>
          </>
        )}
        <p>Percentage Claimed: {percentageClaimed.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default ClaimSummary;