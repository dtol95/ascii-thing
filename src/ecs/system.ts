import type { World } from './world';
import type { EventBus } from './events';

export abstract class System {
  constructor(
    protected world: World,
    protected events: EventBus
  ) {}

  abstract update(deltaTime: number): void;
}