import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const MessageLog: React.FC = () => {
  const { messages, clearOldMessages } = useGameStore();
  
  // Clear old messages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      clearOldMessages();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [clearOldMessages]);
  
  const hexToRgb = (hex: number): string => {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const getOpacity = (messageTime: number): number => {
    const age = Date.now() - messageTime;
    const fadeStart = 3000; // Start fading after 3 seconds
    const fadeEnd = 5000; // Fully faded at 5 seconds
    
    if (age < fadeStart) return 1;
    if (age > fadeEnd) return 0;
    
    return 1 - ((age - fadeStart) / (fadeEnd - fadeStart));
  };
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      pointerEvents: 'none',
      userSelect: 'none'
    }}>
      {messages.map((msg, index) => (
        <div
          key={`${msg.time}-${index}`}
          style={{
            color: hexToRgb(msg.color),
            opacity: getOpacity(msg.time),
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            transition: 'opacity 0.5s ease',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '2px 8px',
            borderRadius: '2px'
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};