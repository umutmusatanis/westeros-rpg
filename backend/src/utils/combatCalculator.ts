import { Stat } from '../../../shared/types';

interface Character {
  name: string;
  stats: {
    strength: number;
    agility: number;
    endurance: number;
    martial: number;
  };
  equipment?: {
    weapon?: {
      damage: number;
      bonus: number;
    };
    armor?: any;
  };
  health: number;
  troops?: any[];
}

/**
 * Roll a d20 dice
 */
export const rollD20 = (): number => {
  return Math.floor(Math.random() * 20) + 1;
};

/**
 * Roll multiple dice and return results
 */
export const rollDice = (sides: number, count: number = 1): number[] => {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
};

/**
 * Calculate attack roll for 1v1 duel
 * Formula: 1d20 + (Strength + Agility) / 3
 */
export const calculateAttackRoll = (strength: number, agility: number): number => {
  const roll = rollD20();
  const bonus = Math.floor((strength + agility) / 3);
  return roll + bonus;
};

/**
 * Calculate damage reduction from endurance
 * Formula: Endurance / 4
 */
export const calculateDamageReduction = (endurance: number): number => {
  return Math.floor(endurance / 4);
};

/**
 * Calculate duel damage
 */
export const calculateDuelDamage = (
  attackRoll: number,
  defenseRoll: number,
  attackerStrength: number,
  defenderEndurance: number,
  weaponBonus: number = 0
): number => {
  if (attackRoll <= defenseRoll) {
    return 0; // Miss or blocked
  }

  const baseDamage = attackRoll - defenseRoll;
  const strengthBonus = Math.floor(attackerStrength / 2);
  const damageReduction = calculateDamageReduction(defenderEndurance);
  
  const totalDamage = Math.max(1, baseDamage + strengthBonus + weaponBonus - damageReduction);
  return totalDamage;
};

/**
 * Calculate army battle advantage based on martial stat difference
 * Returns percentage advantage (0 to 51+)
 */
export const calculateArmyAdvantage = (
  commanderMartial: number,
  enemyMartial: number
): number => {
  const difference = commanderMartial - enemyMartial;
  
  if (difference >= 10) return 51;
  if (difference >= 8) return 40;
  if (difference >= 6) return 30;
  if (difference >= 4) return 20;
  if (difference >= 2) return 10;
  if (difference >= 1) return 5;
  if (difference <= -10) return -51;
  if (difference <= -8) return -40;
  if (difference <= -6) return -30;
  if (difference <= -4) return -20;
  if (difference <= -2) return -10;
  if (difference <= -1) return -5;
  
  return 0;
};

/**
 * Simulate army battle
 */
export const simulateArmyBattle = (
  attackerPower: number,
  defenderPower: number,
  attackerMartial: number,
  defenderMartial: number
): {
  winner: 'attacker' | 'defender';
  attackerLosses: number;
  defenderLosses: number;
  description: string;
} => {
  const advantage = calculateArmyAdvantage(attackerMartial, defenderMartial);
  
  // Roll for both sides
  const attackerRoll = rollD20() + Math.floor(advantage);
  const defenderRoll = rollD20();
  
  // Calculate casualties based on power difference and rolls
  const powerRatio = attackerPower / (defenderPower || 1);
  const rollDifference = attackerRoll - defenderRoll;
  
  let attackerLossPercent = 0.15; // Base 15% losses
  let defenderLossPercent = 0.15;
  
  if (rollDifference > 0) {
    // Attacker wins
    defenderLossPercent += (rollDifference * 0.05);
    attackerLossPercent -= (rollDifference * 0.02);
  } else {
    // Defender wins
    attackerLossPercent += (Math.abs(rollDifference) * 0.05);
    defenderLossPercent -= (Math.abs(rollDifference) * 0.02);
  }
  
  // Adjust by power ratio
  if (powerRatio > 1.5) {
    defenderLossPercent += 0.1;
  } else if (powerRatio < 0.7) {
    attackerLossPercent += 0.1;
  }
  
  // Clamp loss percentages
  attackerLossPercent = Math.max(0.05, Math.min(0.6, attackerLossPercent));
  defenderLossPercent = Math.max(0.05, Math.min(0.6, defenderLossPercent));
  
  const attackerLosses = Math.floor(attackerPower * attackerLossPercent);
  const defenderLosses = Math.floor(defenderPower * defenderLossPercent);
  
  const winner = attackerRoll > defenderRoll ? 'attacker' : 'defender';
  
  const description = winner === 'attacker'
    ? `Saldırgan güçler zaferi kazandı! (Zar: ${attackerRoll} vs ${defenderRoll})`
    : `Savunan güçler saldırıyı püskürttü! (Zar: ${defenderRoll} vs ${attackerRoll})`;
  
  return {
    winner,
    attackerLosses,
    defenderLosses,
    description,
  };
};

/**
 * Calculate injury severity based on damage taken
 */
export const calculateInjurySeverity = (
  damage: number,
  maxHealth: number
): 'light' | 'medium' | 'heavy' | 'critical' | null => {
  const damagePercent = (damage / maxHealth) * 100;
  
  if (damagePercent >= 75) return 'critical';
  if (damagePercent >= 50) return 'heavy';
  if (damagePercent >= 25) return 'medium';
  if (damagePercent >= 10) return 'light';
  
  return null;
};

/**
 * Calculate healing time in days based on injury severity and care level
 */
