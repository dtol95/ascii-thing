export class RNG {
  private static instance: RNG;
  private seed: number;
  private state: number;

  private constructor(seed?: number) {
    this.seed = seed || Date.now();
    this.state = this.seed;
  }

  static getInstance(seed?: number): RNG {
    if (!RNG.instance || seed !== undefined) {
      RNG.instance = new RNG(seed);
    }
    return RNG.instance;
  }

  getSeed(): number {
    return this.seed;
  }

  setSeed(seed: number): void {
    this.seed = seed;
    this.state = seed;
  }

  private mulberry32(): number {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  random(): number {
    return this.mulberry32();
  }

  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  randomChoice<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.randomInt(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  chance(probability: number): boolean {
    return this.random() < probability;
  }
}