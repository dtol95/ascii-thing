export type Entity = number;

export interface Position {
  x: number;
  y: number;
}

export interface RenderGlyph {
  code: number;
  fg: number;
  bg?: number;
  z: number;
}

export interface Blocks {
  blocks: boolean;
}

export interface Transparent {
  transparent: boolean;
}

export interface Light {
  radius: number;
  intensity: number;
  color: number;
}

export type FactionKind = "player" | "mob" | "neutral";

export interface Faction {
  kind: FactionKind;
}

export interface Actor {
  energy: number;
  speed: number;
}

export interface Health {
  hp: number;
  max: number;
  armor: number;
}

export interface Inventory {
  slots: Entity[];
}

export type DamageType = "phys" | "fire" | "cold" | "poison" | "arcane";

export interface Melee {
  damageMin: number;
  damageMax: number;
  type: DamageType;
}

export interface Ranged {
  range: number;
  projectile: string;
}

export type StatusEffectType = "burn" | "poison" | "slow" | "stun";

export interface StatusEffect {
  type: StatusEffectType;
  turns: number;
  damage?: number;
}

export interface Status {
  effects: StatusEffect[];
}

export type BrainKind = "wander" | "hunt" | "flee" | "boss";

export interface Brain {
  kind: BrainKind;
  params: any;
}

export type ParticleOn = "move" | "hit" | "death" | "loop";

export interface ParticleEmitter {
  preset: string;
  on: ParticleOn;
}

export interface Lifetime {
  turns: number;
}

export interface Name {
  name: string;
}

export interface Player {
  isPlayer: boolean;
}

export interface Tile {
  walkable: boolean;
  blocksLight: boolean;
}

export interface Item {
  type: string;
  data: any;
}