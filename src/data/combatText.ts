export interface CombatTextOptions {
  enemy?: string;
  damage?: number;
  maxDamage?: number;
}

export const combatMessages = {
  playerAttack: {
    miss: [
      "You swing and miss!",
      "Your attack goes wide.",
      "The {enemy} dodges your attack.",
      "You stumble and miss."
    ],
    weak: [
      "You barely scratch the {enemy}.",
      "A glancing blow to the {enemy}.",
      "You graze the {enemy}.",
      "Your weak strike connects."
    ],
    normal: [
      "You strike the {enemy}!",
      "A solid hit to the {enemy}!",
      "You wound the {enemy}.",
      "Your attack finds its mark!"
    ],
    strong: [
      "You deliver a crushing blow to the {enemy}!",
      "Critical strike against the {enemy}!",
      "You devastate the {enemy} with a powerful attack!",
      "A mighty blow sends the {enemy} reeling!"
    ],
    kill: [
      "You slay the {enemy}!",
      "The {enemy} falls before you!",
      "Victory! The {enemy} is defeated.",
      "Your final blow destroys the {enemy}."
    ]
  },
  
  enemyAttack: {
    miss: [
      "The {enemy} misses you.",
      "You dodge the {enemy}'s attack.",
      "The {enemy} swings wildly and misses.",
      "You sidestep the {enemy}'s attack."
    ],
    weak: [
      "The {enemy} grazes you.",
      "The {enemy} barely hits you.",
      "A glancing blow from the {enemy}.",
      "The {enemy}'s weak attack connects."
    ],
    normal: [
      "The {enemy} hits you!",
      "The {enemy} wounds you.",
      "You take a hit from the {enemy}.",
      "The {enemy}'s attack connects!"
    ],
    strong: [
      "The {enemy} lands a vicious blow!",
      "Critical hit from the {enemy}!",
      "The {enemy} strikes you hard!",
      "A devastating attack from the {enemy}!"
    ]
  },
  
  enemyBehavior: {
    spotted: [
      "The {enemy} notices you!",
      "The {enemy} turns toward you menacingly.",
      "The {enemy} hisses at you!",
      "You've caught the {enemy}'s attention."
    ],
    hunting: [
      "The {enemy} stalks toward you.",
      "The {enemy} moves to attack!",
      "The {enemy} closes in.",
      "The {enemy} advances aggressively."
    ],
    fleeing: [
      "The {enemy} tries to flee!",
      "The {enemy} backs away fearfully.",
      "The {enemy} retreats!",
      "The {enemy} cowers in fear."
    ]
  }
};

export function getDamageCategory(damage: number, maxDamage: number): 'miss' | 'weak' | 'normal' | 'strong' {
  if (damage === 0) return 'miss';
  const ratio = damage / maxDamage;
  if (ratio < 0.3) return 'weak';
  if (ratio < 0.7) return 'normal';
  return 'strong';
}

export function formatCombatMessage(template: string, options: CombatTextOptions): string {
  let result = template;
  if (options.enemy) {
    result = result.replace('{enemy}', options.enemy);
  }
  if (options.damage !== undefined) {
    result = result.replace('{damage}', options.damage.toString());
  }
  return result;
}

export function getRandomCombatMessage(
  messages: string[], 
  options: CombatTextOptions = {}
): string {
  const template = messages[Math.floor(Math.random() * messages.length)];
  return formatCombatMessage(template, options);
}