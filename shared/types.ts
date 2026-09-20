// Shared types between frontend and backend

export interface Stat {
  diplomacy: number;
  martial: number;
  stewardship: number;
  intrigue: number;
  learning: number;
  strength: number;
  agility: number;
  endurance: number;
}

export type HouseName = 
  | 'None'
  | 'Stark'
  | 'Lannister'
  | 'Targaryen'
  | 'Baratheon'
  | 'Greyjoy'
  | 'Martell'
  | 'Tyrell'
  | 'Tully'
  | 'Arryn';

export type RegionName =
  | 'North'
  | 'IronIslands'
  | 'Dorne'
  | 'TheReach'
  | 'Westerlands'
  | 'Stormlands'
  | 'Riverlands'
  | 'TheVale'
  | 'KingsLanding'
  | 'BeyondTheWall';

export type ProfessionName =
  | 'Soldier'
  | 'Blacksmith'
  | 'Merchant'
  | 'Priest'
  | 'Spy'
  | 'Healer'
  | 'Farmer'
  | 'Sailor'
  | 'Hunter'
  | 'Knight'
  | 'Scholar'
  | 'Thief';

export type EducationTrait =
  | 'CharismaticNegotiator'
  | 'TalentedTactician'
  | 'WealthArchitect'
  | 'SpiderMaster'
  | 'CunningIntellectual';

export type PersonalityTrait =
  | 'Brave'
  | 'Coward'
  | 'Wrathful'
  | 'Calm'
  | 'Lustful'
  | 'Chaste'
  | 'Ambitious'
  | 'Diligent'
  | 'Vengeful'
  | 'Greedy'
  | 'Generous'
  | 'Gregarious'
  | 'Shy'
  | 'Honest'
  | 'Deceitful'
  | 'Gluttonous'
  | 'Temperate'
  | 'Humble'
  | 'Proud'
  | 'Cynical'
  | 'Zealous'
  | 'Callous'
  | 'Sadistic'
  | 'Stubborn'
  | 'Just'
  | 'Paranoid'
  | 'Melancholic'
  | 'Irritable';

export type OtherTrait =
  | 'Pureblood'
  | 'Giant'
  | 'Strong'
  | 'Fertile'
  | 'Brave'
  | 'Beautiful'
  | 'Torturer'
  | 'Wise'
  | 'Physician'
  | 'Herbalist'
  | 'Melancholic'
  | 'Lunatic'
  | 'Lisp'
  | 'Stutter'
  | 'Dwarf'
  | 'Hunchback'
  | 'Maimed'
  | 'Scaly';

export type CombatTrait =
  | 'BraveRaider'
  | 'ShieldWall'
  | 'FaithfulSword'
  | 'RiverExpert'
  | 'SupplyMaster'
  | 'VirtuosoOrganizer'
  | 'RaiderLeader'
  | 'ForestGhost'
  | 'PlainsMaster'
  | 'TerrainMaster'
  | 'DesertTiger'
  | 'WinterSoldier'
  | 'SiegeMaster';

export type Period = 'RobertsRebellion' | 'GameOfThrones';

export interface House {
  name: HouseName;
  bonuses: Partial<Stat>;
  description: string;
  words: string;
  region: RegionName;
}

export interface Region {
  name: RegionName;
  bonuses: Partial<Stat>;
  description: string;
  culture: string;
}

export interface Profession {
  name: ProfessionName;
  bonuses: Partial<Stat>;
  weeklyIncome: {
    min: number;
    max: number;
    currency: 'copper' | 'silver' | 'gold';
  };
  description: string;
}

export interface Trait {
  name: string;
  type: 'education' | 'personality' | 'other' | 'combat';
  cost: number;
  bonuses?: Partial<Stat>;
  requirements?: {
    stat?: keyof Stat;
    minValue?: number;
    height?: number;
    excludes?: string[];
  };
  description: string;
}

