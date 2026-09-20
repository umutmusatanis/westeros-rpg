// MOCK MODE - No Backend Required!
import { mockAuthService } from './mockAuthService';

export const characterService = {
  // Get all characters for current user
  getCharacters: async () => {
    const result = await mockAuthService.getCharacters();
    return { data: { characters: result.characters } };
  },

  // Get character by ID
  getCharacterById: async (id: string) => {
    const result = await mockAuthService.getCharacterById(id);
    return { data: { character: result.character } };
  },

  // Create new character
  createCharacter: async (characterData: any) => {
    const result = await mockAuthService.createCharacter(characterData);
    return { data: { character: result.character } };
  },

  // Update character (mock - just saves to localStorage)
  updateCharacter: async (id: string, updates: any) => {
    const saved = localStorage.getItem('characters');
    const characters = saved ? JSON.parse(saved) : [];
    const index = characters.findIndex((c: any) => c._id === id);
    
    if (index >= 0) {
      characters[index] = { ...characters[index], ...updates };
      localStorage.setItem('characters', JSON.stringify(characters));
      return { data: { character: characters[index] } };
    }
    
    throw new Error('Character not found');
  },

  // Delete character (mock)
  deleteCharacter: async (id: string) => {
    const saved = localStorage.getItem('characters');
    const characters = saved ? JSON.parse(saved) : [];
    const filtered = characters.filter((c: any) => c._id !== id);
    localStorage.setItem('characters', JSON.stringify(filtered));
    return { data: { success: true } };
  }
};
