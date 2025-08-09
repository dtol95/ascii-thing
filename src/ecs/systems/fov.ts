import { System } from '../system';
import * as ROT from 'rot-js';
import type { Position, Transparent } from '../components';

export interface Visibility {
  visible: boolean;
  seen: boolean;
}

export class FOVSystem extends System {
  private fov: InstanceType<typeof ROT.FOV.PreciseShadowcasting>;
  private visibility: Map<string, Visibility> = new Map();
  private dirty = true;

  constructor(
    world: any,
    events: any,
    private mapWidth: number,
    private mapHeight: number
  ) {
    super(world, events);
    
    this.fov = new ROT.FOV.PreciseShadowcasting((x: number, y: number) => {
      return this.isTransparent(x, y);
    });
  }

  update(_deltaTime: number): void {
    if (!this.dirty) return;
    
    const player = this.world.getEntitiesWithComponents('Player', 'Position')[0];
    if (!player) return;
    
    const position = this.world.getComponent<Position>(player, 'Position')!;
    
    for (const [_key, vis] of this.visibility) {
      vis.visible = false;
    }
    
    this.fov.compute(position.x, position.y, 10, (x: number, y: number, _r: number, _visibility: number) => {
      const key = `${x},${y}`;
      let vis = this.visibility.get(key);
      
      if (!vis) {
        vis = { visible: false, seen: false };
        this.visibility.set(key, vis);
      }
      
      vis.visible = true;
      vis.seen = true;
    });
    
    this.dirty = false;
  }

  private isTransparent(x: number, y: number): boolean {
    if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
      return false;
    }
    
    const entities = this.world.getEntitiesWithComponents('Position');
    for (const entity of entities) {
      const pos = this.world.getComponent<Position>(entity, 'Position')!;
      if (pos.x === x && pos.y === y) {
        const transparent = this.world.getComponent<Transparent>(entity, 'Transparent');
        if (transparent !== undefined && !transparent.transparent) {
          return false;
        }
      }
    }
    
    return true;
  }

  isVisible(x: number, y: number): boolean {
    const vis = this.visibility.get(`${x},${y}`);
    return vis ? vis.visible : false;
  }

  isSeen(x: number, y: number): boolean {
    const vis = this.visibility.get(`${x},${y}`);
    return vis ? vis.seen : false;
  }

  markDirty(): void {
    this.dirty = true;
  }

  clearMemory(): void {
    this.visibility.clear();
    this.dirty = true;
  }
}