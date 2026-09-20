import { Request, Response } from 'express';
import Character from '../models/Character.model';
import { rollDice, calculateDuelResult, calculateBattleResult } from '../utils/combatCalculator';

// 1v1 Duel
export const initiateDuel = async (req: Request, res: Response) => {
  try {
    const { attackerId, defenderId } = req.body;

    // Get both characters
    const attacker = await Character.findById(attackerId);
    const defender = await Character.findById(defenderId);

    if (!attacker || !defender) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Calculate duel result
    const result = calculateDuelResult(attacker, defender);

    // Update characters based on result
    if (result.winner === 'attacker') {
      // Attacker wins
      attacker.reputation += 10;
      defender.health = result.defenderHealth;
      
      if (result.defenderHealth <= 0) {
        defender.isDead = true;
        attacker.reputation += 20; // Bonus for kill
      }
    } else {
      // Defender wins
      defender.reputation += 10;
      attacker.health = result.attackerHealth;
      
      if (result.attackerHealth <= 0) {
        attacker.isDead = true;
        defender.reputation += 20;
      }
    }

    await attacker.save();
    await defender.save();

    res.json({
      success: true,
      result,
      attacker: {
        id: attacker._id,
        name: attacker.name,
        health: attacker.health,
        reputation: attacker.reputation,
        isDead: attacker.isDead,
      },
      defender: {
        id: defender._id,
        name: defender.name,
        health: defender.health,
        reputation: defender.reputation,
        isDead: defender.isDead,
      },
    });
  } catch (error) {
    console.error('Duel error:', error);
    res.status(500).json({ message: 'Düello sırasında bir hata oluştu' });
  }
};

// Army Battle
export const initiateBattle = async (req: Request, res: Response) => {
  try {
    const { attackerId, defenderId } = req.body;

    const attacker = await Character.findById(attackerId);
    const defender = await Character.findById(defenderId);

    if (!attacker || !defender) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Check if both have troops
    if (attacker.troops.length === 0 || defender.troops.length === 0) {
      return res.status(400).json({ message: 'Her iki tarafın da birlikleri olmalı' });
    }

    // Calculate battle result
    const result = calculateBattleResult(attacker, defender);

    // Update troops and reputation
    attacker.troops = result.attackerTroops;
    defender.troops = result.defenderTroops;

    if (result.winner === 'attacker') {
      attacker.reputation += 50;
      defender.reputation -= 20;
      // Winner gets loot
      const loot = Math.floor(defender.wealth.gold * 0.1);
      attacker.wealth.gold += loot;
      defender.wealth.gold -= loot;
    } else {
      defender.reputation += 50;
      attacker.reputation -= 20;
      const loot = Math.floor(attacker.wealth.gold * 0.1);
      defender.wealth.gold += loot;
      attacker.wealth.gold -= loot;
    }

    await attacker.save();
    await defender.save();

    res.json({
      success: true,
      result,
      attacker: {
        id: attacker._id,
        name: attacker.name,
        troops: attacker.troops,
        reputation: attacker.reputation,
        wealth: attacker.wealth,
      },
      defender: {
        id: defender._id,
        name: defender.name,
        troops: defender.troops,
        reputation: defender.reputation,
        wealth: defender.wealth,
      },
    });
  } catch (error) {
    console.error('Battle error:', error);
    res.status(500).json({ message: 'Savaş sırasında bir hata oluştu' });
  }
};

// Practice Duel (no real consequences)
export const practiceDuel = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Karakter bulunamadı' });
    }

    // Create a dummy opponent with similar stats
    const dummyOpponent = {
      name: 'Antrenman Ortağı',
      stats: character.stats,
      equipment: {
        weapon: { name: 'Eğitim Kılıcı', damage: 5, bonus: 0, quality: 'iron' },
        armor: {},
      },
      health: 100,
    };

    // Calculate result without saving
    const result = calculateDuelResult(character, dummyOpponent as any);

    // Small experience gain
    if (result.winner === 'attacker') {
      character.stats.martial += 0.1;
      await character.save();
    }

    res.json({
      success: true,
      result,
      message: result.winner === 'attacker' 
        ? 'Antrenman başarılı! Askeriye beceriniz biraz arttı.' 
        : 'Antrenman zorlu geçti. Daha fazla pratik yapmalısın.',
    });
  } catch (error) {
    console.error('Practice duel error:', error);
    res.status(500).json({ message: 'Antrenman sırasında bir hata oluştu' });
  }
};

// Get combat history (placeholder for future implementation)
export const getCombatHistory = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params;

    // TODO: Implement combat history model and storage
    res.json({
      success: true,
      history: [],
      message: 'Savaş geçmişi özelliği yakında eklenecek',
    });
  } catch (error) {
    res.status(500).json({ message: 'Hata oluştu' });
  }
};
