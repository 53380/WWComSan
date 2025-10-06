import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Swords, Target, Activity, Settings } from 'lucide-react';
import {
  ABILITIES,
  ATTRIBUTES,
  ATTRIBUTE_DESCRIPTIONS,
  COMBAT_STATES,
  ELEMENTS,
  LANE_STYLES,
  LANE_RULES,
  WEAPONS,
  WEAPON_TAGS,
  ELEMENT_DESCRIPTIONS,
  initialCharacter,
  initialEnemy
} from './constants.js';
import { characterReducer, enemyReducer } from './reducers.js';
import {
  calculateAnimationTiming,
  calculateAnimationTimingWithCrossover,
  calculateDamage,
  calculateERCost,
  calculateHealing,
  calculateResonance,
  computeCompatibility,
  getCrossoverTier,
  getResonanceTier,
  resolveCombatPhase,
  getTimestamp,
  rollDodge
} from './utils.js';

const MAX_LOG_ENTRIES = 20;

const defaultSelectedAbilities = {
  attack: 'fire_attack',
  defense: 'fire_defense',
  control: 'fire_control',
  special: 'fire_special'
};

function useCombatLog(initial = []) {
  const [log, setLog] = useState(initial);

  const addLog = (message, type) => {
    setLog((prev) => [{ message, type, time: Date.now() }, ...prev.slice(0, MAX_LOG_ENTRIES - 1)]);
  };

  const clear = () => setLog([]);

  return { log, addLog, clear };
}

function useAnimationFrame(callback, active) {
  const requestRef = useRef(null);

  useEffect(() => {
    if (!active) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return () => {};
    }

    const animate = () => {
      callback();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, active]);
}

