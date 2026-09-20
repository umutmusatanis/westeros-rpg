import mongoose, { Schema, Document } from 'mongoose';
import { Character as ICharacter } from '../../../shared/types';

export interface ICharacterDocument extends Omit<ICharacter, '_id'>, Document {}

const StatSchema = new Schema({
  diplomacy: { type: Number, required: true, min: 3, max: 30 },
  martial: { type: Number, required: true, min: 3, max: 30 },
  stewardship: { type: Number, required: true, min: 3, max: 30 },
  intrigue: { type: Number, required: true, min: 3, max: 30 },
  learning: { type: Number, required: true, min: 3, max: 30 },
  strength: { type: Number, required: true, min: 3, max: 30 },
  agility: { type: Number, required: true, min: 3, max: 30 },
  endurance: { type: Number, required: true, min: 3, max: 30 },
}, { _id: false });

const AppearanceSchema = new Schema({
  height: { type: Number, required: true, min: 140, max: 220 },
  weight: { type: Number, required: true, min: 40, max: 200 },
  hairColor: { type: String, required: true },
  hairLength: { type: String, required: true },
  hairStyle: { type: String, required: true },
  eyeColor: { type: String, required: true },
  skinTone: { type: String, required: true },
  faceType: { type: String, required: true },
  beard: { type: String },
  bodyType: { type: String, required: true },
}, { _id: false });

const TraitsSchema = new Schema({
  education: { type: String },
  personality: [{ type: String }],
  other: [{ type: String }],
  combat: [{ type: String }],
}, { _id: false });

const CurrencySchema = new Schema({
  gold: { type: Number, default: 0, min: 0 },
  silver: { type: Number, default: 0, min: 0 },
  copper: { type: Number, default: 10, min: 0 },
}, { _id: false });

const InjurySchema = new Schema({
  severity: { 
    type: String, 
    enum: ['light', 'medium', 'heavy', 'critical'],
    required: true 
  },
  description: { type: String, required: true },
  healingTime: { type: Number, required: true },
  acquiredAt: { type: Date, default: Date.now },
}, { _id: false });

const TroopSchema = new Schema({
  tier: { type: Number, required: true, min: 1, max: 6 },
  type: { type: String, required: true },
  count: { type: Number, required: true, min: 0 },
  experience: { type: Number, default: 0, min: 0 },
  power: { type: Number, required: true },
}, { _id: false });

const WeaponSchema = new Schema({
  name: { type: String, required: true },
  quality: { type: String, enum: ['iron', 'steel', 'valyrian'], required: true },
  damage: { type: Number, required: true },
  bonus: { type: Number, required: true },
}, { _id: false });

const ArmorPieceSchema = new Schema({
  slot: { 
    type: String, 
    enum: ['helmet', 'chestplate', 'gauntlets', 'gloves', 'leggings', 'boots'],
    required: true 
  },
  type: { type: String, enum: ['leather', 'chain', 'plate', 'valyrian'], required: true },
  defense: { type: Number, required: true },
  agilityPenalty: { type: Number, default: 0 },
}, { _id: false });

const ArmorSetSchema = new Schema({
  helmet: { type: ArmorPieceSchema },
  chestplate: { type: ArmorPieceSchema },
  gauntlets: { type: ArmorPieceSchema },
  gloves: { type: ArmorPieceSchema },
  leggings: { type: ArmorPieceSchema },
  boots: { type: ArmorPieceSchema },
}, { _id: false });

const HorseSchema = new Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['common', 'warhorse', 'dothraki', 'bloodhorse'],
    required: true 
  },
  speed: { type: Number, required: true },
  combatBonus: { type: Number, default: 0 },
}, { _id: false });

const LocationSchema = new Schema({
  x: { type: Number, required: true, default: 0 },
  y: { type: Number, required: true, default: 0 },
  region: { 
    type: String, 
    enum: [
      'North', 'IronIslands', 'Dorne', 'TheReach', 'Westerlands',
      'Stormlands', 'Riverlands', 'TheVale', 'KingsLanding', 'BeyondTheWall'
    ],
    required: true 
  },
}, { _id: false });

const EquipmentSchema = new Schema({
  weapon: { type: WeaponSchema },
  armor: { type: ArmorSetSchema, default: {} },
  horse: { type: HorseSchema },
}, { _id: false });

const RelationshipSchema = new Schema({
  characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
  type: { 
    type: String, 
    enum: ['friend', 'rival', 'lover', 'spouse', 'family', 'enemy'],
    required: true 
  },
  value: { type: Number, required: true, min: -100, max: 100 },
}, { _id: false });

