import { create } from 'zustand';
import {
  HouseName,
  RegionName,
  ProfessionName,
  Period,
  Stat,
  EducationTrait,
  PersonalityTrait,
  OtherTrait,
  CombatTrait,
} from '../../../shared/types';

interface Appearance {
  height: number;
  weight: number;
  hairColor: string;
  hairLength: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  faceType: string;
  beard?: string;
  bodyType: string;
}

interface CharacterCreationState {
  // Step 1: Identity
  name: string;
  age: number;
  gender: 'male' | 'female';
  birthStatus: 'legitimate' | 'bastard';
  period: Period;

  // Step 2: Origin
  house: HouseName | null;
  region: RegionName | null;
  profession: ProfessionName | null;

  // Step 3: Appearance
  appearance: Appearance | null;

  // Step 4: Stats
  baseStats: Stat | null;

  // Step 5: Traits
  educationTrait: EducationTrait | null;
  personalityTraits: PersonalityTrait[];
  otherTraits: OtherTrait[];
  combatTraits: CombatTrait[];

  // Actions
  setIdentity: (data: {
    name: string;
    age: number;
    gender: 'male' | 'female';
    birthStatus: 'legitimate' | 'bastard';
    period: Period;
  }) => void;

  setOrigin: (data: {
    house: HouseName;
    region: RegionName;
    profession: ProfessionName;
  }) => void;

  setAppearance: (appearance: Appearance) => void;
  setBaseStats: (stats: Stat) => void;

  setEducationTrait: (trait: EducationTrait | null) => void;
  togglePersonalityTrait: (trait: PersonalityTrait) => void;
  toggleOtherTrait: (trait: OtherTrait) => void;
  toggleCombatTrait: (trait: CombatTrait) => void;

  reset: () => void;
}

const initialState = {
  name: '',
  age: 20,
  gender: 'male' as const,
  birthStatus: 'legitimate' as const,
  period: 'GameOfThrones' as Period,
  house: null,
  region: null,
  profession: null,
  appearance: null,
  baseStats: null,
  educationTrait: null,
  personalityTraits: [],
  otherTraits: [],
  combatTraits: [],
};

export const useCharacterCreationStore = create<CharacterCreationState>((set) => ({
  ...initialState,

  setIdentity: (data) => set(data),

  setOrigin: (data) => set(data),

  setAppearance: (appearance) => set({ appearance }),

  setBaseStats: (stats) => set({ baseStats: stats }),

  setEducationTrait: (trait) => set({ educationTrait: trait }),

  togglePersonalityTrait: (trait) =>
    set((state) => {
      const exists = state.personalityTraits.includes(trait);
      return {
        personalityTraits: exists
          ? state.personalityTraits.filter((t) => t !== trait)
          : [...state.personalityTraits, trait],
      };
    }),

  toggleOtherTrait: (trait) =>
    set((state) => {
      const exists = state.otherTraits.includes(trait);
      return {
        otherTraits: exists
          ? state.otherTraits.filter((t) => t !== trait)
          : [...state.otherTraits, trait],
      };
    }),

  toggleCombatTrait: (trait) =>
    set((state) => {
      const exists = state.combatTraits.includes(trait);
      return {
        combatTraits: exists
          ? state.combatTraits.filter((t) => t !== trait)
          : [...state.combatTraits, trait],
      };
    }),

  reset: () => set(initialState),
}));
