import { System } from '../system';

export interface Intent {
  type: 'move' | 'wait' | 'action';
  dx?: number;
  dy?: number;
  action?: string;
  itemIndex?: number;
}

export class InputSystem extends System {
  private keyQueue: string[] = [];
  private inputResolver: ((intent: Intent) => void) | null = null;
  private keys: Set<string> = new Set();

  init(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.keys.has(e.key)) return;
    this.keys.add(e.key);
    
    // Add key to queue for processing
    this.keyQueue.push(e.key);
    
    // If we have a resolver waiting, process immediately
    if (this.inputResolver && this.keyQueue.length > 0) {
      const key = this.keyQueue.shift()!;
      const intent = this.keyToIntent(key);
      if (intent) {
        const resolver = this.inputResolver;
        this.inputResolver = null;
        resolver(intent);
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key);
  };

  private keyToIntent(key: string): Intent | null {
    // Check for number keys (1-9) for inventory item usage
    const num = parseInt(key);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      return { type: 'action', action: 'useItem', itemIndex: num - 1 };
    }
    
    switch (key) {
      case 'ArrowUp':
      case 'w':
        return { type: 'move', dx: 0, dy: -1 };
      case 'ArrowDown':
      case 's':
        return { type: 'move', dx: 0, dy: 1 };
      case 'ArrowLeft':
      case 'a':
        return { type: 'move', dx: -1, dy: 0 };
      case 'ArrowRight':
      case 'd':
        return { type: 'move', dx: 1, dy: 0 };
      case '.':
      case ' ':
        return { type: 'wait' };
      case 'g':
        return { type: 'action', action: 'pickup' };
      case 'i':
        return { type: 'action', action: 'inventory' };
      case '?':
        return { type: 'action', action: 'help' };
      case '<':
        return { type: 'action', action: 'ascend' };
      case '>':
        return { type: 'action', action: 'descend' };
      case 'f':
        return { type: 'action', action: 'fire' };
      case 'Escape':
        return { type: 'action', action: 'escape' };
      default:
        return null;
    }
  }

  waitForInput(): Promise<Intent> {
    return new Promise(resolve => {
      // Check if we have queued input first
      if (this.keyQueue.length > 0) {
        const key = this.keyQueue.shift()!;
        const intent = this.keyToIntent(key);
        if (intent) {
          resolve(intent);
          return;
        }
      }
      // Otherwise wait for new input
      this.inputResolver = resolve;
    });
  }

  update(_deltaTime: number): void {
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}