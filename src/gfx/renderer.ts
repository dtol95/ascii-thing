import { Application, Sprite, Texture, Container, Rectangle } from 'pixi.js';
import { generateFontTexture } from './fontGenerator';
import { getGlyphCode, DEFAULT_ATLAS_CONFIG, type GlyphAtlasConfig } from './glyphAtlas';
import { ParticleSystem } from './particles';

export interface RendererConfig {
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  atlasConfig?: GlyphAtlasConfig;
}

export class AsciiRenderer {
  private app: Application;
  private container: Container;
  private glyphTextures: Texture[] = [];
  private gridSprites: Sprite[][] = [];
  private bgSprites: Sprite[][] = [];
  private config: Required<RendererConfig>;
  private baseTexture!: Texture;
  private particleSystem!: ParticleSystem;

  constructor(config: RendererConfig) {
    this.config = {
      ...config,
      atlasConfig: config.atlasConfig || DEFAULT_ATLAS_CONFIG
    };

    this.app = new Application();
    this.container = new Container();
  }

  async init(parent: HTMLElement): Promise<void> {
    await this.app.init({
      width: this.config.gridWidth * this.config.cellSize,
      height: this.config.gridHeight * this.config.cellSize,
      backgroundColor: 0x0a0a0a,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });

    parent.appendChild(this.app.canvas);
    this.app.stage.addChild(this.container);

    this.createGlyphTextures();
    // Initialize particle system first so particles render behind sprites
    this.particleSystem = new ParticleSystem(this.container, this.glyphTextures);
    this.initGrid();
  }

  private createGlyphTextures(): void {
    const fontCanvas = generateFontTexture(this.config.atlasConfig);
    this.baseTexture = Texture.from(fontCanvas);
    
    const { glyphWidth, glyphHeight, columns } = this.config.atlasConfig;
    
    for (let i = 0; i < 256; i++) {
      const x = (i % columns) * glyphWidth;
      const y = Math.floor(i / columns) * glyphHeight;
      
      const rect = new Rectangle(x, y, glyphWidth, glyphHeight);
      const texture = new Texture({
        source: this.baseTexture.source,
        frame: rect
      });
      this.glyphTextures.push(texture);
    }
  }

  private initGrid(): void {
    const { gridWidth, gridHeight, cellSize } = this.config;
    const scaleX = cellSize / this.config.atlasConfig.glyphWidth;
    const scaleY = cellSize / this.config.atlasConfig.glyphHeight;
    const scale = Math.min(scaleX, scaleY);
    
    for (let y = 0; y < gridHeight; y++) {
      this.bgSprites[y] = [];
      this.gridSprites[y] = [];
      
      for (let x = 0; x < gridWidth; x++) {
        const bgSprite = new Sprite(this.glyphTextures[219]);
        bgSprite.position.set(x * cellSize, y * cellSize);
        bgSprite.scale.set(scale);
        bgSprite.tint = 0x000000;
        bgSprite.visible = false;
        this.container.addChild(bgSprite);
        this.bgSprites[y][x] = bgSprite;
        
        const sprite = new Sprite(this.glyphTextures[0]);
        sprite.position.set(x * cellSize, y * cellSize);
        sprite.scale.set(scale);
        sprite.tint = 0xffffff;
        this.container.addChild(sprite);
        this.gridSprites[y][x] = sprite;
      }
    }
  }

  putGlyph(x: number, y: number, code: number, fg: number, bg?: number): void {
    if (x < 0 || x >= this.config.gridWidth || y < 0 || y >= this.config.gridHeight) {
      return;
    }
    
    // Additional safety check for uninitialized arrays
    if (!this.gridSprites[y] || !this.gridSprites[y][x]) {
      console.warn(`Grid sprites not initialized at [${x}, ${y}]`);
      return;
    }
    
    const sprite = this.gridSprites[y][x];
    const bgSprite = this.bgSprites[y][x];
    
    sprite.texture = this.glyphTextures[code & 0xff];
    sprite.tint = fg;
    
    if (bg !== undefined && bg !== 0x000000) {
      bgSprite.visible = true;
      bgSprite.tint = bg;
    } else {
      bgSprite.visible = false;
    }
  }

  writeString(x: number, y: number, text: string, fg: number, bg?: number): void {
    for (let i = 0; i < text.length; i++) {
      const code = getGlyphCode(text[i]);
      this.putGlyph(x + i, y, code, fg, bg);
    }
  }

  clear(): void {
    for (let y = 0; y < this.config.gridHeight; y++) {
      for (let x = 0; x < this.config.gridWidth; x++) {
        this.putGlyph(x, y, 0, 0xffffff);
      }
    }
  }

  beginFrame(): void {
  }

  endFrame(): void {
    this.particleSystem.update(16);
    this.app.renderer.render(this.app.stage);
  }

  floatText(x: number, y: number, text: string, color: number): void {
    // Convert grid coordinates to pixel coordinates
    const pixelX = x * this.config.cellSize + this.config.cellSize / 2;
    const pixelY = y * this.config.cellSize;
    
    // Spawn floating text particles for damage numbers
    this.particleSystem.spawnFloatingText(pixelX, pixelY, text, color);
  }

  spawnParticles(gridX: number, gridY: number, preset: string): void {
    const pixelX = gridX * this.config.cellSize + this.config.cellSize / 2;
    const pixelY = gridY * this.config.cellSize + this.config.cellSize / 2;
    this.particleSystem.spawn(pixelX, pixelY, preset);
  }

  getParticleCount(): number {
    return this.particleSystem.getParticleCount();
  }

  destroy(): void {
    this.app.destroy(true);
  }
}