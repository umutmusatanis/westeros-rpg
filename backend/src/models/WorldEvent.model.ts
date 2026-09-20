import mongoose, { Schema, Document } from 'mongoose';
import { WorldEvent as IWorldEvent } from '../../../shared/types';

export interface IWorldEventDocument extends Omit<IWorldEvent, '_id'>, Document {}

const HouseEffectSchema = new Schema({
  house: {
    type: String,
    enum: [
      'None', 'Stark', 'Lannister', 'Targaryen', 'Baratheon',
      'Greyjoy', 'Martell', 'Tyrell', 'Tully', 'Arryn'
    ],
    required: true,
  },
  powerChange: { type: Number, required: true },
}, { _id: false });

const RegionEffectSchema = new Schema({
  region: {
    type: String,
    enum: [
      'North', 'IronIslands', 'Dorne', 'TheReach', 'Westerlands',
      'Stormlands', 'Riverlands', 'TheVale', 'KingsLanding', 'BeyondTheWall'
    ],
    required: true,
  },
  controlChange: { type: String, required: true },
}, { _id: false });

const CharacterEffectSchema = new Schema({
  characterId: { type: String, required: true },
  effectDescription: { type: String, required: true },
}, { _id: false });

const EffectsSchema = new Schema({
  houses: [HouseEffectSchema],
  regions: [RegionEffectSchema],
  characters: [CharacterEffectSchema],
}, { _id: false });

const PlayerChoiceOptionSchema = new Schema({
  text: { type: String, required: true },
  consequences: { type: String, required: true },
}, { _id: false });

const PlayerChoicesSchema = new Schema({
  description: { type: String, required: true },
  options: [PlayerChoiceOptionSchema],
}, { _id: false });

const WorldEventSchema = new Schema<IWorldEventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      enum: ['RobertsRebellion', 'GameOfThrones'],
      required: true,
    },
    triggerDate: {
      type: Date,
    },
    effects: {
      type: EffectsSchema,
      required: true,
    },
    playerChoices: {
      type: PlayerChoicesSchema,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
WorldEventSchema.index({ period: 1 });
WorldEventSchema.index({ triggerDate: 1 });

export default mongoose.model<IWorldEventDocument>('WorldEvent', WorldEventSchema);
