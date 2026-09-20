import { create } from 'zustand';
import { House, Region, Profession, Trait } from '../../../shared/types';

interface GameDataState {
  houses: House[];
  regions: Region[];
  professions: Profession[];
  traits: Trait[];
  isLoaded: boolean;
  setHouses: (houses: House[]) => void;
  setRegions: (regions: Region[]) => void;
  setProfessions: (professions: Profession[]) => void;
  setTraits: (traits: Trait[]) => void;
  setIsLoaded: (loaded: boolean) => void;
}

export const useGameDataStore = create<GameDataState>((set) => ({
  houses: [],
  regions: [],
  professions: [],
  traits: [],
  isLoaded: false,

  setHouses: (houses) => set({ houses }),
  setRegions: (regions) => set({ regions }),
  setProfessions: (professions) => set({ professions }),
  setTraits: (traits) => set({ traits }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
}));
