import { System } from '../system';
import type { World } from '../world';
import type { EventBus } from '../events';
import type { Entity, Position, RenderGlyph, Name } from '../components';

export interface ItemData {
  name: string;
  glyph: number;
  color: number;
  type: 'potion' | 'weapon' | 'armor';
  effect?: {
    heal?: number;
    damage?: { min: number; max: number };
    armor?: number;
  };
}

export const ITEM_TYPES: Record<string, ItemData> = {
  healthPotion: {
    name: 'Health Potion',
    glyph: 33, // !
    color: 0xff0000,
    type: 'potion',
    effect: { heal: 10 }
  },
  smallHealthPotion: {
    name: 'Small Health Potion',
    glyph: 33, // !
    color: 0xcc6666,
    type: 'potion',
    effect: { heal: 5 }
  }
};

export class ItemSystem extends System {
  constructor(world: World, events: EventBus) {
    super(world, events);
  }

  spawnItem(x: number, y: number, itemType: string): Entity | null {
    const itemData = ITEM_TYPES[itemType];
    if (!itemData) return null;

    const item = this.world.createEntity();
    this.world.addComponent<Position>(item, 'Position', { x, y });
    this.world.addComponent<RenderGlyph>(item, 'RenderGlyph', {
      code: itemData.glyph,
      fg: itemData.color,
      z: 5
    });
    this.world.addComponent<Name>(item, 'Name', { name: itemData.name });
    
    // Add item-specific component to identify it as an item
    this.world.addComponent(item, 'Item', { type: itemType, data: itemData });
    
    return item;
  }

  getItemAt(x: number, y: number): Entity | null {
    const entities = this.world.getEntitiesWithComponent('Item');
    
    for (const entity of entities) {
      const pos = this.world.getComponent<Position>(entity, 'Position');
      if (pos && pos.x === x && pos.y === y) {
        return entity;
      }
    }
    
    return null;
  }

  useItem(item: Entity, user: Entity): boolean {
    const itemComp = this.world.getComponent(item, 'Item') as any;
    if (!itemComp) return false;

    const itemData = itemComp.data as ItemData;
    
    if (itemData.type === 'potion' && itemData.effect?.heal) {
      const health = this.world.getComponent(user, 'Health') as any;
      if (health) {
        const oldHp = health.hp;
        health.hp = Math.min(health.hp + itemData.effect.heal, health.max);
        const healed = health.hp - oldHp;
        
        if (healed > 0) {
          this.events.push({ 
            type: 'Healed', 
            who: user, 
            amount: healed 
          });
          
          const userName = this.world.getComponent(user, 'Name') as any;
          this.events.push({ 
            type: 'Message', 
            text: `${userName?.name || 'Entity'} healed for ${healed} HP!`, 
            color: 0x00ff00 
          });
        }
        
        // Destroy the item after use
        this.world.destroyEntity(item);
        return true;
      }
    }
    
    return false;
  }

  update(_deltaTime: number): void {
    // Item system doesn't need regular updates
  }
}