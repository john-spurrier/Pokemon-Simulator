import React, { useState } from 'react';
import { X } from 'lucide-react';

const SearchModal = ({ deck, onClose, onSelectCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState(deck);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredCards(deck);
    } else {
      const filtered = deck.filter(card =>
        card.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCards(filtered);
    }
  };

  const handleCardSelect = (card) => {
    onSelectCard(card);
  };

  return (
    <div className="search-modal" onClick={onClose}>
      <div className="search-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Search Your Deck</h2>
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
        
        <input
          type="text"
          placeholder="Search for a card..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
          autoFocus
        />
        
        <div className="search-results">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="search-result-card"
              onClick={() => handleCardSelect(card)}
            >
              <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
          ))}
        </div>
        
        {filteredCards.length === 0 && searchTerm && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            No cards found matching "{searchTerm}"
          </p>
        )}
        
        {!searchTerm && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            {deck.length} cards in deck. Start typing to search.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchModal; 