import { WEAPONS, COMBAT_STATES } from './constants.js';

export const calculateResonance = (attrValue, elemValue) => (attrValue / 100) * (elemValue / 100);

export const getAttributeTierDiscount = (value) => {
  if (value >= 90) return 0.15;
  if (value >= 60) return 0.10;
  if (value >= 30) return 0.05;
  return 0;
};

export const getResonanceDiscount = (resonance) => {
  if (resonance >= 0.9) return 0.20;
  if (resonance >= 0.7) return 0.15;
  if (resonance >= 0.5) return 0.10;
  if (resonance >= 0.3) return 0.05;
  return 0;
};

export const getResonanceTier = (resonance) => {
  if (resonance >= 0.7) return 'Merged';
  if (resonance >= 0.5) return 'Bonded';
  if (resonance >= 0.3) return 'Touched';
  return 'Base';
};

export const calculateAnimationTiming = (weapon, agiValue) => {
  const weaponData = WEAPONS[weapon];
  const massModifier = 1 + (weaponData.mass - 1) * 0.1;
  const agiModifier = 1 - (agiValue / 100) * 0.3;
  const windUpReduction = weaponData.windUpReduction || 0;

  return {
    windUp: weaponData.windUpBase * massModifier * agiModifier * (1 - windUpReduction),
    recovery: weaponData.recoveryBase * massModifier * agiModifier
  };
};

export const calculateERCost = (ability, character) => {
  const attrValue = character.attributes[ability.governingAttr] || 0;
  const elemValue = character.elements[ability.governingElem] || 0;
  const resonance = calculateResonance(attrValue, elemValue);
  const s = ability.scalars;

  const grossCost = ability.baseBand * (s.scope || 1) * (s.potency || 1) * (s.uptime || 1) *
    (s.reliability || 1) * (s.mobility || 1) * (s.ccCap || 1) *
    (s.reaction || 1) * (s.cooldown || 1) * (s.risk || 1);

  const finalCost = grossCost * (1 - getAttributeTierDiscount(attrValue)) * (1 - getResonanceDiscount(resonance));

  return {
    grossCost,
    finalCost: Math.round(finalCost * 10) / 10,
    resonance,
    resonanceTier: getResonanceTier(resonance)
  };
};

export const calculateDamage = (ability, character) => {
  const attrValue = character.attributes[ability.governingAttr] || 0;
  const elemValue = character.elements[ability.governingElem] || 0;
  const resonance = calculateResonance(attrValue, elemValue);
  const weaponMult = WEAPONS[character.weapon].damageMultiplier;

  // Enhanced attribute contributions
  const strMod = 1 + ((character.attributes.STR || 0) / 100) * 0.5;
  const dexMod = 1 + ((character.attributes.DEX || 0) / 100) * 0.3;
  const insMod = 1 + ((character.attributes.INS || 0) / 100) * 0.4;

  let finalMod = 1 + attrValue / 100;
  if (ability.variant === 'Attack') {
    finalMod *= (strMod * 0.4 + dexMod * 0.3 + insMod * 0.3);
  } else if (ability.variant === 'Special') {
    finalMod *= (insMod * 0.5 + strMod * 0.3 + dexMod * 0.2);
  }

  return Math.round((ability.baseDamage || 10) * finalMod * (1 + resonance) * weaponMult);
};

export const calculateHealing = (ability, character) => {
  const attrValue = character.attributes[ability.governingAttr] || 0;
  const elemValue = character.elements[ability.governingElem] || 0;
  const resonance = calculateResonance(attrValue, elemValue);

  const sprMod = 1 + ((character.attributes.SPR || 0) / 100) * 0.6;
  const chaMod = 1 + ((character.attributes.CHA || 0) / 100) * 0.4;

  const baseHeal = ability.baseHealing || 0;
  return Math.round(baseHeal * sprMod * chaMod * (1 + resonance));
};

export const resolveCombatPhase = ({
  combatState,
  setCombatState,
  character,
  dispatchEnemy,
  dispatchCharacter,
  addLog,
  setPerfectTimingWindow,
  ccSuccessTimestamps,
  setCcSuccessTimestamps
}) => {
  if (combatState.state === COMBAT_STATES.IDLE) {
    return;
  }

  const timing = calculateAnimationTiming(character.weapon, character.attributes.AGI);
  const phaseDuration = combatState.state === COMBAT_STATES.WIND_UP ? timing.windUp : timing.recovery;
  const elapsed = (Date.now() - combatState.startTime) / 1000;
  const progress = Math.min(elapsed / phaseDuration, 1);

  setCombatState((prev) => ({ ...prev, progress }));

  if (progress < 1) {
    return;
  }

  if (combatState.state === COMBAT_STATES.WIND_UP) {
    const ability = combatState.ability;

    if (ability.variant === 'Support') {
      const heal = calculateHealing(ability, character);
      dispatchCharacter({ type: 'HEAL', amount: heal });
      addLog(`${ability.name} heals for ${heal} HP`, 'heal');
      dispatchCharacter({ type: 'GAIN_ER', amount: 2 });
      addLog(`+2 ER`, 'er');
    } else {
      const dmg = calculateDamage(ability, character);
      dispatchEnemy({ type: 'TAKE_DAMAGE', amount: dmg });
      addLog(`${ability.name} hits for ${dmg} damage`, 'damage');

      if (ability.variant === 'Attack') {
        const erGain = WEAPONS[character.weapon].erGainedOnHit || 2;
        dispatchCharacter({ type: 'GAIN_ER', amount: erGain });
        addLog(`+${erGain} ER`, 'er');
      } else if (ability.variant === 'Defense') {
        dispatchCharacter({ type: 'SET_DEFENSE', defense: ability });
        const perfectWindow = ability.perfectWindow || 0.3;
        setPerfectTimingWindow({
          startTime: Date.now(),
          duration: perfectWindow * 1000,
          ability
        });

        addLog(`Defense active! ${perfectWindow.toFixed(1)}s perfect window`, 'info');

        setTimeout(() => {
          setPerfectTimingWindow(null);
          dispatchCharacter({ type: 'CLEAR_DEFENSE' });
          addLog('Defense ended', 'info');
        }, ability.duration || 2000);
      } else if (ability.variant === 'Control') {
        if (ability.ccDuration && ability.ccType) {
          const cappedDuration = Math.min(ability.ccDuration, 2.0);
          dispatchEnemy({ type: 'ADD_CC', ccType: ability.ccType, duration: cappedDuration });
          addLog(`Applied ${ability.ccType} (${cappedDuration}s, capped at 2.0s)`, 'info');

          const now = Date.now();
          const lastSuccess = ccSuccessTimestamps[ability.id] || 0;
          const timeSinceLastSuccess = (now - lastSuccess) / 1000;

          if (timeSinceLastSuccess >= 2.0) {
            dispatchCharacter({ type: 'GAIN_ER', amount: 1 });
            addLog('CC success! +1 ER (2s gate passed)', 'er');
            setCcSuccessTimestamps((prev) => ({ ...prev, [ability.id]: now }));
          } else {
            addLog(`CC applied (ER gain on cooldown: ${(2.0 - timeSinceLastSuccess).toFixed(1)}s)`, 'info');
          }
        }
      }
    }

    setCombatState({ state: COMBAT_STATES.RECOVERY, ability, progress: 0, startTime: Date.now() });
  } else {
    setCombatState({ state: COMBAT_STATES.IDLE, ability: null, progress: 0, startTime: 0 });
  }
};
