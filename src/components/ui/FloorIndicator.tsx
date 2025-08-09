import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const FloorIndicator: React.FC = () => {
  const { floor } = useGameStore();
  
  const color = floor === 10 ? '#ff00ff' : '#ffff00';
  
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      fontFamily: 'monospace',
      fontSize: '16px',
      color,
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '4px 8px',
      border: '2px solid #444',
      borderRadius: '2px'
    }}>
      Floor: {floor}
      {floor === 10 && <span style={{ marginLeft: '8px' }}>⭐</span>}
    </div>
  );
};