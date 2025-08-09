export interface FloorTheme {
  name: string;
  description: string;
  ambientMessages: string[];
  enterMessage: string;
  colorTint?: number; // Optional color modifier for this floor
}

export const floorThemes: Record<number, FloorTheme> = {
  1: {
    name: "Dungeon Entrance",
    description: "The upper levels, recently abandoned",
    ambientMessages: [
      "Fresh air still reaches here from above.",
      "You can almost see daylight behind you.",
      "These halls were inhabited recently.",
      "Footprints in the dust lead deeper."
    ],
    enterMessage: "You enter the dungeon, leaving the world above behind...",
    colorTint: 0xcccccc
  },
  
  2: {
    name: "Abandoned Halls",
    description: "Once-occupied chambers now empty",
    ambientMessages: [
      "Broken furniture litters the floor.",
      "Old torches still smolder in their sconces.",
      "Signs of a hasty evacuation are everywhere.",
      "Something drove the inhabitants away..."
    ],
    enterMessage: "The halls grow quieter as you descend.",
    colorTint: 0xaaaaaa
  },
  
  3: {
    name: "Forgotten Chambers",
    description: "Ancient rooms untouched for years",
    ambientMessages: [
      "Thick dust coats everything.",
      "Cobwebs span every corner.",
      "The air tastes stale and old.",
      "These rooms have been sealed for ages."
    ],
    enterMessage: "You enter the forgotten chambers of the dungeon.",
    colorTint: 0x999999
  },
  
  4: {
    name: "The Warrens",
    description: "Twisting passages and small chambers",
    ambientMessages: [
      "The walls close in around you.",
      "Passages branch in all directions.",
      "You're losing your sense of direction.",
      "Is that the way you came from?"
    ],
    enterMessage: "The dungeon becomes a maze of passages.",
    colorTint: 0x888888
  },
  
  5: {
    name: "The Deep Halls",
    description: "Far from the surface world",
    ambientMessages: [
      "No natural light has ever reached here.",
      "The weight of stone above is oppressive.",
      "Strange fungi glow in the corners.",
      "The darkness seems almost solid."
    ],
    enterMessage: "You descend into the deep halls, far from safety.",
    colorTint: 0x777777
  },
  
  6: {
    name: "The Catacombs",
    description: "Ancient burial grounds",
    ambientMessages: [
      "Bones crunch under your feet.",
      "Empty alcoves line the walls.",
      "Death permeates this place.",
      "The dead do not rest easy here."
    ],
    enterMessage: "You enter the catacombs. The air reeks of death.",
    colorTint: 0x666666
  },
  
  7: {
    name: "The Depths",
    description: "Deep underground caverns",
    ambientMessages: [
      "Water drips from stalactites above.",
      "The walls are wet and slippery.",
      "Strange sounds echo from below.",
      "You've never been this deep before."
    ],
    enterMessage: "The constructed halls give way to natural caverns.",
    colorTint: 0x555555
  },
  
  8: {
    name: "The Abyss Edge",
    description: "Passages near the great void",
    ambientMessages: [
      "You hear a distant, endless falling of water.",
      "Chasms open into impenetrable darkness.",
      "One wrong step could be your last.",
      "The abyss calls to you..."
    ],
    enterMessage: "You stand at the edge of the abyss.",
    colorTint: 0x444444
  },
  
  9: {
    name: "The Inner Sanctum",
    description: "Sacred chambers of ancient evil",
    ambientMessages: [
      "Unholy symbols cover the walls.",
      "You feel a malevolent presence.",
      "The very air opposes your presence.",
      "Dark magic crackles in the air."
    ],
    enterMessage: "You breach the inner sanctum. Evil dwells here.",
    colorTint: 0x333333
  },
  
  10: {
    name: "The Heart of Darkness",
    description: "The source of all evil",
    ambientMessages: [
      "This is it. The final floor.",
      "Ancient evil stirs at your approach.",
      "The darkness here is almost alive.",
      "Your quest nears its end, one way or another."
    ],
    enterMessage: "You've reached the heart of darkness. This is the end.",
    colorTint: 0x222222
  }
};

export function getFloorTheme(floor: number): FloorTheme {
  return floorThemes[floor] || {
    name: "Unknown Depths",
    description: "Uncharted territory",
    ambientMessages: ["You've gone deeper than any map shows."],
    enterMessage: "You enter unknown depths..."
  };
}

export function getFloorAmbientMessage(floor: number): string | null {
  const theme = getFloorTheme(floor);
  if (theme.ambientMessages.length === 0) return null;
  return theme.ambientMessages[Math.floor(Math.random() * theme.ambientMessages.length)];
}