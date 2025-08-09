# Project Overview

A browser-based, turn-based roguelike rendered with ASCII glyphs while leveraging modern GPU-accelerated effects (particles, bloom-like glows, subtle CRT, vignette). The aesthetic stays faithful to grid-locked ASCII readability, with tasteful VFX that never hinder clarity.

---

# Goals & Non-Goals

**Goals**

- Tight, readable ASCII presentation with smooth feel via particles and micro-animations.
- Deterministic, turn-based simulation with clear logs and replayability.
- Modular ECS so content/features iterate without code rot.
- Runs on mid/low-end laptops at 60 FPS with effects toggles.

**Non-Goals (v1)**

- No real-time combat; no animation that delays input more than \~150 ms.
- No complex story scripting system; focus on run-based loops.
- No heavy networking; v1 is single-player local.

---

# Tech Stack

- **Runtime/Rendering:** PixiJS v8 (WebGL2), @pixi/particle-emitter for VFX.
- **Roguelike utilities:** rot-js (FOV, dungeon gen, pathfinding) or custom equivalents.
- **Language/Build:** TypeScript + Vite for the main dev build; single-file ESM demo for quick tests.
- **Data:** JSON for content (items, enemies, biomes). LocalStorage/IndexedDB for saves.

---

# Architecture

## Entity-Component-System (ECS)

- **Entity:** integer id.

- **Components (data-only):**

  - Position(x\:int, y\:int)
  - RenderGlyph(code\:int, fg\:uint24, bg\:uint24?, z\:int)
  - Blocks(bool)
  - Transparent(bool)
  - Light(radius\:int, intensity\:float, color\:uint24)
  - Faction(kind:"player"|"mob"|"neutral")
  - Actor(energy\:int, speed\:int)
  - Health(hp\:int, max\:int, armor\:int)
  - Inventory(slots\:ItemId)
  - Melee(damageMin\:int, damageMax\:int, type:"phys"|"fire"|...)
  - Ranged(range\:int, projectile\:PrefabId)
  - Status(list: StatusEffect[])
  - Brain(kind:"wander"|"hunt"|"flee"|"boss", params\:object)
  - ParticleEmitter(preset\:string, on:"move|hit|death|loop")
  - Lifetime(turns\:int) // for temp actors, projectiles, decals

- **Systems (pure logic in fixed order per turn):**

  1. InputIntent (player only when in control)
  2. Energy/Turn (actors gain energy; process ready actors)
  3. AI (decide intents for mobs)
  4. Movement/Collision
  5. Combat/Resolution (melee, ranged, on-hit effects)
  6. Status/Timers (poison, burn, slow, stun)
  7. FOV/Lighting (shadow-casting + light propagation)
  8. MapEvents/Spawns (doors, traps, pickups, stairs)
  9. FX Dispatch (enqueue particles, screen shake, numbers)
  10. Render (read-only over component state)

- **Message/Event Bus:**

  - Events: `Moved`, `TookDamage`, `Healed`, `Died`, `PickedItem`, `Descend`, `ProjectileHit`, `ApplyStatus`.
  - FX system subscribes to events to spawn particles and floats; logging subscribes for the message log.

---

# Rendering Pipeline

- **Grid:** fixed columns×rows, e.g., 80×45, cell size 16 px.
- **Glyphs:** Prefer a bitmap glyph atlas (code page 437 or custom). Each cell is a Pixi `Sprite` with tint; backgrounds optionally as a second quad layer.
- **Layers (z-order):**
  - `bg` (floor/terrain), `items`, `actors`, `ui-floats`, `fx`.
- **Post-processing (optional toggles):** very subtle CRT (scanlines), vignette, light bloom (fake via additive particles), color grading.
- **Accessibility:** high-contrast palette; font scaling (12/14/16/18 px); `prefers-reduced-motion` disables particles and post.

**Tile Write API**

```ts
putGlyph(x:number, y:number, code:number, fg:number, bg?:number)
writeString(x:number, y:number, text:string, fg:number)
```

---

# Camera & UI

- **Camera:** static for v1 (whole map); optional camera pan for larger maps.
- **HUD:** top-left: HP/Armor/Status; top-right: depth/floor; bottom: message log (last 4 lines) with fade.
- **Input:** Arrow/WASD to move, `.` wait, `g` pick up, `i` inventory, `<`/`>` stairs, `f` fire.

