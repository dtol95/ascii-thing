import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { gameStateBridge } from '../../bridge/GameStateBridge';

export const InventoryModal: React.FC = () => {
  const { inventoryOpen, inventory, toggleInventory } = useGameStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!inventoryOpen) return;
      
      if (e.key === 'i' || e.key === 'Escape') {
        toggleInventory();
        return;
      }
      
      // Handle number keys for item usage
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const index = num - 1;
        if (index < inventory.length) {
          setSelectedIndex(index);
          // Trigger item use through bridge
          gameStateBridge.useInventoryItem(index);
          toggleInventory();
        }
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowUp' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      } else if (e.key === 'ArrowDown' && selectedIndex < inventory.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inventoryOpen, inventory, selectedIndex, toggleInventory]);
  
  // Reset selection when modal opens
  useEffect(() => {
    if (inventoryOpen) {
      setSelectedIndex(0);
    }
  }, [inventoryOpen]);
  
  if (!inventoryOpen) return null;
  
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
        minWidth: '400px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '60vh',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* ASCII Border decoration */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          textAlign: 'center',
          fontSize: '10px',
          color: '#808080',
          userSelect: 'none'
        }}>
          ╔═══════════════════════════════════════╗
        </div>
        
        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          color: '#ffff00',
          marginTop: '10px',
          marginBottom: '10px',
          fontSize: '20px',
          letterSpacing: '2px'
        }}>
          ═══ INVENTORY ═══
        </h2>
        
        {/* Instructions */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#aaaaaa'
        }}>
          <div>Press [i] or [Escape] to close</div>
          <div>Press [1-9] to use item</div>
        </div>
        
        {/* Items List */}
        <div style={{
          minHeight: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444444'
        }}>
          {inventory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#808080',
              padding: '20px'
            }}>
              Your inventory is empty.
            </div>
          ) : (
            <div>
              {inventory.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  style={{
                    padding: '5px 10px',
                    marginBottom: '5px',
                    backgroundColor: index === selectedIndex ? '#333333' : 'transparent',
                    border: index === selectedIndex ? '1px solid #666666' : '1px solid transparent',
                    color: index === selectedIndex ? '#ffff00' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.1s ease'
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                    gameStateBridge.useInventoryItem(index);
                    toggleInventory();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#aaaaaa', minWidth: '20px' }}>
                      {index + 1}.
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {item.effect?.heal && (
                    <span style={{ color: '#00ff00', fontSize: '12px' }}>
                      +{item.effect.heal} HP
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Item count */}
        <div style={{
          marginTop: '15px',
          textAlign: 'right',
          color: '#aaaaaa',
          fontSize: '12px'
        }}>
          Items: {inventory.length}/20
        </div>
        
        {/* Bottom border decoration */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          textAlign: 'center',
          fontSize: '10px',
          color: '#808080',
          userSelect: 'none'
        }}>
          ╚═══════════════════════════════════════╝
        </div>
      </div>
    </div>
  );
};