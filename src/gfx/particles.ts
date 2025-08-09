import { Container, Sprite, Texture } from 'pixi.js';

export interface Particle {
  sprite: Sprite;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  fadeOut: boolean;
  scale: number;
  scaleSpeed: number;
  gravity: number;
}

export interface ParticlePreset {
  count: number;
  speed: number;
  speedVariance: number;
  life: number;
  lifeVariance: number;
  angle: number;
  angleVariance: number;
  color: number;
  colorVariance: number;
  scale: number;
  scaleVariance: number;
  scaleSpeed: number;
  gravity: number;
  fadeOut: boolean;
  glyphCode: number;
}

export const PARTICLE_PRESETS: { [key: string]: ParticlePreset } = {
  stepDust: {
    count: 3,
    speed: 50,
    speedVariance: 30,
    life: 0.2,
    lifeVariance: 0.1,
    angle: Math.PI,
    angleVariance: Math.PI,
    color: 0x808080,
    colorVariance: 0x202020,
    scale: 0.3,
    scaleVariance: 0.1,
    scaleSpeed: -0.5,
    gravity: 0,
    fadeOut: true,
    glyphCode: 250
  },
  hitSpark: {
    count: 12,
    speed: 120,
    speedVariance: 40,
    life: 0.15,
    lifeVariance: 0.05,
    angle: Math.PI,
    angleVariance: Math.PI,
    color: 0xffff00,
    colorVariance: 0x404000,
    scale: 0.8,
    scaleVariance: 0.3,
    scaleSpeed: -1.0,
    gravity: 0,
    fadeOut: true,
    glyphCode: 42
  },
  bloodPuff: {
    count: 6,
    speed: 60,
    speedVariance: 20,
    life: 0.3,
    lifeVariance: 0.2,
    angle: -Math.PI / 2,
    angleVariance: Math.PI / 4,
    color: 0xaa0000,
    colorVariance: 0x200000,
    scale: 0.4,
    scaleVariance: 0.2,
    scaleSpeed: -0.3,
    gravity: 150,
    fadeOut: true,
    glyphCode: 7
  },
  fireEmber: {
    count: 6,
    speed: 30,
    speedVariance: 10,
    life: 1.0,
    lifeVariance: 0.3,
    angle: -Math.PI / 2,
    angleVariance: Math.PI / 8,
    color: 0xff8800,
    colorVariance: 0x404000,
    scale: 0.5,
    scaleVariance: 0.2,
    scaleSpeed: -0.2,
    gravity: -50,
    fadeOut: true,
    glyphCode: 15
  },
  poisonMote: {
    count: 4,
    speed: 20,
    speedVariance: 10,
    life: 1.5,
    lifeVariance: 0.5,
    angle: Math.PI,
    angleVariance: Math.PI,
    color: 0x00ff00,
    colorVariance: 0x004000,
    scale: 0.4,
    scaleVariance: 0.1,
    scaleSpeed: 0.1,
    gravity: 0,
    fadeOut: true,
    glyphCode: 247
  }
};

export class ParticleSystem {
  private container: Container;
  private particles: Particle[] = [];
  private glyphTextures: Texture[];
  
  constructor(parent: Container, glyphTextures: Texture[]) {
    this.container = new Container();
    this.glyphTextures = glyphTextures;
    parent.addChild(this.container);
  }

  spawn(x: number, y: number, preset: string | ParticlePreset): void {
    const config = typeof preset === 'string' ? PARTICLE_PRESETS[preset] : preset;
    if (!config) return;

    for (let i = 0; i < config.count; i++) {
      const angle = config.angle + (Math.random() - 0.5) * config.angleVariance;
      const speed = config.speed + (Math.random() - 0.5) * config.speedVariance;
      const life = config.life + (Math.random() - 0.5) * config.lifeVariance;
      const scale = config.scale + (Math.random() - 0.5) * config.scaleVariance;
      
      const sprite = new Sprite(this.glyphTextures[config.glyphCode]);
      sprite.position.set(x, y);
      sprite.scale.set(scale);
      sprite.tint = this.varyColor(config.color, config.colorVariance);
      sprite.anchor.set(0.5);
      
      const particle: Particle = {
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        fadeOut: config.fadeOut,
        scale,
        scaleSpeed: config.scaleSpeed,
        gravity: config.gravity
      };
      
      this.particles.push(particle);
      this.container.addChild(sprite);
    }
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.life -= dt;
      
      if (particle.life <= 0) {
        this.container.removeChild(particle.sprite);
        particle.sprite.destroy();
        this.particles.splice(i, 1);
        continue;
      }
      
      particle.sprite.x += particle.vx * dt;
      particle.sprite.y += particle.vy * dt;
      
      particle.vy += particle.gravity * dt;
      
      particle.scale += particle.scaleSpeed * dt;
      particle.sprite.scale.set(Math.max(0.1, particle.scale));
      
      if (particle.fadeOut) {
        particle.sprite.alpha = particle.life / particle.maxLife;
      }
    }
  }

  private varyColor(base: number, variance: number): number {
    const r = ((base >> 16) & 0xff) + Math.floor((Math.random() - 0.5) * ((variance >> 16) & 0xff));
    const g = ((base >> 8) & 0xff) + Math.floor((Math.random() - 0.5) * ((variance >> 8) & 0xff));
    const b = (base & 0xff) + Math.floor((Math.random() - 0.5) * (variance & 0xff));
    
    return ((Math.max(0, Math.min(255, r)) << 16) |
            (Math.max(0, Math.min(255, g)) << 8) |
             Math.max(0, Math.min(255, b)));
  }

  clear(): void {
    for (const particle of this.particles) {
      this.container.removeChild(particle.sprite);
      particle.sprite.destroy();
    }
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  spawnFloatingText(x: number, y: number, text: string, color: number): void {
    // Create floating text that drifts upward and fades out
    // Use individual character sprites for ASCII text
    const startX = x - (text.length * 4); // Center the text
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const sprite = new Sprite(this.glyphTextures[charCode]);
      sprite.position.set(startX + i * 8, y);
      sprite.scale.set(0.8);
      sprite.tint = color;
      sprite.anchor.set(0.5);
      
      const particle: Particle = {
        sprite,
        vx: 0,
        vy: -30, // Float upward
        life: 0.5,
        maxLife: 0.5,
        fadeOut: true,
        scale: 0.8,
        scaleSpeed: 0.2, // Grow slightly
        gravity: -10 // Slight upward acceleration
      };
      
      this.particles.push(particle);
      this.container.addChild(sprite);
    }
  }
}