---

# Game Loop (Turn-Based with Energy)

- Each actor has `speed` (default 100). Each turn tick, add energy = 100.
- When actor.energy >= 100: they act once (move/attack/use), then energy -= 100.
- Player input only when player is the ready actor.

**Pseudo**

```ts
while (running) {
  if (player.isReady()) {
    const intent = readPlayerInput();
    queueIntent(player, intent);
  }
  processReadyActors(); // AI decide intents, resolve
  resolveIntentsOrdered();
  applyStatuses();
  recomputeFOVAndLightsIfDirty();
  dispatchFXFromEvents();
  renderFrame(delta);
}
```

---

# Field of View & Lighting

- **FOV:** roguelike shadow-casting from `rot-js` (or precise permissive), radius from torch/light.
- **Memory:** unseen tiles retain last seen glyph tinted to memory color.
- **Dynamic Lights:** torches (flicker), fire tiles, spells. Per-tile light = max of contributions; tint glyph by light.

---

# VFX & Particles

**Principles**

- Always snap spawns to half-cell or sub-cell; particles are small squares/plus signs to keep ASCII feel.
- Strict palette; avoid rainbow noise.

**Presets**

- `stepDust`: brief burst on movement; warm gray, 10–14 particles, 0.25–0.45 s.
- `hitSpark`: yellow-white sparks, 80–140 speed, 0.15 s; add 80–120 ms hit-stop.
- `bloodPuff`: dark red motes, low gravity, tiny splash decal (ASCII `,` or `'`).
- `fireEmber`: slow orange motes with occasional upward drift.
- `poisonMote`: greenish, sinusoidal drift, low alpha.
- `portal`: purple additive swirl with radial scale.

**Floating Text**

- BitmapText numbers with slight upward drift and 250–350 ms fade.

---

# World Generation

**Map Types** (v1 pick one; keep hooks for more)

- `DUNGEON_ROOMS`: BSP rooms + corridors (rot-js `Digger`).
- `CAVES`: cellular automata with smoothing.
- `RUINS`: hand-authored room templates with random props.

**Placement Pipeline**

1. Generate walkable grid, mark `Blocks`/`Transparent` per cell.
2. Place stairs up/down; guarantee connectivity.
3. Scatter props (doors, braziers, barrels) based on biome table.
4. Spawn enemies via depth budget (see balance below).
5. Place items (weapons, potions, scrolls) via weighted tables.

---

# Data & Content

## Data Files (JSON)

- `items.json`, `enemies.json`, `biomes.json`, `lootTables.json`.
- Version each file `version: number`. Validate on load.

**Item Schema**

```json
{
  "id": "short_sword",
  "name": "Short Sword",
  "slot": "hand",
  "glyph": { "code": 47, "fg": "#e0e0e0" },
  "mods": { "damageMin": 2, "damageMax": 4 },
  "tags": ["weapon", "melee"]
}
```

**Enemy Schema**

```json
{
  "id": "rat",
  "name": "Cave Rat",
  "glyph": { "code": 114, "fg": "#bba46a" },
  "hp": 3,
  "armor": 0,
  "speed": 100,
  "ai": { "kind": "hunt", "aggroRange": 6 },
  "attacks": [{ "type": "melee", "damage": [1,2] }],
  "xp": 1
}
```

---

# Combat & Status

**Melee**

- If target adjacent: roll damage in range, apply armor reduction, spawn `hitSpark` + float number.

**Ranged**

- Line-of-sight check via FOV; projectile entity with `Lifetime` and `Velocity` moves per tick until hit.

**Damage Types**

- `phys`, `fire`, `cold`, `poison`, `arcane`.

**Status Effects**

- `burn`: dps per turn, emits `fireEmber`.
- `poison`: dps, reduces regen; green motes.
- `slow`: halves energy gain.
- `stun`: skip next N actions.

---

# Items & Inventory (MVP)

- Slots: head, chest, hands(2), ring(2), pack.
- Potions: heal, strength, clarity (cures poison), speed.
- Scrolls: identify, teleport, fireburst.
- Weights optional in v1; keep carry limit simple (slots + 10 pack items).

---

# Save/Load

