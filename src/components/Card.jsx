import React from 'react';

const Card = ({ card, onHealthClick, isDragging }) => {
  return (
    <div className={`card ${isDragging ? 'dragging' : ''}`}>
      <img src={card.image} alt={card.name} className="card-image" />
      <div className="card-overlay">
        <button onClick={() => onHealthClick(card)}>
          HP: {card.health}
        </button>
      </div>
    </div>
  );
};

export default Card; 