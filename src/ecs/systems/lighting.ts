import { System } from '../system';
import * as ROT from 'rot-js';
import type { Position, Light } from '../components';

export interface LightLevel {
  intensity: number;
  color: number;
}

export class LightingSystem extends System {
  private lightMap: Map<string, LightLevel> = new Map();
  private wallMap: Set<string> = new Set();
  private lightFov: InstanceType<typeof ROT.FOV.PreciseShadowcasting>;
  private dirty = true;

  constructor(
    world: any,
    events: any,
    private mapWidth: number,
    private mapHeight: number
  ) {
    super(world, events);
    
    this.lightFov = new ROT.FOV.PreciseShadowcasting((x: number, y: number) => {
      return this.lightPasses(x, y);
    });
  }

  update(_deltaTime: number): void {
    if (!this.dirty) return;
    
    this.lightMap.clear();
    
    const lights = this.world.getEntitiesWithComponents('Position', 'Light');
    
    for (const entity of lights) {
      const position = this.world.getComponent<Position>(entity, 'Position')!;
      const light = this.world.getComponent<Light>(entity, 'Light')!;
      
      this.lightFov.compute(position.x, position.y, light.radius, (x: number, y: number, _r: number, visibility: number) => {
        const key = `${x},${y}`;
        const distance = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2);
        const intensity = light.intensity * (1 - distance / light.radius) * visibility;
        
        const existing = this.lightMap.get(key);
        if (!existing || existing.intensity < intensity) {
          this.lightMap.set(key, {
            intensity,
            color: light.color
          });
        }
      });
    }
    
    this.dirty = false;
  }

  rebuildWallMap(): void {
    this.wallMap.clear();
    
    const entities = this.world.getEntitiesWithComponents('Position', 'Tile');
    for (const entity of entities) {
      const pos = this.world.getComponent<Position>(entity, 'Position')!;
      const tile = this.world.getComponent(entity, 'Tile') as any;
      if (tile && tile.blocksLight) {
        this.wallMap.add(`${pos.x},${pos.y}`);
      }
    }
  }

  private lightPasses(x: number, y: number): boolean {
    if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
      return false;
    }
    
    // Use the cached wall map for O(1) lookup
    return !this.wallMap.has(`${x},${y}`);
  }

  getLightAt(x: number, y: number): LightLevel | null {
    return this.lightMap.get(`${x},${y}`) || null;
  }

  markDirty(): void {
    this.dirty = true;
  }

  mixColors(color1: number, color2: number, ratio: number): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;
    
    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;
    
    const r = Math.floor(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.floor(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.floor(b1 * (1 - ratio) + b2 * ratio);
    
    return (r << 16) | (g << 8) | b;
  }
}