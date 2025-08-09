import type { World } from '../ecs/world';
import type { AsciiRenderer } from '../gfx/renderer';
import type { Entity, Inventory, Name } from '../ecs/components';

export class InventoryUI {
  private visible = false;
  private selectedIndex = 0;
  
  constructor(
    private world: World,
    private renderer: AsciiRenderer,
    private gridWidth: number,
    private gridHeight: number
  ) {}
  
  toggle(): void {
    this.visible = !this.visible;
    this.selectedIndex = 0;
  }
  
  show(): void {
    this.visible = true;
    this.selectedIndex = 0;
  }
  
  hide(): void {
    this.visible = false;
  }
  
  isVisible(): boolean {
    return this.visible;
  }
  
  moveSelection(direction: -1 | 1): void {
    this.selectedIndex += direction;
  }
  
  render(playerEntity: Entity): void {
    if (!this.visible) return;
    
    const inventory = this.world.getComponent<Inventory>(playerEntity, 'Inventory');
    if (!inventory) return;
    
    // Draw inventory window
    const windowWidth = 40;
    const windowHeight = 20;
    const startX = Math.floor((this.gridWidth - windowWidth) / 2);
    const startY = Math.floor((this.gridHeight - windowHeight) / 2);
    
    // Draw border and background
    this.drawWindow(startX, startY, windowWidth, windowHeight);
    
    // Draw title
    const title = "=== INVENTORY ===";
    const titleX = startX + Math.floor((windowWidth - title.length) / 2);
    this.renderer.writeString(titleX, startY + 1, title, 0xffff00);
    
    // Draw instructions
    this.renderer.writeString(startX + 2, startY + 3, "Press [i] to close", 0xaaaaaa);
    this.renderer.writeString(startX + 2, startY + 4, "Press [1-9] to use item", 0xaaaaaa);
    
    // Draw items
    if (inventory.slots.length === 0) {
      this.renderer.writeString(startX + 2, startY + 7, "Your inventory is empty.", 0x808080);
    } else {
      for (let i = 0; i < inventory.slots.length && i < 9; i++) {
        const item = inventory.slots[i];
        const itemName = this.world.getComponent<Name>(item, 'Name');
        const itemComp = this.world.getComponent(item, 'Item') as any;
        
        if (itemName && itemComp) {
          const y = startY + 7 + i;
          const number = `${i + 1}.`;
          const name = itemName.name;
          
          // Highlight selected item
          const color = i === this.selectedIndex ? 0xffff00 : 0xffffff;
          
          this.renderer.writeString(startX + 2, y, number, 0xaaaaaa);
          this.renderer.writeString(startX + 5, y, name, color);
          
          // Show item effect
          if (itemComp.data.effect?.heal) {
            const healText = `(+${itemComp.data.effect.heal} HP)`;
            this.renderer.writeString(startX + 5 + name.length + 1, y, healText, 0x00ff00);
          }
        }
      }
    }
    
    // Draw item count
    const countText = `Items: ${inventory.slots.length}/20`;
    this.renderer.writeString(startX + windowWidth - countText.length - 2, startY + windowHeight - 2, countText, 0xaaaaaa);
  }
  
  private drawWindow(x: number, y: number, width: number, height: number): void {
    // Draw background (dark gray)
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        this.renderer.putGlyph(x + dx, y + dy, 32, 0x000000, 0x202020);
      }
    }
    
    // Draw border
    const borderColor = 0x808080;
    
    // Corners
    this.renderer.putGlyph(x, y, 201, borderColor, 0x202020); // ╔
    this.renderer.putGlyph(x + width - 1, y, 187, borderColor, 0x202020); // ╗
    this.renderer.putGlyph(x, y + height - 1, 200, borderColor, 0x202020); // ╚
    this.renderer.putGlyph(x + width - 1, y + height - 1, 188, borderColor, 0x202020); // ╝
    
    // Horizontal lines
    for (let dx = 1; dx < width - 1; dx++) {
      this.renderer.putGlyph(x + dx, y, 205, borderColor, 0x202020); // ═
      this.renderer.putGlyph(x + dx, y + height - 1, 205, borderColor, 0x202020); // ═
    }
    
    // Vertical lines
    for (let dy = 1; dy < height - 1; dy++) {
      this.renderer.putGlyph(x, y + dy, 186, borderColor, 0x202020); // ║
      this.renderer.putGlyph(x + width - 1, y + dy, 186, borderColor, 0x202020); // ║
    }
  }
  
  handleKeyPress(key: string, playerEntity: Entity): boolean {
    if (!this.visible) return false;
    
    if (key === 'i' || key === 'Escape') {
      this.hide();
      return true;
    }
    
    // Handle number keys for item usage
    const itemIndex = parseInt(key) - 1;
    if (!isNaN(itemIndex) && itemIndex >= 0 && itemIndex < 9) {
      const inventory = this.world.getComponent<Inventory>(playerEntity, 'Inventory');
      if (inventory && itemIndex < inventory.slots.length) {
        this.selectedIndex = itemIndex;
        // Return the item entity to be used
        return true;
      }
    }
    
    return true; // Consume all input while inventory is open
  }
  
  getSelectedItem(playerEntity: Entity): Entity | null {
    const inventory = this.world.getComponent<Inventory>(playerEntity, 'Inventory');
    if (!inventory || this.selectedIndex >= inventory.slots.length) {
      return null;
    }
    return inventory.slots[this.selectedIndex];
  }
}