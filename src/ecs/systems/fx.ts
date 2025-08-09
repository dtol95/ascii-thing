import { System } from '../system';
import type { World } from '../world';
import type { EventBus, GameEvent } from '../events';
import type { AsciiRenderer } from '../../gfx/renderer';
import type { Position } from '../components';

export class FXSystem extends System {
  constructor(
    world: World,
    events: EventBus,
    private renderer: AsciiRenderer
  ) {
    super(world, events);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.events.on('Moved', (event: GameEvent) => {
      if (event.type === 'Moved') {
        // Only spawn step dust occasionally for better visibility
        if (Math.random() < 0.3) {
          const position = this.world.getComponent<Position>(event.who, 'Position');
          if (position) {
            this.renderer.spawnParticles(position.x, position.y, 'stepDust');
          }
        }
      }
    });

    this.events.on('Attack', (event: GameEvent) => {
      if (event.type === 'Attack') {
        const targetPos = this.world.getComponent<Position>(event.target, 'Position');
        if (targetPos) {
          this.renderer.spawnParticles(targetPos.x, targetPos.y, 'hitSpark');
        }
      }
    });

    this.events.on('TookDamage', (event: GameEvent) => {
      if (event.type === 'TookDamage') {
        const position = this.world.getComponent<Position>(event.who, 'Position');
        if (position && event.amount > 2) {
          this.renderer.spawnParticles(position.x, position.y, 'bloodPuff');
        }
      }
    });

    this.events.on('Died', (event: GameEvent) => {
      if (event.type === 'Died') {
        const position = this.world.getComponent<Position>(event.who, 'Position');
        if (position) {
          this.renderer.spawnParticles(position.x, position.y, 'bloodPuff');
        }
      }
    });
  }

  update(_deltaTime: number): void {
    const particleCount = this.renderer.getParticleCount();
    if (particleCount > 400) {
      console.warn(`High particle count: ${particleCount}`);
    }
  }
}