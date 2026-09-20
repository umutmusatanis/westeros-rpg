import api from './api';

export const gameDataService = {
  getHouses: async () => {
    const response = await api.get('/game-data/houses');
    return response.data;
  },

  getRegions: async () => {
    const response = await api.get('/game-data/regions');
    return response.data;
  },

  getProfessions: async () => {
    const response = await api.get('/game-data/professions');
    return response.data;
  },

  getTraits: async () => {
    const response = await api.get('/game-data/traits');
    return response.data;
  },

  getAllGameData: async () => {
    const [houses, regions, professions, traits] = await Promise.all([
      gameDataService.getHouses(),
      gameDataService.getRegions(),
      gameDataService.getProfessions(),
      gameDataService.getTraits(),
    ]);

    return {
      houses: houses.data.houses,
      regions: regions.data.regions,
      professions: professions.data.professions,
      traits: traits.data.traits,
    };
  },
};
