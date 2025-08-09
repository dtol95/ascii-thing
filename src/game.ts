import { World } from './ecs/world';
import { EventBus } from './ecs/events';
import { AsciiRenderer } from './gfx/renderer';
import type { Entity, Actor, Position, RenderGlyph, Player, Health, Name, Brain, Melee, Inventory } from './ecs/components';
import { InputSystem } from './ecs/systems/input';
import { RenderSystem } from './ecs/systems/render';
import { MovementSystem } from './ecs/systems/movement';
import { EnergySystem } from './ecs/systems/energy';
import { FOVSystem } from './ecs/systems/fov';
import { LightingSystem } from './ecs/systems/lighting';
import { AISystem } from './ecs/systems/ai';
import { CombatSystem } from './ecs/systems/combat';
import { FXSystem } from './ecs/systems/fx';
import { ItemSystem } from './ecs/systems/item';
import { MapGenerator } from './world/mapGenerator';
import { HUD } from './ui/hud';
import { InventoryUI } from './ui/inventoryUI';
import { KeybindUI } from './ui/keybindUI';
import { RNG } from './rng';

export interface GameConfig {
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
}

export class Game {
  private world: World;
  private events: EventBus;
  private renderer: AsciiRenderer;
  private systems: any[] = [];
  private running = false;
  private playerEntity!: Entity;
  private energySystem: EnergySystem;
  private inputSystem: InputSystem;
  private renderSystem: RenderSystem;
  private movementSystem: MovementSystem;
  private fovSystem: FOVSystem;
  private lightingSystem: LightingSystem;
  private aiSystem: AISystem;
  private combatSystem: CombatSystem;
  private fxSystem: FXSystem;
  private itemSystem: ItemSystem;
  private hud!: HUD;
  private inventoryUI!: InventoryUI;
  private keybindUI!: KeybindUI;
  private waitingForInput = false;
  private stairsPosition?: [number, number];
  private currentFloor = 1;

  constructor(private config: GameConfig) {
    this.world = new World();
    this.events = new EventBus();
    this.renderer = new AsciiRenderer({
      gridWidth: config.gridWidth,
      gridHeight: config.gridHeight,
      cellSize: config.cellSize
    });

    this.energySystem = new EnergySystem(this.world, this.events);
    this.inputSystem = new InputSystem(this.world, this.events);
    this.movementSystem = new MovementSystem(this.world, this.events, config.gridWidth, config.gridHeight);
    this.combatSystem = new CombatSystem(this.world, this.events);
    this.aiSystem = new AISystem(this.world, this.events, config.gridWidth, config.gridHeight);
    this.fovSystem = new FOVSystem(this.world, this.events, config.gridWidth, config.gridHeight);
    this.lightingSystem = new LightingSystem(this.world, this.events, config.gridWidth, config.gridHeight);
    this.fxSystem = new FXSystem(this.world, this.events, this.renderer);
    this.itemSystem = new ItemSystem(this.world, this.events);
    this.renderSystem = new RenderSystem(this.world, this.events, this.renderer);
    
    this.aiSystem.setMovementSystem(this.movementSystem);
    this.renderSystem.setFOVSystem(this.fovSystem);
    this.renderSystem.setLightingSystem(this.lightingSystem);
    
    this.systems = [
      this.energySystem,
      this.inputSystem,
      this.aiSystem,
      this.movementSystem,
      this.combatSystem,
      this.itemSystem,
      this.fovSystem,
      this.lightingSystem,
      this.fxSystem,
      this.renderSystem
    ];
  }

  async init(container: HTMLElement): Promise<void> {
    await this.renderer.init(container);
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get('seed');
    const rng = RNG.getInstance(seed ? parseInt(seed) : undefined);
    console.log(`Game seed: ${rng.getSeed()}`);
    this.setupTestWorld();
    this.inputSystem.init();
  }

