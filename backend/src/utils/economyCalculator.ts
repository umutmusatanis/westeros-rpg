/**
 * Currency conversion utilities
 * 1 Gold Dragon (AD) = 30 Silver Stags (GG) = 300 Copper Pennies (BA)
 */

export interface Currency {
  gold: number;
  silver: number;
  copper: number;
}

/**
 * Convert all currency to copper
 */
export const convertToCopper = (currency: Currency): number => {
  return (currency.gold * 300) + (currency.silver * 10) + currency.copper;
};

/**
 * Convert copper to currency object
 */
export const convertFromCopper = (totalCopper: number): Currency => {
  const gold = Math.floor(totalCopper / 300);
  const remaining = totalCopper % 300;
  const silver = Math.floor(remaining / 10);
  const copper = remaining % 10;
  
  return { gold, silver, copper };
};

/**
 * Add two currency amounts
 */
export const addCurrency = (currency1: Currency, currency2: Currency): Currency => {
  const total = convertToCopper(currency1) + convertToCopper(currency2);
  return convertFromCopper(total);
};

/**
 * Subtract currency (returns null if insufficient funds)
 */
export const subtractCurrency = (
  from: Currency,
  amount: Currency
): Currency | null => {
  const fromCopper = convertToCopper(from);
  const amountCopper = convertToCopper(amount);
  
  if (fromCopper < amountCopper) {
    return null; // Insufficient funds
  }
  
  return convertFromCopper(fromCopper - amountCopper);
};

/**
 * Check if has enough currency
 */
export const hasEnoughCurrency = (currency: Currency, required: Currency): boolean => {
  return convertToCopper(currency) >= convertToCopper(required);
};

/**
 * Calculate weekly income based on profession
 */
export const calculateWeeklyIncome = (
  professionName: string,
  minIncome: number,
  maxIncome: number,
  currency: 'copper' | 'silver' | 'gold'
): Currency => {
  const amount = Math.floor(Math.random() * (maxIncome - minIncome + 1)) + minIncome;
  
  if (currency === 'gold') {
    return { gold: amount, silver: 0, copper: 0 };
  } else if (currency === 'silver') {
    return { gold: 0, silver: amount, copper: 0 };
  } else {
    return { gold: 0, silver: 0, copper: amount };
  }
};

/**
 * Calculate living expenses based on lifestyle
 */
export const calculateLivingExpenses = (
  lifestyle: 'squalid' | 'common' | 'comfortable' | 'noble'
): Currency => {
  const expenses = {
    squalid: 2,      // 2 copper
    common: 8,       // 8 copper
    comfortable: 20, // 20 copper
    noble: 10,       // 1 silver = 10 copper
  };
  
  const copperCost = expenses[lifestyle];
  return convertFromCopper(copperCost);
};

/**
 * Calculate troop recruitment cost
 */
export const calculateTroopCost = (tier: number, count: number): Currency => {
  const costs = {
    1: 2,    // T1: 2 copper
    2: 8,    // T2: 8 copper
    3: 20,   // T3: 20 copper
    4: 50,   // T4: 50 copper
    5: 120,  // T5: 120 copper
    6: 300,  // T6: 300 copper
  };
  
  const totalCopper = costs[tier as keyof typeof costs] * count;
  return convertFromCopper(totalCopper);
};

/**
 * Calculate weekly troop wages
 */
export const calculateTroopWages = (tier: number, count: number): Currency => {
  const wages = {
    1: 2,   // T1: 2 copper/week
    2: 5,   // T2: 5 copper/week
    3: 10,  // T3: 10 copper/week
    4: 20,  // T4: 20 copper/week
    5: 40,  // T5: 40 copper/week
    6: 80,  // T6: 80 copper/week
  };
  
  const totalCopper = wages[tier as keyof typeof wages] * count;
  return convertFromCopper(totalCopper);
};

/**
 * Format currency for display
 */
export const formatCurrency = (currency: Currency): string => {
  const parts: string[] = [];
  
  if (currency.gold > 0) {
    parts.push(`${currency.gold} AD`);
  }
  if (currency.silver > 0) {
    parts.push(`${currency.silver} GG`);
  }
  if (currency.copper > 0 || parts.length === 0) {
    parts.push(`${currency.copper} BA`);
  }
  
  return parts.join(', ');
};

/**
 * Calculate total weekly income for a character
 */
export const calculateWeeklyIncome = (character: any): number => {
  if (!character.profession) return 0;
  
  const { min, max, currency } = character.profession.weeklyIncome;
  const amount = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Convert to copper
  if (currency === 'gold') return amount * 300;
  if (currency === 'silver') return amount * 10;
  return amount;
};

/**
 * Calculate total weekly costs for a character
 */
export const calculateWeeklyCosts = (character: any): { troops: number; living: number; total: number } => {
  // Troop wages
  const troopWages = {
    1: 2, 2: 5, 3: 10, 4: 20, 5: 40, 6: 80
  };
  
  const troopCost = character.troops.reduce((sum: number, troop: any) => {
    const wage = troopWages[troop.tier as keyof typeof troopWages] || 0;
    return sum + (wage * troop.count);
  }, 0);
  
  // Living expenses (base 10 copper)
  const livingCost = 10;
  
  return {
    troops: troopCost,
    living: livingCost,
    total: troopCost + livingCost,
  };
};

/**
 * Convert copper amount back to Currency object
 */
export const convertCurrency = (totalCopper: number): Currency => {
  const gold = Math.floor(totalCopper / 300);
  const remaining = totalCopper % 300;
  const silver = Math.floor(remaining / 10);
  const copper = remaining % 10;
  
  return { gold, silver, copper };
};
