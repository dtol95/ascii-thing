import { System } from '../system';
import type { Actor, Entity } from '../components';

export class EnergySystem extends System {
  update(_deltaTime: number): void {
    const actors = this.world.getEntitiesWithComponents('Actor');
    
    for (const entity of actors) {
      const actor = this.world.getComponent<Actor>(entity, 'Actor')!;
      actor.energy += actor.speed;
    }
  }

  getReadyActor(): Entity | null {
    const actors = this.world.getEntitiesWithComponents('Actor');
    let readyActor: Entity | null = null;
    let maxEnergy = 99;
    
    for (const entity of actors) {
      const actor = this.world.getComponent<Actor>(entity, 'Actor')!;
      if (actor.energy >= 100 && actor.energy > maxEnergy) {
        readyActor = entity;
        maxEnergy = actor.energy;
      }
    }
    
    return readyActor;
  }
}