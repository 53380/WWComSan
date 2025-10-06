import { describe, it, expect } from 'vitest';
import {
  ABILITIES,
  WEAPON_TAGS
} from '../constants.js';
import {
  applyCrossoverModifiers,
  calculateDamage,
  calculateERCost,
  computeCompatibility,
  getCrossoverTier
} from '../utils.js';

const findAbility = (id) => ABILITIES.find((ability) => ability.id === id);

const baseAttributes = {
  STR: 0,
  DEX: 0,
  TOU: 0,
  AGI: 0,
  SPR: 0,
  INS: 0,
  CHA: 0,
  Impact: 0
};

const baseElements = {
  Fire: 0,
  Water: 0,
  Stone: 0,
  Air: 0,
  Spark: 0,
  Verdant: 0,
  Essence: 0
};

const buildCharacter = (weapon) => ({
  weapon,
  attributes: { ...baseAttributes },
  elements: { ...baseElements },
  currentER: 100,
  maxER: 100,
  hp: 100,
  maxHp: 100
});

describe('weapon compatibility scoring', () => {
  it('yields a native score for on-kit pairings', () => {
    const ability = findAbility('fire_attack');
    const score = computeCompatibility('Long Swords', ability);
    expect(score).toBeCloseTo(0.9, 3);
    expect(getCrossoverTier(score)).toBe('Native');
  });

  it('blocks abilities when required tags are missing', () => {
    const ability = findAbility('fire_heavy_defense');
    const score = computeCompatibility('Longbows', ability);
    expect(score).toBe(0);
    expect(getCrossoverTier(score)).toBe('Blocked');
  });

  it('marks partial overlaps as hard crossovers', () => {
    const hybridAbility = {
      kit: { requiredTags: ['Close', 'Guard'], tags: ['Pierce'], preferredFamilies: [] }
    };
    const score = computeCompatibility('Spears (Thrusting)', hybridAbility);
    expect(score).toBeCloseTo(0.45, 3);
    expect(getCrossoverTier(score)).toBe('Hard');
  });
});

describe('crossover penalties', () => {
  it('applies tiered multipliers to cost, damage, and timing', () => {
    const actor = buildCharacter('Spears (Thrusting)');
    const hardAbility = {
      kit: { requiredTags: ['Close', 'Guard'], tags: ['Pierce'], preferredFamilies: [] }
    };

    const result = applyCrossoverModifiers({
      ability: hardAbility,
      actor,
      baseCost: 10,
      baseDamage: 50,
      baseTiming: { windUp: 2 }
    });

    expect(result.tier).toBe('Hard');
    expect(result.finalCost).toBeCloseTo(13.5, 5);
    expect(result.finalDamage).toBeCloseTo(40, 5);
    expect(result.finalTiming.windUp).toBeCloseTo(2.4, 5);
  });
});

describe('integration with cost and damage calculators', () => {
  const ability = findAbility('fire_heavy_defense');
  const nativeCharacter = buildCharacter('Long Swords');
  const softCharacter = buildCharacter('Spears (Thrusting)');
  const blockedCharacter = buildCharacter('Crossbows');

  const roundTo = (value, decimals) => {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  };

  it('keeps base costs identical before crossover modifiers', () => {
    const nativeCost = calculateERCost(ability, nativeCharacter);
    const softCost = calculateERCost(ability, softCharacter);
    expect(softCost.baseFinalCost).toBe(nativeCost.baseFinalCost);
    expect(softCost.crossover.tier).toBe('Soft');

    const expectedSoft = roundTo(roundTo(nativeCost.baseFinalCost * 1.15, 2), 1);
    expect(softCost.finalCost).toBe(expectedSoft);
  });

  it('reduces damage output for soft crossovers', () => {
    const nativeDamage = calculateDamage(ability, nativeCharacter);
    const softDamage = calculateDamage(ability, softCharacter);
    expect(nativeDamage).toBeGreaterThan(softDamage);
    expect(softDamage).toBe(7);
  });

  it('blocks incompatible abilities completely', () => {
    const blockedAbility = findAbility('fire_attack');
    const cost = calculateERCost(blockedAbility, blockedCharacter);
    expect(cost.crossover.tier).toBe('Blocked');
    expect(cost.finalCost).toBe(Infinity);

    const damage = calculateDamage(blockedAbility, blockedCharacter);
    expect(damage).toBe(0);
  });
});

it('weapon tags expose universal hooks for validation sanity', () => {
  Object.entries(WEAPON_TAGS).forEach(([weapon, tags]) => {
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.every((tag) => typeof tag === 'string')).toBe(true);
    expect(new Set(tags).size).toBe(tags.length);
  });
});