- **Snapshot** world state (RNG seed, floor, entities, components) into JSON; compress optional.
- Store in LocalStorage or IndexedDB. Provide three manual save slots + autosave on floor change.

---

# Performance Targets

- 80×45 grid at 60 FPS on iGPU.
- Max \~400 active particles; adapt using `matchMedia('(prefers-reduced-motion)')`.
- Pre-allocate tile sprites and reuse textures; avoid per-frame text layout (use bitmap glyphs).

**Hot Paths**

- Tile rendering: O(w\*h) swap-only; no node churn.
- FOV recompute only when player moved or doors toggled.
- Event queue is array-backed; reuse objects.

---

# Testing & Telemetry

- Seeded runs (`seed` in URL param) to reproduce bugs.
- Determinism checks: same seed + inputs produce identical logs.
- In dev, toggle overlays: collision, FOV, light heatmap, entity ids.

---

# Project Layout (TS + Vite)

```
/src
  /ecs
    components.ts
    world.ts
    systems/
      input.ts
      energy.ts
      ai.ts
      move.ts
      combat.ts
      status.ts
      fov.ts
      lighting.ts
      fx.ts
      render.ts
  /content
    items.json
    enemies.json
    biomes.json
  /gfx
    glyphs.png
    glyphs.json (spritesheet frames g_32..g_255)
  main.ts
  app.ts (boot, Pixi init)
  assets.ts (loaders)
  rng.ts
```

---

# Key Interfaces (TypeScript)

```ts
// ECS basics
export type Entity = number;
export interface ComponentMap<T> { [id: number]: T | undefined }

export interface Position { x:number; y:number }
export interface RenderGlyph { code:number; fg:number; bg?:number; z:number }
export interface Actor { energy:number; speed:number }
export interface Health { hp:number; max:number; armor:number }
export interface Brain { kind:"wander"|"hunt"|"flee"|"boss"; params:any }

// Events
type Event =
  | { type:"Moved"; who:Entity; from:[number,number]; to:[number,number] }
  | { type:"TookDamage"; who:Entity; amount:number; kind:string }
  | { type:"Died"; who:Entity }
  | { type:"ProjectileHit"; who:Entity; target:Entity; amount:number }
  | { type:"ApplyStatus"; who:Entity; effect:string; turns:number };

export interface EventBus { push(e:Event):void; drain():Event[] }

// Renderer contract
export interface Renderer {
  init(canvas:HTMLCanvasElement):Promise<void>;
  put(x:number,y:number,code:number,fg:number,bg?:number):void;
  beginFrame():void; endFrame():void;
  floatText(x:number,y:number,text:string,color:number):void;
}
```

---

# Implementation Notes

- Use a **bitmap glyph atlas** early. `PIXI.BitmapText` or manual sprites; avoid `PIXI.Text` for 80×45 grids.
- Maintain a `dirty` set of tiles to minimize redraw when only a few cells change.
- Keep RNG centralized (e.g., `Mulberry32(seed)`), pass to systems; do not call `Math.random` directly.
- Screen shake: tiny camera offset (±1 px) for 60–120 ms on big hits.

---

# MVP Scope (2–3 weeks)

1. **Week 1**: ECS scaffolding, renderer with bitmap glyphs, input + energy loop, FOV/lighting, basic dungeon gen, player + rat.
2. **Week 2**: Combat, items (potions), particles (step dust, hit spark), floating numbers, save/load.
3. **Week 3**: Balance passes, accessibility toggles, seed/debug overlays, polish.

---

# Stretch Goals

- Elemental interactions (ignite oil, freeze water, conduct lightning).
- Boss floors with telegraphed attacks using ASCII shapes.
- Meta-progression: unlockable classes or run modifiers.
- Daily seed leaderboard.

---

# Acceptance Criteria (MVP)

- Player can complete 3 floors and win; death returns to title.
- 5 enemy types, 6 items, 4 statuses implemented.
- 60 FPS on integrated graphics with particles ON.
- All actions are logged; seeded runs are deterministic.

---

# References (general)

- rot.js for FOV and dungeon generation.
- CP437 palettes and ASCII roguelike conventions.

---

# Next Steps

- Confirm final grid size and font.
- Decide between rot-js vs custom map gen.
- Lock palette and glyph atlas design.
- Start with the Week 1 milestones above.

