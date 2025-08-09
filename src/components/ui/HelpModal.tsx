import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const HelpModal: React.FC = () => {
  const { keybindHelpOpen, toggleKeybindHelp } = useGameStore();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (keybindHelpOpen && (e.key === '?' || e.key === 'Escape')) {
        toggleKeybindHelp();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keybindHelpOpen, toggleKeybindHelp]);
  
  if (!keybindHelpOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
      fontFamily: 'monospace',
      pointerEvents: 'auto'
    }}>
      <div style={{
        backgroundColor: '#202020',
        border: '2px solid #808080',
        borderRadius: '0',
        padding: '20px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* ASCII Border Top */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          height: '2px',
          backgroundColor: '#808080',
          content: ''
        }} />
        
        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          color: '#ffff00',
          marginTop: 0,
          fontSize: '24px',
          letterSpacing: '2px'
        }}>
          ═══ KEYBINDS ═══
        </h2>
        
        {/* Close instruction */}
        <p style={{ 
          textAlign: 'center', 
          color: '#aaaaaa',
          fontSize: '12px',
          marginBottom: '20px'
        }}>
          Press [?] or [Escape] to close
        </p>
        
        {/* Movement Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>
            ▶ MOVEMENT
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <div><span style={{ color: '#ffff00' }}>Arrow Keys / WASD</span> - Move in four directions</div>
            <div><span style={{ color: '#ffff00' }}>Space / .</span> - Wait (skip turn)</div>
          </div>
        </div>
        
        {/* Actions Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>
            ▶ ACTIONS
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <div><span style={{ color: '#ffff00' }}>g</span> - Pick up items</div>
            <div><span style={{ color: '#ffff00' }}>i</span> - Open inventory</div>
            <div><span style={{ color: '#ffff00' }}>&lt;</span> - Go up stairs (when on stairs)</div>
            <div><span style={{ color: '#ffff00' }}>&gt;</span> - Go down stairs (when on stairs)</div>
          </div>
        </div>
        
        {/* Combat Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>
            ▶ COMBAT
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <div>• Bump into enemies to attack</div>
            <div>• Use corridors to fight one at a time</div>
            <div>• Retreat when overwhelmed</div>
          </div>
        </div>
        
        {/* Meta Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ffff', marginBottom: '10px' }}>
            ▶ META
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <div><span style={{ color: '#ffff00' }}>?</span> - Show this help</div>
            <div><span style={{ color: '#ffff00' }}>F5</span> - Restart game</div>
          </div>
        </div>
        
        {/* Tips Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>
            ▶ TIPS
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#aaaaaa' }}>
            <div>• Rats have 3 HP, you deal 2-4 damage</div>
            <div>• Use doorways to prevent being surrounded</div>
            <div>• Pick up potions and save them for emergencies</div>
            <div>• The deeper you go, the stronger enemies become</div>
            <div>• Listen to ambient sounds for clues</div>
          </div>
        </div>
        
        {/* Coming Soon Section */}
        <div style={{ 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #444444'
        }}>
          <h3 style={{ color: '#ff00ff', marginBottom: '10px' }}>
            ▶ COMING SOON
          </h3>
          <div style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#808080' }}>
            <div>• More enemy types (Goblin, Orc, Skeleton, Boss)</div>
            <div>• Weapons & Armor system</div>
            <div>• Magic scrolls and spells</div>
            <div>• Status effects (poison, burn, stun)</div>
            <div>• Loot drop system</div>
            <div>• Random events & encounters</div>
            <div>• Full dungeon lore & story</div>
            <div>• Ranged combat</div>
            <div>• Character progression</div>
          </div>
        </div>
        
        {/* ASCII Border Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '-2px',
          right: '-2px',
          height: '2px',
          backgroundColor: '#808080'
        }} />
      </div>
    </div>
  );
};