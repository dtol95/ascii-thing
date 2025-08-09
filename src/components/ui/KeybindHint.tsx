import React from 'react';

export const KeybindHint: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#00ffff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      pointerEvents: 'none',
      userSelect: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '4px 8px',
      border: '1px solid #00ffff',
      borderRadius: '2px'
    }}>
      [?] Help
    </div>
  );
};