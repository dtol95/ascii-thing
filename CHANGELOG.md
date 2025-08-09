# Changelog

## [2.0.0] - React UI Integration & Performance Optimizations

### Added
- **React UI Layer**: Modern UI components overlay the game canvas
  - Animated health bar with smooth color transitions
  - Fading message log with automatic cleanup
  - Floor indicator with special effects for final floor
  - Beautiful game over screen with victory/defeat animations
  - Keybind help hint
- **State Management**: Zustand store for predictable UI state updates
- **GameStateBridge**: Clean communication layer between ECS and React
- **Performance Monitoring**: Stats tracking for enemies killed and items collected

### Changed
- **Hybrid Architecture**: Game renders in PixiJS, UI renders in React
- **Build System**: Updated to support React with Vite plugin
- **Entry Point**: Changed from `main.ts` to `main.tsx`
- **HUD System**: Legacy render methods preserved but disabled in favor of React

### Optimized
- **A* Pathfinding**: 
  - Limited to 4 calculations per turn
  - Simple fallback movement when limit reached
  - Removed complex caching that added overhead
- **Particle System**:
  - Reduced hit sparks from 12 to 8 particles
  - Only spawn particles within 12 tiles of player
  - Distance culling for off-screen effects
- **Lighting System**:
  - Static wall map for O(1) lookups
  - Rebuilt only on level generation
- **Rendering**:
  - Selective screen clearing (game area only, not HUD)
  - Eliminated HUD flickering

### Fixed
- **Visibility Bug**: FOV memory now properly clears when changing floors
- **Item Count Bug**: Player inventory clears on floor transitions to prevent stale references
- **HUD Flickering**: Selective clearing prevents HUD redraw flicker
- **Performance Issues**: Removed problematic frame throttling that caused lag

### Technical Details
- TypeScript strict mode compliance
- Full type safety across React and game code
- Production build size: ~365KB gzipped
- Maintains 60 FPS with 20+ enemies on screen

## [1.1.0] - Multiple Floors & Items

### Added
- 10 dungeon levels with progression
- Health potion items (small and regular)
- Inventory system with 'i' key
- Item pickup with 'g' key
- Stairs system for floor transitions
- Floor indicator in HUD
- Victory condition (reach floor 10)
- Difficulty scaling per floor
- HP restoration on floor transitions (+5 HP)

### Changed
- Enemies spawn in greater numbers on deeper floors
- Enemy stats scale with floor depth
- Enemy aggression increases on deeper floors

## [1.0.0] - Initial Playable Release

### Core Features
- Entity-Component-System architecture
- Turn-based energy system
- ASCII rendering with PixiJS
- Procedural dungeon generation
- Field of view with memory
- Enemy AI with A* pathfinding
- Melee combat system
- Particle effects
- Health bar and message log
- Seeded random generation