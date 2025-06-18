import React from 'react';
import { X, Hand, Shuffle } from 'lucide-react';

const DiscardPileModal = ({ discardPile, onClose, onAddToHand, onAddToDeck }) => {
  return (
    <div className="search-modal" onClick={onClose}>
      <div className="search-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Discard Pile ({discardPile.length} cards)</h2>
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
        
        {discardPile.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Your discard pile is empty</p>
          </div>
        ) : (
          <div className="search-results">
            {discardPile.map((card) => (
              <div key={card.id} className="discard-pile-card">
                <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                <div className="discard-pile-card-overlay">
                  <button 
                    onClick={() => onAddToHand(card.id)}
                    className="retrieve-btn hand-btn"
                    title="Add to hand"
                  >
                    <Hand size={16} />
                  </button>
                  <button 
                    onClick={() => onAddToDeck(card.id)}
                    className="retrieve-btn deck-btn"
                    title="Add to deck"
                  >
                    <Shuffle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>Click the hand icon to add a card to your hand</p>
          <p>Click the shuffle icon to add a card to your deck</p>
        </div>
      </div>
    </div>
  );
};

export default DiscardPileModal; 