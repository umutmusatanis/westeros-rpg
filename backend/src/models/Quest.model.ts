import mongoose, { Schema, Document } from 'mongoose';
import { Quest as IQuest } from '../../../shared/types';

export interface IQuestDocument extends Omit<IQuest, '_id'>, Document {}

const RewardsSchema = new Schema({
  gold: { type: Number, min: 0 },
  silver: { type: Number, min: 0 },
  copper: { type: Number, min: 0 },
  reputation: { type: Number },
  items: [{ type: String }],
}, { _id: false });

const RequirementsSchema = new Schema({
  level: { type: Number, min: 1 },
  reputation: { type: Number },
  stats: {
    diplomacy: { type: Number },
    martial: { type: Number },
    stewardship: { type: Number },
    intrigue: { type: Number },
    learning: { type: Number },
    strength: { type: Number },
    agility: { type: Number },
    endurance: { type: Number },
  },
}, { _id: false });

const QuestSchema = new Schema<IQuestDocument>(
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
    source: {
      type: String,
      enum: ['tavern', 'lord', 'village', 'guild'],
      required: true,
    },
    type: {
      type: String,
      enum: ['courier', 'bandit', 'information', 'mediation', 'escort', 'hunt'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'legendary'],
      required: true,
    },
    rewards: {
      type: RewardsSchema,
      required: true,
    },
    requirements: {
      type: RequirementsSchema,
    },
    location: {
      type: String,
      enum: [
        'North', 'IronIslands', 'Dorne', 'TheReach', 'Westerlands',
        'Stormlands', 'Riverlands', 'TheVale', 'KingsLanding', 'BeyondTheWall'
      ],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
QuestSchema.index({ location: 1, active: 1 });
QuestSchema.index({ difficulty: 1 });
QuestSchema.index({ type: 1 });

export default mongoose.model<IQuestDocument>('Quest', QuestSchema);
