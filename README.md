# ASCII Roguelike with Modern VFX

A browser-based, turn-based roguelike rendered with ASCII glyphs while leveraging modern GPU-accelerated effects.

📖 **[How to Play Guide](HOWTOPLAY.md)** - Complete controls, strategies, and gameplay mechanics

## Current Features

### Core Systems (Completed ✅)
- **ECS Architecture**: Entity-Component-System for modular game logic
- **ASCII Renderer**: PixiJS v8 with dynamically generated CP437 bitmap font
- **Turn-Based Combat**: Energy-based turn system with melee combat
- **Procedural Generation**: BSP dungeon rooms connected by corridors (rot-js)
- **Field of View**: Shadowcasting FOV with memory system
- **Dynamic Lighting**: Light propagation system ready for torches
- **Enemy AI**: Hunt and wander behaviors with A* pathfinding
- **Combat System**: Melee attacks with damage calculation and armor
- **Particle Effects**: Hit sparks, step dust, blood effects
- **UI/HUD**: Health bar, message log, floor indicator
- **Seeded Runs**: Deterministic RNG for reproducible gameplay (?seed=12345)

## How to Play

### Controls
- **Arrow Keys/WASD**: Move your character (@)
- **Space/.**: Wait one turn
- **g**: Pick up items
- **i**: Use health potion from inventory
- **>**: Descend stairs (when standing on them)

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

- **Runtime**: PixiJS v8 (WebGL2 rendering)
- **Language**: TypeScript
- **Build**: Vite
- **Roguelike Utilities**: rot-js (FOV, pathfinding, dungeon generation)
- **Particles**: @pixi/particle-emitter (ready for implementation)

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
- **Healing System**: Health potions spawn throughout the dungeon
- **10 Dungeon Levels**: Progress through increasingly difficult floors
- **Difficulty Scaling**: Enemies get stronger and more numerous on deeper floors
- **Win Condition**: Reach and conquer floor 10!
- **Floor Transitions**: Gain 5 HP when descending to reward exploration

### Known Issues
- Only one enemy type (rats) - more variety coming soon
- No save/load functionality yet
- Basic inventory system (no full UI overlay, but potions are usable with 'i' key)

### Quick Start
```bash
# Run with default random seed
npm run dev

# Run with specific seed for reproducible dungeon
# http://localhost:3000?seed=12345
```

Try to survive as long as possible against the rat hordes!