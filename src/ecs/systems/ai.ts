import { System } from '../system';
import type { Entity, Position, Brain, Actor, Health } from '../components';
import type { World } from '../world';
import type { EventBus } from '../events';
import type { MovementSystem } from './movement';
import * as ROT from 'rot-js';

export interface AIIntent {
  type: 'move' | 'attack' | 'wait';
  dx?: number;
  dy?: number;
  target?: Entity;
}

export class AISystem extends System {
  private movementSystem?: MovementSystem;
  
  constructor(
    world: World,
    events: EventBus,
    _mapWidth: number,
    _mapHeight: number
  ) {
    super(world, events);
  }

  setMovementSystem(movementSystem: MovementSystem): void {
    this.movementSystem = movementSystem;
  }

  update(_deltaTime: number): void {
  }

  getIntent(entity: Entity): AIIntent {
    const brain = this.world.getComponent<Brain>(entity, 'Brain');
    if (!brain) {
      return { type: 'wait' };
    }

    const position = this.world.getComponent<Position>(entity, 'Position');
    if (!position) {
      return { type: 'wait' };
    }

    // Check if actor has enough energy to act
    const actor = this.world.getComponent<Actor>(entity, 'Actor');
    if (actor && actor.energy < 100) {
      return { type: 'wait' };
    }

    switch (brain.kind) {
      case 'wander':
        return this.wanderBehavior(entity, position);
      case 'hunt':
        return this.huntBehavior(entity, position, brain.params);
      case 'flee':
        return this.fleeBehavior(entity, position, brain.params);
      default:
        return { type: 'wait' };
    }
  }

  private wanderBehavior(_entity: Entity, position: Position): AIIntent {
    if (Math.random() < 0.5) {
      return { type: 'wait' };
    }

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];

    const validDirs = directions.filter(dir => 
      this.movementSystem?.canMoveTo(position.x + dir.dx, position.y + dir.dy)
    );

    if (validDirs.length === 0) {
      return { type: 'wait' };
    }

    const dir = validDirs[Math.floor(Math.random() * validDirs.length)];
    return { type: 'move', dx: dir.dx, dy: dir.dy };
  }

  private huntBehavior(entity: Entity, position: Position, params: any): AIIntent {
    const player = this.world.getEntitiesWithComponents('Player', 'Position')[0];
    if (!player) {
      return this.wanderBehavior(entity, position);
    }

    // Check own health - flee if low
    const health = this.world.getComponent<Health>(entity, 'Health');
    if (health && health.hp < health.max * 0.3) {
      // Switch to flee behavior when low on health
      return this.fleeBehavior(entity, position, params);
    }

    const playerPos = this.world.getComponent<Position>(player, 'Position')!;
    const distance = Math.abs(position.x - playerPos.x) + Math.abs(position.y - playerPos.y);
    
    const aggroRange = params?.aggroRange ?? 6;
    if (distance > aggroRange) {
      return this.wanderBehavior(entity, position);
    }

    if (distance === 1) {
      return {
        type: 'attack',
        target: player,
        dx: playerPos.x - position.x,
        dy: playerPos.y - position.y
      };
    }

    // Create a new pathfinding instance for this calculation
    const astar = new ROT.Path.AStar(
      playerPos.x,
      playerPos.y,
      (x: number, y: number) => this.movementSystem?.canMoveTo(x, y) ?? false,
      { topology: 4 }
    );
    
    const path: [number, number][] = [];
    astar.compute(
      position.x,
      position.y,
      (x: number, y: number) => path.push([x, y])
    );

    if (path.length > 1) {
      const nextStep = path[1];
      return {
        type: 'move',
        dx: nextStep[0] - position.x,
        dy: nextStep[1] - position.y
      };
    }

    return { type: 'wait' };
  }

  private fleeBehavior(entity: Entity, position: Position, params: any): AIIntent {
    const player = this.world.getEntitiesWithComponents('Player', 'Position')[0];
    if (!player) {
      return this.wanderBehavior(entity, position);
    }

    const playerPos = this.world.getComponent<Position>(player, 'Position')!;
    const distance = Math.abs(position.x - playerPos.x) + Math.abs(position.y - playerPos.y);
    
    const fleeRange = params?.fleeRange ?? 4;
    if (distance > fleeRange) {
      return this.wanderBehavior(entity, position);
    }

    const dx = position.x - playerPos.x;
    const dy = position.y - playerPos.y;
    const directions = [
      { dx: Math.sign(dx), dy: 0 },
      { dx: 0, dy: Math.sign(dy) },
      { dx: Math.sign(dx), dy: Math.sign(dy) }
    ].filter(dir => dir.dx !== 0 || dir.dy !== 0);

    for (const dir of directions) {
      if (this.movementSystem?.canMoveTo(position.x + dir.dx, position.y + dir.dy)) {
        return { type: 'move', dx: dir.dx, dy: dir.dy };
      }
    }

    return this.wanderBehavior(entity, position);
  }
}