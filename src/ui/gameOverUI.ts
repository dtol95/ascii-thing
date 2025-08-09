import type { AsciiRenderer } from '../gfx/renderer';

export interface GameStats {
  floor: number;
  enemiesKilled: number;
  itemsCollected: number;
  victory: boolean;
}

export class GameOverUI {
  private visible = false;
  private stats: GameStats = {
    floor: 1,
    enemiesKilled: 0,
    itemsCollected: 0,
    victory: false
  };
  
  constructor(
    private renderer: AsciiRenderer,
    private gridWidth: number,
    private gridHeight: number
  ) {}
  
  show(stats: GameStats): void {
    this.visible = true;
    this.stats = stats;
  }
  
  hide(): void {
    this.visible = false;
  }
  
  isVisible(): boolean {
    return this.visible;
  }
  
  render(): void {
    if (!this.visible) return;
    
    // Draw game over window
    const windowWidth = 50;
    const windowHeight = 20;
    const startX = Math.floor((this.gridWidth - windowWidth) / 2);
    const startY = Math.floor((this.gridHeight - windowHeight) / 2);
    
    // Draw border and background
    this.drawWindow(startX, startY, windowWidth, windowHeight);
    
    // Draw title based on victory/defeat
    let y = startY + 2;
    if (this.stats.victory) {
      const victoryText = "*** VICTORY! ***";
      const victoryX = startX + Math.floor((windowWidth - victoryText.length) / 2);
      this.renderer.writeString(victoryX, y, victoryText, 0x00ff00);
      y += 2;
      
      const congratsText = "You have conquered the dungeon!";
      const congratsX = startX + Math.floor((windowWidth - congratsText.length) / 2);
      this.renderer.writeString(congratsX, y, congratsText, 0xffff00);
      y += 1;
      
      // Draw victory ASCII art
      const crown = "♔";
      const crownX = startX + Math.floor(windowWidth / 2);
      this.renderer.writeString(crownX, y, crown, 0xffff00);
      y += 2;
    } else {
      const deathText = "*** GAME OVER ***";
      const deathX = startX + Math.floor((windowWidth - deathText.length) / 2);
      this.renderer.writeString(deathX, y, deathText, 0xff0000);
      y += 2;
      
      const ripText = "You have died!";
      const ripX = startX + Math.floor((windowWidth - ripText.length) / 2);
      this.renderer.writeString(ripX, y, ripText, 0xaa0000);
      y += 1;
      
      // Draw death ASCII art
      const skull = "☠";
      const skullX = startX + Math.floor(windowWidth / 2);
      this.renderer.writeString(skullX, y, skull, 0xff0000);
      y += 2;
    }
    
    // Draw stats
    y += 1;
    const statsTitle = "=== FINAL STATS ===";
    const statsTitleX = startX + Math.floor((windowWidth - statsTitle.length) / 2);
    this.renderer.writeString(statsTitleX, y, statsTitle, 0xaaaaaa);
    y += 2;
    
    const floorText = `Floor Reached: ${this.stats.floor}${this.stats.victory ? ' (MAX)' : ''}`;
    this.renderer.writeString(startX + 5, y, floorText, 0xffffff);
    y += 1;
    
    const enemiesText = `Enemies Defeated: ${this.stats.enemiesKilled}`;
    this.renderer.writeString(startX + 5, y, enemiesText, 0xffffff);
    y += 1;
    
    const itemsText = `Items Collected: ${this.stats.itemsCollected}`;
    this.renderer.writeString(startX + 5, y, itemsText, 0xffffff);
    y += 3;
    
    // Draw restart instruction
    const restartText = "Press [F5] to play again";
    const restartX = startX + Math.floor((windowWidth - restartText.length) / 2);
    this.renderer.writeString(restartX, y, restartText, 0x00ffff);
  }
  
  private drawWindow(x: number, y: number, width: number, height: number): void {
    // Draw background (dark)
    const bgColor = this.stats.victory ? 0x002200 : 0x220000;
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        this.renderer.putGlyph(x + dx, y + dy, 32, 0x000000, bgColor);
      }
    }
    
    // Draw border
    const borderColor = this.stats.victory ? 0x00ff00 : 0xff0000;
    
    // Corners
    this.renderer.putGlyph(x, y, 201, borderColor, bgColor); // ╔
    this.renderer.putGlyph(x + width - 1, y, 187, borderColor, bgColor); // ╗
    this.renderer.putGlyph(x, y + height - 1, 200, borderColor, bgColor); // ╚
    this.renderer.putGlyph(x + width - 1, y + height - 1, 188, borderColor, bgColor); // ╝
    
    // Horizontal lines
    for (let dx = 1; dx < width - 1; dx++) {
      this.renderer.putGlyph(x + dx, y, 205, borderColor, bgColor); // ═
      this.renderer.putGlyph(x + dx, y + height - 1, 205, borderColor, bgColor); // ═
    }
    
    // Vertical lines
    for (let dy = 1; dy < height - 1; dy++) {
      this.renderer.putGlyph(x, y + dy, 186, borderColor, bgColor); // ║
      this.renderer.putGlyph(x + width - 1, y + dy, 186, borderColor, bgColor); // ║
    }
  }
}