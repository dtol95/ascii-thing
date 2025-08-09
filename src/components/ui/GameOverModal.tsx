import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { getDeathMessage } from '../../data/deathMessages';

export const GameOverModal: React.FC = () => {
  const { gameOver, gameOverStats } = useGameStore();
  
  if (!gameOver || !gameOverStats) return null;
  
  const { victory, floor, enemiesKilled, itemsCollected, killerName, turnsSurvived } = gameOverStats;
  
  // Get contextual death message
  const deathInfo = !victory ? getDeathMessage({
    killerName,
    floor,
    turnsAlive: turnsSurvived || 0,
    enemiesKilled
  }) : null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      pointerEvents: 'auto'
    }}>
      <div style={{
        backgroundColor: victory ? 'rgba(0, 34, 0, 0.95)' : 'rgba(34, 0, 0, 0.95)',
        border: `3px solid ${victory ? '#00ff00' : '#ff0000'}`,
        borderRadius: '8px',
        padding: '40px',
        minWidth: '400px',
        fontFamily: 'monospace',
        color: 'white',
        textAlign: 'center',
        boxShadow: `0 0 30px ${victory ? '#00ff00' : '#ff0000'}`
      }}>
        <h1 style={{
          fontSize: '32px',
          margin: '0 0 20px 0',
          color: victory ? '#00ff00' : '#ff0000',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          {victory ? '*** VICTORY! ***' : '*** GAME OVER ***'}
        </h1>
        
        <p style={{
          fontSize: '18px',
          margin: '0 0 10px 0',
          color: victory ? '#ffff00' : '#ff6666'
        }}>
          {victory ? 'You have conquered the dungeon!' : (deathInfo?.message || 'You have died!')}
        </p>
        
        {!victory && killerName && (
          <p style={{
            fontSize: '16px',
            margin: '0 0 20px 0',
            color: '#ff0000',
            fontStyle: 'italic'
          }}>
            Slain by {killerName}
          </p>
        )}
        
        {!victory && deathInfo?.epitaph && (
          <p style={{
            fontSize: '14px',
            margin: '0 0 20px 0',
            color: '#888888',
            fontStyle: 'italic'
          }}>
            "{deathInfo.epitaph}"
          </p>
        )}
        
        <div style={{
          fontSize: '48px',
          margin: '20px 0'
        }}>
          {victory ? '👑' : '💀'}
        </div>
        
        <div style={{
          borderTop: '1px solid #666',
          marginTop: '30px',
          paddingTop: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#aaaaaa',
            margin: '0 0 15px 0'
          }}>
            === FINAL STATS ===
          </h3>
          
          <div style={{
            textAlign: 'left',
            display: 'inline-block',
            fontSize: '16px',
            lineHeight: '24px'
          }}>
            <div>Floor Reached: <span style={{ color: '#ffff00' }}>{floor}{victory && ' (MAX)'}</span></div>
            <div>Enemies Defeated: <span style={{ color: '#ff8800' }}>{enemiesKilled}</span></div>
            <div>Items Collected: <span style={{ color: '#00ffff' }}>{itemsCollected}</span></div>
            {turnsSurvived && (
              <div>Turns Survived: <span style={{ color: '#ff00ff' }}>{turnsSurvived}</span></div>
            )}
          </div>
        </div>
        
        {!victory && deathInfo?.hint && (
          <div style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid #444444',
            borderRadius: '4px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#00ff00',
              margin: 0
            }}>
              {deathInfo.hint}
            </p>
          </div>
        )}
        
        <div style={{
          marginTop: '30px',
          fontSize: '16px',
          color: '#00ffff',
          animation: 'pulse 2s infinite'
        }}>
          Press [F5] to play again
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};