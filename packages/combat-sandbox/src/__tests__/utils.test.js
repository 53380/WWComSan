import { describe, expect, it } from 'vitest';
import { calculateDamage, calculateERCost, calculateHealing } from '../utils.js';

const baseCharacter = {
  weapon: 'Long Swords',
  attributes: {
    STR: 80,
    DEX: 40,
    INS: 30,
    SPR: 80,
    CHA: 50,
    TOU: 0,
    AGI: 0,
    Impact: 40
  },
  elements: {
    Fire: 90,
    Verdant: 70
  }
};

describe('calculateERCost', () => {
  it('applies attribute and resonance discounts with rounding and tier detection', () => {
    const ability = {
      baseBand: 10,
      governingAttr: 'STR',
      governingElem: 'Fire',
      scalars: {
        scope: 1,
        potency: 1,
        uptime: 1,
        reliability: 1,
        mobility: 1,
        ccCap: 1,
        reaction: 1,
        cooldown: 1,
        risk: 1
      }
    };

    const character = {
      ...baseCharacter,
      attributes: { ...baseCharacter.attributes, STR: 60 },
      elements: { ...baseCharacter.elements, Fire: 70 }
    };

    const result = calculateERCost(ability, character);

    expect(result.grossCost).toBe(10);
    expect(result.finalCost).toBe(8.6);
    expect(result.resonance).toBeCloseTo(0.42, 5);
    expect(result.resonanceTier).toBe('Touched');
  });
});

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

    expect(damage).toBe(412);
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
