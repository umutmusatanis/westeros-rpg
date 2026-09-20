import { Stat, HouseName, RegionName, ProfessionName, Trait } from '../../../shared/types';
import { HOUSES, REGIONS, PROFESSIONS, TRAITS } from '../data/gameData';

/**
 * Calculate total stats with bonuses from house, region, profession, and traits
 */
export const calculateTotalStats = (
  baseStats: Stat,
  house: HouseName,
  region: RegionName,
  profession: ProfessionName,
  traitNames: string[]
): Stat => {
  const totalStats: Stat = { ...baseStats };

  // Add house bonuses
  const houseData = HOUSES.find(h => h.name === house);
  if (houseData?.bonuses) {
    Object.entries(houseData.bonuses).forEach(([stat, bonus]) => {
      totalStats[stat as keyof Stat] += bonus;
    });
  }

  // Add region bonuses
  const regionData = REGIONS.find(r => r.name === region);
  if (regionData?.bonuses) {
    Object.entries(regionData.bonuses).forEach(([stat, bonus]) => {
      totalStats[stat as keyof Stat] += bonus;
    });
  }

  // Add profession bonuses
  const professionData = PROFESSIONS.find(p => p.name === profession);
  if (professionData?.bonuses) {
    Object.entries(professionData.bonuses).forEach(([stat, bonus]) => {
      totalStats[stat as keyof Stat] += bonus;
    });
  }

  // Add trait bonuses
  traitNames.forEach(traitName => {
    const trait = TRAITS.find(t => t.name === traitName);
    if (trait?.bonuses) {
      Object.entries(trait.bonuses).forEach(([stat, bonus]) => {
        totalStats[stat as keyof Stat] += bonus;
      });
    }
  });

  return totalStats;
};

/**
 * Validate stat distribution (55 points, 3-21 range)
 */
export const validateStatDistribution = (stats: Stat): { valid: boolean; error?: string } => {
  const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
  
  if (total !== 55) {
    return { valid: false, error: `Total stats must be 55, got ${total}` };
  }

  for (const [stat, value] of Object.entries(stats)) {
    if (value < 3 || value > 21) {
      return { valid: false, error: `Stat ${stat} must be between 3 and 21, got ${value}` };
    }
  }

  return { valid: true };
};

/**
 * Validate trait selection
 */
export const validateTraitSelection = (
  traitNames: string[],
  baseStats: Stat,
  height: number
): { valid: boolean; error?: string; totalCost: number } => {
  let totalCost = 0;
  const selectedTraits = traitNames.map(name => TRAITS.find(t => t.name === name)).filter(Boolean) as Trait[];

  // Check for education trait requirement (exactly 1)
  const educationTraits = selectedTraits.filter(t => t.type === 'education');
  if (educationTraits.length > 1) {
    return { valid: false, error: 'Only one education trait allowed', totalCost: 0 };
  }

  // Check for personality trait requirement (min 2)
  const personalityTraits = selectedTraits.filter(t => t.type === 'personality');
  if (personalityTraits.length < 2) {
    return { valid: false, error: 'At least 2 personality traits required', totalCost: 0 };
  }

  // Validate each trait
  for (const trait of selectedTraits) {
    totalCost += trait.cost;

    // Check stat requirements
    if (trait.requirements?.stat && trait.requirements?.minValue) {
      const statValue = baseStats[trait.requirements.stat];
      if (statValue < trait.requirements.minValue) {
        return {
          valid: false,
          error: `Trait "${trait.name}" requires ${trait.requirements.stat} >= ${trait.requirements.minValue}`,
          totalCost: 0,
        };
      }
    }

    // Check height requirement
    if (trait.requirements?.height && height < trait.requirements.height) {
      return {
        valid: false,
        error: `Trait "${trait.name}" requires height >= ${trait.requirements.height}cm`,
        totalCost: 0,
      };
    }

    // Check exclusions
    if (trait.requirements?.excludes) {
      const conflicts = traitNames.filter(name => trait.requirements!.excludes!.includes(name));
      if (conflicts.length > 0) {
        return {
          valid: false,
          error: `Trait "${trait.name}" conflicts with: ${conflicts.join(', ')}`,
          totalCost: 0,
        };
      }
    }
  }

  // Check total cost (200 points)
  if (totalCost > 200) {
    return { valid: false, error: `Total trait cost exceeds 200 (got ${totalCost})`, totalCost };
  }

  return { valid: true, totalCost };
};

/**
 * Calculate max health from endurance
 */
export const calculateMaxHealth = (endurance: number): number => {
  return 100 + (endurance * 5);
};

/**
 * Calculate reputation level from reputation points
 */
export const getReputationLevel = (reputation: number): string => {
  if (reputation >= 1000) return 'Legendary';
  if (reputation >= 600) return 'Lord';
  if (reputation >= 300) return 'Ser';
  if (reputation >= 100) return 'Known';
  return 'Common';
};

/**
 * Calculate max troop tier based on reputation
 */
export const getMaxTroopTier = (reputation: number): number => {
  if (reputation >= 1000) return 3; // Legendary
  if (reputation >= 600) return 3;  // Lord
  if (reputation >= 300) return 3;  // Ser
  if (reputation >= 100) return 2;  // Known
  return 1; // Common
};
