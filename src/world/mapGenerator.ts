import * as ROT from 'rot-js';
import type { World } from '../ecs/world';
import type { Position, RenderGlyph, Tile, Blocks, Transparent } from '../ecs/components';

export interface MapCell {
  type: 'floor' | 'wall' | 'door' | 'stairs_up' | 'stairs_down';
  glyph: number;
  fg: number;
  bg?: number;
  walkable: boolean;
  transparent: boolean;
  blocksLight: boolean;
}

export class MapGenerator {
  private cells: MapCell[][] = [];
  private rooms: any[] = [];
  
  constructor(
    private width: number,
    private height: number,
    private world: World
  ) {
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        this.cells[y][x] = this.createWall();
      }
    }
  }

  generateDungeon(): { playerStart: [number, number], stairsDown: [number, number], itemPositions: [number, number][] } {
    const digger = new ROT.Map.Digger(this.width, this.height, {
      roomWidth: [3, 9],
      roomHeight: [3, 9],
      corridorLength: [3, 10],
      dugPercentage: 0.2,
      timeLimit: 1000
    });

    digger.create((x, y, value) => {
      if (value === 0) {
        this.cells[y][x] = this.createFloor();
      }
    });

    this.rooms = digger.getRooms();
    
    const startRoom = this.rooms[0];
    const endRoom = this.rooms[this.rooms.length - 1];
    
    const playerStart: [number, number] = [
      Math.floor((startRoom.getLeft() + startRoom.getRight()) / 2),
      Math.floor((startRoom.getTop() + startRoom.getBottom()) / 2)
    ];
    
    const stairsDown: [number, number] = [
      Math.floor((endRoom.getLeft() + endRoom.getRight()) / 2),
      Math.floor((endRoom.getTop() + endRoom.getBottom()) / 2)
    ];
    
    this.cells[stairsDown[1]][stairsDown[0]] = this.createStairsDown();
    
    // Generate item positions in random rooms
    const itemPositions: [number, number][] = [];
    const numItems = 3 + Math.floor(Math.random() * 3); // 3-5 items per floor
    
    for (let i = 0; i < numItems && i < this.rooms.length - 1; i++) {
      const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
      const roomWidth = room.getRight() - room.getLeft() + 1;
      const roomHeight = room.getBottom() - room.getTop() + 1;
      const x = room.getLeft() + 1 + Math.floor(Math.random() * (roomWidth - 2));
      const y = room.getTop() + 1 + Math.floor(Math.random() * (roomHeight - 2));
      
      // Make sure we don't place items on player start or stairs
      if ((x !== playerStart[0] || y !== playerStart[1]) && 
          (x !== stairsDown[0] || y !== stairsDown[1])) {
        itemPositions.push([x, y]);
      }
    }
    
    this.addDoors();
    this.populateToWorld();
    
    return { playerStart, stairsDown, itemPositions };
  }

  private addDoors(): void {
    for (const room of this.rooms) {
      room.getDoors((x: number, y: number) => {
        if (Math.random() < 0.5) {
          this.cells[y][x] = this.createDoor();
        }
      });
    }
  }

  private populateToWorld(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        const entity = this.world.createEntity();
        
        this.world.addComponent<Position>(entity, 'Position', { x, y });
        this.world.addComponent<RenderGlyph>(entity, 'RenderGlyph', {
          code: cell.glyph,
          fg: cell.fg,
          bg: cell.bg,
          z: cell.type === 'floor' ? -1 : 0
        });
        this.world.addComponent<Tile>(entity, 'Tile', {
          walkable: cell.walkable,
          blocksLight: cell.blocksLight
        });
        
        if (!cell.walkable) {
          this.world.addComponent<Blocks>(entity, 'Blocks', { blocks: true });
        }
        
        this.world.addComponent<Transparent>(entity, 'Transparent', {
          transparent: cell.transparent
        });
      }
    }
  }

  private createWall(): MapCell {
    return {
      type: 'wall',
      glyph: 35, // #
      fg: 0x808080,
      walkable: false,
      transparent: false,
      blocksLight: true
    };
  }

  private createFloor(): MapCell {
    return {
      type: 'floor',
      glyph: 46, // .
      fg: 0x404040,
      walkable: true,
      transparent: true,
      blocksLight: false
    };
  }

  private createDoor(): MapCell {
    return {
      type: 'door',
      glyph: 43, // +
      fg: 0xa0522d,
      walkable: true,
      transparent: false,
      blocksLight: false
    };
  }

  private createStairsDown(): MapCell {
    return {
      type: 'stairs_down',
      glyph: 62, // >
      fg: 0xffff00,
      walkable: true,
      transparent: true,
      blocksLight: false
    };
  }

  getCell(x: number, y: number): MapCell | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.cells[y][x];
  }
}