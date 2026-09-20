import api from './api';
import { Character } from '../../../shared/types';

export const characterService = {
  getCharacters: async () => {
    const response = await api.get('/characters');
    return response.data;
  },

  getCharacterById: async (id: string) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  createCharacter: async (characterData: Partial<Character>) => {
    const response = await api.post('/characters', characterData);
    return response.data;
  },

  updateCharacter: async (id: string, updates: Partial<Character>) => {
    const response = await api.put(`/characters/${id}`, updates);
    return response.data;
  },

  deleteCharacter: async (id: string) => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
};