const CharacterSchema = new Schema<ICharacterDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Step 1: Identity
    name: {
      type: String,
      required: [true, 'Character name is required'],
      trim: true,
      maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    age: {
      type: Number,
      required: true,
      min: [15, 'Minimum age is 15'],
      max: [80, 'Maximum age is 80'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    birthStatus: {
      type: String,
      enum: ['legitimate', 'bastard'],
      required: true,
    },
    
    // Step 2: Origin
    house: {
      type: String,
      enum: [
        'None', 'Stark', 'Lannister', 'Targaryen', 'Baratheon',
        'Greyjoy', 'Martell', 'Tyrell', 'Tully', 'Arryn'
      ],
      required: true,
    },
    region: {
      type: String,
      enum: [
        'North', 'IronIslands', 'Dorne', 'TheReach', 'Westerlands',
        'Stormlands', 'Riverlands', 'TheVale', 'KingsLanding', 'BeyondTheWall'
      ],
      required: true,
    },
    profession: {
      type: String,
      enum: [
        'Soldier', 'Blacksmith', 'Merchant', 'Priest', 'Spy', 'Healer',
        'Farmer', 'Sailor', 'Hunter', 'Knight', 'Scholar', 'Thief'
      ],
      required: true,
    },
    
    // Step 3: Appearance
    appearance: {
      type: AppearanceSchema,
      required: true,
    },
    
    // Step 4: Stats
    baseStats: {
      type: StatSchema,
      required: true,
    },
    currentStats: {
      type: StatSchema,
      required: true,
    },
    
    // Step 5: Traits
    traits: {
      type: TraitsSchema,
      required: true,
    },
    
    // Game data
    period: {
      type: String,
      enum: ['RobertsRebellion', 'GameOfThrones'],
      required: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    statExperience: {
      diplomacy: { type: Number, default: 0 },
      martial: { type: Number, default: 0 },
      stewardship: { type: Number, default: 0 },
      intrigue: { type: Number, default: 0 },
      learning: { type: Number, default: 0 },
      strength: { type: Number, default: 0 },
      agility: { type: Number, default: 0 },
      endurance: { type: Number, default: 0 },
    },
    
    // Resources
    currency: {
      type: CurrencySchema,
      default: { gold: 0, silver: 0, copper: 50 },
    },
    
    reputation: {
      type: Number,
      default: 0,
      min: 0,
    },
    reputationLevel: {
      type: String,
      enum: ['Common', 'Known', 'Ser', 'Lord', 'Legendary'],
      default: 'Common',
    },
    
    // Combat
    health: {
      type: Number,
      default: 100,
      min: 0,
      max: 200,
    },
    maxHealth: {
      type: Number,
      default: 100,
      min: 1,
      max: 200,
    },
    injuries: {
      type: [InjurySchema],
      default: [],
    },
    
    // Army
    troops: {
      type: [TroopSchema],
      default: [],
    },
    
    // Location
    location: {
      type: LocationSchema,
      required: true,
    },
    
    // Equipment
    equipment: {
      type: EquipmentSchema,
      default: {},
    },
    
    // Relationships
    relationships: {
      type: [RelationshipSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CharacterSchema.index({ userId: 1, name: 1 });
CharacterSchema.index({ house: 1 });
CharacterSchema.index({ region: 1 });
CharacterSchema.index({ reputation: -1 });
CharacterSchema.index({ level: -1 });

// Virtual for total troop count
CharacterSchema.virtual('totalTroops').get(function() {
  return this.troops.reduce((total, troop) => total + troop.count, 0);
});

// Virtual for total troop power
CharacterSchema.virtual('totalPower').get(function() {
  return this.troops.reduce((total, troop) => total + (troop.power * troop.count), 0);
});

// Virtual for total wealth in copper
CharacterSchema.virtual('totalWealthInCopper').get(function() {
  return (this.currency.gold * 300) + (this.currency.silver * 10) + this.currency.copper;
});

// Method to calculate reputation level
CharacterSchema.methods.updateReputationLevel = function() {
  if (this.reputation >= 1000) {
    this.reputationLevel = 'Legendary';
  } else if (this.reputation >= 600) {
    this.reputationLevel = 'Lord';
  } else if (this.reputation >= 300) {
    this.reputationLevel = 'Ser';
  } else if (this.reputation >= 100) {
    this.reputationLevel = 'Known';
  } else {
    this.reputationLevel = 'Common';
  }
};

// Method to calculate max health from endurance
CharacterSchema.methods.calculateMaxHealth = function() {
  this.maxHealth = 100 + (this.currentStats.endurance * 5);
  if (this.health > this.maxHealth) {
    this.health = this.maxHealth;
  }
};

// Pre-save hook to update reputation level and max health
CharacterSchema.pre('save', function(next) {
  if (this.isModified('reputation')) {
    this.updateReputationLevel();
  }
  if (this.isModified('currentStats.endurance')) {
    this.calculateMaxHealth();
  }
  next();
});

export default mongoose.model<ICharacterDocument>('Character', CharacterSchema);