  private setupTestWorld(): void {
    // Create player on first run
    this.playerEntity = this.world.createEntity();
    this.world.addComponent<RenderGlyph>(this.playerEntity, 'RenderGlyph', { code: 64, fg: 0xffff00, z: 10 });
    this.world.addComponent<Actor>(this.playerEntity, 'Actor', { energy: 0, speed: 100 });
    this.world.addComponent<Player>(this.playerEntity, 'Player', { isPlayer: true });
    this.world.addComponent<Name>(this.playerEntity, 'Name', { name: 'Player' });
    this.world.addComponent<Health>(this.playerEntity, 'Health', { hp: 20, max: 20, armor: 0 });
    this.world.addComponent<Melee>(this.playerEntity, 'Melee', { damageMin: 2, damageMax: 4, type: 'phys' });
    this.world.addComponent<Inventory>(this.playerEntity, 'Inventory', { slots: [] });
    
    this.hud = new HUD(this.world, this.events, this.renderer, this.playerEntity, this.config.gridWidth, this.config.gridHeight);
    this.inventoryUI = new InventoryUI(this.world, this.renderer, this.config.gridWidth, this.config.gridHeight);
    this.keybindUI = new KeybindUI(this.renderer, this.config.gridWidth, this.config.gridHeight);
    
    this.generateLevel();
    
    this.hud.addMessage('Welcome to the dungeon!', 0xffff00);
    this.hud.addMessage('Use arrow keys or WASD to move.', 0xaaaaaa);
    this.hud.addMessage('Press "g" to pick up items, "i" for inventory.', 0xaaaaaa);
  }
  
  private generateLevel(): void {
    // Clear existing level entities (except player)
    const entitiesToRemove: Entity[] = [];
    for (const entity of this.world.getAllEntities()) {
      if (!this.world.hasComponent(entity, 'Player')) {
        entitiesToRemove.push(entity);
      }
    }
    for (const entity of entitiesToRemove) {
      this.world.destroyEntity(entity);
    }
    
    // Generate new map
    const mapGen = new MapGenerator(this.config.gridWidth, this.config.gridHeight, this.world);
    const { playerStart, stairsDown, itemPositions } = mapGen.generateDungeon();
    
    // Store stairs position for later use
    this.stairsPosition = stairsDown;
    
    // Position player
    const playerPos = this.world.getComponent<Position>(this.playerEntity, 'Position');
    if (playerPos) {
      playerPos.x = playerStart[0];
      playerPos.y = playerStart[1];
    } else {
      this.world.addComponent<Position>(this.playerEntity, 'Position', { x: playerStart[0], y: playerStart[1] });
    }
    
    // Reset player energy for new floor
    const playerActor = this.world.getComponent<Actor>(this.playerEntity, 'Actor');
    if (playerActor) {
      playerActor.energy = 0;
    }
    
    // Spawn enemies (more on deeper floors)
    this.spawnEnemies();
    
    // Spawn items
    const rng = RNG.getInstance();
    for (const [x, y] of itemPositions) {
      const itemType = rng.chance(0.7) ? 'smallHealthPotion' : 'healthPotion';
      this.itemSystem.spawnItem(x, y, itemType);
    }
    
    this.fovSystem.markDirty();
    this.lightingSystem.markDirty();
    
    this.hud.setFloor(this.currentFloor);
    this.hud.addMessage(`Floor ${this.currentFloor} - ${this.getFloorDescription()}`, 0xffff00);
  }
  
  private getFloorDescription(): string {
    if (this.currentFloor === 1) return "The entrance";
    if (this.currentFloor <= 3) return "Upper levels";
    if (this.currentFloor <= 6) return "The depths";
    if (this.currentFloor <= 9) return "Deep caverns";
    if (this.currentFloor === 10) return "The final floor!";
    return "Unknown depths";
  }
  
