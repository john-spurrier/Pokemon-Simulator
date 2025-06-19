import React, { useState } from 'react';
import { Coins } from 'lucide-react';

const Coin = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHeads, setIsHeads] = useState(true);

  const flipCoin = () => {
    if (isFlipping) return; // Prevent multiple clicks during flip
    
    setIsFlipping(true);
    
    // Random result
    const newResult = Math.random() < 0.5;
    
    // Simulate flip animation
    setTimeout(() => {
      setIsHeads(newResult);
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div 
      className="coin-container"
      onClick={flipCoin}
      title="Click to flip coin"
    >
      <div className={`coin ${isFlipping ? 'flipping' : ''}`}>
        <div className={`coin-side ${isHeads ? 'heads' : 'tails'}`}>
          {isHeads ? (
            <div className="coin-heads">
              <Coins size={24} />
              <span>HEADS</span>
            </div>
          ) : (
            <div className="coin-tails">
              <span>TAILS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coin; 