import { describe, expect, it } from 'vitest';
import { characterReducer, enemyReducer } from '../reducers.js';

const baseCharacterState = {
  hp: 200,
  maxHp: 200,
  currentER: 50,
  maxER: 100,
  attributes: { STR: 20, DEX: 20, INS: 20, SPR: 20, CHA: 20, TOU: 50, AGI: 20 },
  elements: { Fire: 20, Water: 20 },
  weapon: 'Long Swords',
  activeDefense: null,
  ccEffects: []
};

describe('characterReducer', () => {
  it('grants ER on dodge without applying damage', () => {
    const dodged = characterReducer(baseCharacterState, {
      type: 'TAKE_DAMAGE',
      amount: 100,
      didDodge: true,
      dodgeErGain: 5,
      dodgeTimestamp: 1234
    });

    expect(dodged.hp).toBe(baseCharacterState.hp);
    expect(dodged.currentER).toBe(baseCharacterState.currentER + 5);
    expect(dodged.lastDodge).toBe(1234);
  });

  it('applies mitigation, toughness reduction, and ER gain on hit', () => {
    const mitigatedState = characterReducer(
      { ...baseCharacterState, activeDefense: { mitigationMultiplier: 0.5 }, currentER: 98 },
      { type: 'TAKE_DAMAGE', amount: 100, erOnHit: 3 }
    );

    expect(mitigatedState.hp).toBe(155);
    expect(mitigatedState.currentER).toBe(100);
  });

  it('caps CC durations and stores computed expiration', () => {
    const ccState = characterReducer(baseCharacterState, {
      type: 'ADD_CC',
      ccType: 'Stun',
      duration: 3,
      applied: 1000
    });

    expect(ccState.ccEffects).toHaveLength(1);
    expect(ccState.ccEffects[0]).toMatchObject({
      type: 'Stun',
      duration: 2,
      applied: 1000,
      expiresAt: 3000
    });
  });

  it('removes expired CC entries based on provided timestamp', () => {
    const stateWithCc = {
      ...baseCharacterState,
      ccEffects: [
        { type: 'Stun', duration: 2, applied: 0, expiresAt: 1000 },
        { type: 'Slow', duration: 1.5, applied: 0, expiresAt: 4000 }
      ]
    };

    const updated = characterReducer(stateWithCc, { type: 'UPDATE_CC', currentTime: 2500 });

    expect(updated.ccEffects).toEqual([
      { type: 'Slow', duration: 1.5, applied: 0, expiresAt: 4000 }
    ]);
  });

  it('regenerates ER passively without exceeding maxER', () => {
    const regen = characterReducer({ ...baseCharacterState, currentER: 99, maxER: 100 }, { type: 'PASSIVE_REGEN' });
    expect(regen.currentER).toBe(100);
  });
});

const baseEnemyState = {
  hp: 300,
  maxHp: 300,
  currentER: 95,
  maxER: 100,
  activeDefense: { mitigationMultiplier: 0.6 },
  ccEffects: []
};

describe('enemyReducer', () => {
  it('applies mitigation when taking damage', () => {
    const result = enemyReducer(baseEnemyState, { type: 'TAKE_DAMAGE', amount: 100 });
    expect(result.hp).toBe(240);
  });

  it('adds CC effects through helper payload', () => {
    const result = enemyReducer(baseEnemyState, {
      type: 'ADD_CC',
      ccType: 'Root',
      duration: 2.5,
      applied: 2000
    });

    expect(result.ccEffects).toHaveLength(1);
    expect(result.ccEffects[0].duration).toBe(2);
    expect(result.ccEffects[0].expiresAt).toBe(4000);
  });

  it('filters expired CC effects and regenerates ER', () => {
    const stateWithCc = {
      ...baseEnemyState,
      ccEffects: [
        { type: 'Root', duration: 2, applied: 0, expiresAt: 1500 },
        { type: 'Shock', duration: 2, applied: 0, expiresAt: 5000 }
      ],
      currentER: 99
    };

    const afterUpdate = enemyReducer(stateWithCc, { type: 'UPDATE_CC', currentTime: 2000 });
    expect(afterUpdate.ccEffects).toEqual([
      { type: 'Shock', duration: 2, applied: 0, expiresAt: 5000 }
    ]);

    const afterRegen = enemyReducer(afterUpdate, { type: 'PASSIVE_REGEN' });
    expect(afterRegen.currentER).toBe(100);
  });
});
