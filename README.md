# ASCII Roguelike with Modern VFX

A browser-based, turn-based roguelike rendered with ASCII glyphs while leveraging modern GPU-accelerated effects.

📖 **[How to Play Guide](HOWTOPLAY.md)** - Complete controls, strategies, and gameplay mechanics

## Current Features

### Core Systems (Completed ✅)
- **Hybrid Architecture**: React UI layer + PixiJS game rendering for best of both worlds
- **ECS Architecture**: Entity-Component-System for modular game logic
- **ASCII Renderer**: PixiJS v8 with dynamically generated CP437 bitmap font (60 FPS)
- **Integer Scaling**: Pixel-perfect responsive design with letterboxing
- **React UI Components**: 
  - Animated health bar, message log, floor indicator
  - ASCII-styled inventory modal with keyboard navigation
  - Help modal with keybinds and coming soon features
  - Enhanced game over screen with death context and stats
- **State Management**: Zustand store with GameStateBridge for ECS → React communication
- **Turn-Based Combat**: Energy-based turn system with dynamic combat text
- **Narrative System**: Environmental messages, floor themes, contextual feedback
- **Procedural Generation**: BSP dungeon rooms connected by corridors (rot-js)
- **Field of View**: Shadowcasting FOV with memory system (clears on floor change)
- **Dynamic Lighting**: Light propagation with static wall map for O(1) performance
- **Enemy AI**: Hunt and wander behaviors with optimized A* pathfinding (4 calculations/turn max)
- **Combat System**: 
  - Melee attacks with damage calculation and armor
  - Dynamic combat messages based on damage dealt
  - Death tracking with killer attribution
- **Particle Effects**: Optimized hit sparks, step dust, blood (only spawn near player)
- **UI/HUD**: React-based health bar, message log, floor indicator with smooth animations
- **Seeded Runs**: Deterministic RNG for reproducible gameplay (?seed=12345)
- **Data-Driven Content**: Modular message files for easy content expansion

## How to Play

### Controls
- **Arrow Keys/WASD**: Move your character (@)
- **Space/.**: Wait one turn
- **g**: Pick up items
- **i**: Open inventory modal (React UI)
- **1-9**: Use items in inventory
- **>**: Descend stairs (when standing on them)
- **?**: Show help modal with keybinds

### Game Elements
- **@** (Yellow): You, the player
- **r** (Brown): Rats - enemies that scale with floor depth
- **!** (Red/Pink): Health potions
- **#** (Gray): Walls
- **.** (Dark Gray): Floor
- **+** (Brown): Doors
- **>** (Yellow): Stairs down to next level

## Running the Game

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Development Status

### ✅ Completed Features
- [x] Project setup with TypeScript + Vite
- [x] ECS architecture implementation
- [x] ASCII renderer with bitmap font atlas
- [x] Turn-based energy system
- [x] FOV and lighting systems
- [x] Dungeon generation
- [x] Player movement and input
- [x] Enemy AI with pathfinding
- [x] Combat system with melee damage
- [x] Particle effects (hit sparks, step dust, blood)
- [x] UI/HUD with health bar and message log
- [x] Seeded RNG for deterministic runs
- [x] **Items and inventory system** (health potions with pickup and use)
- [x] **Multiple dungeon levels** (10 floors)
- [x] **Difficulty progression** (enemies scale with floor)
- [x] **Win condition** (reach floor 10)

### 🚧 Coming Soon
- [ ] **Enemy Variety**: Goblins, Orcs, Skeletons, Boss enemies
- [ ] **Expanded Items**: 
  - Weapons (Dagger, Sword, Axe)
  - Armor (Leather, Chain, Plate)
  - Scrolls (Fireball, Teleport, Identify)
  - Food (Bread, Meat)
- [ ] **Status Effects**: Poison, Burn, Stun, Slow
- [ ] **Loot System**: Enemy drops with rarity tiers
- [ ] **Random Events**: Non-combat encounters
- [ ] **Dungeon Lore**: Story elements and collectibles
- [ ] **Save/Load**: Persistent game state
- [ ] **Ranged Combat**: Bows, throwing weapons
- [ ] **Magic System**: Spells and mana
- [ ] **Character Progression**: Experience and leveling

## Architecture

The game follows the design document's ECS architecture:
- **Entities**: Simple integer IDs
- **Components**: Data-only structures (Position, Health, Actor, etc.)
- **Systems**: Logic processors that operate on entities with specific components
- **Events**: Message bus for decoupled communication

## Tech Stack

- **Game Rendering**: PixiJS v8 (WebGL2 rendering for 60 FPS performance)
- **UI Framework**: React 18 with TypeScript
- **State Management**: Zustand for UI state synchronization
- **Language**: TypeScript (strict mode)
- **Build**: Vite with React plugin
- **Roguelike Utilities**: rot-js (FOV, pathfinding, dungeon generation)
- **Architecture**: Hybrid - PixiJS for game, React for UI overlay

## Game Status

🎮 **The game is fully playable!** 

### What Works
- Complete turn-based roguelike gameplay
- Enemies hunt and attack the player
- Combat with damage, death, and particle effects
- Field of view with memory system
- Health bar and message log
- Procedurally generated dungeons
- Seeded runs for speedrunning/challenges

### What's New (Latest Update)
- **React Modal UIs**: Full inventory and help screens with ASCII styling
- **Narrative System**: 
  - Environmental messages that add atmosphere
  - Floor-specific themes and descriptions
  - Dynamic combat text for variety
- **Enhanced Death System**:
  - Tracks what killed you
  - Contextual death messages
  - Helpful hints for improvement
  - Death statistics (turns survived, enemies killed)
- **Integer Scaling**: Pixel-perfect responsive design without blur
- **Content System**: Modular data files for messages and combat text
- **Improved Combat Feedback**: Varied messages based on damage dealt

### Recent Improvements
- ✅ Added React modal system for inventory and help
- ✅ Implemented narrative system with environmental messages
- ✅ Enhanced death tracking and contextual messages
- ✅ Added integer scaling for responsive display
- ✅ Fixed edge clearing bug on floor transitions
- ✅ Created modular content system for easy expansion
- ✅ Added dynamic combat text for variety
- ✅ Improved game over screen with full statistics

### Known Issues
- Only one enemy type (rats) - more variety coming soon
- No save/load functionality yet

### Quick Start
```bash
# Run with default random seed
npm run dev

# Run with specific seed for reproducible dungeon
# http://localhost:3000?seed=12345
```

Try to survive as long as possible against the rat hordes!