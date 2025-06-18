import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const HealthEditor = ({ card, onSave, onCancel }) => {
  const [health, setHealth] = useState(card.health);

  const handleSave = () => {
    const numHealth = parseInt(health);
    if (!isNaN(numHealth) && numHealth >= 0) {
      onSave(numHealth);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="health-editor">
      <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
        <Heart size={20} style={{ marginRight: '8px' }} />
        Edit {card.name}'s Health
      </h3>
      
      <div style={{ textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Health:</label>
        <input
          type="number"
          value={health}
          onChange={(e) => setHealth(e.target.value)}
          onKeyPress={handleKeyPress}
          className="health-input"
          min="0"
          autoFocus
        />
      </div>
      
      <div className="health-buttons">
        <button className="health-button save" onClick={handleSave}>
          Save
        </button>
        <button className="health-button cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HealthEditor; 