export interface Character {
  _id?: string;
  userId: string;
  
  // Step 1: Identity
  name: string;
  age: number;
  gender: 'male' | 'female';
  birthStatus: 'legitimate' | 'bastard';
  
  // Step 2: Origin
  house: HouseName;
  region: RegionName;
  profession: ProfessionName;
  
  // Step 3: Appearance
  appearance: {
    height: number;
    weight: number;
    hairColor: string;
    hairLength: string;
    hairStyle: string;
    eyeColor: string;
    skinTone: string;
    faceType: string;
    beard?: string;
    bodyType: string;
  };
  
  // Step 4: Stats
  baseStats: Stat;
  currentStats: Stat; // includes bonuses
  
  // Step 5: Traits
  traits: {
    education?: EducationTrait;
    personality: PersonalityTrait[];
    other: OtherTrait[];
    combat: CombatTrait[];
  };
  
  // Game data
  period: Period;
  level: number;
  experience: number;
  statExperience: Partial<Record<keyof Stat, number>>;
  
  // Resources
  currency: {
    gold: number;
    silver: number;
    copper: number;
  };
  
  reputation: number;
  reputationLevel: 'Common' | 'Known' | 'Ser' | 'Lord' | 'Legendary';
  
  // Combat
  health: number;
  maxHealth: number;
  injuries: Injury[];
  
  // Army
  troops: Troop[];
  
  // Location
  location: {
    x: number;
    y: number;
    region: RegionName;
  };
  
  // Equipment
  equipment: {
    weapon?: Weapon;
    armor: ArmorSet;
    horse?: Horse;
  };
  
  // Relationships
  relationships: Relationship[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Injury {
  severity: 'light' | 'medium' | 'heavy' | 'critical';
  description: string;
  healingTime: number; // in days
  acquiredAt: Date;
}

export interface Troop {
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  type: string;
  count: number;
  experience: number;
  power: number;
}

export interface Weapon {
  name: string;
  quality: 'iron' | 'steel' | 'valyrian';
  damage: number;
  bonus: number;
}

export interface ArmorSet {
  helmet?: ArmorPiece;
  chestplate?: ArmorPiece;
  gauntlets?: ArmorPiece;
  gloves?: ArmorPiece;
  leggings?: ArmorPiece;
  boots?: ArmorPiece;
}

export interface ArmorPiece {
  slot: 'helmet' | 'chestplate' | 'gauntlets' | 'gloves' | 'leggings' | 'boots';
  type: 'leather' | 'chain' | 'plate' | 'valyrian';
  defense: number;
  agilityPenalty: number;
}

export interface Horse {
  name: string;
  type: 'common' | 'warhorse' | 'dothraki' | 'bloodhorse';
  speed: number;
  combatBonus: number;
}

export interface Relationship {
  characterId: string;
  type: 'friend' | 'rival' | 'lover' | 'spouse' | 'family' | 'enemy';
  value: number; // -100 to 100
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  characters: string[]; // Character IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Quest {
  _id?: string;
  title: string;
  description: string;
  source: 'tavern' | 'lord' | 'village' | 'guild';
  type: 'courier' | 'bandit' | 'information' | 'mediation' | 'escort' | 'hunt';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  rewards: {
    gold?: number;
    silver?: number;
    copper?: number;
    reputation?: number;
    items?: string[];
  };
  requirements?: {
    level?: number;
    reputation?: number;
    stats?: Partial<Stat>;
  };
  location: RegionName;
  active: boolean;
}

export interface WorldEvent {
  _id?: string;
  title: string;
  description: string;
  period: Period;
  triggerDate?: Date;
  effects: {
    houses?: { house: HouseName; powerChange: number }[];
    regions?: { region: RegionName; controlChange: string }[];
    characters?: { characterId: string; effectDescription: string }[];
  };
  playerChoices?: {
    description: string;
    options: {
      text: string;
      consequences: string;
    }[];
  };
}
