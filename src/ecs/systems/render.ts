import { System } from '../system';
import type { Position, RenderGlyph } from '../components';
import type { AsciiRenderer } from '../../gfx/renderer';
import type { World } from '../world';
import type { EventBus } from '../events';
import type { FOVSystem } from './fov';
import type { LightingSystem } from './lighting';

export class RenderSystem extends System {
  private fovSystem?: FOVSystem;
  private lightingSystem?: LightingSystem;
  
  constructor(
    world: World,
    events: EventBus,
    private renderer: AsciiRenderer
  ) {
    super(world, events);
  }

  setFOVSystem(fovSystem: FOVSystem): void {
    this.fovSystem = fovSystem;
  }

  setLightingSystem(lightingSystem: LightingSystem): void {
    this.lightingSystem = lightingSystem;
  }

  update(_deltaTime: number): void {
    this.renderer.clear();
    
    const renderables = this.world.getEntitiesWithComponents('Position', 'RenderGlyph');
    
    renderables.sort((a, b) => {
      const glyphA = this.world.getComponent<RenderGlyph>(a, 'RenderGlyph')!;
      const glyphB = this.world.getComponent<RenderGlyph>(b, 'RenderGlyph')!;
      return glyphA.z - glyphB.z;
    });
    
    for (const entity of renderables) {
      const position = this.world.getComponent<Position>(entity, 'Position')!;
      const glyph = this.world.getComponent<RenderGlyph>(entity, 'RenderGlyph')!;
      
      if (this.fovSystem) {
        const isVisible = this.fovSystem.isVisible(position.x, position.y);
        const isSeen = this.fovSystem.isSeen(position.x, position.y);
        
        if (isVisible) {
          let fg = glyph.fg;
          
          // Make enemies more visible by ensuring minimum brightness
          const hasHealth = this.world.getComponent<any>(entity, 'Health');
          if (hasHealth && glyph.z > 5) { // Likely an actor
            const minBrightness = 0x606060;
            const r = Math.max((fg >> 16) & 0xff, (minBrightness >> 16) & 0xff);
            const g = Math.max((fg >> 8) & 0xff, (minBrightness >> 8) & 0xff);
            const b = Math.max(fg & 0xff, minBrightness & 0xff);
            fg = (r << 16) | (g << 8) | b;
          }
          
          if (this.lightingSystem) {
            const light = this.lightingSystem.getLightAt(position.x, position.y);
            if (light && light.intensity > 0) {
              fg = this.lightingSystem.mixColors(fg, light.color, light.intensity * 0.3);
            }
          }
          
          this.renderer.putGlyph(position.x, position.y, glyph.code, fg, glyph.bg);
        } else if (isSeen) {
          const memoryColor = this.dimColor(glyph.fg, 0.3);
          this.renderer.putGlyph(position.x, position.y, glyph.code, memoryColor, glyph.bg ? this.dimColor(glyph.bg, 0.3) : undefined);
        }
      } else {
        this.renderer.putGlyph(position.x, position.y, glyph.code, glyph.fg, glyph.bg);
      }
    }
    
    this.renderer.beginFrame();
    this.renderer.endFrame();
  }

  private dimColor(color: number, factor: number): number {
    const r = Math.floor(((color >> 16) & 0xff) * factor);
    const g = Math.floor(((color >> 8) & 0xff) * factor);
    const b = Math.floor((color & 0xff) * factor);
    return (r << 16) | (g << 8) | b;
  }
}