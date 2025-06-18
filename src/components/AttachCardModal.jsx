import React, { useState } from 'react';
import { X, Link } from 'lucide-react';

const AttachCardModal = ({ hand, onClose, onAttachCard }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [makeDisplayCard, setMakeDisplayCard] = useState(false);

  const handleAttachCard = (cardId) => {
    if (selectedCard === cardId) {
      // If clicking the same card, proceed with attachment
      onAttachCard(cardId, makeDisplayCard);
    } else {
      // If clicking a different card, select it first
      setSelectedCard(cardId);
    }
  };

  return (
    <div className="search-modal" onClick={onClose}>
      <div className="search-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Attach Card to Pokemon</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
          <p>Select a card from your hand to attach to this Pokemon</p>
          <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
            This can be used for evolution, energy cards, tools, or other attachments
          </p>
        </div>

        {selectedCard && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '2px solid #007bff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="checkbox"
                id="makeDisplayCard"
                checked={makeDisplayCard}
                onChange={(e) => setMakeDisplayCard(e.target.checked)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor="makeDisplayCard" style={{ fontWeight: 'bold', color: '#007bff' }}>
                Make this card the display card (show on top)
              </label>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              When checked, this card will be shown as the top card of the Pokemon stack instead of the original Pokemon card.
            </p>
          </div>
        )}
        
        {hand.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No cards in your hand to attach</p>
          </div>
        ) : (
          <div className="search-results">
            {hand.map((card) => (
              <div
                key={card.id}
                className={`attach-card-option ${selectedCard === card.id ? 'selected' : ''}`}
                onClick={() => handleAttachCard(card.id)}
              >
                <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <div className="attach-card-overlay">
                  {selectedCard === card.id ? (
                    <button className="attach-confirm-btn confirm">
                      <Link size={16} />
                      Confirm Attach
                    </button>
                  ) : (
                    <button className="attach-confirm-btn">
                      <Link size={16} />
                      Select
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>Click a card to select it, then click again to attach it to the Pokemon</p>
        </div>
      </div>
    </div>
  );
};

export default AttachCardModal; 