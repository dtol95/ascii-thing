import { System } from '../system';
import type { Entity, Health, Melee, Position, Name } from '../components';
import type { World } from '../world';
import type { EventBus } from '../events';

export class CombatSystem extends System {
  constructor(
    world: World,
    events: EventBus
  ) {
    super(world, events);
  }

  update(_deltaTime: number): void {
  }

  attack(attacker: Entity, target: Entity): boolean {
    const attackerName = this.world.getComponent<Name>(attacker, 'Name')?.name || 'Something';
    const targetName = this.world.getComponent<Name>(target, 'Name')?.name || 'something';
    
    const targetHealth = this.world.getComponent<Health>(target, 'Health');
    if (!targetHealth) {
      return false;
    }

    let damage = 1;
    const melee = this.world.getComponent<Melee>(attacker, 'Melee');
    if (melee) {
      damage = Math.floor(
        melee.damageMin + Math.random() * (melee.damageMax - melee.damageMin + 1)
      );
    }

    damage = Math.max(1, damage - targetHealth.armor);
    targetHealth.hp -= damage;

    this.events.push({
      type: 'TookDamage',
      who: target,
      amount: damage,
      damageType: melee?.type || 'phys'
    });

    this.events.push({
      type: 'Attack',
      attacker,
      target
    });

    this.events.push({
      type: 'Message',
      text: `${attackerName} hits ${targetName} for ${damage} damage!`,
      color: 0xff0000
    });

    if (targetHealth.hp <= 0) {
      this.events.push({
        type: 'Died',
        who: target
      });

      this.events.push({
        type: 'Message',
        text: `${targetName} dies!`,
        color: 0xff0000
      });

      this.world.destroyEntity(target);
    }

    return true;
  }

  canAttack(attacker: Entity, target: Entity): boolean {
    const attackerPos = this.world.getComponent<Position>(attacker, 'Position');
    const targetPos = this.world.getComponent<Position>(target, 'Position');
    
    if (!attackerPos || !targetPos) {
      return false;
    }

    const distance = Math.abs(attackerPos.x - targetPos.x) + Math.abs(attackerPos.y - targetPos.y);
    return distance === 1;
  }

  getEntityAt(x: number, y: number): Entity | null {
    const entities = this.world.getEntitiesWithComponents('Position', 'Health');
    for (const entity of entities) {
      const pos = this.world.getComponent<Position>(entity, 'Position')!;
      if (pos.x === x && pos.y === y) {
        return entity;
      }
    }
    return null;
  }
}