export const calculateHealingTime = (
  severity: 'light' | 'medium' | 'heavy' | 'critical',
  careLevel: 'camp' | 'village' | 'city' | 'healer'
): number => {
  const baseTime = {
    light: 7,
    medium: 14,
    heavy: 30,
    critical: 60,
  };
  
  const careMultiplier = {
    camp: 1.0,
    village: 0.8,
    city: 0.6,
    healer: 0.4,
  };
  
  return Math.ceil(baseTime[severity] * careMultiplier[careLevel]);
};

/**
 * Calculate complete duel result between two characters
 */
export const calculateDuelResult = (attacker: Character, defender: Character) => {
  const rounds: any[] = [];
  let attackerHealth = attacker.health;
  let defenderHealth = defender.health;
  
  let currentRound = 1;
  const maxRounds = 10;
  
  while (attackerHealth > 0 && defenderHealth > 0 && currentRound <= maxRounds) {
    // Attacker's turn
    const attackerRoll = rollD20();
    const attackerBonus = Math.floor((attacker.stats.strength + attacker.stats.agility) / 3);
    const attackerTotal = attackerRoll + attackerBonus + (attacker.equipment?.weapon?.bonus || 0);
    
    // Defender's turn
    const defenderRoll = rollD20();
    const defenderBonus = Math.floor((defender.stats.strength + defender.stats.agility) / 3);
    const defenderTotal = defenderRoll + defenderBonus + (defender.equipment?.weapon?.bonus || 0);
    
    // Calculate damage
    let roundDamageToDefender = 0;
    let roundDamageToAttacker = 0;
    
    if (attackerTotal > defenderTotal) {
      const baseDamage = attackerTotal - defenderTotal;
      const weaponDamage = attacker.equipment?.weapon?.damage || 5;
      const damageReduction = Math.floor(defender.stats.endurance / 4);
      roundDamageToDefender = Math.max(1, baseDamage + weaponDamage - damageReduction);
      defenderHealth -= roundDamageToDefender;
    } else if (defenderTotal > attackerTotal) {
      const baseDamage = defenderTotal - attackerTotal;
      const weaponDamage = defender.equipment?.weapon?.damage || 5;
      const damageReduction = Math.floor(attacker.stats.endurance / 4);
      roundDamageToAttacker = Math.max(1, baseDamage + weaponDamage - damageReduction);
      attackerHealth -= roundDamageToAttacker;
    }
    
    rounds.push({
      round: currentRound,
      attackerRoll,
      attackerTotal,
      defenderRoll,
      defenderTotal,
      damageToDefender: roundDamageToDefender,
      damageToAttacker: roundDamageToAttacker,
      attackerHealthAfter: Math.max(0, attackerHealth),
      defenderHealthAfter: Math.max(0, defenderHealth),
    });
    
    currentRound++;
  }
  
  const winner = attackerHealth > defenderHealth ? 'attacker' : 'defender';
  
  return {
    winner,
    rounds,
    attackerHealth: Math.max(0, attackerHealth),
    defenderHealth: Math.max(0, defenderHealth),
    totalRounds: rounds.length,
  };
};

/**
 * Calculate complete battle result between two armies
 */
export const calculateBattleResult = (attacker: Character, defender: Character) => {
  // Calculate total power for each side
  const attackerPower = attacker.troops?.reduce((sum, troop) => sum + (troop.power * troop.count), 0) || 0;
  const defenderPower = defender.troops?.reduce((sum, troop) => sum + (troop.power * troop.count), 0) || 0;
  
  // Simulate battle
  const battleResult = simulateArmyBattle(
    attackerPower,
    defenderPower,
    attacker.stats.martial,
    defender.stats.martial
  );
  
  // Apply casualties to troops
  const applyLosses = (troops: any[], totalLosses: number) => {
    let remainingLosses = totalLosses;
    const updatedTroops = [];
    
    // Start from lowest tier
    const sortedTroops = [...troops].sort((a, b) => a.tier - b.tier);
    
    for (const troop of sortedTroops) {
      const troopPower = troop.power * troop.count;
      const lossesInThisTroop = Math.min(remainingLosses, troopPower);
      const troopsLost = Math.ceil(lossesInThisTroop / troop.power);
      
      const remainingCount = troop.count - troopsLost;
      if (remainingCount > 0) {
        updatedTroops.push({
          ...troop,
          count: remainingCount,
        });
      }
      
      remainingLosses -= lossesInThisTroop;
      if (remainingLosses <= 0) {
        // Add remaining troops without losses
        updatedTroops.push(...sortedTroops.slice(sortedTroops.indexOf(troop) + 1));
        break;
      }
    }
    
    return updatedTroops;
  };
  
  const attackerTroops = applyLosses(attacker.troops || [], battleResult.attackerLosses);
  const defenderTroops = applyLosses(defender.troops || [], battleResult.defenderLosses);
  
  return {
    winner: battleResult.winner,
    description: battleResult.description,
    attackerTroops,
    defenderTroops,
    attackerLosses: battleResult.attackerLosses,
    defenderLosses: battleResult.defenderLosses,
    attackerPowerBefore: attackerPower,
    defenderPowerBefore: defenderPower,
    attackerPowerAfter: attackerTroops.reduce((sum, t) => sum + (t.power * t.count), 0),
    defenderPowerAfter: defenderTroops.reduce((sum, t) => sum + (t.power * t.count), 0),
  };
};
