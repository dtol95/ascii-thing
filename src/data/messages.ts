export interface WeightedMessage {
  text: string;
  weight: number;
  minFloor?: number;
  maxFloor?: number;
}

export interface RoomMessages {
  corridor: string[];
  largeRoom: string[];
  smallRoom: string[];
  entrance?: string[];
}

export const environmentalMessages = {
  ambient: [
    { text: "Water drips somewhere in the darkness...", weight: 2 },
    { text: "You hear skittering in the walls.", weight: 2 },
    { text: "A cold draft chills your bones.", weight: 1 },
    { text: "The air feels heavy and oppressive.", weight: 1 },
    { text: "Strange shadows dance at the edge of your vision.", weight: 1 },
    { text: "You hear distant echoes of... something.", weight: 1 },
    { text: "The walls seem to close in around you.", weight: 1, minFloor: 3 },
    { text: "An unnatural silence fills the air.", weight: 1 },
    { text: "You smell decay and ancient dust.", weight: 1 },
    { text: "Your footsteps echo ominously.", weight: 2 },
    { text: "Something moves in the shadows...", weight: 1, minFloor: 5 },
    { text: "The darkness feels alive.", weight: 1, minFloor: 7 },
    { text: "You sense you're being watched.", weight: 1, minFloor: 4 },
    { text: "Ancient stonework crumbles at your touch.", weight: 1 },
    { text: "Cobwebs brush against your face.", weight: 1 },
  ] as WeightedMessage[],
  
  roomEntry: {
    corridor: [
      "The narrow passage feels oppressive.",
      "Walls press in from both sides.",
      "You squeeze through the tight corridor.",
      "The passage stretches ahead into darkness."
    ],
    largeRoom: [
      "You enter a vast chamber.",
      "The room opens up before you.",
      "Shadows lurk in the far corners.",
      "Your torch barely illuminates the far walls."
    ],
    smallRoom: [
      "A cramped room surrounds you.",
      "The low ceiling makes you duck.",
      "There's barely room to swing a sword.",
      "The walls feel uncomfortably close."
    ],
    entrance: [
      "You descend into the dungeon...",
      "The entrance seals behind you.",
      "No turning back now.",
      "Your adventure begins."
    ]
  } as RoomMessages,
  
  stairsFound: [
    "You've found stairs leading deeper...",
    "A stairway descends into darkness.",
    "Stone steps spiral downward.",
    "The way down beckons ominously."
  ],
  
  itemSpotted: [
    "Something glints in the darkness.",
    "You spot something useful.",
    "An item catches your eye.",
    "There's something on the ground here."
  ],
  
  lowHealth: [
    "Your wounds ache terribly.",
    "You're badly injured.",
    "Blood drips from your wounds.",
    "You need healing, badly.",
    "Your vision blurs from pain."
  ]
};

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getWeightedMessage(messages: WeightedMessage[], currentFloor: number = 1): string | null {
  const filtered = messages.filter(m => 
    (!m.minFloor || currentFloor >= m.minFloor) &&
    (!m.maxFloor || currentFloor <= m.maxFloor)
  );
  
  if (filtered.length === 0) return null;
  
  const totalWeight = filtered.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const message of filtered) {
    random -= message.weight;
    if (random <= 0) return message.text;
  }
  
  return filtered[filtered.length - 1].text;
}