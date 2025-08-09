import { System } from '../system';
import type { Entity, Position } from '../components';
import type { World } from '../world';
import type { EventBus } from '../events';

export class MovementSystem extends System {
  constructor(
    world: World,
    events: EventBus,
    private mapWidth: number,
    private mapHeight: number
  ) {
    super(world, events);
  }

  update(_deltaTime: number): void {
  }

  move(entity: Entity, dx: number, dy: number): boolean {
    const position = this.world.getComponent<Position>(entity, 'Position');
    if (!position) return false;

    const newX = position.x + dx;
    const newY = position.y + dy;

    if (!this.canMoveTo(newX, newY)) {
      return false;
    }

    const oldPos: [number, number] = [position.x, position.y];
    position.x = newX;
    position.y = newY;

    this.events.push({
      type: 'Moved',
      who: entity,
      from: oldPos,
      to: [newX, newY]
    });

    return true;
  }

  canMoveTo(x: number, y: number): boolean {
    if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
      return false;
    }

    const entitiesAtPosition = this.world.getEntitiesWithComponents('Position');
    for (const entity of entitiesAtPosition) {
      const pos = this.world.getComponent<Position>(entity, 'Position')!;
      if (pos.x === x && pos.y === y) {
        const blocks = this.world.getComponent(entity, 'Blocks');
        if (blocks) {
          return false;
        }
      }
    }

    return true;
  }
}