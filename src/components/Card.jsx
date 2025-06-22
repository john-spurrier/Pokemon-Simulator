import React from 'react';
import { Eye } from 'lucide-react';

const Card = ({ card, onHealthClick, isDragging, onCloseUp }) => {
  // Use displayCard if it exists, otherwise use the original card
  const displayCard = card.displayCard || card;
  
  return (
    <div className={`card ${isDragging ? 'dragging' : ''}`}>
      <img src={displayCard.image} alt={displayCard.name} className="card-image" />
      
      {/* Always visible health display */}
      <div className="card-health-display">
        <span className="health-text">HP: {card.health}</span>
      </div>
      
      <div className="card-overlay">
        <div className="card-overlay-buttons">
          <button 
            onClick={() => onHealthClick(card)}
            className="health-button"
            title="Edit health"
          >
            HP: {card.health}
          </button>
          {onCloseUp && (
            <button 
              onClick={() => onCloseUp(card)}
              className="closeup-button"
              title="View close-up"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card; 