export interface DeathContext {
  killerName?: string;
  floor: number;
  turnsAlive: number;
  enemiesKilled: number;
  lowHealth?: boolean;
}

export const deathMessages = {
  byEnemy: {
    rat: [
      "The rats overwhelm you in the darkness...",
      "Tiny teeth and claws prove your undoing.",
      "Death by a thousand tiny bites.",
      "The vermin claim another victim."
    ],
    goblin: [
      "The goblin's blade finds your heart.",
      "Outsmarted by a goblin. How embarrassing.",
      "The goblin cackles as you fall.",
      "Green skin, sharp blade, your end."
    ],
    orc: [
      "The orc's massive club crushes you.",
      "Brute force wins this day.",
      "The orc roars in victory.",
      "You are no match for orcish strength."
    ],
    skeleton: [
      "The skeleton's bony fingers squeeze the life from you.",
      "Death comes for you... literally.",
      "Bones rattle as you fall.",
      "The undead claim another soul."
    ],
    default: [
      "You have been slain by {killer}.",
      "The {killer} proves too strong.",
      "{killer} stands victorious over your corpse.",
      "Your journey ends at the hands of {killer}."
    ]
  },
  
  byEnvironment: {
    starvation: [
      "You collapse from exhaustion and hunger.",
      "Without food, your body gives out.",
      "Starvation claims you in the depths."
    ],
    poison: [
      "The poison finally overcomes you.",
      "Your veins burn as the toxin takes hold.",
      "You succumb to the venom."
    ],
    trap: [
      "You failed to spot the trap in time.",
      "Ancient mechanisms seal your fate.",
      "The dungeon's defenses claim another."
    ],
    fall: [
      "You tumble into the abyss.",
      "The ground gives way beneath you.",
      "A fatal misstep ends your journey."
    ]
  },
  
  hints: {
    early: [
      "Tip: Use corridors to fight enemies one at a time.",
      "Tip: Save health potions for emergencies.",
      "Tip: Press '?' to view controls.",
      "Tip: Don't let enemies surround you."
    ],
    mid: [
      "Tip: Some enemies are best avoided.",
      "Tip: Explore thoroughly for better items.",
      "Tip: Learn enemy patterns to survive.",
      "Tip: Retreat is sometimes the best option."
    ],
    late: [
      "Tip: The deeper you go, the deadlier it gets.",
      "Tip: Boss enemies require special tactics.",
      "Tip: Manage your resources carefully.",
      "You were so close! Try again?"
    ]
  },
  
  epitaphs: [
    "Here lies an adventurer, brave but foolish.",
    "Another soul lost to the dungeon.",
    "They came seeking glory, found only death.",
    "R.I.P. - Really Incompetent Player",
    "Died as they lived: poorly.",
    "At least you tried.",
    "The dungeon hungers for more...",
    "Your bones will warn the next adventurer."
  ]
};

export function getDeathMessage(context: DeathContext): {
  message: string;
  hint?: string;
  epitaph?: string;
} {
  let message = "";
  let hint = "";
  let epitaph = "";
  
  // Get main death message
  if (context.killerName) {
    const killerType = context.killerName.toLowerCase();
    const specificMessages = deathMessages.byEnemy[killerType as keyof typeof deathMessages.byEnemy];
    
    if (specificMessages && Array.isArray(specificMessages)) {
      message = specificMessages[Math.floor(Math.random() * specificMessages.length)];
    } else {
      const defaultMsg = deathMessages.byEnemy.default[
        Math.floor(Math.random() * deathMessages.byEnemy.default.length)
      ];
      message = defaultMsg.replace('{killer}', context.killerName);
    }
  }
  
  // Get hint based on progress
  let hintCategory: 'early' | 'mid' | 'late' = 'early';
  if (context.floor > 7) hintCategory = 'late';
  else if (context.floor > 3) hintCategory = 'mid';
  
  const hints = deathMessages.hints[hintCategory];
  hint = hints[Math.floor(Math.random() * hints.length)];
  
  // Get random epitaph
  if (Math.random() < 0.3) { // 30% chance for epitaph
    epitaph = deathMessages.epitaphs[
      Math.floor(Math.random() * deathMessages.epitaphs.length)
    ];
  }
  
  return { message, hint, epitaph };
}