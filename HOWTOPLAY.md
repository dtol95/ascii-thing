# How to Play ASCII Roguelike

## Quick Start
Welcome to the dungeon! You are **@** - a brave adventurer exploring procedurally generated dungeons filled with dangerous creatures. Your goal is to survive as long as possible and descend through the dungeon floors.

## Controls

### Movement & Basic Actions
| Key | Action | Description |
|-----|--------|-------------|
| **↑↓←→** or **WASD** | Move | Move your character in four directions |
| **Space** or **.** | Wait | Skip your turn (useful for letting enemies come to you) |
| **g** | Pick up | Pick up items at your location |
| **i** | Inventory | Open inventory modal (React UI) |
| **1-9** | Use Item | Use item from inventory (when modal is open) |
| **?** | Help | Show help modal with keybinds |
| **<** | Ascend | Go up stairs (when on stairs) |
| **>** | Descend | Go down stairs (when on stairs) |
| **Escape** | Close | Close any open modal |
| **f** | Fire | Fire ranged weapon (*coming soon*) |

### Tips for Movement
- **Diagonal movement** is not available - plan your path accordingly
- **Bump to attack** - Move into an enemy to perform a melee attack
- **Strategic waiting** - Sometimes it's better to let enemies come to you

## ASCII Symbol Reference

### Terrain
| Symbol | Color | Description |
|--------|-------|-------------|
| **#** | Gray | Wall - blocks movement and vision |
| **.** | Dark Gray | Floor - walkable terrain |
| **+** | Brown | Door - can be walked through |
| **>** | Yellow | Stairs down - stand on it and press **>** to descend |

### Entities
| Symbol | Color | Description |
|--------|-------|-------------|
| **@** | Yellow | You, the player character |
| **r** | Brown | Rat - weak but aggressive enemy |
| **!** | Red/Pink | Health Potion - restores HP when used |
| **)** | Various | Weapon (*coming soon*) |
| **[** | Various | Armor (*coming soon*) |

## Game Mechanics

### Turn-Based Combat
The game uses an **energy-based turn system**:
- Each actor accumulates energy based on their speed (default: 100)
- When energy reaches 100, the actor can take one action
- Actions consume 100 energy
- Faster creatures act more frequently

### Combat System
- **Melee Combat**: Move into an enemy to attack
- **Damage Calculation**: Damage = Random(damageMin, damageMax) - armor
- **Death**: When HP reaches 0, the entity dies
- **Player Death**: Game ends - press F5 to restart with a new dungeon
- **Healing**: Pick up potions with 'g' and use them with 'i' to restore HP

### Field of View (FOV)
- You can only see areas within your line of sight
- Walls block vision
- **Memory System**: Previously seen areas remain visible but dimmed
- Unexplored areas are completely dark

### Health & Status
- **Health Bar**: Displayed at top-left (current/max HP)
- **Message Log**: Bottom of screen shows recent events
- **Healing Items**: Health potions restore HP when used
- **Floor Transitions**: Gain 5 HP when descending stairs

## Strategy Tips

### Combat Strategy
1. **Positioning is key** - Use doorways and corridors to fight enemies one at a time
2. **Know when to retreat** - Running away is sometimes the best option
3. **Use walls** - Break line of sight to escape pursuing enemies
4. **Wait tactically** - Let enemies come to you in narrow passages

### Exploration Tips
1. **Clear rooms systematically** - Don't get surrounded
2. **Remember your path** - You might need to retreat quickly
3. **Check corners** - Enemies can lurk in blind spots
4. **Find stairs early** - Know your escape route

### Enemy Behavior
- **Rats** have two AI modes:
  - **Hunt** (70%): Actively pursue you when in range
  - **Wander** (30%): Move randomly until they spot you
- **Aggro Range**: Enemies detect you within 6 tiles
- **Pathfinding**: Enemies use A* pathfinding to chase you

## Seeded Runs
For consistent dungeons (speedrunning, sharing challenges):
- Add `?seed=NUMBER` to the URL
- Example: `http://localhost:3000?seed=12345`
- Same seed = same dungeon layout and enemy placement

## Particle Effects
The game features visual feedback through particle effects:
- **Step Dust**: Small particles when moving
- **Hit Sparks**: Yellow-white sparks on successful attacks
- **Blood**: Red particles when taking damage

## New Features

### React UI Modals
The game now features modern React-based UI overlays:
- **Inventory Modal**: Press 'i' to open, shows all items with descriptions
- **Help Modal**: Press '?' to view controls and coming soon features
- **Game Over Screen**: Enhanced with death context and statistics
- All modals use ASCII-style borders for thematic consistency

### Narrative System
The game now includes atmospheric text:
- **Environmental Messages**: Ambient descriptions that appear during exploration
- **Floor Themes**: Each level has unique atmosphere and descriptions
- **Dynamic Combat**: Varied combat messages based on damage dealt
- **Death Context**: Learn what killed you and receive helpful hints

### Responsive Design
- **Integer Scaling**: The game scales perfectly to any screen size
- **Letterboxing**: Maintains aspect ratio without stretching
- **Pixel-Perfect**: No blur or distortion at any size

## Current Limitations
As the game is in development, some features are not yet implemented:
- Limited item variety (only health potions)
- Single enemy type (rats only)
- No save/load functionality
- No ranged weapons or armor yet

## Tips for New Players
1. **Start cautiously** - Learn enemy patterns before engaging
2. **Use the message log** - It provides important combat information
3. **Count your hits** - Rats have 3 HP, you deal 2-4 damage
4. **Manage your HP** - Save potions for when you really need them
5. **Learn to kite** - Move away after attacking to avoid counterattacks
6. **Explore thoroughly** - Look for health potions before descending

## Advanced Techniques
- **Door Fighting**: Stand in a doorway to prevent being surrounded
- **Pillar Dancing**: Circle around a pillar to break line of sight
- **Energy Management**: Sometimes waiting gives you a double turn
- **Spawn Control**: Clear areas systematically to avoid surprises
- **Message Reading**: Pay attention to environmental messages for clues
- **Death Learning**: Use death hints to improve your strategy

## Keyboard Reference Card
```
Movement:     ↑ W
            ← A S D →
              ↓

Actions:
Space/. = Wait
g = Pick up items
i = Open inventory modal
1-9 = Use item (in inventory)
? = Show help modal
< = Go upstairs
> = Go downstairs
Escape = Close modals
f = Fire ranged (coming soon)

Meta:
F5 = Restart game
?seed=X = Set dungeon seed
```

## Troubleshooting
- **Can't move?** - You might be blocked by a wall or enemy
- **No damage dealt?** - Check the message log for combat details
- **Game frozen?** - The game waits for your input when it's your turn
- **Black screen?** - Try refreshing the page (F5)

## Coming Soon
Exciting features in development:
- **More Enemies**: Goblins, Orcs, Skeletons, Boss monsters
- **Equipment System**: Weapons and armor with stats
- **Magic**: Scrolls and spells
- **Status Effects**: Poison, burn, stun
- **Loot Drops**: Enemies drop items
- **Story Elements**: Uncover the dungeon's mysteries
- **Save System**: Continue your adventure later

---

*Happy dungeon crawling! May your @ survive the depths!*