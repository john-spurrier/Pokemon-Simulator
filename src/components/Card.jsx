import React from 'react';

const Card = ({ card, onHealthClick, isDragging }) => {
  // Use displayCard if it exists, otherwise use the original card
  const displayCard = card.displayCard || card;
  
  return (
    <div className={`card ${isDragging ? 'dragging' : ''}`}>
      <img src={displayCard.image} alt={displayCard.name} className="card-image" />
      <div className="card-overlay">
        <button onClick={() => onHealthClick(card)}>
          HP: {card.health}
        </button>
      </div>
    </div>
  );
};

export default Card; 