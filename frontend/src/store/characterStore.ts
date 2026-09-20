import { create } from 'zustand';
import { Character } from '../../../shared/types';

interface CharacterState {
  characters: Character[];
  currentCharacter: Character | null;
  setCharacters: (characters: Character[]) => void;
  setCurrentCharacter: (character: Character | null) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  currentCharacter: null,

  setCharacters: (characters) => {
    set({ characters });
  },

  setCurrentCharacter: (character) => {
    set({ currentCharacter: character });
  },

  addCharacter: (character) => {
    set((state) => ({
      characters: [...state.characters, character],
    }));
  },

  updateCharacter: (id, updates) => {
    set((state) => ({
      characters: state.characters.map((char) =>
        char._id === id ? { ...char, ...updates } : char
      ),
      currentCharacter:
        state.currentCharacter?._id === id
          ? { ...state.currentCharacter, ...updates }
          : state.currentCharacter,
    }));
  },

  deleteCharacter: (id) => {
    set((state) => ({
      characters: state.characters.filter((char) => char._id !== id),
      currentCharacter:
        state.currentCharacter?._id === id ? null : state.currentCharacter,
    }));
  },
}));
