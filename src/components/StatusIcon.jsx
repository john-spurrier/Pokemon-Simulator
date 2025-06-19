import React from 'react';
import Draggable from 'react-draggable';
import { Zap, Skull, Flame, Shell, Bed } from 'lucide-react';

const StatusIcon = ({ type, position, onPositionChange, onRemove }) => {
  const getIcon = () => {
    switch (type) {
      case 'lightning':
        return <Zap size={20} />;
      case 'poison':
        return <Skull size={20} />;
      case 'fire':
        return <Flame size={20} />;
      case 'spiral':
        return <Shell size={20} />;
      case 'z':
        return <Bed size={20} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'lightning':
        return '#FFD700'; // Gold
      case 'poison':
        return '#8B008B'; // Dark magenta
      case 'fire':
        return '#FF4500'; // Orange red
      case 'spiral':
        return '#32CD32'; // Royal blue
      case 'z':
        return '#4169E1'; // Lime green
      default:
        return '#666';
    }
  };

  return (
    <Draggable
      position={position}
      onStop={(e, data) => {
        onPositionChange({ x: data.x, y: data.y });
      }}
      bounds=".playmat"
    >
      <div 
        className="status-icon"
        style={{ 
          backgroundColor: getColor(),
          position: 'absolute',
          zIndex: 1000
        }}
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} status`}
      >
        {getIcon()}
        <button 
          className="status-icon-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove status icon"
        >
          ×
        </button>
      </div>
    </Draggable>
  );
};

export default StatusIcon; 