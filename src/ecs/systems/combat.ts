import { System } from '../system';
import type { Entity, Health, Melee, Position, Name } from '../components';
import type { World } from '../world';
import type { EventBus } from '../events';
import { 
  combatMessages, 
  getDamageCategory, 
  getRandomCombatMessage 
} from '../../data/combatText';

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

    // Apply armor
    damage = Math.max(0, damage - targetHealth.armor);
    
    // Determine if player is attacking or being attacked
    const isPlayerAttacker = this.world.hasComponent(attacker, 'Player');
    const isPlayerTarget = this.world.hasComponent(target, 'Player');
    
    // Get appropriate combat message based on damage
    const damageCategory = getDamageCategory(damage, melee?.damageMax || 4);
    let combatMessage = '';
    let messageColor = 0xffffff;
    
    if (damage === 0) {
      // Armor blocked the attack
      combatMessage = `${targetName}'s armor absorbs the blow!`;
      messageColor = 0x888888;
    } else {
      // Apply damage
      targetHealth.hp -= damage;
      
      // Check if this is a killing blow
      const isKillingBlow = targetHealth.hp <= 0;
      
      if (isPlayerAttacker) {
        // Player is attacking
        if (isKillingBlow) {
          combatMessage = getRandomCombatMessage(
            combatMessages.playerAttack.kill,
            { enemy: targetName }
          );
          messageColor = 0x00ff00;
        } else {
          const messages = combatMessages.playerAttack[damageCategory];
          combatMessage = getRandomCombatMessage(messages, { 
            enemy: targetName,
            damage: damage
          });
          messageColor = damageCategory === 'strong' ? 0xffff00 : 
                        damageCategory === 'weak' ? 0xcccccc : 0xffffff;
        }
      } else if (isPlayerTarget) {
        // Player is being attacked
        const messages = combatMessages.enemyAttack[damageCategory];
        combatMessage = getRandomCombatMessage(messages, { 
          enemy: attackerName,
          damage: damage
        });
        messageColor = damageCategory === 'strong' ? 0xff0000 : 
                       damageCategory === 'weak' ? 0xffaa00 : 0xff6666;
      } else {
        // NPC vs NPC (simple message)
        combatMessage = `${attackerName} hits ${targetName} for ${damage} damage!`;
        messageColor = 0xaaaaaa;
      }
    }

    // Send events
    this.events.push({
      type: 'TookDamage',
      who: target,
      attacker: attacker,
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
      text: combatMessage,
      color: messageColor
    });

    if (targetHealth.hp <= 0) {
      this.events.push({
        type: 'Died',
        who: target,
        killer: attacker
      });

      // Death message is handled by the HUD event listener
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