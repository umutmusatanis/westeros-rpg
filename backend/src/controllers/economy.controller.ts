import { Request, Response } from 'express';
import Character from '../models/Character.model';
import { calculateWeeklyIncome, calculateWeeklyCosts, convertCurrency } from '../utils/economyCalculator';

// Process weekly turn (income and expenses)
export const processWeeklyTurn = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Calculate income
    const income = calculateWeeklyIncome(character);

    // Calculate costs
    const costs = calculateWeeklyCosts(character);

    // Net income
    const netIncome = income - costs.total;

    // Update wealth (in copper)
    let totalCopper = character.wealth.copper + (character.wealth.silver * 10) + (character.wealth.gold * 300);
    totalCopper += netIncome;

    // Ensure minimum 0
    if (totalCopper < 0) {
      totalCopper = 0;
    }

    // Convert back to gold/silver/copper
    const newWealth = convertCurrency(totalCopper);
    character.wealth = newWealth;

    // Save character
    await character.save();

    res.json({
      success: true,
      income,
      costs,
      netIncome,
      wealth: character.wealth,
      message: netIncome >= 0 
        ? `Haftalık gelir: +${netIncome} BA` 
        : `Haftalık kayıp: ${netIncome} BA`,
    });
  } catch (error) {
    console.error('Weekly turn error:', error);
    res.status(500).json({ message: 'Haftalık işlem sırasında hata oluştu' });
  }
};

// Recruit troops
export const recruitTroops = async (req: Request, res: Response) => {
  try {
    const { characterId, tier, count } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Check reputation level for tier access
    const maxTier = character.reputation >= 1000 ? 3 :
                    character.reputation >= 600 ? 3 :
                    character.reputation >= 300 ? 3 :
                    character.reputation >= 100 ? 2 : 1;

    if (tier > maxTier) {
      return res.status(400).json({ 
        message: `Bu tier için yeterli itibarınız yok. Maximum Tier ${maxTier}` 
      });
    }

    if (tier > 3) {
      return res.status(400).json({ 
        message: 'Tier 4-6 birlikleri sadece deneyimle kazanılır' 
      });
    }

    // Calculate cost
    const costs: { [key: number]: number } = {
      1: 2, 2: 8, 3: 20, 4: 50, 5: 120, 6: 300
    };
    const totalCost = costs[tier] * count;

    // Check if character has enough money
    const totalCopper = character.wealth.copper + (character.wealth.silver * 10) + (character.wealth.gold * 300);
    if (totalCopper < totalCost) {
      return res.status(400).json({ message: 'Yeterli paranız yok' });
    }

    // Deduct cost
    let remainingCopper = totalCopper - totalCost;
    character.wealth = convertCurrency(remainingCopper);

    // Add or update troops
    const troopTypes: { [key: number]: string } = {
      1: 'Milis',
      2: 'Eğitimli Asker',
      3: 'Veteran',
      4: 'Elit Muhafız',
      5: 'Şövalye',
      6: 'Efsanevi Savaşçı',
    };

    const troopPower: { [key: number]: number } = {
      1: 10, 2: 25, 3: 50, 4: 100, 5: 200, 6: 400
    };

    const existingTroopIndex = character.troops.findIndex(t => t.tier === tier);
    
    if (existingTroopIndex >= 0) {
      character.troops[existingTroopIndex].count += count;
    } else {
      character.troops.push({
        type: troopTypes[tier],
        tier,
        count,
        power: troopPower[tier],
        experience: 0,
      });
    }

    await character.save();

    res.json({
      success: true,
      message: `${count} adet Tier ${tier} birlikleri işe alındı`,
      troops: character.troops,
      wealth: character.wealth,
      cost: totalCost,
    });
  } catch (error) {
    console.error('Recruit troops error:', error);
    res.status(500).json({ message: 'Birlik işe alma sırasında hata oluştu' });
  }
};

// Update reputation
export const updateReputation = async (req: Request, res: Response) => {
  try {
    const { characterId, amount, reason } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    const oldReputation = character.reputation;
    character.reputation += amount;

    // Ensure minimum 0
    if (character.reputation < 0) {
      character.reputation = 0;
    }

    // Determine reputation level
    const getReputationLevel = (rep: number) => {
      if (rep >= 1000) return 'Efsane';
      if (rep >= 600) return 'Lord/Lady';
      if (rep >= 300) return 'Ser';
      if (rep >= 100) return 'Tanınan';
      return 'Sıradan';
    };

    const oldLevel = getReputationLevel(oldReputation);
    const newLevel = getReputationLevel(character.reputation);

    character.reputationLevel = newLevel;
    await character.save();

    res.json({
      success: true,
      oldReputation,
      newReputation: character.reputation,
      change: amount,
      oldLevel,
      newLevel,
      levelChanged: oldLevel !== newLevel,
      reason,
      message: amount > 0 
        ? `İtibarınız ${amount} puan arttı! ${reason || ''}` 
        : `İtibarınız ${Math.abs(amount)} puan düştü. ${reason || ''}`,
    });
  } catch (error) {
    console.error('Update reputation error:', error);
    res.status(500).json({ message: 'İtibar güncellemesi sırasında hata oluştu' });
  }
};

// Buy equipment
export const buyEquipment = async (req: Request, res: Response) => {
  try {
    const { characterId, itemType, itemData, cost } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Check if character has enough money
    const totalCopper = character.wealth.copper + (character.wealth.silver * 10) + (character.wealth.gold * 300);
    if (totalCopper < cost) {
      return res.status(400).json({ message: 'Yeterli paranız yok' });
    }

    // Deduct cost
    let remainingCopper = totalCopper - cost;
    character.wealth = convertCurrency(remainingCopper);

    // Update equipment
    if (itemType === 'weapon') {
      character.equipment.weapon = itemData;
    } else if (itemType === 'armor') {
      const { slot, ...armorData } = itemData;
      if (!character.equipment.armor) {
        character.equipment.armor = {};
      }
      (character.equipment.armor as any)[slot] = armorData;
    } else if (itemType === 'horse') {
      character.equipment.horse = itemData;
    }

    await character.save();

    res.json({
      success: true,
      message: 'Ekipman satın alındı',
      equipment: character.equipment,
      wealth: character.wealth,
    });
  } catch (error) {
    console.error('Buy equipment error:', error);
    res.status(500).json({ message: 'Ekipman satın alma sırasında hata oluştu' });
  }
};

// Get economic summary
export const getEconomicSummary = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    const income = calculateWeeklyIncome(character);
    const costs = calculateWeeklyCosts(character);
    const netIncome = income - costs.total;

    const totalCopper = character.wealth.copper + (character.wealth.silver * 10) + (character.wealth.gold * 300);

    res.json({
      success: true,
      wealth: character.wealth,
      totalWealthInCopper: totalCopper,
      weeklyIncome: income,
      weeklyCosts: costs,
      netWeeklyIncome: netIncome,
      reputation: character.reputation,
      reputationLevel: character.reputationLevel,
    });
  } catch (error) {
    console.error('Get economic summary error:', error);
    res.status(500).json({ message: 'Ekonomik özet alınamadı' });
  }
};
