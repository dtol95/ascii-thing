import React from 'react';
import { HealthBar } from './HealthBar';
import { MessageLog } from './MessageLog';
import { FloorIndicator } from './FloorIndicator';
import { KeybindHint } from './KeybindHint';
import { GameOverModal } from './GameOverModal';

export const GameUI: React.FC = () => {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        <HealthBar />
        <FloorIndicator />
        <MessageLog />
        <KeybindHint />
      </div>
      <GameOverModal />
    </>
  );
};