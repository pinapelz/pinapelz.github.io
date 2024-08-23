import React, { useState, useEffect } from 'react';

interface FFXIVItemPriceProps {
  itemId: number;
  itemName: string;
  itemImageUrl: string;
}

const FFXIVItemPrice: React.FC<FFXIVItemPriceProps> = ({ itemId = 5530, itemName="Coke", itemImageUrl="https://xivapi.com/i/021000/021462_hr1.png"}) => {
  const [selectedWorld, setSelectedWorld] = useState<string | null>(null);
  const [dailySaleVelocity, setDailySaleVelocity] = useState<number | null>(null);
  const [averageSalePrice, setAverageSalePrice] = useState<number | null>(null);
  const [inputQuantity, setInputQuantity] = useState<number>(0);
  const [potentialGil, setPotentialGil] = useState<number>(0);

  useEffect(() => {
    const savedWorld = localStorage.getItem('selectedWorld');
    if (savedWorld) {
      setSelectedWorld(savedWorld);
    } else {
      setSelectedWorld('Midgardsormr');
    }

    fetch(`https://universalis.app/api/v2/aggregated/${selectedWorld}/${itemId}`)
      .then(response => response.json())
      .then(data => {
        const result = data.results[0];
        setDailySaleVelocity(Math.round(result.nq.dailySaleVelocity.world.quantity));
        setAverageSalePrice(Math.round(result.nq.averageSalePrice.world.price));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [itemId, selectedWorld]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    setInputQuantity(quantity);
    setPotentialGil(quantity * (averageSalePrice || 0));
  };

  const formatNumber = (number: number | null) => {
    return number !== null ? new Intl.NumberFormat().format(number) : 'N/A';
  };

  return (
    <div className="ffxiv-container">
      <div className="ffxiv-header">
        <h1 className="ffxiv-h1">{itemName}</h1>
        <img src={itemImageUrl} alt={itemName} className="ffxiv-item-icon" />
      </div>
      <table className="ffxiv-table">
        <tbody>
          <tr>
            <td className="ffxiv-label">Daily Sale Velocity:</td>
            <td className="ffxiv-value">{formatNumber(dailySaleVelocity)} items</td>
          </tr>
          <tr>
            <td className="ffxiv-label">Average Price/Item:</td>
            <td className="ffxiv-value">{formatNumber(averageSalePrice)} gil</td>
          </tr>
          <tr>
            <td className="ffxiv-label">Enter Quantity:</td>
            <td>
              <input
                type="number"
                value={inputQuantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                className="ffxiv-input"
              />
            </td>
          </tr>
          <tr>
            <td className="ffxiv-label">Potential Gil Earnings:</td>
            <td className="ffxiv-value">{formatNumber(potentialGil)} gil</td>
          </tr>
        </tbody>
      </table>
      <footer>{selectedWorld} Marketboard Data provided by Universalis API</footer>
    </div>
  );
};

export default FFXIVItemPrice;