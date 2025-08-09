import type { AsciiRenderer } from '../gfx/renderer';

export class KeybindUI {
  private visible = false;
  
  constructor(
    private renderer: AsciiRenderer,
    private gridWidth: number,
    private gridHeight: number
  ) {}
  
  toggle(): void {
    this.visible = !this.visible;
  }
  
  show(): void {
    this.visible = true;
  }
  
  hide(): void {
    this.visible = false;
  }
  
  isVisible(): boolean {
    return this.visible;
  }
  
  render(): void {
    if (!this.visible) return;
    
    // Draw help window
    const windowWidth = 50;
    const windowHeight = 30;
    const startX = Math.floor((this.gridWidth - windowWidth) / 2);
    const startY = Math.floor((this.gridHeight - windowHeight) / 2);
    
    // Draw border and background
    this.drawWindow(startX, startY, windowWidth, windowHeight);
    
    // Draw title
    const title = "=== KEYBINDS ===";
    const titleX = startX + Math.floor((windowWidth - title.length) / 2);
    this.renderer.writeString(titleX, startY + 1, title, 0xffff00);
    
    // Draw instructions
    this.renderer.writeString(startX + 2, startY + 3, "Press [?] or [Escape] to close", 0xaaaaaa);
    
    let y = startY + 5;
    
    // Movement section
    this.renderer.writeString(startX + 2, y++, "MOVEMENT:", 0x00ffff);
    this.renderer.writeString(startX + 4, y++, "Arrow Keys / WASD - Move in four directions", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "Space / .        - Wait (skip turn)", 0xffffff);
    y++;
    
    // Actions section
    this.renderer.writeString(startX + 2, y++, "ACTIONS:", 0x00ffff);
    this.renderer.writeString(startX + 4, y++, "g   - Pick up items", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "i   - Use health potion", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "<   - Go up stairs (when on stairs)", 0xffffff);
    this.renderer.writeString(startX + 4, y++, ">   - Go down stairs (when on stairs)", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "f   - Fire ranged weapon (coming soon)", 0x808080);
    y++;
    
    // Combat section
    this.renderer.writeString(startX + 2, y++, "COMBAT:", 0x00ffff);
    this.renderer.writeString(startX + 4, y++, "Bump into enemies to attack", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "Use corridors to fight one at a time", 0xffffff);
    y++;
    
    // Meta section
    this.renderer.writeString(startX + 2, y++, "META:", 0x00ffff);
    this.renderer.writeString(startX + 4, y++, "?   - Show this help", 0xffffff);
    this.renderer.writeString(startX + 4, y++, "F5  - Restart game", 0xffffff);
    y++;
    
    // Tips
    this.renderer.writeString(startX + 2, y++, "TIPS:", 0x00ff00);
    this.renderer.writeString(startX + 4, y++, "- Rats have 3 HP, you deal 2-4 damage", 0xaaaaaa);
    this.renderer.writeString(startX + 4, y++, "- Use doorways to prevent being surrounded", 0xaaaaaa);
    this.renderer.writeString(startX + 4, y++, "- Pick up potions and save them for emergencies", 0xaaaaaa);
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
  
  handleKeyPress(key: string): boolean {
    if (!this.visible) return false;
    
    if (key === '?' || key === 'Escape') {
      this.hide();
      return true;
    }
    
    return true; // Consume all input while help is open
  }
}