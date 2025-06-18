import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Search, Shuffle, RotateCcw, Heart, Play, Trophy } from 'lucide-react';
import Card from './components/Card';
import SearchModal from './components/SearchModal';
import HealthEditor from './components/HealthEditor';

function App() {
  const [deck, setDeck] = useState([]);
  const [originalDeck, setOriginalDeck] = useState([]); // Store original deck for resets
  const [hand, setHand] = useState([]);
  const [benchPokemon, setBenchPokemon] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);
  const [prizeCards, setPrizeCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHealthEditor, setShowHealthEditor] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Load cards from folder
  const handleFileLoad = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length !== 60) {
      setError('Please select exactly 60 card images for your deck.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cardPromises = files.map((file, index) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: index,
              name: file.name.replace(/\.[^/.]+$/, ""),
              image: e.target.result,
              health: 100,
              position: { x: 0, y: 0 }
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const loadedCards = await Promise.all(cardPromises);
      setDeck(loadedCards);
      setOriginalDeck([...loadedCards]); // Store original deck
      setHand([]);
      setBenchPokemon([]);
      setActivePokemon(null);
      setPrizeCards([]);
      setGameStarted(false);
    } catch (err) {
      setError('Error loading cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start the game - draw 7 cards and set up prize cards
  const startGame = () => {
    if (deck.length < 13) {
      setError('Not enough cards in deck to start game (need at least 13)');
      return;
    }

    // Draw 7 cards for hand
    const initialHand = deck.slice(0, 7);
    const remainingDeck = deck.slice(7);
    
    // Set aside 6 prize cards
    const prizeCards = remainingDeck.slice(0, 6);
    const finalDeck = remainingDeck.slice(6);

    setHand(initialHand);
    setPrizeCards(prizeCards);
    setDeck(finalDeck);
    setGameStarted(true);
    setError('');
  };

  // Shuffle deck
  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
  };

  // Draw card from deck
  const drawCard = () => {
    if (deck.length === 0) return;
    
    const drawnCard = deck[0];
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    setHand([...hand, drawnCard]);
  };

  // Place card as active Pokemon
  const placeActivePokemon = (cardId) => {
    const card = hand.find(c => c.id === cardId);
    if (!card) return;

    const newHand = hand.filter(c => c.id !== cardId);
    setHand(newHand);
    setActivePokemon(card);
  };

  // Place card on bench
  const placeCardOnBench = (cardId) => {
    if (benchPokemon.length >= 5) {
      setError('Bench is full! You can only have 5 Pokemon on your bench.');
      return;
    }

    const card = hand.find(c => c.id === cardId);
    if (!card) return;

    const newHand = hand.filter(c => c.id !== cardId);
    setHand(newHand);
    setBenchPokemon([...benchPokemon, card]);
  };

  // Remove card from bench
  const removeFromBench = (cardId) => {
    const card = benchPokemon.find(c => c.id === cardId);
    if (!card) return;

    const newBench = benchPokemon.filter(c => c.id !== cardId);
    setBenchPokemon(newBench);
    setHand([...hand, card]);
  };

  // Update card health
  const updateCardHealth = (cardId, newHealth) => {
    // Update bench Pokemon health
    setBenchPokemon(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, health: newHealth } 
          : card
      )
    );
    
    // Also update active Pokemon health if it's the same card
    if (activePokemon && activePokemon.id === cardId) {
      setActivePokemon(prev => ({ ...prev, health: newHealth }));
    }
    
    setShowHealthEditor(false);
    setSelectedCard(null);
  };

  // Take a prize card
  const takePrizeCard = (prizeIndex) => {
    const prizeCard = prizeCards[prizeIndex];
    if (!prizeCard) return;

    const newPrizeCards = prizeCards.filter((_, index) => index !== prizeIndex);
    setPrizeCards(newPrizeCards);
    setHand([...hand, prizeCard]);
  };

  // Search and add card to hand
  const searchAndAddCard = (card) => {
    const newCard = {
      ...card,
      id: Date.now() + Math.random(),
      health: 100,
      position: { x: 0, y: 0 }
    };
    setHand([...hand, newCard]);
    setShowSearch(false);
  };

  // Reset game - restore all cards to deck
  const resetGame = () => {
    // Collect all cards from hand, bench, active Pokemon, and prize cards
    const allCards = [
      ...hand,
      ...benchPokemon,
      ...(activePokemon ? [activePokemon] : []),
      ...prizeCards,
      ...deck
    ];

    // Reset all game state
    setHand([]);
    setBenchPokemon([]);
    setActivePokemon(null);
    setPrizeCards([]);
    setGameStarted(false);
    
    // Restore all cards to deck and shuffle
    const shuffledDeck = allCards.sort(() => Math.random() - 0.5);
    setDeck(shuffledDeck);
  };

  // Complete reset - go back to original deck
  const completeReset = () => {
    setHand([]);
    setBenchPokemon([]);
    setActivePokemon(null);
    setPrizeCards([]);
    setGameStarted(false);
    setDeck([...originalDeck]);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Pokemon TCG Simulator</h1>
        <p>Load your 60-card deck and start playing!</p>
      </div>

      {!deck.length && (
        <div className="file-input-container">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileLoad}
            className="file-input"
            id="card-files"
          />
          <label htmlFor="card-files" className="file-input-label">
            Select 60 Card Images
          </label>
        </div>
      )}

      {loading && <div className="loading">Loading cards...</div>}
      
      {error && <div className="error">{error}</div>}

      {deck.length > 0 && !gameStarted && (
        <div className="start-game-container">
          <div className="deck-info">
            <h3>Deck Ready!</h3>
            <p>Your deck has {deck.length} cards</p>
            <button className="control-button start-game" onClick={startGame}>
              <Play size={20} />
              Start Game (Draw 7 Cards)
            </button>
            <button className="control-button" onClick={shuffleDeck}>
              <Shuffle size={20} />
              Shuffle Deck
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="game-container">
          <div className="playmat">
            {/* Prize Cards Area */}
            <div className="prize-cards-area">
              <h3>Prize Cards ({prizeCards.length})</h3>
              <div className="prize-cards">
                {prizeCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="prize-card"
                    onClick={() => takePrizeCard(index)}
                    title="Click to take this prize card"
                  >
                    <div className="prize-card-back">
                      <Trophy size={30} />
                      <span>Prize {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Pokemon Area */}
            <div className="active-pokemon-area">
              <h3>Active Pokemon</h3>
              {activePokemon ? (
                <div className="active-pokemon">
                  <img src={activePokemon.image} alt={activePokemon.name} className="card-image" />
                  <div className="active-pokemon-overlay">
                    <button onClick={() => {
                      setSelectedCard(activePokemon);
                      setShowHealthEditor(true);
                    }}>
                      <Heart size={16} />
                      {activePokemon.health}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="active-pokemon-placeholder">
                  <p>Drag a Pokemon from your hand here to set as Active Pokemon</p>
                </div>
              )}
            </div>

            {/* Bench Pokemon Area */}
            <div className="bench-area">
              <h3>Bench Pokemon ({benchPokemon.length}/5)</h3>
              <div className="bench-slots">
                {Array.from({ length: 5 }, (_, index) => {
                  const benchCard = benchPokemon[index];
                  return (
                    <div key={index} className="bench-slot">
                      {benchCard ? (
                        <div className="bench-pokemon">
                          <img src={benchCard.image} alt={benchCard.name} className="card-image" />
                          <div className="bench-pokemon-overlay">
                            <button onClick={() => {
                              setSelectedCard(benchCard);
                              setShowHealthEditor(true);
                            }}>
                              <Heart size={16} />
                              {benchCard.health}
                            </button>
                            <button 
                              className="remove-bench-btn"
                              onClick={() => removeFromBench(benchCard.id)}
                              title="Return to hand"
                            >
                              ↺
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bench-slot-placeholder">
                          <span>Bench {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deck Area */}
            <div className="deck-area">
              <div className="deck" onClick={drawCard}>
                <div className="deck-count">{deck.length}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="controls">
              <button className="control-button" onClick={shuffleDeck}>
                <Shuffle size={20} />
                Shuffle Deck
              </button>
              <button className="control-button" onClick={() => setShowSearch(true)}>
                <Search size={20} />
                Search Deck
              </button>
              <button className="control-button" onClick={resetGame}>
                <RotateCcw size={20} />
                Reset Game
              </button>
              <button className="control-button" onClick={completeReset}>
                <RotateCcw size={20} />
                Complete Reset
              </button>
            </div>
          </div>

          {/* Hand Area - positioned below playmat */}
          <div className="hand-area">
            <h3>Your Hand ({hand.length})</h3>
            <div className="hand-cards">
              {hand.map((card) => (
                <Draggable
                  key={card.id}
                  onStop={(e, data) => {
                    const playmatRect = document.querySelector('.playmat').getBoundingClientRect();
                    const cardRect = e.target.getBoundingClientRect();
                    
                    // Check if dropped on active Pokemon area
                    const activeArea = document.querySelector('.active-pokemon-area');
                    if (activeArea) {
                      const activeRect = activeArea.getBoundingClientRect();
                      const cardCenterX = cardRect.left + cardRect.width / 2;
                      const cardCenterY = cardRect.top + cardRect.height / 2;
                      
                      if (cardCenterX >= activeRect.left && cardCenterX <= activeRect.right &&
                          cardCenterY >= activeRect.top && cardCenterY <= activeRect.bottom) {
                        placeActivePokemon(card.id);
                        return;
                      }
                    }
                    
                    // Check if dropped on bench area
                    const benchArea = document.querySelector('.bench-area');
                    if (benchArea) {
                      const benchRect = benchArea.getBoundingClientRect();
                      const cardCenterX = cardRect.left + cardRect.width / 2;
                      const cardCenterY = cardRect.top + cardRect.height / 2;
                      
                      if (cardCenterX >= benchRect.left && cardCenterX <= benchRect.right &&
                          cardCenterY >= benchRect.top && cardCenterY <= benchRect.bottom) {
                        placeCardOnBench(card.id);
                        return;
                      }
                    }
                  }}
                >
                  <div className="card">
                    <img src={card.image} alt={card.name} className="card-image" />
                  </div>
                </Draggable>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          deck={deck}
          onClose={() => setShowSearch(false)}
          onSelectCard={searchAndAddCard}
        />
      )}

      {/* Health Editor */}
      {showHealthEditor && selectedCard && (
        <HealthEditor
          card={selectedCard}
          onSave={(newHealth) => updateCardHealth(selectedCard.id, newHealth)}
          onCancel={() => {
            setShowHealthEditor(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}

export default App; 