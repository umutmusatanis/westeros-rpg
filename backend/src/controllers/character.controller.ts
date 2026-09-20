import { Response, NextFunction } from 'express';
import Character from '../models/Character.model';
import User from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  calculateTotalStats,
  validateStatDistribution,
  validateTraitSelection,
  calculateMaxHealth,
} from '../utils/statCalculator';

export const createCharacter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const characterData = req.body;
    characterData.userId = req.userId;

    // Validate required fields
    if (!characterData.name || !characterData.age) {
      throw new AppError('Name and age are required', 400);
    }

    if (!characterData.house || !characterData.region || !characterData.profession) {
      throw new AppError('House, region, and profession are required', 400);
    }

    if (!characterData.baseStats) {
      throw new AppError('Base stats are required', 400);
    }

    // Validate stat distribution
    const statValidation = validateStatDistribution(characterData.baseStats);
    if (!statValidation.valid) {
      throw new AppError(statValidation.error || 'Invalid stat distribution', 400);
    }

    // Collect all trait names
    const allTraitNames = [
      characterData.traits?.education,
      ...(characterData.traits?.personality || []),
      ...(characterData.traits?.other || []),
      ...(characterData.traits?.combat || []),
    ].filter(Boolean);

    // Validate trait selection
    const traitValidation = validateTraitSelection(
      allTraitNames,
      characterData.baseStats,
      characterData.appearance?.height || 175
    );
    
    if (!traitValidation.valid) {
      throw new AppError(traitValidation.error || 'Invalid trait selection', 400);
    }

    // Calculate total stats with bonuses
    const currentStats = calculateTotalStats(
      characterData.baseStats,
      characterData.house,
      characterData.region,
      characterData.profession,
      allTraitNames
    );

    characterData.currentStats = currentStats;

    // Calculate max health based on endurance
    const maxHealth = calculateMaxHealth(currentStats.endurance);
    characterData.maxHealth = maxHealth;
    characterData.health = maxHealth;

    // Set initial stat experience
    characterData.statExperience = {
      diplomacy: 0,
      martial: 0,
      stewardship: 0,
      intrigue: 0,
      learning: 0,
      strength: 0,
      agility: 0,
      endurance: 0,
    };

    // Create character
    const character = await Character.create(characterData);

    // Add character to user's character list
    await User.findByIdAndUpdate(req.userId, {
      $push: { characters: character._id },
    });

    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: { character },
    });
  } catch (error) {
    next(error);
  }
};

export const getCharacters = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const characters = await Character.find({ userId: req.userId });

    res.json({
      success: true,
      data: { characters },
    });
  } catch (error) {
    next(error);
  }
};

export const getCharacterById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!character) {
      throw new AppError('Character not found', 404);
    }

    res.json({
      success: true,
      data: { character },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCharacter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!character) {
      throw new AppError('Character not found', 404);
    }

    res.json({
      success: true,
      message: 'Character updated successfully',
      data: { character },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCharacter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const character = await Character.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!character) {
      throw new AppError('Character not found', 404);
    }

    // Remove character from user's character list
    await User.findByIdAndUpdate(req.userId, {
      $pull: { characters: character._id },
    });

    res.json({
      success: true,
      message: 'Character deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
