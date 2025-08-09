import type { Entity } from './components';

export interface ComponentMap<T> {
  [id: number]: T | undefined;
}

export class World {
  private nextEntityId = 1;
  private entities = new Set<Entity>();
  private componentsMap = new Map<string, ComponentMap<any>>();
  private entityComponentMask = new Map<Entity, Set<string>>();

  createEntity(): Entity {
    const id = this.nextEntityId++;
    this.entities.add(id);
    this.entityComponentMask.set(id, new Set());
    return id;
  }

  destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    const mask = this.entityComponentMask.get(entity);
    if (mask) {
      for (const componentType of mask) {
        const components = this.componentsMap.get(componentType);
        if (components) {
          delete components[entity];
        }
      }
    }
    this.entityComponentMask.delete(entity);
  }

  addComponent<T>(entity: Entity, componentType: string, component: T): void {
    if (!this.entities.has(entity)) {
      throw new Error(`Entity ${entity} does not exist`);
    }

    if (!this.componentsMap.has(componentType)) {
      this.componentsMap.set(componentType, {});
    }

    const components = this.componentsMap.get(componentType)!;
    components[entity] = component;

    const mask = this.entityComponentMask.get(entity)!;
    mask.add(componentType);
  }

  removeComponent(entity: Entity, componentType: string): void {
    const components = this.componentsMap.get(componentType);
    if (components) {
      delete components[entity];
    }

    const mask = this.entityComponentMask.get(entity);
    if (mask) {
      mask.delete(componentType);
    }
  }

  getComponent<T>(entity: Entity, componentType: string): T | undefined {
    const components = this.componentsMap.get(componentType);
    return components ? components[entity] : undefined;
  }

  hasComponent(entity: Entity, componentType: string): boolean {
    const mask = this.entityComponentMask.get(entity);
    return mask ? mask.has(componentType) : false;
  }

  getEntitiesWithComponents(...componentTypes: string[]): Entity[] {
    const result: Entity[] = [];
    
    for (const entity of this.entities) {
      const mask = this.entityComponentMask.get(entity);
      if (mask && componentTypes.every(type => mask.has(type))) {
        result.push(entity);
      }
    }
    
    return result;
  }

  getAllComponents<T>(componentType: string): ComponentMap<T> {
    return this.componentsMap.get(componentType) || {};
  }

  clear(): void {
    this.entities.clear();
    this.componentsMap.clear();
    this.entityComponentMask.clear();
    this.nextEntityId = 1;
  }

  getEntityCount(): number {
    return this.entities.size;
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities);
  }

  getEntitiesWithComponent(componentType: string): Entity[] {
    return this.getEntitiesWithComponents(componentType);
  }
}