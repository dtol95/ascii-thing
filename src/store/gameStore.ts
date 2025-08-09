import { create } from 'zustand';

export interface Message {
  text: string;
  color: number;
  time: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity?: number;
  effect?: {
    heal?: number;
  };
}

export interface GameStats {
  floor: number;
  enemiesKilled: number;
  itemsCollected: number;
  victory: boolean;
}

interface GameState {
  // Player stats
  hp: number;
  maxHp: number;
  armor: number;
  
  // Game progress
  floor: number;
  enemiesKilled: number;
  itemsCollected: number;
  
  // UI state
  messages: Message[];
  inventory: InventoryItem[];
  inventoryOpen: boolean;
  gameOver: boolean;
  gameOverStats: GameStats | null;
  keybindHelpOpen: boolean;
  
  // Actions
  updateHealth: (hp: number, maxHp: number, armor?: number) => void;
  updateFloor: (floor: number) => void;
  addMessage: (text: string, color: number) => void;
  clearOldMessages: () => void;
  updateInventory: (items: InventoryItem[]) => void;
  toggleInventory: () => void;
  showGameOver: (stats: GameStats) => void;
  hideGameOver: () => void;
  toggleKeybindHelp: () => void;
  incrementEnemiesKilled: () => void;
  incrementItemsCollected: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  hp: 20,
  maxHp: 20,
  armor: 0,
  floor: 1,
  enemiesKilled: 0,
  itemsCollected: 0,
  messages: [],
  inventory: [],
  inventoryOpen: false,
  gameOver: false,
  gameOverStats: null,
  keybindHelpOpen: false,
  
  // Actions
  updateHealth: (hp, maxHp, armor = 0) => set({ hp, maxHp, armor }),
  
  updateFloor: (floor) => set({ floor }),
  
  addMessage: (text, color) => set((state) => {
    const newMessage: Message = { text, color, time: Date.now() };
    const messages = [...state.messages, newMessage].slice(-4); // Keep last 4 messages
    return { messages };
  }),
  
  clearOldMessages: () => set((state) => {
    const now = Date.now();
    const messages = state.messages.filter(msg => now - msg.time < 5000);
    return { messages };
  }),
  
  updateInventory: (inventory) => set({ inventory }),
  
  toggleInventory: () => set((state) => ({ inventoryOpen: !state.inventoryOpen })),
  
  showGameOver: (stats) => set({ gameOver: true, gameOverStats: stats }),
  
  hideGameOver: () => set({ gameOver: false, gameOverStats: null }),
  
  toggleKeybindHelp: () => set((state) => ({ keybindHelpOpen: !state.keybindHelpOpen })),
  
  incrementEnemiesKilled: () => set((state) => ({ enemiesKilled: state.enemiesKilled + 1 })),
  
  incrementItemsCollected: () => set((state) => ({ itemsCollected: state.itemsCollected + 1 })),
  
  reset: () => set({
    hp: 20,
    maxHp: 20,
    armor: 0,
    floor: 1,
    enemiesKilled: 0,
    itemsCollected: 0,
    messages: [],
    inventory: [],
    inventoryOpen: false,
    gameOver: false,
    gameOverStats: null,
    keybindHelpOpen: false,
  })
}));

// Export store for non-React access
export const gameStore = useGameStore.getState;