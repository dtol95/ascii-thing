import type { World } from '../ecs/world';
import type { EventBus, GameEvent } from '../ecs/events';
import type { AsciiRenderer } from '../gfx/renderer';
import type { Entity, Health, Name } from '../ecs/components';
import { gameStateBridge } from '../bridge/GameStateBridge';

export interface Message {
  text: string;
  color: number;
  time: number;
}

export class HUD {
  private messages: Message[] = [];
  private maxMessages = 4;
  private messageFadeTime = 5000;
  private currentFloor = 1;
  
  constructor(
    private world: World,
    private events: EventBus,
    private renderer: AsciiRenderer,
    private playerEntity: Entity,
    private gridWidth: number,
    private gridHeight: number
  ) {
    this.setupEventListeners();
  }
  
  setFloor(floor: number): void {
    this.currentFloor = floor;
    gameStateBridge.updateFloor(floor);
  }

  private setupEventListeners(): void {
    this.events.on('Message', (event: GameEvent) => {
      if (event.type === 'Message') {
        this.addMessage(event.text, event.color || 0xffffff);
      }
    });

    this.events.on('TookDamage', (event: GameEvent) => {
      if (event.type === 'TookDamage') {
        const name = this.world.getComponent<Name>(event.who, 'Name')?.name || 'Something';
        const color = event.who === this.playerEntity ? 0xff0000 : 0xffaa00;
        this.addMessage(`${name} takes ${event.amount} damage!`, color);
      }
    });

    this.events.on('Died', (event: GameEvent) => {
      if (event.type === 'Died') {
        const name = this.world.getComponent<Name>(event.who, 'Name')?.name || 'Something';
        const color = event.who === this.playerEntity ? 0xff0000 : 0x00ff00;
        this.addMessage(`${name} dies!`, color);
        
        // Track enemy deaths for stats
        if (event.who !== this.playerEntity) {
          gameStateBridge.incrementEnemiesKilled();
        }
      }
    });
  }

  addMessage(text: string, color: number = 0xffffff): void {
    this.messages.push({ text, color, time: Date.now() });
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
    // Send to React UI
    gameStateBridge.addMessage(text, color);
  }

  update(_deltaTime: number): void {
    const now = Date.now();
    this.messages = this.messages.filter(msg => now - msg.time < this.messageFadeTime);
  }

  render(): void {
    // Update React state with current health
    const health = this.world.getComponent<Health>(this.playerEntity, 'Health');
    if (health) {
      gameStateBridge.updateHealth(health.hp, health.max, health.armor);
    }
    
    // Rendering is now handled by React components
    // Keeping old render methods commented for reference if needed
    // this.renderHealthBar();
    // this.renderMessages();
    // this.renderFloorInfo();
    // this.renderKeybindHint();
  }

  // Legacy rendering methods - preserved for reference but not used with React UI
  // @ts-ignore - Preserved for reference
  private renderHealthBar(): void {
    const health = this.world.getComponent<Health>(this.playerEntity, 'Health');
    if (!health) return;

    const barLength = 20;
    const healthPercent = health.hp / health.max;
    const filledBars = Math.floor(barLength * healthPercent);
    
    this.renderer.writeString(1, 1, 'HP: ', 0xffffff);
    
    for (let i = 0; i < barLength; i++) {
      const x = 5 + i;
      if (i < filledBars) {
        this.renderer.putGlyph(x, 1, 219, healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffff00 : 0xff0000);
      } else {
        this.renderer.putGlyph(x, 1, 176, 0x404040);
      }
    }
    
    const healthText = `${health.hp}/${health.max}`;
    this.renderer.writeString(26, 1, healthText, 0xffffff);
    
    if (health.armor > 0) {
      this.renderer.writeString(35, 1, `ARM: ${health.armor}`, 0xaaaaaa);
    }
  }

  // @ts-ignore - Preserved for reference
  private renderMessages(): void {
    const startY = this.gridHeight - this.maxMessages - 2;
    const now = Date.now();
    
    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      const age = (now - msg.time) / this.messageFadeTime;
      const opacity = Math.max(0.3, 1 - age * 0.7);
      const color = this.fadeColor(msg.color, opacity);
      
      this.renderer.writeString(1, startY + i, msg.text, color);
    }
  }

  // @ts-ignore - Preserved for reference
  private renderFloorInfo(): void {
    const floorText = `Floor: ${this.currentFloor}`;
    const color = this.currentFloor === 10 ? 0xff00ff : 0xffff00; // Special color for final floor
    this.renderer.writeString(this.gridWidth - 10, 1, floorText, color);
  }

  // @ts-ignore - Preserved for reference
  private renderKeybindHint(): void {
    const helpText = "[?] Help";
    this.renderer.writeString(this.gridWidth - helpText.length - 1, this.gridHeight - 2, helpText, 0x00ffff);
  }

  private fadeColor(color: number, opacity: number): number {
    const r = Math.floor(((color >> 16) & 0xff) * opacity);
    const g = Math.floor(((color >> 8) & 0xff) * opacity);
    const b = Math.floor((color & 0xff) * opacity);
    return (r << 16) | (g << 8) | b;
  }
}