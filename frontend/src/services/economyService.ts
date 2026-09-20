import api from './api';

export const economyService = {
  // Process weekly turn
  processWeeklyTurn: async (characterId: string) => {
    const response = await api.post('/economy/weekly-turn', { characterId });
    return response.data;
  },

  // Recruit troops
  recruitTroops: async (characterId: string, tier: number, count: number) => {
    const response = await api.post('/economy/recruit', { characterId, tier, count });
    return response.data;
  },

  // Update reputation
  updateReputation: async (characterId: string, amount: number, reason?: string) => {
    const response = await api.post('/economy/reputation', { characterId, amount, reason });
    return response.data;
  },

  // Buy equipment
  buyEquipment: async (characterId: string, itemType: string, itemData: any, cost: number) => {
    const response = await api.post('/economy/buy-equipment', { characterId, itemType, itemData, cost });
    return response.data;
  },

  // Get economic summary
  getEconomicSummary: async (characterId: string) => {
    const response = await api.get(`/economy/summary/${characterId}`);
    return response.data;
  },
};
