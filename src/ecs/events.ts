import type { Entity } from './components';

export type GameEvent =
  | { type: "Moved"; who: Entity; from: [number, number]; to: [number, number] }
  | { type: "TookDamage"; who: Entity; amount: number; damageType: string }
  | { type: "Died"; who: Entity }
  | { type: "Healed"; who: Entity; amount: number }
  | { type: "PickedItem"; who: Entity; item: Entity }
  | { type: "Descend"; who: Entity }
  | { type: "ProjectileHit"; who: Entity; target: Entity; amount: number }
  | { type: "ApplyStatus"; who: Entity; effect: string; turns: number }
  | { type: "Attack"; attacker: Entity; target: Entity }
  | { type: "Message"; text: string; color?: number };

export class EventBus {
  private events: GameEvent[] = [];
  private listeners: Map<string, ((event: GameEvent) => void)[]> = new Map();

  push(event: GameEvent): void {
    this.events.push(event);
    this.notifyListeners(event);
  }

  drain(): GameEvent[] {
    const result = [...this.events];
    this.events = [];
    return result;
  }

  peek(): GameEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }

  on(eventType: string, callback: (event: GameEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: (event: GameEvent) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: GameEvent): void {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(event);
      }
    }
  }
}