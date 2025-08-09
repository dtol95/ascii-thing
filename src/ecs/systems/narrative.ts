import { System } from '../system';
import type { World } from '../world';
import type { EventBus } from '../events';
import type { Health } from '../components';
import { 
  environmentalMessages, 
  getRandomMessage, 
  getWeightedMessage 
} from '../../data/messages';
import { 
  getFloorTheme, 
  getFloorAmbientMessage 
} from '../../data/floorThemes';

export class NarrativeSystem extends System {
  private lastAmbientMessage = 0;
  private ambientMessageInterval = 2000; // Ticks between ambient messages
  private currentFloor = 1;
  private tickCounter = 0;
  private hasShownFloorMessage = false;
  
  constructor(
    world: World,
    events: EventBus,
    private playerEntity: number
  ) {
    super(world, events);
    
    // Listen for floor changes
    this.events.on('FloorChanged', (event: any) => {
      if (event.type === 'FloorChanged') {
        this.currentFloor = event.floor;
        this.hasShownFloorMessage = false;
        this.showFloorEntryMessage();
      }
    });
    
    // Listen for stairs discovery
    this.events.on('StairsFound', (event: any) => {
      if (event.type === 'StairsFound') {
        const message = getRandomMessage(environmentalMessages.stairsFound);
        this.events.push({
          type: 'Message',
          text: message,
          color: 0x00ffff
        });
      }
    });
    
    // Listen for item spotting
    this.events.on('ItemSpotted', (event: any) => {
      if (event.type === 'ItemSpotted') {
        const message = getRandomMessage(environmentalMessages.itemSpotted);
        this.events.push({
          type: 'Message',
          text: message,
          color: 0x00ffff
        });
      }
    });
    
    // Listen for low health
    this.events.on('LowHealth', (event: any) => {
      if (event.type === 'LowHealth' && event.who === this.playerEntity) {
        const message = getRandomMessage(environmentalMessages.lowHealth);
        this.events.push({
          type: 'Message',
          text: message,
          color: 0xff6666
        });
      }
    });
  }
  
  update(_deltaTime: number): void {
    this.tickCounter++;
    
    // Show floor entry message once
    if (!this.hasShownFloorMessage && this.tickCounter > 10) {
      this.showFloorEntryMessage();
      this.hasShownFloorMessage = true;
    }
    
    // Check for low health warning
    const health = this.world.getComponent<Health>(this.playerEntity, 'Health');
    if (health && health.hp < health.max * 0.3 && health.hp > 0) {
      if (this.tickCounter % 500 === 0) { // Check every ~500 ticks
        this.events.push({
          type: 'LowHealth',
          who: this.playerEntity
        });
      }
    }
    
    // Periodic ambient messages
    if (this.tickCounter - this.lastAmbientMessage > this.ambientMessageInterval) {
      this.showAmbientMessage();
      this.lastAmbientMessage = this.tickCounter;
      // Randomize next interval
      this.ambientMessageInterval = 1500 + Math.floor(Math.random() * 2000);
    }
  }
  
  private showFloorEntryMessage(): void {
    const theme = getFloorTheme(this.currentFloor);
    this.events.push({
      type: 'Message',
      text: theme.enterMessage,
      color: 0xffff00
    });
  }
  
  private showAmbientMessage(): void {
    // 70% chance for general ambient, 30% for floor-specific
    if (Math.random() < 0.7) {
      const message = getWeightedMessage(environmentalMessages.ambient, this.currentFloor);
      if (message) {
        this.events.push({
          type: 'Message',
          text: message,
          color: 0x888888
        });
      }
    } else {
      const message = getFloorAmbientMessage(this.currentFloor);
      if (message) {
        this.events.push({
          type: 'Message',
          text: message,
          color: 0x888888
        });
      }
    }
  }
  
  setFloor(floor: number): void {
    this.currentFloor = floor;
    this.hasShownFloorMessage = false;
    this.tickCounter = 0;
  }
  
  // Call this when entering a new room
  showRoomDescription(roomType: 'corridor' | 'largeRoom' | 'smallRoom' | 'entrance'): void {
    if (environmentalMessages.roomEntry[roomType]) {
      const message = getRandomMessage(environmentalMessages.roomEntry[roomType]);
      this.events.push({
        type: 'Message',
        text: message,
        color: 0x666666
      });
    }
  }
}