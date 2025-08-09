# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
npm install

# Start development server on http://localhost:3000
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

### TypeScript
The project uses TypeScript with strict mode enabled. The TypeScript compiler is configured via `tsconfig.json` with:
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- No unused locals/parameters warnings

Note: There are no linting or formatting commands configured. TypeScript compilation happens through Vite during `npm run build`.

## Architecture

### Hybrid Architecture (React UI + PixiJS Game)
The project uses a hybrid architecture:
- **React** for UI components (health bar, messages, inventory, etc.)
- **PixiJS** for game rendering (60 FPS WebGL performance)
- **Zustand** for state management between game and UI
- **GameStateBridge** for ECS → React communication

### ECS (Entity-Component-System)
The game uses a pure ECS architecture where:
- **Entities** are simple integer IDs managed by `World`
- **Components** are data-only interfaces (no logic) in `src/ecs/components.ts`
- **Systems** process entities with specific components in a fixed order each turn
- **Events** communicate between systems via `EventBus`

### System Processing Order (per turn)
1. **EnergySystem**: Manages turn-based energy accumulation and determines which actors can act
2. **InputSystem**: Handles player keyboard input when player has enough energy  
3. **AISystem**: Determines AI actor intents (hunt/wander behaviors with A* pathfinding)
4. **MovementSystem**: Processes movement intents and collision detection
5. **CombatSystem**: Resolves melee attacks and damage
6. **FOVSystem**: Computes field of view using shadowcasting
7. **LightingSystem**: Propagates dynamic lighting from light sources
8. **FXSystem**: Spawns particle effects based on events (hit sparks, blood, dust)
9. **RenderSystem**: Updates the ASCII display using PixiJS

### Rendering Pipeline
- **Game Renderer**: `AsciiRenderer` uses PixiJS v8 with WebGL2 for game grid
- **UI Layer**: React components overlay the game canvas
- **Font**: Dynamically generates CP437 bitmap font atlas at runtime
- **Grid**: 80×45 cells, 16px each
- **Layers**: Background tiles → items → actors → particles (PixiJS) + UI overlay (React)
- **Performance**: 60 FPS game rendering with smooth React UI animations

### Game Loop
The game uses an **energy-based turn system**:
- Each actor has `speed` (default 100) and accumulates energy each tick
- When energy >= 100, the actor can act (move/attack), consuming 100 energy
- Player input is only processed when the player has enough energy
- The game loop continuously processes ready actors in system order

### Key Architectural Decisions
1. **Hybrid Rendering**: PixiJS for game (performance) + React for UI (developer experience)
2. **Seeded RNG**: Deterministic gameplay using URL seed parameter (`?seed=12345`)
3. **Event-Driven Effects**: Combat/movement events trigger particles via event bus
4. **Memory System**: FOV system maintains "memory" of previously seen tiles with proper clearing on floor changes
5. **Component Storage**: Uses sparse arrays (`ComponentMap<T>`) for efficient access
6. **System Dependencies**: Systems can reference each other (e.g., RenderSystem uses FOVSystem)
7. **Performance Optimizations**:
   - A* pathfinding limited to 4 calculations per turn
   - Particles only spawn within view range
   - Static wall map for O(1) lighting checks
   - Selective screen clearing (game area only, not HUD)

## Project Structure
```
src/
  bridge/         # Game-UI communication
    GameStateBridge.ts # Singleton for ECS → React updates
  components/     # React components
    ui/           # UI components
      HealthBar.tsx      # Animated health display
      MessageLog.tsx     # Fading message system
      FloorIndicator.tsx # Floor counter
      GameOverModal.tsx  # Victory/defeat screen
      GameUI.tsx         # Main UI container
  ecs/            # Core ECS framework
    components.ts   # All component interfaces
    world.ts        # Entity/component management
    events.ts       # Event system and types
    systems/        # Game logic systems
  gfx/            # Rendering utilities
    renderer.ts     # PixiJS ASCII renderer
    particles.ts    # Particle effect system
  store/          # State management
    gameStore.ts    # Zustand store for UI state
  world/          # World generation
    mapGenerator.ts # BSP dungeon generation using rot-js
  ui/             # Legacy UI (being migrated)
    hud.ts          # Bridge to React components
  App.tsx         # React root component
  game.ts         # Main game class and loop
  main.tsx        # Entry point (React)
```

## Development Guidelines

### Adding New Components
1. Define interface in `src/ecs/components.ts`
2. Export from components module
3. Use in systems via `world.getComponent(entity, 'ComponentName')`

### Adding New Systems
1. Create in `src/ecs/systems/`
2. Extend base System class
3. Add to Game's system array in correct processing order
4. Subscribe to relevant events if needed

### Particle Effects
Defined in `FXSystem` with presets:
- `stepDust`: Movement particles (3 particles)
- `hitSpark`: Combat impact (8 particles, reduced from 12)
- `bloodPuff`: Damage effect (6 particles)
- `fireEmber`: Fire effect
- `poisonMote`: Poison effect
Particles only spawn within 12 tiles of player for performance.
Use `events.push({ type: 'Spawn<Effect>', ... })` to trigger

### Map Generation
Uses rot-js for:
- BSP room generation
- Corridor connections  
- FOV shadowcasting (with memory system)
- A* pathfinding (optimized with per-turn limits)
- Stairs placement for level progression
- Item spawn points

## Current Implementation Status
- ✅ Core gameplay loop with combat
- ✅ Procedural dungeon generation
- ✅ Enemy AI with optimized pathfinding
- ✅ Particle effects system
- ✅ FOV and lighting with memory system
- ✅ React UI layer with Zustand state management
- ✅ Multiple dungeon levels (10 floors)
- ✅ Items/inventory system with health potions
- ✅ Game over screen with victory/defeat states
- ✅ Performance optimizations for smooth gameplay
- ❌ Save/load functionality
- ❌ Status effects system
- ❌ More item types (weapons, armor)