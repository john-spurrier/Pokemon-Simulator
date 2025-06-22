import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Search, Shuffle, RotateCcw, Heart, Play, Trophy, Trash2, Eye, ArrowUpDown, Plus } from 'lucide-react';
import Card from './components/Card';
import SearchModal from './components/SearchModal';
import HealthEditor from './components/HealthEditor';
import DiscardPileModal from './components/DiscardPileModal';
import AttachCardModal from './components/AttachCardModal';
import AttachedCardsModal from './components/AttachedCardsModal';
import StatusIcon from './components/StatusIcon';
import StatusIconPalette from './components/StatusIconPalette';
import Coin from './components/Coin';
import CardCloseUpModal from './components/CardCloseUpModal';

function App() {
  const [deck, setDeck] = useState([]);
  const [originalDeck, setOriginalDeck] = useState([]); // Store original deck for resets
  const [hand, setHand] = useState([]);
  const [benchPokemon, setBenchPokemon] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);
  const [prizeCards, setPrizeCards] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showHealthEditor, setShowHealthEditor] = useState(false);
  const [showDiscardPile, setShowDiscardPile] = useState(false);
  const [showAttachCard, setShowAttachCard] = useState(false);
  const [showAttachedCards, setShowAttachedCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusIcons, setStatusIcons] = useState([]);
  const [showCardCloseUp, setShowCardCloseUp] = useState(false);
  const [closeUpCard, setCloseUpCard] = useState(null);
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
              position: { x: 0, y: 0 },
              attachedCards: [],
              isEvolved: false
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
      setDiscardPile([]);
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

  // Move card from hand to bottom of deck
  const moveCardToBottomOfDeck = (cardId) => {
    const card = hand.find(c => c.id === cardId);
    if (!card) return;

    const newHand = hand.filter(c => c.id !== cardId);
    setHand(newHand);
    setDeck([...deck, card]); // Add to bottom of deck
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

  // Move Pokemon from bench to active
  const moveToActive = (benchIndex) => {
    if (!activePokemon) {
      // If no active Pokemon, just move bench Pokemon to active
      const benchCard = benchPokemon[benchIndex];
      const newBench = benchPokemon.filter((_, index) => index !== benchIndex);
      setBenchPokemon(newBench);
      setActivePokemon(benchCard);
    } else {
      // Swap active and bench Pokemon
      const benchCard = benchPokemon[benchIndex];
      const newBench = benchPokemon.map((card, index) => 
        index === benchIndex ? activePokemon : card
      );
      setBenchPokemon(newBench);
      setActivePokemon(benchCard);
    }
  };

  // Move Pokemon from active to bench
  const moveToBench = () => {
    if (benchPokemon.length >= 5) {
      setError('Bench is full! You can only have 5 Pokemon on your bench.');
      return;
    }

    setBenchPokemon([...benchPokemon, activePokemon]);
    setActivePokemon(null);
  };

  // Remove card from bench
  const removeFromBench = (cardId) => {
    const card = benchPokemon.find(c => c.id === cardId);
    if (!card) return;

    const newBench = benchPokemon.filter(c => c.id !== cardId);
    setBenchPokemon(newBench);
    setHand([...hand, card]);
  };

  // Attach card to Pokemon (evolution, energy, etc.)
  const attachCardToPokemon = (cardId, targetPokemonId, location, makeDisplayCard = false) => {
    const card = hand.find(c => c.id === cardId);
    if (!card) return;

    const newHand = hand.filter(c => c.id !== cardId);
    setHand(newHand);

    // Attach to active Pokemon
    if (location === 'active' && activePokemon && activePokemon.id === targetPokemonId) {
      const updatedActive = {
        ...activePokemon,
        attachedCards: [...activePokemon.attachedCards, card],
        displayCard: makeDisplayCard ? card : activePokemon.displayCard || activePokemon
      };
      setActivePokemon(updatedActive);
    }
    // Attach to bench Pokemon
    else if (location === 'bench') {
      setBenchPokemon(prev => 
        prev.map(pokemon => 
          pokemon.id === targetPokemonId 
            ? { 
                ...pokemon, 
                attachedCards: [...pokemon.attachedCards, card],
                displayCard: makeDisplayCard ? card : pokemon.displayCard || pokemon
              }
            : pokemon
        )
      );
    }
  };

  // Remove attached card from Pokemon
  const removeAttachedCard = (pokemonId, cardIndex, location) => {
    const cardToRemove = location === 'active' 
      ? activePokemon.attachedCards[cardIndex]
      : benchPokemon.find(p => p.id === pokemonId)?.attachedCards[cardIndex];

    if (!cardToRemove) return;

    // Add card back to hand
    setHand(prev => [...prev, cardToRemove]);

    // Remove from active Pokemon
    if (location === 'active' && activePokemon && activePokemon.id === pokemonId) {
      const updatedAttachedCards = activePokemon.attachedCards.filter((_, index) => index !== cardIndex);
      const updatedActive = {
        ...activePokemon,
        attachedCards: updatedAttachedCards
      };
      
      // If the removed card was the display card, reset to original Pokemon
      if (activePokemon.displayCard && activePokemon.displayCard.id === cardToRemove.id) {
        updatedActive.displayCard = null;
      }
      
      setActivePokemon(updatedActive);
    }
    // Remove from bench Pokemon
    else if (location === 'bench') {
      setBenchPokemon(prev => 
        prev.map(pokemon => {
          if (pokemon.id === pokemonId) {
            const updatedAttachedCards = pokemon.attachedCards.filter((_, index) => index !== cardIndex);
            const updatedPokemon = {
              ...pokemon,
              attachedCards: updatedAttachedCards
            };
            
            // If the removed card was the display card, reset to original Pokemon
            if (pokemon.displayCard && pokemon.displayCard.id === cardToRemove.id) {
              updatedPokemon.displayCard = null;
            }
            
            return updatedPokemon;
          }
          return pokemon;
        })
      );
    }
  };

  // Add card to discard pile
  const addToDiscardPile = (cardId, source) => {
    let card = null;
    let attachedCards = [];
    let newHand = [...hand];
    let newBench = [...benchPokemon];
    let newActivePokemon = activePokemon;

    // Find and remove card from source
    switch (source) {
      case 'hand':
        card = hand.find(c => c.id === cardId);
        if (card) {
          newHand = hand.filter(c => c.id !== cardId);
        }
        break;
      case 'bench':
        card = benchPokemon.find(c => c.id === cardId);
        if (card) {
          attachedCards = [...card.attachedCards]; // Get attached cards before removing
          newBench = benchPokemon.filter(c => c.id !== cardId);
        }
        break;
      case 'active':
        if (activePokemon && activePokemon.id === cardId) {
          card = activePokemon;
          attachedCards = [...activePokemon.attachedCards]; // Get attached cards before removing
          newActivePokemon = null;
        }
        break;
      default:
        return;
    }

    if (card) {
      setHand(newHand);
      setBenchPokemon(newBench);
      setActivePokemon(newActivePokemon);
      
      // Add the main card and all its attached cards to discard pile
      const cardsToDiscard = [card, ...attachedCards];
      setDiscardPile([...discardPile, ...cardsToDiscard]);
    }
  };

  // Remove card from discard pile
  const removeFromDiscardPile = (cardId, destination) => {
    const card = discardPile.find(c => c.id === cardId);
    if (!card) return;

    const newDiscardPile = discardPile.filter(c => c.id !== cardId);
    setDiscardPile(newDiscardPile);

    // Add card to destination
    switch (destination) {
      case 'hand':
        setHand([...hand, card]);
        break;
      case 'deck':
        setDeck([...deck, card]);
        break;
      default:
        break;
    }
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
    // Find the original card in the deck and remove it
    const cardIndex = deck.findIndex(c => c.id === card.id);
    if (cardIndex !== -1) {
      const newDeck = [...deck];
      const selectedCard = newDeck.splice(cardIndex, 1)[0];
      setDeck(newDeck);
      setHand([...hand, selectedCard]);
    }
    setShowSearch(false);
  };

  // Reset game - restore all cards to deck
  const resetGame = () => {
    // Helper function to extract all cards from a Pokemon (including attached cards)
    const extractAllCardsFromPokemon = (pokemon) => {
      if (!pokemon) return [];
      return [pokemon, ...pokemon.attachedCards];
    };

    // Collect all cards from hand, bench, active Pokemon, prize cards, and discard pile
    const allCards = [
      ...hand,
      ...benchPokemon.flatMap(extractAllCardsFromPokemon),
      ...extractAllCardsFromPokemon(activePokemon),
      ...prizeCards,
      ...discardPile,
      ...deck
    ];

    // Reset all game state
    setHand([]);
    setBenchPokemon([]);
    setActivePokemon(null);
    setPrizeCards([]);
    setDiscardPile([]);
    setStatusIcons([]);
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
    setDiscardPile([]);
    setStatusIcons([]);
    setGameStarted(false);
    setDeck([...originalDeck]);
  };

  // Add status icon to playmat
  const addStatusIcon = (type) => {
    const newIcon = {
      id: Date.now() + Math.random(),
      type,
      position: { x: 100, y: 100 } // Default position
    };
    setStatusIcons([...statusIcons, newIcon]);
  };

  // Update status icon position
  const updateStatusIconPosition = (id, newPosition) => {
    setStatusIcons(prev => 
      prev.map(icon => 
        icon.id === id ? { ...icon, position: newPosition } : icon
      )
    );
  };

  // Remove status icon
  const removeStatusIcon = (id) => {
    setStatusIcons(prev => prev.filter(icon => icon.id !== id));
  };

  // Show card close-up
  const handleCardCloseUp = (card) => {
    setCloseUpCard(card);
    setShowCardCloseUp(true);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Pokemon TCG Simulator</h1>
      </div>

      {!deck.length && (
        <div className="homepage-container">
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
              Load Your 60-Card Deck
            </label>
            <p className="file-input-hint">
              Select exactly 60 card images to begin your adventure!
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-pokeball"></div>
          <p>Loading your deck...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button 
            onClick={() => setError('')}
            className="error-close-button"
          >
            OK
          </button>
        </div>
      )}

      {deck.length > 0 && !gameStarted && (
        <div className="start-game-container">
          <div className="deck-info">
            <h3 className="deck-ready-title">Your Deck is Ready!</h3>
            <div className="deck-stats">
              <div className="deck-stat">
                <span className="deck-stat-value">{deck.length}</span>
                <span className="deck-stat-label">Cards</span>
              </div>
            </div>
            <p className="start-game-hint">
              It's time to battle! Start the game or give your deck a shuffle.
            </p>
            <div className="start-game-buttons">
              <button className="control-button start-game" onClick={startGame}>
                <Play size={20} />
                Start Game
              </button>
              <button className="control-button" onClick={shuffleDeck}>
                <Shuffle size={20} />
                Shuffle Deck
              </button>
            </div>
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
                  <Card 
                    card={activePokemon} 
                    onHealthClick={(card) => {
                      setSelectedCard(card);
                      setShowHealthEditor(true);
                    }}
                    onCloseUp={handleCardCloseUp}
                  />
                  {activePokemon.attachedCards.length > 0 && (
                    <div className="attached-cards-indicator">
                      <span>{activePokemon.attachedCards.length}</span>
                    </div>
                  )}
                  <div className="active-pokemon-overlay">
                    <button onClick={() => {
                      setSelectedCard(activePokemon);
                      setShowHealthEditor(true);
                    }}>
                      <Heart size={16} />
                      {activePokemon.health}
                    </button>
                    <button 
                      className="closeup-button"
                      onClick={() => handleCardCloseUp(activePokemon)}
                      title="View close-up"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="discard-btn"
                      onClick={() => addToDiscardPile(activePokemon.id, 'active')}
                      title={activePokemon.attachedCards.length > 0 
                        ? `Discard this Pokemon and all ${activePokemon.attachedCards.length} attached cards` 
                        : "Discard this Pokemon"
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="move-btn"
                      onClick={moveToBench}
                      title="Move to bench"
                    >
                      <ArrowUpDown size={16} />
                    </button>
                    <button 
                      className="attach-btn"
                      onClick={() => {
                        setTargetPokemon({ id: activePokemon.id, location: 'active' });
                        setShowAttachCard(true);
                      }}
                      title="Attach card"
                    >
                      <Plus size={16} />
                    </button>
                    {activePokemon.attachedCards.length > 0 && (
                      <button 
                        className="view-attached-btn"
                        onClick={() => {
                          setSelectedPokemon({ ...activePokemon, location: 'active' });
                          setShowAttachedCards(true);
                        }}
                        title="View attached cards"
                      >
                        <Eye size={16} />
                      </button>
                    )}
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
                          <Card 
                            card={benchCard} 
                            onHealthClick={(card) => {
                              setSelectedCard(card);
                              setShowHealthEditor(true);
                            }}
                            onCloseUp={handleCardCloseUp}
                          />
                          {benchCard.attachedCards.length > 0 && (
                            <div className="attached-cards-indicator">
                              <span>{benchCard.attachedCards.length}</span>
                            </div>
                          )}
                          <div className="bench-pokemon-overlay">
                            <button onClick={() => {
                              setSelectedCard(benchCard);
                              setShowHealthEditor(true);
                            }}>
                              <Heart size={16} />
                              {benchCard.health}
                            </button>
                            <button 
                              className="closeup-button"
                              onClick={() => handleCardCloseUp(benchCard)}
                              title="View close-up"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="remove-bench-btn"
                              onClick={() => removeFromBench(benchCard.id)}
                              title="Return to hand"
                            >
                              ↺
                            </button>
                            <button 
                              className="discard-btn"
                              onClick={() => addToDiscardPile(benchCard.id, 'bench')}
                              title={benchCard.attachedCards.length > 0 
                                ? `Discard this Pokemon and all ${benchCard.attachedCards.length} attached cards` 
                                : "Discard this Pokemon"
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              className="move-btn"
                              onClick={() => moveToActive(index)}
                              title="Move to active"
                            >
                              <ArrowUpDown size={16} />
                            </button>
                            <button 
                              className="attach-btn"
                              onClick={() => {
                                setTargetPokemon({ id: benchCard.id, location: 'bench' });
                                setShowAttachCard(true);
                              }}
                              title="Attach card"
                            >
                              <Plus size={16} />
                            </button>
                            {benchCard.attachedCards.length > 0 && (
                              <button 
                                className="view-attached-btn"
                                onClick={() => {
                                  setSelectedPokemon({ ...benchCard, location: 'bench' });
                                  setShowAttachedCards(true);
                                }}
                                title="View attached cards"
                              >
                                <Eye size={16} />
                              </button>
                            )}
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

            {/* Discard Pile Area */}
            <div className="discard-pile-area">
              <div className="discard-pile" onClick={() => setShowDiscardPile(true)}>
                <div className="discard-pile-back">
                  <Trash2 size={30} />
                  <span>{discardPile.length}</span>
                </div>
              </div>
            </div>

            {/* Coin */}
            <Coin />

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

            {/* Status Icon Palette */}
            <StatusIconPalette onAddStatusIcon={addStatusIcon} />

            {/* Status Icons */}
            {statusIcons.map((icon) => (
              <StatusIcon
                key={icon.id}
                type={icon.type}
                position={icon.position}
                onPositionChange={(newPosition) => updateStatusIconPosition(icon.id, newPosition)}
                onRemove={() => removeStatusIcon(icon.id)}
              />
            ))}
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
                    
                    // Check if dropped on bench area with improved slot detection
                    const benchArea = document.querySelector('.bench-area');
                    if (benchArea) {
                      const benchRect = benchArea.getBoundingClientRect();
                      const cardCenterX = cardRect.left + cardRect.width / 2;
                      const cardCenterY = cardRect.top + cardRect.height / 2;
                      
                      if (cardCenterX >= benchRect.left && cardCenterX <= benchRect.right &&
                          cardCenterY >= benchRect.top && cardCenterY <= benchRect.bottom) {
                        // Find the specific bench slot
                        const benchSlots = document.querySelectorAll('.bench-slot');
                        let slotFound = false;
                        for (let i = 0; i < benchSlots.length; i++) {
                          const slotRect = benchSlots[i].getBoundingClientRect();
                          if (cardCenterX >= slotRect.left && cardCenterX <= slotRect.right &&
                              cardCenterY >= slotRect.top && cardCenterY <= slotRect.bottom) {
                            // Check if this slot is empty
                            if (!benchPokemon[i]) {
                              placeCardOnBench(card.id);
                              slotFound = true;
                              break;
                            } else {
                              // Slot is occupied, don't place card
                              slotFound = true;
                              break;
                            }
                          }
                        }
                        if (slotFound) {
                          return;
                        }
                      }
                    }
                  }}
                >
                  <div className="card">
                    <img src={card.image} alt={card.name} className="card-image" />
                    <div className="card-health-display">
                      <span className="health-text">HP: {card.health}</span>
                    </div>
                    <div className="card-overlay">
                      <div className="card-overlay-buttons">
                        <button 
                          className="health-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(card);
                            setShowHealthEditor(true);
                          }}
                          title="Edit health"
                        >
                          HP: {card.health}
                        </button>
                        <button 
                          className="closeup-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardCloseUp(card);
                          }}
                          title="View close-up"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="deck-bottom-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveCardToBottomOfDeck(card.id);
                          }}
                          title="Move to bottom of deck"
                        >
                          <Shuffle size={16} />
                        </button>
                        <button 
                          className="discard-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToDiscardPile(card.id, 'hand');
                          }}
                          title="Discard this card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
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

      {/* Discard Pile Modal */}
      {showDiscardPile && (
        <DiscardPileModal
          discardPile={discardPile}
          onClose={() => setShowDiscardPile(false)}
          onAddToHand={(cardId) => removeFromDiscardPile(cardId, 'hand')}
          onAddToDeck={(cardId) => removeFromDiscardPile(cardId, 'deck')}
        />
      )}

      {/* Attach Card Modal */}
      {showAttachCard && targetPokemon && (
        <AttachCardModal
          hand={hand}
          onClose={() => {
            setShowAttachCard(false);
            setTargetPokemon(null);
          }}
          onAttachCard={(cardId, makeDisplayCard) => {
            attachCardToPokemon(cardId, targetPokemon.id, targetPokemon.location, makeDisplayCard);
            setShowAttachCard(false);
            setTargetPokemon(null);
          }}
        />
      )}

      {/* Attached Cards Modal */}
      {showAttachedCards && selectedPokemon && (
        <AttachedCardsModal
          pokemon={selectedPokemon}
          onClose={() => {
            setShowAttachedCards(false);
            setSelectedPokemon(null);
          }}
          onRemoveCard={(cardIndex) => {
            removeAttachedCard(selectedPokemon.id, cardIndex, selectedPokemon.location);
          }}
        />
      )}

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
    </div>
  );
}

export default App; 