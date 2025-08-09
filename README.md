# ASCII Roguelike with Modern VFX

A browser-based, turn-based roguelike rendered with ASCII glyphs while leveraging modern GPU-accelerated effects.

📖 **[How to Play Guide](HOWTOPLAY.md)** - Complete controls, strategies, and gameplay mechanics

## Current Features

### Core Systems (Completed ✅)
- **Hybrid Architecture**: React UI layer + PixiJS game rendering for best of both worlds
- **ECS Architecture**: Entity-Component-System for modular game logic
- **ASCII Renderer**: PixiJS v8 with dynamically generated CP437 bitmap font (60 FPS)
- **React UI Components**: Smooth animated health bar, message log, game over screen
- **State Management**: Zustand store with GameStateBridge for ECS → React communication
- **Turn-Based Combat**: Energy-based turn system with melee combat
- **Procedural Generation**: BSP dungeon rooms connected by corridors (rot-js)
- **Field of View**: Shadowcasting FOV with memory system (clears on floor change)
- **Dynamic Lighting**: Light propagation with static wall map for O(1) performance
- **Enemy AI**: Hunt and wander behaviors with optimized A* pathfinding (4 calculations/turn max)
- **Combat System**: Melee attacks with damage calculation and armor
- **Particle Effects**: Optimized hit sparks, step dust, blood (only spawn near player)
- **UI/HUD**: React-based health bar, message log, floor indicator with smooth animations
- **Seeded Runs**: Deterministic RNG for reproducible gameplay (?seed=12345)

## How to Play

### Controls
- **Arrow Keys/WASD**: Move your character (@)
- **Space/.**: Wait one turn
- **g**: Pick up items
- **i**: Open inventory (use items with number keys)
- **>**: Descend stairs (when standing on them)
- **?**: Show keybind help

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

### 🚧 Future Features
- [ ] Full inventory UI overlay
- [ ] Status effects (burn, poison, slow, stun)
- [ ] Save/load functionality
- [ ] More enemy types (goblins, orcs, skeletons)
- [ ] More item types (weapons, armor)
- [ ] Ranged combat
- [ ] Spells and abilities
- [ ] Performance optimization

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

### What's New
- **React UI Integration**: Modern UI components with smooth animations
- **Performance Optimizations**: Smart pathfinding limits, particle culling, selective rendering
- **Healing System**: Health potions spawn throughout the dungeon
- **10 Dungeon Levels**: Progress through increasingly difficult floors
- **Difficulty Scaling**: Enemies get stronger and more numerous on deeper floors
- **Win Condition**: Reach and conquer floor 10!
- **Floor Transitions**: Gain 5 HP when descending to reward exploration
- **Game Over Screen**: Beautiful victory/defeat modal with final stats

### Recent Improvements
- ✅ Fixed visibility persistence between floors
- ✅ Fixed item count tracking issues
- ✅ Eliminated HUD flickering with selective screen clearing
- ✅ Added proper game over screen with stats
- ✅ Optimized pathfinding for better performance with many enemies
- ✅ Integrated React UI layer for modern interface

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