import React, { useEffect, useRef } from 'react';
import { Game } from './game';
import { GameUI } from './components/ui/GameUI';

const GRID_WIDTH = 80;
const GRID_HEIGHT = 45;
const CELL_SIZE = 16;

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    
    // Create and initialize the game
    const game = new Game({
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT,
      cellSize: CELL_SIZE
    });
    
    gameRef.current = game;
    
    // Initialize and start the game
    game.init(containerRef.current).then(() => {
      game.start();
    });
    
    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Game Canvas Container - now fills the entire viewport for scaling */}
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      />
      
      {/* React UI Overlay */}
      <GameUI />
    </div>
  );
};