  private spawnEnemies(): void {
    const rng = RNG.getInstance();
    // More enemies on deeper floors
    const baseEnemies = 5 + Math.floor(this.currentFloor * 0.5);
    const numEnemies = rng.randomInt(baseEnemies, baseEnemies + 5);
    
    for (let i = 0; i < numEnemies; i++) {
      const pos = this.findRandomWalkablePosition();
      if (!pos) continue;
      
      const enemy = this.world.createEntity();
      this.world.addComponent<Position>(enemy, 'Position', { x: pos[0], y: pos[1] });
      
      // Stronger enemies on deeper floors
      const hp = 3 + Math.floor(this.currentFloor / 3);
      const damageMin = 1 + Math.floor(this.currentFloor / 4);
      const damageMax = 2 + Math.floor(this.currentFloor / 3);
      
      this.world.addComponent<RenderGlyph>(enemy, 'RenderGlyph', { code: 114, fg: 0xcc8855, z: 10 }); // Brighter brown for visibility
      this.world.addComponent<Actor>(enemy, 'Actor', { energy: 0, speed: 100 });
      this.world.addComponent<Name>(enemy, 'Name', { name: 'Rat' });
      this.world.addComponent<Health>(enemy, 'Health', { hp, max: hp, armor: 0 });
      this.world.addComponent<Melee>(enemy, 'Melee', { damageMin, damageMax, type: 'phys' });
      this.world.addComponent<Brain>(enemy, 'Brain', { 
        kind: rng.chance(0.7 + this.currentFloor * 0.02) ? 'hunt' : 'wander', // More aggressive on deeper floors
        params: { aggroRange: 6 + Math.floor(this.currentFloor / 5) }
      });
    }
  }
  
  private findRandomWalkablePosition(): [number, number] | null {
    const rng = RNG.getInstance();
    const maxAttempts = 100;
    
    for (let i = 0; i < maxAttempts; i++) {
      const x = rng.randomInt(0, this.config.gridWidth - 1);
      const y = rng.randomInt(0, this.config.gridHeight - 1);
      
      if (this.movementSystem.canMoveTo(x, y)) {
        return [x, y];
      }
    }
    
    return null;
  }

  start(): void {
    this.running = true;
    this.gameLoop();
  }

  stop(): void {
    this.running = false;
  }

  private gameLoop = (): void => {
    if (!this.running) return;

    // Handle keybind UI
    if (this.keybindUI.isVisible()) {
      this.keybindUI.render();
      
      if (!this.waitingForInput) {
        this.waitingForInput = true;
        this.inputSystem.waitForInput().then(intent => {
          if (intent.type === 'action' && (intent.action === 'help' || intent.action === 'escape')) {
            this.keybindUI.hide();
          }
          this.waitingForInput = false;
          requestAnimationFrame(this.gameLoop);
        });
        return;
      }
      requestAnimationFrame(this.gameLoop);
      return;
    }

    // Handle inventory UI
    if (this.inventoryUI.isVisible()) {
      this.inventoryUI.render(this.playerEntity);
      
      if (!this.waitingForInput) {
        this.waitingForInput = true;
        this.inputSystem.waitForInput().then(intent => {
          if (intent.type === 'action' && (intent.action === 'inventory' || intent.action === 'escape')) {
            this.inventoryUI.hide();
          } else if (intent.type === 'action' && intent.action === 'useItem' && intent.itemIndex !== undefined) {
            // Use item from inventory
            const inventory = this.world.getComponent<Inventory>(this.playerEntity, 'Inventory');
            if (inventory && intent.itemIndex < inventory.slots.length) {
              const item = inventory.slots[intent.itemIndex];
              if (this.itemSystem.useItem(item, this.playerEntity)) {
                inventory.slots.splice(intent.itemIndex, 1);
              }
            }
            this.inventoryUI.hide();
          }
          this.waitingForInput = false;
          requestAnimationFrame(this.gameLoop);
        });
        return;
      }
      requestAnimationFrame(this.gameLoop);
      return;
    }

    const readyActor = this.energySystem.getReadyActor();
    
    if (readyActor) {
      const isPlayer = this.world.hasComponent(readyActor, 'Player');
      
      if (isPlayer) {
        if (!this.waitingForInput) {
          this.waitingForInput = true;
          this.inputSystem.waitForInput().then(intent => {
            this.processIntent(readyActor, intent);
            this.waitingForInput = false;
            requestAnimationFrame(this.gameLoop);
          });
          return;
        }
      } else {
        const intent = this.aiSystem.getIntent(readyActor);
        this.processIntent(readyActor, intent);
      }
    } else {
      this.energySystem.update(0);
    }

    for (const system of this.systems) {
      if (system !== this.energySystem) {
        system.update(0);
      }
    }

    if (this.hud) {
      this.hud.update(0);
      this.hud.render();
    }

    requestAnimationFrame(this.gameLoop);
  };

