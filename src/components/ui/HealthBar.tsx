import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const HealthBar: React.FC = () => {
  const { hp, maxHp, armor } = useGameStore();
  
  const healthPercent = (hp / maxHp) * 100;
  const healthColor = healthPercent > 50 ? '#00ff00' : healthPercent > 25 ? '#ffff00' : '#ff0000';
  
  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'monospace',
      fontSize: '16px',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      pointerEvents: 'none',
      userSelect: 'none'
    }}>
      <span>HP:</span>
      
      <div style={{
        width: '200px',
        height: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        border: '2px solid #444',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${healthPercent}%`,
          height: '100%',
          backgroundColor: healthColor,
          transition: 'width 0.3s ease, background-color 0.3s ease',
          boxShadow: `0 0 10px ${healthColor}`
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
        }}>
          {hp}/{maxHp}
        </div>
      </div>
      
      {armor > 0 && (
        <span style={{ color: '#aaaaaa' }}>
          ARM: {armor}
        </span>
      )}
    </div>
  );
};