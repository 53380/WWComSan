import { describe, expect, it } from 'vitest';
import { calculateDamage, calculateHealing } from '../utils.js';

const baseCharacter = {
  weapon: 'Long Swords',
  attributes: {
    STR: 80,
    DEX: 40,
    INS: 30,
    SPR: 80,
    CHA: 50,
    TOU: 0,
    AGI: 0
  },
  elements: {
    Fire: 90,
    Verdant: 70
  }
};

describe('calculateDamage', () => {
  it('scales with resonance tiers, weapon multiplier, and composite attribute weights', () => {
    const ability = {
      variant: 'Attack',
      baseDamage: 100,
      governingAttr: 'STR',
      governingElem: 'Fire'
    };

    const character = {
      ...baseCharacter,
      weapon: 'Long Swords',
      attributes: { ...baseCharacter.attributes, STR: 80 },
      elements: { ...baseCharacter.elements, Fire: 90 }
    };

    const damage = calculateDamage(ability, character);

    expect(damage).toBe(381);
  });
});

describe('calculateHealing', () => {
  it('includes resonance bonus and rounded totals for supportive stats', () => {
    const ability = {
      baseHealing: 200,
      governingAttr: 'SPR',
      governingElem: 'Verdant'
    };

    const character = {
      ...baseCharacter,
      attributes: { ...baseCharacter.attributes, SPR: 80, CHA: 50 },
      elements: { ...baseCharacter.elements, Verdant: 70 }
    };

    const healing = calculateHealing(ability, character);

    expect(healing).toBe(554);
  });
});
