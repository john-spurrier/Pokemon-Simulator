import React from 'react';
import { Zap, Skull, Flame, RotateCcw } from 'lucide-react';

const StatusIconPalette = ({ onAddStatusIcon }) => {
  const statusTypes = [
    { type: 'lightning', icon: <Zap size={20} />, color: '#FFD700', label: 'Lightning' },
    { type: 'poison', icon: <Skull size={20} />, color: '#8B008B', label: 'Poison' },
    { type: 'fire', icon: <Flame size={20} />, color: '#FF4500', label: 'Fire' },
    { type: 'spiral', icon: <RotateCcw size={20} />, color: '#4169E1', label: 'Spiral' },
    { type: 'z', icon: <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Z</span>, color: '#32CD32', label: 'Z' }
  ];

  return (
    <div className="status-icon-palette">
      <h3>Status Icons</h3>
      <div className="status-icon-grid">
        {statusTypes.map((status) => (
          <div
            key={status.type}
            className="status-icon-option"
            style={{ backgroundColor: status.color }}
            onClick={() => onAddStatusIcon(status.type)}
            title={`Add ${status.label} status icon`}
          >
            {status.icon}
          </div>
        ))}
      </div>
      <p className="status-icon-help">
        Click an icon to add it to the playmat, then drag it onto cards
      </p>
    </div>
  );
};

export default StatusIconPalette; 