export function CombatSandbox({
  initialCharacterState = initialCharacter,
  initialEnemyState = initialEnemy,
  abilityLoadout = defaultSelectedAbilities
}) {
  const [character, dispatchCharacter] = useReducer(characterReducer, initialCharacterState);
  const [enemy, dispatchEnemy] = useReducer(enemyReducer, initialEnemyState);
  const [combatState, setCombatState] = useState({
    state: COMBAT_STATES.IDLE,
    ability: null,
    progress: 0,
    startTime: 0
  });
  const [selectedAbilities, setSelectedAbilities] = useState(abilityLoadout);
  const [perfectTimingWindow, setPerfectTimingWindow] = useState(null);
  const [ccSuccessTimestamps, setCcSuccessTimestamps] = useState({});
  const [showAllResonances, setShowAllResonances] = useState(false);
  const playerDefenseTimeoutRef = useRef(null);
  const enemyDefenseTimeoutRef = useRef(null);

  const { log: combatLog, addLog, clear: clearLog } = useCombatLog();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = getTimestamp();
      dispatchCharacter({ type: 'PASSIVE_REGEN' });
      dispatchEnemy({ type: 'PASSIVE_REGEN' });
      dispatchCharacter({ type: 'UPDATE_CC', currentTime });
      dispatchEnemy({ type: 'UPDATE_CC', currentTime });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useAnimationFrame(
    () =>
      resolveCombatPhase({
        combatState,
        setCombatState,
        character,
        dispatchEnemy,
        dispatchCharacter,
        addLog,
        setPerfectTimingWindow,
        ccSuccessTimestamps,
        setCcSuccessTimestamps,
        defenseTimeoutRef: playerDefenseTimeoutRef
      }),
    combatState.state !== COMBAT_STATES.IDLE
  );

  useEffect(() => {
    if (!enemy.aiEnabled || combatState.state !== COMBAT_STATES.IDLE || character.hp <= 0 || enemy.hp <= 0) return;

    const timer = setTimeout(() => {
      const affordable = ABILITIES.filter((a) => {
        const rules = LANE_RULES[a.variant] || { softMin: 0.3 };
        const compatScore = computeCompatibility(enemy.weapon, a);
        if (compatScore < (rules.softMin ?? 0)) {
          return false;
        }

        const costCheck = calculateERCost(a, enemy);
        if (costCheck.crossover?.tier === 'Blocked') {
          return false;
        }

        return costCheck.finalCost <= enemy.currentER;
      });
      if (affordable.length === 0) return;

      const ability = affordable[Math.floor(Math.random() * affordable.length)];

      const cost = calculateERCost(ability, enemy);
      dispatchEnemy({ type: 'SPEND_ER', amount: cost.finalCost });
      addLog(`Enemy: ${ability.name}`, 'info');

      const healing = ability.baseHealing ?? 0;
      if (healing > 0) {
        const heal = calculateHealing(ability, enemy);
        if (heal > 0) {
          dispatchEnemy({ type: 'HEAL', amount: heal });
          addLog(`Enemy heals for ${heal} HP`, 'heal');
        }
      }

      const dealsDamage = (ability.baseDamage ?? 0) > 0;
      if (dealsDamage) {
        const dmg = calculateDamage(ability, enemy);
        const dodgeTimestamp = getTimestamp();
        const didDodge = rollDodge(character.attributes.AGI);
        const dodgeErGain = 4;
        const actualDodgeErGain = Math.max(
          0,
          Math.min(character.maxER - character.currentER, dodgeErGain)
        );
        const erOnHit = 1;
        dispatchCharacter({
          type: 'TAKE_DAMAGE',
          amount: dmg,
          didDodge,
          dodgeTimestamp: didDodge ? dodgeTimestamp : undefined,
          dodgeErGain: actualDodgeErGain,
          erOnHit
        });
        if (didDodge) {
          addLog(`Enemy attack dodged! +${actualDodgeErGain} ER`, 'er');
        } else {
          addLog(`Enemy hits for ${dmg} damage`, 'damage');
        }
      }

      if (ability.variant === 'Attack') {
        dispatchEnemy({ type: 'GAIN_ER', amount: WEAPONS[enemy.weapon].erGainedOnHit || 2 });
      } else if (ability.variant === 'Defense') {
        dispatchEnemy({ type: 'SET_DEFENSE', defense: ability });
        if (enemyDefenseTimeoutRef.current) {
          clearTimeout(enemyDefenseTimeoutRef.current);
        }
        enemyDefenseTimeoutRef.current = setTimeout(() => {
          dispatchEnemy({ type: 'CLEAR_DEFENSE' });
          enemyDefenseTimeoutRef.current = null;
        }, ability.duration || 2000);
      }
    }, 1500 + Math.random() * 1000);

    return () => {
      clearTimeout(timer);
      if (enemyDefenseTimeoutRef.current) {
        clearTimeout(enemyDefenseTimeoutRef.current);
        enemyDefenseTimeoutRef.current = null;
      }
    };
  }, [enemy.aiEnabled, enemy.currentER, combatState.state, character.hp, enemy.hp]);

  const handleCast = (ability) => {
    if (combatState.state !== COMBAT_STATES.IDLE) return;

    const cost = calculateERCost(ability, character);
    if (cost.crossover?.tier === 'Blocked') {
      addLog(`${ability.name} is incompatible with ${character.weapon}`, 'error');
      return;
    }
    if (!Number.isFinite(cost.finalCost) || character.currentER < cost.finalCost) {
      addLog(`Not enough ER for ${ability.name}`, 'error');
      return;
    }

    dispatchCharacter({ type: 'SPEND_ER', amount: cost.finalCost });
    addLog(`Casting ${ability.name} (-${cost.finalCost.toFixed(1)} ER)`, 'cast');

    setCombatState({ state: COMBAT_STATES.WIND_UP, ability, progress: 0, startTime: getTimestamp() });
  };

  const handleCancel = () => {
    if (combatState.state !== COMBAT_STATES.WIND_UP) return;

    const cost = calculateERCost(combatState.ability, character);
    const refund = cost.finalCost * 0.4;
    const actualRefund = Math.max(0, Math.min(character.maxER - character.currentER, refund));
    dispatchCharacter({ type: 'GAIN_ER', amount: actualRefund });
    addLog(`Cancelled! Refunded ${actualRefund.toFixed(1)} ER (40%)`, 'info');

    setCombatState({ state: COMBAT_STATES.IDLE, ability: null, progress: 0, startTime: 0 });
  };

  const handlePerfectTiming = () => {
    if (!perfectTimingWindow) return;

    const now = getTimestamp();
    const elapsed = now - perfectTimingWindow.startTime;

    if (elapsed <= perfectTimingWindow.duration) {
      const intendedGain = 4;
      const actualGain = Math.max(
        0,
        Math.min(character.maxER - character.currentER, intendedGain)
      );
      dispatchCharacter({ type: 'GAIN_ER', amount: actualGain });
      addLog(`PERFECT PARRY! +${actualGain} ER`, 'er');
      setPerfectTimingWindow(null);
    } else {
      addLog('Too late! Perfect window missed', 'error');
    }
  };

  const handleReset = () => {
    dispatchCharacter({ type: 'RESET_HP' });
    dispatchEnemy({ type: 'RESET' });
    clearLog();
    setCombatState({ state: COMBAT_STATES.IDLE, ability: null, progress: 0, startTime: 0 });
    if (playerDefenseTimeoutRef.current) {
      clearTimeout(playerDefenseTimeoutRef.current);
      playerDefenseTimeoutRef.current = null;
    }
    if (enemyDefenseTimeoutRef.current) {
      clearTimeout(enemyDefenseTimeoutRef.current);
      enemyDefenseTimeoutRef.current = null;
    }
    addLog('Combat reset', 'info');
  };

  useEffect(
    () => () => {
      if (playerDefenseTimeoutRef.current) {
        clearTimeout(playerDefenseTimeoutRef.current);
        playerDefenseTimeoutRef.current = null;
      }
      if (enemyDefenseTimeoutRef.current) {
        clearTimeout(enemyDefenseTimeoutRef.current);
        enemyDefenseTimeoutRef.current = null;
      }
    },
    []
  );

  const getAbility = (id) => ABILITIES.find((a) => a.id === id);

  const getTopResonances = () => {
    const allResonances = ELEMENTS.map((elem) => {
      const resonances = ATTRIBUTES.map((attr) => ({
        attr,
        value: calculateResonance(character.attributes[attr], character.elements[elem]),
        attrVal: character.attributes[attr],
        elemVal: character.elements[elem]
      })).sort((a, b) => b.value - a.value);

      return {
        elem,
        ...resonances[0],
        tier: getResonanceTier(resonances[0].value)
      };
    }).sort((a, b) => b.value - a.value);

    return allResonances;
  };

  const getHighestResonanceTier = () => {
    const resonances = getTopResonances();
    if (!resonances.length) return 'Base';
    const highest = resonances[0].value;
    if (highest >= 0.7) return 'Merged';
    if (highest >= 0.5) return 'Bonded';
    if (highest >= 0.3) return 'Touched';
    return 'Base';
  };

  const getRelevantAbilities = (variant) => {
    const topResonances = getTopResonances();
    const highestTier = getHighestResonanceTier();
    const rules = LANE_RULES[variant] || { softMin: 0 };
    const weaponTags = WEAPON_TAGS[character.weapon] || [];

    const relevant = ABILITIES.filter((a) => {
      if (a.variant !== variant) return false;

      if (a.requiresResonance) {
        if (a.requiresResonance >= 0.7 && highestTier === 'Base') return false;
        if (a.requiresResonance >= 0.7 && highestTier === 'Touched') return false;
        if (a.requiresResonance >= 0.5 && highestTier === 'Base') return false;
      }

      const elemValue = character.elements[a.governingElem] || 0;
      if (elemValue < 25) return false;

      const compatScore = computeCompatibility(character.weapon, a);
      const hasUniversal = (rules.universalTags || []).some(
        (tag) => weaponTags.includes(tag) || (a.kit?.requiredTags || []).includes(tag)
      );

      if (compatScore < (rules.softMin ?? 0) && !hasUniversal) {
        return false;
      }

      return true;
    });

    return relevant.sort((a, b) => {
      const compatDiff = computeCompatibility(character.weapon, b) - computeCompatibility(character.weapon, a);
      if (Math.abs(compatDiff) > 0.001) {
        return compatDiff;
      }
      const aElemIndex = topResonances.findIndex((r) => r.elem === a.governingElem);
      const bElemIndex = topResonances.findIndex((r) => r.elem === b.governingElem);
      return aElemIndex - bElemIndex;
    });
  };

  const isAbilityRecommended = (ability) => {
    const topResonances = getTopResonances().slice(0, 2);
    const matchesTopElement = topResonances.some((r) => r.elem === ability.governingElem);

    if (!matchesTopElement) return false;

    const rules = LANE_RULES[ability.variant] || { minCompat: 0 };
    const compatScore = computeCompatibility(character.weapon, ability);
    if (compatScore < (rules.minCompat ?? 0)) {
      return false;
    }

    // If it requires resonance, verify you've actually hit that threshold
    if (ability.requiresResonance) {
      const cost = calculateERCost(ability, character);
      return cost.resonance >= ability.requiresResonance;
    }

    return true;
  };

  const renderResonanceDetails = () => (
    <div className="mt-4 p-3 bg-gray-900 rounded border border-purple-500">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-purple-300">Live Resonances (All Elements)</h4>
        <button
          type="button"
          className="text-xs underline"
          onClick={() => setShowAllResonances((prev) => !prev)}
        >
          {showAllResonances ? 'Hide details' : 'Show details'}
        </button>
      </div>
      {ELEMENTS.map((elem) => {
        const resonances = ATTRIBUTES.map((attr) => ({
          attr,
          value: calculateResonance(character.attributes[attr], character.elements[elem]),
          attrVal: character.attributes[attr],
          elemVal: character.elements[elem]
        })).sort((a, b) => b.value - a.value);

        const top = resonances[0];
        const tier = getResonanceTier(top.value);

        return (
          <div key={elem} className="mb-2 p-2 bg-gray-800 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white">{elem}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  tier === 'Merged'
                    ? 'bg-yellow-600'
                    : tier === 'Bonded'
                    ? 'bg-purple-600'
                    : tier === 'Touched'
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}
              >
                {tier}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Best: {top.attr} {top.attrVal} × {elem} {top.elemVal} ={' '}
              <span className="font-mono text-white font-bold">{top.value.toFixed(3)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  tier === 'Merged'
                    ? 'bg-yellow-500'
                    : tier === 'Bonded'
                    ? 'bg-purple-500'
                    : tier === 'Touched'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
                }`}
                style={{ width: `${Math.min(top.value * 100, 100)}%` }}
              />
            </div>
            {showAllResonances && (
              <ul className="mt-2 space-y-1 text-xs text-gray-400">
                {resonances.map((res) => (
                  <li key={res.attr} className="flex justify-between">
                    <span>
                      {res.attr} × {elem}
                    </span>
                    <span className="font-mono text-white">{res.value.toFixed(3)}</span>
                  </li>
                ))}
              </ul>
            )}
            {top.value >= 0.5 && top.value < 0.7 && (
              <div className="text-xs text-purple-400 mt-1">✓ Bonded specials available</div>
            )}
            {top.value >= 0.7 && <div className="text-xs text-yellow-400 mt-1">✓ Merged ultimates available</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Worlds Within - Combat Sandbox</h1>
        <p className="text-sm text-gray-400">
          Wind-Up/Recovery • 23 Weapons • {ABILITIES.length} Abilities • Perfect Timing • CC System
        </p>
      </header>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 bg-gray-800 rounded-lg p-3">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Build Lab
          </h2>

          <div className="mb-3">
            <label className="text-xs font-semibold mb-1 block">Weapon</label>
            <select
              value={character.weapon}
              onChange={(e) => dispatchCharacter({ type: 'SET_WEAPON', weapon: e.target.value })}
              className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm"
            >
              {Object.keys(WEAPONS).map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-400 mt-1">
              Dmg: ×{WEAPONS[character.weapon].damageMultiplier.toFixed(2)} | ER/hit: +{WEAPONS[character.weapon].erGainedOnHit}
            </div>
          </div>

          <div className="mb-3 p-2.5 bg-gray-900 rounded">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold">ER</span>
              <span className="text-base font-bold text-cyan-400">
                {character.currentER.toFixed(0)} / {character.maxER}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all"
                style={{ width: `${(character.currentER / character.maxER) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-xs font-bold mb-2 mt-4 text-orange-400">Attributes</h3>
          {ATTRIBUTES.map((attr) => {
            const description = ATTRIBUTE_DESCRIPTIONS[attr];
            const inputId = `attribute-${attr.toLowerCase()}`;
            const descriptionId = description ? `${inputId}-description` : undefined;

            return (
              <div key={attr} className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold" htmlFor={inputId} title={description}>
                    {attr}
                  </label>
                  <span className="text-xs font-bold">{character.attributes[attr]}</span>
                </div>
                <input
                  id={inputId}
                  type="range"
                  min="0"
                  max="100"
                  value={character.attributes[attr]}
                  onChange={(e) =>
                    dispatchCharacter({ type: 'SET_ATTRIBUTE', attr, value: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-2 rounded"
                  aria-describedby={descriptionId}
                />
                {description ? (
                  <p id={descriptionId} className="mt-1 text-xs text-gray-300 italic opacity-80">
                    {description}
                  </p>
                ) : null}
              </div>
            );
          })}

          <h3 className="text-xs font-bold mb-2 mt-4 text-purple-400">Elements</h3>
          {ELEMENTS.map((elem) => {
            const description = ELEMENT_DESCRIPTIONS[elem];
            const inputId = `element-${elem.toLowerCase()}`;
            const descriptionId = description ? `${inputId}-description` : undefined;

            return (
              <div key={elem} className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold" htmlFor={inputId} title={description}>
                    {elem}
                  </label>
                  <span className="text-xs font-bold">{character.elements[elem]}</span>
                </div>
                <input
                  id={inputId}
                  type="range"
                  min="0"
                  max="100"
                  value={character.elements[elem]}
                  onChange={(e) => dispatchCharacter({ type: 'SET_ELEMENT', elem, value: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 rounded"
                  aria-describedby={descriptionId}
                />
                {description ? (
                  <p id={descriptionId} className="mt-1 text-xs text-gray-300 italic opacity-80">
                    {description}
                  </p>
                ) : null}
              </div>
            );
          })}

          {renderResonanceDetails()}
        </div>

        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5" />
                Combat Arena
              </h2>
              <div className="flex gap-2">
                {combatState.state === COMBAT_STATES.WIND_UP && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-semibold"
                  >
                    Cancel (40% refund)
                  </button>
                )}
                {perfectTimingWindow && (
                  <button
                    type="button"
                    onClick={handlePerfectTiming}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold animate-pulse"
                  >
                    PERFECT PARRY!
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatchEnemy({ type: 'TOGGLE_AI' })}
                  className={`px-3 py-1.5 rounded text-sm font-semibold ${
                    enemy.aiEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {enemy.aiEnabled ? 'Stop AI' : 'Start AI'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-gray-700 rounded p-4 h-64 flex justify-between items-center px-8">
              <div className="text-center relative">
                <div
                  className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center text-2xl transition-colors ${
                    combatState.state === COMBAT_STATES.WIND_UP
                      ? 'bg-yellow-500'
                      : combatState.state === COMBAT_STATES.RECOVERY
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                >
                  👤
                </div>
                {combatState.state !== COMBAT_STATES.IDLE && (
                  <div className="absolute -bottom-2 left-0 right-0">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          combatState.state === COMBAT_STATES.WIND_UP ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${combatState.progress * 100}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1 font-bold text-yellow-400">
                      {combatState.state === COMBAT_STATES.WIND_UP ? 'WIND-UP' : 'RECOVERY'}
                    </div>
                  </div>
                )}
                <div className="text-xs font-bold mt-4">PLAYER</div>
                <div className="text-xs">
                  HP: {character.hp}/{character.maxHp}
                </div>
                <div className="text-xs">ER: {character.currentER.toFixed(0)}</div>
                {character.activeDefense && (
                  <div className="text-xs text-green-400 mt-1">
                    Defense: {((1 - character.activeDefense.mitigationMultiplier) * 100).toFixed(0)}%
                  </div>
                )}
                {character.ccEffects.length > 0 && (
                  <div className="text-xs text-red-400 mt-1">CC: {character.ccEffects.map((cc) => cc.type).join(', ')}</div>
                )}
              </div>

              <div className="text-4xl">⚔️</div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-600 mb-2 flex items-center justify-center text-2xl">🎯</div>
                <div className="text-xs font-bold">ENEMY</div>
                <div className="text-xs">
                  HP: {enemy.hp}/{enemy.maxHp}
                </div>
                <div className="text-xs">ER: {enemy.currentER.toFixed(0)}</div>
                {enemy.activeDefense && (
                  <div className="text-xs text-green-400 mt-1">
                    Defense: {((1 - enemy.activeDefense.mitigationMultiplier) * 100).toFixed(0)}%
                  </div>
                )}
                {enemy.ccEffects.length > 0 && (
                  <div className="text-xs text-red-400 mt-1">CC: {enemy.ccEffects.map((cc) => cc.type).join(', ')}</div>
                )}
                {enemy.aiEnabled && <div className="text-xs text-green-400 mt-1">AI ACTIVE</div>}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Combat Lanes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-3">
              {['attack', 'defense', 'control', 'special'].map((lane) => {
                const variant = lane === 'attack' ? 'Attack' : lane === 'defense' ? 'Defense' : lane === 'control' ? 'Control' : 'Special';
                const relevantAbilities = getRelevantAbilities(variant);

                return (
                  <div key={lane}>
                    <select
                      value={selectedAbilities[lane]}
                      onChange={(e) => setSelectedAbilities((prev) => ({ ...prev, [lane]: e.target.value }))}
                      className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1"
                    >
                      {relevantAbilities.map((a) => {
                        const recommended = isAbilityRecommended(a);
                        const compatScore = computeCompatibility(character.weapon, a);
                        const compatTier = getCrossoverTier(compatScore);
                        return (
                          <option key={a.id} value={a.id}>
                            {recommended ? '⭐ ' : ''}
                            {a.name} ({compatTier})
                          </option>
                        );
                      })}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      {relevantAbilities.length} / {ABILITIES.filter((ab) => ab.variant === variant).length}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { ability: getAbility(selectedAbilities.attack), lane: 'A' },
                { ability: getAbility(selectedAbilities.defense), lane: 'D' },
                { ability: getAbility(selectedAbilities.control), lane: 'C' },
                { ability: getAbility(selectedAbilities.special), lane: 'S' }
              ].map(({ ability, lane }) => {
                if (!ability) return null;
                const cost = calculateERCost(ability, character);
                const compatScore = cost.crossover?.score ?? computeCompatibility(character.weapon, ability);
                const compatTier = cost.crossover?.tier ?? getCrossoverTier(compatScore);
                const penalty = cost.crossover?.penalty;
                const canAfford = Number.isFinite(cost.finalCost) && character.currentER >= cost.finalCost;
                const meetsResonance = !ability.requiresResonance || cost.resonance >= ability.requiresResonance;
                const isBlocked = compatTier === 'Blocked';
                const canCast = !isBlocked && canAfford && meetsResonance && combatState.state === COMBAT_STATES.IDLE;
                const styles = LANE_STYLES[ability.variant];
                const prospectiveDamage = ability.baseDamage ? calculateDamage(ability, character) : 0;
                const prospectiveHealing = ability.baseHealing ? calculateHealing(ability, character) : 0;
                const timing = calculateAnimationTimingWithCrossover(ability, character);
                const cancelRefund = Number.isFinite(cost.finalCost) ? cost.finalCost * 0.4 : 0;
                const weaponData = WEAPONS[character.weapon] || {};
                const erOnHit = weaponData.erGainedOnHit ?? 0;
                const erPenaltyPct = penalty ? Math.round((penalty.er - 1) * 100) : 0;
                const dmgPenaltyPct = penalty ? Math.round((penalty.dmg - 1) * 100) : 0;
                const windPenaltyPct = penalty ? Math.round((penalty.windUp - 1) * 100) : 0;
                const formatPercent = (value) => (value > 0 ? `+${value}` : `${value}`);
                const compatBadgeClass =
                  compatTier === 'Native'
                    ? 'bg-green-600'
                    : compatTier === 'Soft'
                    ? 'bg-yellow-600'
                    : compatTier === 'Hard'
                    ? 'bg-orange-600'
                    : 'bg-red-700';
                let compatibilityTooltip = '';
                if (compatTier === 'Blocked') {
                  compatibilityTooltip = 'Blocked by weapon compatibility';
                } else {
                  compatibilityTooltip = `Compatibility ${compatScore.toFixed(2)} (${compatTier})`;
                  if (penalty && compatTier !== 'Native') {
                    compatibilityTooltip += ` • ${formatPercent(erPenaltyPct)}% ER, ${formatPercent(dmgPenaltyPct)}% dmg, ${formatPercent(windPenaltyPct)}% wind-up`;
                  }
                }
                const tooltipParts = [];
                if (compatibilityTooltip) tooltipParts.push(compatibilityTooltip);
                if (!meetsResonance) {
                  tooltipParts.push(
                    `Requires ${ability.governingAttr}×${ability.governingElem} ≥ ${ability.requiresResonance}. You have: ${cost.resonance.toFixed(3)}`
                  );
                } else if (!canAfford && Number.isFinite(cost.finalCost)) {
                  tooltipParts.push(`Need ${(cost.finalCost - character.currentER).toFixed(1)} more ER`);
                }
                const tooltip = tooltipParts.join(' • ');

                return (
                  <button
                    key={lane}
                    type="button"
                    onClick={() => handleCast(ability)}
                    disabled={!canCast}
                    className={`p-4 rounded border-2 transition-all relative ${
                      canCast ? `${styles.active} ${styles.hover}` : 'bg-gray-800 border-gray-700 opacity-40 cursor-not-allowed'
                    }`}
                    title={tooltip}
                  >
                    <div
                      className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${compatBadgeClass}`}
                      title={`Compatibility ${compatScore.toFixed(2)} (${compatTier})`}
                    >
                      {compatTier}
                    </div>
                    <div className="text-xs font-bold mb-1 text-gray-400">{lane}</div>
                    <div className="text-sm font-bold mb-1">{ability.name}</div>
                    {isAbilityRecommended(ability) && <div className="text-xs text-yellow-400 mb-1">⭐ Recommended</div>}
                    <div className={`text-2xl font-bold ${canAfford ? 'text-cyan-400' : 'text-red-400'}`}>
                      {Number.isFinite(cost.finalCost) ? cost.finalCost.toFixed(1) : '—'}
                    </div>
                    <div className="text-xs text-gray-400">ER</div>
                    <div className="mt-1 text-[0.7rem] text-gray-300 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                      <span title="Estimated damage output">
                        ≈{prospectiveDamage > 0 ? `${prospectiveDamage}` : '—'} dmg
                      </span>
                      <span title="Estimated healing output">
                        ≈{prospectiveHealing > 0 ? `${prospectiveHealing}` : '—'} heal
                      </span>
                      <span title="Approximate wind-up time">wind-up {timing.windUp.toFixed(2)}s</span>
                    </div>
                    <div className="mt-2 text-[0.65rem] text-gray-400 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                      <span title="Energy refunded if you cancel during wind-up">
                        Cancel refund {Number.isFinite(cost.finalCost) ? `≈${cancelRefund.toFixed(1)} ER` : '—'}
                      </span>
                      {ability.variant === 'Attack' && erOnHit > 0 && (
                        <span title="Energy returned on a successful hit with this weapon">
                          On-hit +{erOnHit} ER
                        </span>
                      )}
                    </div>
                    {penalty && compatTier !== 'Native' && compatTier !== 'Blocked' && (
                      <div className="mt-1 text-[0.65rem] text-gray-400">
                        {formatPercent(erPenaltyPct)}% ER · {formatPercent(dmgPenaltyPct)}% dmg · {formatPercent(windPenaltyPct)}% wind-up
                      </div>
                    )}
                    {compatTier === 'Blocked' && (
                      <div className="mt-1 text-[0.65rem] text-red-400">Blocked: incompatible with current weapon</div>
                    )}
                    <div className="text-xs mt-1 text-gray-300">{ability.description}</div>
                    {ability.requiresResonance && (
                      <div
                        className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                          meetsResonance ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        R≥{ability.requiresResonance.toFixed(1)}
                      </div>
                    )}
                    {cost.resonanceTier !== 'Base' && !ability.requiresResonance && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">
                        {cost.resonanceTier}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-gray-900 rounded text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400">Weapon:</span>
                  <span className="font-bold text-cyan-400 ml-1">{character.weapon}</span>
                </div>
                <div>
                  <span className="text-gray-400">Wind-Up:</span>
                  <span className="font-mono ml-1 text-white">
                    {calculateAnimationTiming(character.weapon, character.attributes.AGI).windUp.toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Combat Log
            </h3>
            <div className="space-y-1 text-sm max-h-96 overflow-y-auto">
              {combatLog.length === 0 ? (
                <p className="text-gray-500 italic text-xs">Cast an ability to begin</p>
              ) : (
                combatLog.map((logEntry, index) => (
                  <div
                    key={logEntry.time + index}
                    className={`py-1.5 px-2 rounded text-xs ${
                      logEntry.type === 'damage'
                        ? 'bg-red-900 bg-opacity-30 text-red-300'
                        : logEntry.type === 'heal'
                        ? 'bg-green-900 bg-opacity-30 text-green-300'
                        : logEntry.type === 'er'
                        ? 'bg-cyan-900 bg-opacity-30 text-cyan-300'
                        : logEntry.type === 'cast'
                        ? 'bg-blue-900 bg-opacity-30 text-blue-300'
                        : logEntry.type === 'error'
                        ? 'bg-orange-900 bg-opacity-30 text-orange-300'
                        : 'bg-gray-900 bg-opacity-50 text-gray-300'
                    }`}
                  >
                    {logEntry.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CombatSandbox;
