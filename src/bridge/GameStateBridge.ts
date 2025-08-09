import { gameStore, type InventoryItem } from '../store/gameStore';

/**
 * Bridge between ECS game systems and React UI state.
 * This allows game code to update UI without React dependencies.
 */
export class GameStateBridge {
  private static instance: GameStateBridge;
  
  private constructor() {}
  
  static getInstance(): GameStateBridge {
    if (!GameStateBridge.instance) {
      GameStateBridge.instance = new GameStateBridge();
    }
    return GameStateBridge.instance;
  }
  
  // Health updates
  updateHealth(hp: number, maxHp: number, armor: number = 0): void {
    gameStore().updateHealth(hp, maxHp, armor);
  }
  
  // Floor updates
  updateFloor(floor: number): void {
    gameStore().updateFloor(floor);
  }
  
  // Message log
  addMessage(text: string, color: number): void {
    gameStore().addMessage(text, color);
  }
  
  // Inventory management
  updateInventory(items: InventoryItem[]): void {
    gameStore().updateInventory(items);
  }
  
  toggleInventory(): void {
    gameStore().toggleInventory();
  }
  
  // Game over
  showGameOver(victory: boolean, floor: number, enemiesKilled: number, itemsCollected: number): void {
    gameStore().showGameOver({
      floor,
      enemiesKilled,
      itemsCollected,
      victory
    });
  }
  
  // Keybind help
  toggleKeybindHelp(): void {
    gameStore().toggleKeybindHelp();
  }
  
  // Stats tracking
  incrementEnemiesKilled(): void {
    gameStore().incrementEnemiesKilled();
  }
  
  incrementItemsCollected(): void {
    gameStore().incrementItemsCollected();
  }
  
  // Reset game state
  reset(): void {
    gameStore().reset();
  }
  
  // Check UI state (for game to know if UI is blocking)
  isUIBlocking(): boolean {
    const state = gameStore();
    return state.inventoryOpen || state.gameOver || state.keybindHelpOpen;
  }
}

// Export singleton instance
export const gameStateBridge = GameStateBridge.getInstance();