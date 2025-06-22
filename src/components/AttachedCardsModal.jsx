import React, { useState } from 'react';
import { X, Trash2, Eye, Star } from 'lucide-react';
import CardCloseUpModal from './CardCloseUpModal';

const AttachedCardsModal = ({ pokemon, onClose, onRemoveCard }) => {
  const [showCardCloseUp, setShowCardCloseUp] = useState(false);
  const [closeUpCard, setCloseUpCard] = useState(null);

  const handleCardCloseUp = (card) => {
    setCloseUpCard(card);
    setShowCardCloseUp(true);
  };

  return (
    <>
      <div className="search-modal" onClick={onClose}>
        <div className="search-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Attached Cards - {pokemon.name}</h2>
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
            <p>View and manage cards attached to this Pokemon</p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
              Click the trash icon to remove a specific card
            </p>
          </div>
          
          {pokemon.attachedCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <Eye size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
              <p>No cards attached to this Pokemon</p>
            </div>
          ) : (
            <div className="search-results">
              {pokemon.attachedCards.map((card, index) => {
                const isDisplayCard = pokemon.displayCard && pokemon.displayCard.id === card.id;
                return (
                  <div key={`${card.id}-${index}`} className={`attached-card-display ${isDisplayCard ? 'display-card' : ''}`}>
                    <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <div className="card-health-display">
                      <span className="health-text">HP: {card.health}</span>
                    </div>
                    {isDisplayCard && (
                      <div className="display-card-indicator">
                        <Star size={16} />
                        <span>Display</span>
                      </div>
                    )}
                    <div className="attached-card-display-overlay">
                      <div className="card-info">
                        <span className="card-name">{card.name}</span>
                        <span className="card-index">#{index + 1}</span>
                      </div>
                      <div className="attached-card-buttons">
                        <button 
                          className="closeup-button"
                          onClick={() => handleCardCloseUp(card)}
                          title="View close-up"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="remove-attached-btn"
                          onClick={() => onRemoveCard(index)}
                          title="Remove this card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
            <p>Total attached cards: {pokemon.attachedCards.length}</p>
            {pokemon.displayCard && (
              <p style={{ marginTop: '5px', color: '#007bff', fontWeight: 'bold' }}>
                Display card: {pokemon.displayCard.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Close Up Modal */}
      {showCardCloseUp && closeUpCard && (
        <CardCloseUpModal
          card={closeUpCard}
          onClose={() => {
            setShowCardCloseUp(false);
            setCloseUpCard(null);
          }}
        />
      )}
    </>
  );
};

export default AttachedCardsModal; 