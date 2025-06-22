import React from 'react';
import { X } from 'lucide-react';

const CardCloseUpModal = ({ card, onClose }) => {
  return (
    <div className="card-closeup-modal" onClick={onClose}>
      <div className="card-closeup-content" onClick={(e) => e.stopPropagation()}>
        <div className="card-closeup-header">
          <h2>{card.name}</h2>
          <button 
            onClick={onClose}
            className="close-button"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="card-closeup-image-container">
          <img 
            src={card.image} 
            alt={card.name} 
            className="card-closeup-image"
          />
        </div>
        
        <div className="card-closeup-info">
          <div className="card-health">
            <strong>Health:</strong> {card.health}
          </div>
          {card.attachedCards && card.attachedCards.length > 0 && (
            <div className="card-attached">
              <strong>Attached Cards:</strong> {card.attachedCards.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCloseUpModal; 