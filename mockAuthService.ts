// Mock Authentication - No Backend Required!

const MOCK_USER = {
  id: 'user-1',
  username: 'demo',
  email: 'demo@westeros.com',
  token: 'mock-jwt-token-12345'
};

const MOCK_CHARACTERS = [
  {
    _id: 'char-1',
    name: 'Jon Snow',
    age: 24,
    gender: 'male',
    house: {
      id: 'stark',
      name: 'Stark',
      sigil: '🐺',
      words: 'Winter is Coming',
      bonuses: { endurance: 2, martial: 1 }
    },
    region: {
      id: 'north',
      name: 'Kuzey',
      description: 'Soğuk ve sert topraklar'
    },
    profession: {
      id: 'knight',
      name: 'Şövalye',
      weeklyIncome: { min: 50, max: 100, currency: 'copper' }
    },
    stats: {
      diplomacy: 12,
      martial: 18,
      stewardship: 10,
      intrigue: 14,
      learning: 13,
      strength: 16,
      agility: 15,
      endurance: 17
    },
    traits: [
      { id: 'brave', name: 'Cesur', category: 'personality' },
      { id: 'just', name: 'Adil', category: 'personality' },
      { id: 'swordsman', name: 'Kılıç Ustası', category: 'combat' }
    ],
    appearance: {
      height: 180,
      weight: 75,
      hairColor: 'Siyah',
      eyeColor: 'Koyu Kahverengi',
      skinTone: 'Açık'
    },
    equipment: {
      weapon: {
        name: 'Longclaw',
        damage: 15,
        bonus: 3,
        quality: 'valyrian'
      },
      armor: {
        head: { name: 'Gece Nöbeti Miğferi', defense: 5 }
      }
    },
    troops: [
      { type: 'Milis', tier: 1, count: 50, power: 10, experience: 0 },
      { type: 'Eğitimli Asker', tier: 2, count: 20, power: 25, experience: 0 }
    ],
    wealth: {
      gold: 10,
      silver: 50,
      copper: 200
    },
    health: 100,
    maxHealth: 100,
    reputation: 350,
    reputationLevel: 'Ser',
    period: 'game-of-thrones',
    level: 1,
    experience: 0,
    location: { x: 0, y: 0, region: 'north' },
    isDead: false
  },
  {
    _id: 'char-2',
    name: 'Arya Stark',
    age: 18,
    gender: 'female',
    house: {
      id: 'stark',
      name: 'Stark',
      sigil: '🐺',
      words: 'Winter is Coming',
      bonuses: { endurance: 2, martial: 1 }
    },
    region: {
      id: 'north',
      name: 'Kuzey',
      description: 'Soğuk ve sert topraklar'
    },
    profession: {
      id: 'assassin',
      name: 'Suikastçı',
      weeklyIncome: { min: 80, max: 150, currency: 'copper' }
    },
    stats: {
      diplomacy: 8,
      martial: 16,
      stewardship: 7,
      intrigue: 20,
      learning: 14,
      strength: 12,
      agility: 21,
      endurance: 14
    },
    traits: [
      { id: 'brave', name: 'Cesur', category: 'personality' },
      { id: 'vengeful', name: 'İntikamcı', category: 'personality' },
      { id: 'acrobat', name: 'Akrobat', category: 'combat' }
    ],
    appearance: {
      height: 165,
      weight: 55,
      hairColor: 'Kahverengi',
      eyeColor: 'Gri',
      skinTone: 'Açık'
    },
    equipment: {
      weapon: {
        name: 'Needle',
        damage: 12,
        bonus: 2,
        quality: 'steel'
      },
      armor: {}
    },
    troops: [],
    wealth: {
      gold: 5,
      silver: 30,
      copper: 150
    },
    health: 100,
    maxHealth: 100,
    reputation: 280,
    reputationLevel: 'Tanınan',
    period: 'game-of-thrones',
    level: 1,
    experience: 0,
    location: { x: 0, y: 0, region: 'north' },
    isDead: false
  }
];

export const mockAuthService = {
  // Login - her zaman başarılı!
  login: async (email: string, password: string) => {
    // Fake delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('token', MOCK_USER.token);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    
    return {
      success: true,
      token: MOCK_USER.token,
      user: MOCK_USER
    };
  },

  // Register - her zaman başarılı!
  register: async (username: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.setItem('token', MOCK_USER.token);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    
    return {
      success: true,
      token: MOCK_USER.token,
      user: MOCK_USER
    };
  },

  // Get Characters
  getCharacters: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem('characters');
    if (saved) {
      return { characters: JSON.parse(saved) };
    }
    
    localStorage.setItem('characters', JSON.stringify(MOCK_CHARACTERS));
    return { characters: MOCK_CHARACTERS };
  },

  // Create Character
  createCharacter: async (characterData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newChar = {
      ...characterData,
      _id: 'char-' + Date.now(),
      health: 100,
      maxHealth: 100,
      reputation: 0,
      reputationLevel: 'Sıradan',
      level: 1,
      experience: 0,
      isDead: false,
      wealth: characterData.wealth || { gold: 0, silver: 10, copper: 50 },
      equipment: characterData.equipment || { weapon: {}, armor: {} },
      troops: characterData.troops || []
    };
    
    const saved = localStorage.getItem('characters');
    const characters = saved ? JSON.parse(saved) : MOCK_CHARACTERS;
    characters.push(newChar);
    localStorage.setItem('characters', JSON.stringify(characters));
    
    return { character: newChar };
  },

  // Get Character by ID
  getCharacterById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const saved = localStorage.getItem('characters');
    const characters = saved ? JSON.parse(saved) : MOCK_CHARACTERS;
    const character = characters.find((c: any) => c._id === id);
    
    return { character };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
