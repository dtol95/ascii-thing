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
```

### TypeScript
The project uses TypeScript with strict mode enabled. The TypeScript compiler is configured via `tsconfig.json` with:
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- No unused locals/parameters warnings

Note: There are no linting or formatting commands configured. TypeScript compilation happens through Vite during `npm run build`.

## Architecture

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
- **Renderer**: `AsciiRenderer` uses PixiJS v8 with WebGL2
- **Font**: Dynamically generates CP437 bitmap font atlas at runtime
- **Grid**: 80×45 cells, 16px each
- **Layers**: Background tiles → items → actors → UI → particles
- **Performance**: Targets 60 FPS on integrated graphics

### Game Loop
The game uses an **energy-based turn system**:
- Each actor has `speed` (default 100) and accumulates energy each tick
- When energy >= 100, the actor can act (move/attack), consuming 100 energy
- Player input is only processed when the player has enough energy
- The game loop continuously processes ready actors in system order

### Key Architectural Decisions
1. **Seeded RNG**: Deterministic gameplay using URL seed parameter (`?seed=12345`)
2. **Event-Driven Effects**: Combat/movement events trigger particles via event bus
3. **Memory System**: FOV system maintains "memory" of previously seen tiles
4. **Component Storage**: Uses sparse arrays (`ComponentMap<T>`) for efficient access
5. **System Dependencies**: Systems can reference each other (e.g., RenderSystem uses FOVSystem)

## Project Structure
```
src/
  ecs/           # Core ECS framework
    components.ts  # All component interfaces
    world.ts      # Entity/component management
    events.ts     # Event system and types
    systems/      # Game logic systems
  gfx/           # Rendering utilities
    renderer.ts   # PixiJS ASCII renderer
    particles.ts  # Particle effect system
  world/         # World generation
    mapGenerator.ts # BSP dungeon generation using rot-js
  ui/            # User interface
    hud.ts       # Health bar, message log
  game.ts        # Main game class and loop
  main.ts        # Entry point
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
- `stepDust`: Movement particles
- `hitSpark`: Combat impact
- `bloodPuff`: Damage effect
Use `events.push({ type: 'Spawn<Effect>', ... })` to trigger

### Map Generation
Uses rot-js for:
- BSP room generation
- Corridor connections  
- FOV shadowcasting
- A* pathfinding

## Current Implementation Status
- ✅ Core gameplay loop with combat
- ✅ Procedural dungeon generation
- ✅ Enemy AI with pathfinding
- ✅ Particle effects system
- ✅ FOV and lighting
- ❌ Items/inventory (components exist, systems not implemented)
- ❌ Save/load functionality
- ❌ Multiple dungeon levels
- ❌ Status effects system