  private processIntent(entity: Entity, intent: any): void {
    if (intent.type === 'action' && intent.action === 'pickup') {
      // Handle item pickup
      const position = this.world.getComponent<Position>(entity, 'Position');
      if (position) {
        const item = this.itemSystem.getItemAt(position.x, position.y);
        if (item) {
          const inventory = this.world.getComponent<Inventory>(entity, 'Inventory');
          const itemName = this.world.getComponent<Name>(item, 'Name');
          if (inventory) {
            inventory.slots.push(item);
            // Remove item from world position
            this.world.removeComponent(item, 'Position');
            this.hud.addMessage(`Picked up ${itemName?.name || 'item'}!`, 0x00ffff);
          }
        } else {
          this.hud.addMessage('There is nothing here to pick up.', 0xff0000);
        }
      }
    } else if (intent.type === 'action' && intent.action === 'inventory') {
      // Open inventory UI
      this.inventoryUI.show();
      // Don't consume energy for opening inventory
      return;
    } else if (intent.type === 'action' && intent.action === 'help') {
      // Open keybind UI
      this.keybindUI.show();
      // Don't consume energy for opening help
      return;
    } else if (intent.type === 'action' && intent.action === 'descend') {
      // Check if player is on stairs
      const position = this.world.getComponent<Position>(entity, 'Position');
      if (position && this.stairsPosition && 
          position.x === this.stairsPosition[0] && 
          position.y === this.stairsPosition[1]) {
        
        if (this.currentFloor >= 10) {
          // Win condition!
          this.hud.addMessage('Congratulations! You have conquered the dungeon!', 0xffff00);
          this.hud.addMessage('You win! Press F5 to play again.', 0x00ff00);
          this.stop();
        } else {
          this.currentFloor++;
          this.hud.addMessage('You descend deeper into the dungeon...', 0x00ff00);
          this.generateLevel();
          
          // Heal player slightly on level transition as a reward
          const health = this.world.getComponent<Health>(this.playerEntity, 'Health');
          if (health) {
            const healAmount = Math.min(5, health.max - health.hp);
            if (healAmount > 0) {
              health.hp += healAmount;
              this.hud.addMessage(`You feel slightly refreshed (+${healAmount} HP).`, 0x00ff00);
            }
          }
        }
      } else {
        this.hud.addMessage('There are no stairs here.', 0xff0000);
      }
    } else if (intent.type === 'move') {
      const position = this.world.getComponent<Position>(entity, 'Position');
      if (position && intent.dx !== undefined && intent.dy !== undefined) {
        const targetEntity = this.combatSystem.getEntityAt(position.x + intent.dx, position.y + intent.dy);
        
        if (targetEntity && targetEntity !== entity) {
          const isPlayer = this.world.hasComponent(entity, 'Player');
          const targetIsPlayer = this.world.hasComponent(targetEntity, 'Player');
          
          if ((isPlayer && !targetIsPlayer) || (!isPlayer && targetIsPlayer)) {
            this.combatSystem.attack(entity, targetEntity);
          }
        } else {
          const moved = this.movementSystem.move(entity, intent.dx, intent.dy);
          if (moved && this.world.hasComponent(entity, 'Player')) {
            this.fovSystem.markDirty();
          }
        }
      }
    } else if (intent.type === 'attack' && intent.target) {
      this.combatSystem.attack(entity, intent.target);
    }
    
    const actor = this.world.getComponent<Actor>(entity, 'Actor');
    if (actor) {
      actor.energy -= 100;
    }
    
    const playerHealth = this.world.getComponent<Health>(this.playerEntity, 'Health');
    if (playerHealth && playerHealth.hp <= 0) {
      this.events.push({ type: 'Message', text: 'You have died! Press F5 to restart.', color: 0xff0000 });
      this.stop();
    }
  }
}