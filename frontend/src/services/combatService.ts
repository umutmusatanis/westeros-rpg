import api from './api';

export const combatService = {
  // Initiate a 1v1 duel
  initiateDuel: async (attackerId: string, defenderId: string) => {
    const response = await api.post('/combat/duel', { attackerId, defenderId });
    return response.data;
  },

  // Initiate an army battle
  initiateBattle: async (attackerId: string, defenderId: string) => {
    const response = await api.post('/combat/battle', { attackerId, defenderId });
    return response.data;
  },

  // Practice duel (no consequences)
  practiceDuel: async (characterId: string) => {
    const response = await api.post('/combat/practice', { characterId });
    return response.data;
  },

  // Get combat history
  getCombatHistory: async (characterId: string) => {
    const response = await api.get(`/combat/history/${characterId}`);
    return response.data;
  },
};
