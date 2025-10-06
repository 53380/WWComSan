export const ATTRIBUTES = ['STR', 'DEX', 'TOU', 'AGI', 'SPR', 'INS', 'CHA', 'Impact'];

export const ATTRIBUTE_DESCRIPTIONS = {
  STR: 'Strength lifts melee damage bonuses from +10% at tier 30 up to +40% at tier 90 and fuels Inferno Wave with Fire.',
  DEX: 'Dexterity raises crit and off-hand reliability, peaking at +14% crit to spark Chain-Jump style reactions.',
  TOU: 'Toughness adds flat physical damage reduction, climbing toward 8% while pairing with Stone for Charge-Armour.',
  AGI: 'Agility shaves the global cooldown toward 0.75s and widens dodge rolls, unlocking Jet Dash with Air.',
  SPR: 'Spirit amplifies restorative and cleansing payloads, empowering Water and Verdant resonance hooks.',
  INS: 'Insight expands hidden-information reveals—from glow pings to Forecast—and supercharges Essence breaches.',
  CHA: 'Charisma strengthens threat and aura broadcasts, sharing resonance boons across the party.',
  Impact: 'Impact boosts the payoff of damage abilities by amplifying the final damage multiplier for Attacks and Specials.'
};

export const ELEMENT_DESCRIPTIONS = {
  Fire: 'Fire embodies burn and empowerment themes—aggressive damage that peaks in Inferno Wave and lava reactions.',
  Water: 'Water focuses on flow and cleansing support, turning resonance into sustain, debuff washes, and redirect stances.',
  Stone: 'Stone is the fortify-and-impede element, layering mitigation, slows, and Charge-Armour bulwarks.',
  Air: 'Air channels lift and displacement, rewarding high agility builds with mobility tricks like Jet Dash.',
  Spark: 'Spark carries charge-and-jump energy, excelling at chained crit bursts and stun-laced openings.',
  Verdant: 'Verdant nurtures regrowth and entanglement, blending damage with heals through living terrain effects.',
  Essence: 'Essence manipulates soullight to infuse or transmute, enabling phase strikes and reality-tearing ultimates.'
};

export const ELEMENTS = ['Fire', 'Water', 'Stone', 'Air', 'Spark', 'Verdant', 'Essence'];

export const WEAPONS = {
  'Long Swords': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.36, recoveryBase: 0.48, erGainedOnHit: 4 },
  'Curved Long Blades': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.34, recoveryBase: 0.48, erGainedOnHit: 4 },
  'Short Swords': { mass: 1, damageMultiplier: 0.9, windUpBase: 0.28, recoveryBase: 0.38, erGainedOnHit: 3 },
  'Great Swords': { mass: 3, damageMultiplier: 1.3, windUpReduction: 0.08, windUpBase: 0.405, recoveryBase: 0.60, erGainedOnHit: 6 },
  'Knives & Daggers': { mass: 1, damageMultiplier: 0.85, windUpBase: 0.26, recoveryBase: 0.36, erGainedOnHit: 2 },
  'Fist Weapons': { mass: 1, damageMultiplier: 0.85, windUpBase: 0.26, recoveryBase: 0.34, erGainedOnHit: 2 },
  'One-Hand Axes': { mass: 2, damageMultiplier: 1.1, windUpBase: 0.38, recoveryBase: 0.52, erGainedOnHit: 4 },
  'Two-Hand Axes': { mass: 3, damageMultiplier: 1.35, windUpBase: 0.46, recoveryBase: 0.62, erGainedOnHit: 6 },
  'Spears (Thrusting)': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.36, recoveryBase: 0.48, erGainedOnHit: 4 },
  'Polearms (Sweeping)': { mass: 2, damageMultiplier: 1.05, windUpBase: 0.40, recoveryBase: 0.52, erGainedOnHit: 4 },
  'Blunt Weapons': { mass: 3, damageMultiplier: 1.35, windUpBase: 0.46, recoveryBase: 0.64, erGainedOnHit: 6 },
  'Flails & Chain Maces': { mass: 2, damageMultiplier: 1.1, windUpBase: 0.36, recoveryBase: 0.52, erGainedOnHit: 4 },
  'Whips & Urumi': { mass: 1, damageMultiplier: 0.9, windUpBase: 0.32, recoveryBase: 0.50, erGainedOnHit: 2 },
  'Staffs': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.38, recoveryBase: 0.50, erGainedOnHit: 4 },
  'Shields': { mass: 2, damageMultiplier: 0.8, windUpBase: 0.32, recoveryBase: 0.42, erGainedOnHit: 4 },
  'Longbows': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.42, recoveryBase: 0.52, erGainedOnHit: 4 },
  'Short Bows': { mass: 1, damageMultiplier: 0.9, windUpBase: 0.34, recoveryBase: 0.46, erGainedOnHit: 3 },
  'Crossbows': { mass: 2, damageMultiplier: 1.1, windUpBase: 0.42, recoveryBase: 0.56, erGainedOnHit: 4 },
  'Pistols': { mass: 2, damageMultiplier: 1.0, windUpBase: 0.42, recoveryBase: 0.56, erGainedOnHit: 4 },
  'Shotguns': { mass: 2, damageMultiplier: 1.2, windUpBase: 0.42, recoveryBase: 0.60, erGainedOnHit: 4 },
  'Long Guns': { mass: 3, damageMultiplier: 1.25, windUpBase: 0.50, recoveryBase: 0.65, erGainedOnHit: 6 },
  'Thrown Weapons': { mass: 1, damageMultiplier: 0.95, windUpBase: 0.30, recoveryBase: 0.42, erGainedOnHit: 2 },
  'Misc. Ranged': { mass: 1, damageMultiplier: 0.9, windUpBase: 0.32, recoveryBase: 0.46, erGainedOnHit: 2 }
};

export const COMBAT_STATES = { IDLE: 'idle', WIND_UP: 'windUp', RECOVERY: 'recovery' };

export const ABILITIES = [
  { id: 'fire_attack', name: 'Embernick', family: 'Fire', variant: 'Attack', baseBand: 5, baseDamage: 10, governingAttr: 'STR', governingElem: 'Fire', scalars: { scope: 1.0, potency: 1.1, uptime: 1.0, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.0 }, description: 'Fire strike' },
  { id: 'fire_defense', name: 'Ember Mantle', family: 'Fire', variant: 'Defense', baseBand: 5, baseDamage: 5, mitigationMultiplier: 0.50, governingAttr: 'TOU', governingElem: 'Fire', scalars: { scope: 1.0, potency: 1.0, uptime: 1.0, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.90 }, description: '50% mitigation', duration: 2000 },
  { id: 'fire_control', name: 'Ember Haze', family: 'Fire', variant: 'Control', baseBand: 12, baseDamage: 6, governingAttr: 'DEX', governingElem: 'Fire', scalars: { scope: 1.0, potency: 1.0, uptime: 1.0, reliability: 0.98, mobility: 1.0, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.0 }, description: '1.25s Slow', ccDuration: 1.25, ccType: 'Slow' },
  { id: 'fire_special', name: 'Blazereap', family: 'Fire', variant: 'Special', baseBand: 28, baseDamage: 40, governingAttr: 'STR', governingElem: 'Fire', scalars: { scope: 1.25, potency: 1.35, uptime: 1.0, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 1.0 }, description: 'Cone (R≥0.5)', requiresResonance: 0.5 },
  { id: 'fire_safe_attack', name: 'Flicker', family: 'Fire', variant: 'Attack', baseBand: 3, baseDamage: 7, governingAttr: 'DEX', governingElem: 'Fire', scalars: { scope: 1.0, potency: 0.85, uptime: 1.0, reliability: 1.0, mobility: 1.10, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.85 }, description: 'Safe jab' },
  { id: 'fire_heavy_defense', name: 'Ember-Plate', family: 'Fire', variant: 'Defense', baseBand: 7, baseDamage: 8, mitigationMultiplier: 0.35, governingAttr: 'TOU', governingElem: 'Fire', scalars: { scope: 1.0, potency: 1.10, uptime: 1.30, reliability: 1.0, mobility: 0.85, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.80 }, description: '65% mitigation', duration: 3000 },
  { id: 'fire_agg_attack', name: 'Emberstorm', family: 'Fire', variant: 'Attack', baseBand: 8, baseDamage: 18, governingAttr: 'STR', governingElem: 'Fire', scalars: { scope: 1.15, potency: 1.30, uptime: 1.0, reliability: 1.0, mobility: 0.90, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 1.10 }, description: 'Aggressive AoE' },
  { id: 'water_attack', name: 'Rippletap', family: 'Water', variant: 'Attack', baseBand: 5, baseDamage: 9, governingAttr: 'SPR', governingElem: 'Water', scalars: { scope: 1.0, potency: 1.05, uptime: 1.15, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 1.0 }, description: 'Water strike' },
  { id: 'water_defense', name: 'Steamscreen', family: 'Water', variant: 'Defense', baseBand: 6, baseDamage: 4, mitigationMultiplier: 0.60, governingAttr: 'TOU', governingElem: 'Water', scalars: { scope: 1.0, potency: 0.95, uptime: 1.20, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.92 }, description: '60% mitigation', duration: 2000 },
  { id: 'water_control', name: 'Drift Hold', family: 'Water', variant: 'Control', baseBand: 13, baseDamage: 5, governingAttr: 'SPR', governingElem: 'Water', scalars: { scope: 1.05, potency: 0.95, uptime: 1.10, reliability: 1.0, mobility: 1.0, ccCap: 1.05, reaction: 1.20, cooldown: 1.0, risk: 1.0 }, description: '1.5s Slow', ccDuration: 1.5, ccType: 'Slow' },
  { id: 'water_safe_attack', name: 'Measure', family: 'Water', variant: 'Attack', baseBand: 3, baseDamage: 6, governingAttr: 'SPR', governingElem: 'Water', scalars: { scope: 1.0, potency: 0.80, uptime: 1.20, reliability: 1.0, mobility: 1.05, ccCap: 1.0, reaction: 1.05, cooldown: 1.0, risk: 0.85 }, description: 'Sustained poke' },
  { id: 'water_heavy_defense', name: 'Sunken Aegis', family: 'Water', variant: 'Defense', baseBand: 7, baseDamage: 6, mitigationMultiplier: 0.30, governingAttr: 'TOU', governingElem: 'Water', scalars: { scope: 1.0, potency: 0.85, uptime: 1.40, reliability: 1.0, mobility: 0.80, ccCap: 1.0, reaction: 1.20, cooldown: 1.0, risk: 0.75 }, description: '70% mitigation', duration: 3500 },
  { id: 'stone_attack', name: 'Ironkiss', family: 'Stone', variant: 'Attack', baseBand: 6, baseDamage: 12, governingAttr: 'STR', governingElem: 'Stone', scalars: { scope: 1.0, potency: 1.20, uptime: 1.0, reliability: 1.0, mobility: 0.95, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.05 }, description: 'Heavy strike' },
  { id: 'stone_defense', name: 'Ironbark Hold', family: 'Stone', variant: 'Defense', baseBand: 4, baseDamage: 3, mitigationMultiplier: 0.40, governingAttr: 'TOU', governingElem: 'Stone', scalars: { scope: 1.0, potency: 0.90, uptime: 1.25, reliability: 1.0, mobility: 0.90, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.85 }, description: '60% mitigation', duration: 2500 },
  { id: 'stone_control', name: 'Ground-Lock', family: 'Stone', variant: 'Control', baseBand: 14, baseDamage: 7, governingAttr: 'TOU', governingElem: 'Stone', scalars: { scope: 1.0, potency: 1.05, uptime: 1.0, reliability: 1.0, mobility: 0.95, ccCap: 1.10, reaction: 1.0, cooldown: 1.0, risk: 1.0 }, description: '1.75s Root', ccDuration: 1.75, ccType: 'Root' },
  { id: 'stone_safe_attack', name: 'Halfguard', family: 'Stone', variant: 'Attack', baseBand: 4, baseDamage: 9, governingAttr: 'STR', governingElem: 'Stone', scalars: { scope: 1.0, potency: 0.95, uptime: 1.0, reliability: 1.0, mobility: 0.90, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.80 }, description: 'Defensive strike' },
  { id: 'stone_agg_attack', name: 'Quakeblade', family: 'Stone', variant: 'Attack', baseBand: 9, baseDamage: 22, governingAttr: 'STR', governingElem: 'Stone', scalars: { scope: 1.10, potency: 1.40, uptime: 1.0, reliability: 1.0, mobility: 0.80, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.15 }, description: 'Heavy slam' },
  { id: 'stone_heavy_defense', name: 'Granite-Lock', family: 'Stone', variant: 'Defense', baseBand: 6, baseDamage: 5, mitigationMultiplier: 0.25, governingAttr: 'TOU', governingElem: 'Stone', scalars: { scope: 1.0, potency: 0.80, uptime: 1.50, reliability: 1.0, mobility: 0.70, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 0.70 }, description: '75% mitigation', duration: 4000 },
  { id: 'air_attack', name: 'Galespike', family: 'Air', variant: 'Attack', baseBand: 4, baseDamage: 8, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.0, potency: 1.0, uptime: 1.0, reliability: 0.98, mobility: 1.15, ccCap: 1.0, reaction: 1.05, cooldown: 1.0, risk: 0.95 }, description: 'Swift strike' },
  { id: 'air_defense', name: 'Gale Brace', family: 'Air', variant: 'Defense', baseBand: 5, baseDamage: 4, mitigationMultiplier: 0.65, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.0, potency: 0.95, uptime: 1.0, reliability: 1.0, mobility: 1.20, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 0.88 }, description: '65% mitigation', duration: 1800 },
  { id: 'air_control', name: 'Gale Gust', family: 'Air', variant: 'Control', baseBand: 11, baseDamage: 5, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.10, potency: 0.90, uptime: 1.0, reliability: 1.0, mobility: 1.15, ccCap: 0.95, reaction: 1.15, cooldown: 1.0, risk: 0.95 }, description: '1.0s Knockback', ccDuration: 1.0, ccType: 'Knockback' },
  { id: 'air_safe_attack', name: 'Breezelash', family: 'Air', variant: 'Attack', baseBand: 3, baseDamage: 6, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.0, potency: 0.85, uptime: 1.0, reliability: 1.0, mobility: 1.25, ccCap: 1.0, reaction: 1.05, cooldown: 1.0, risk: 0.80 }, description: 'Mobile poke' },
  { id: 'air_agg_attack', name: 'Stormrend', family: 'Air', variant: 'Attack', baseBand: 7, baseDamage: 15, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.20, potency: 1.25, uptime: 1.0, reliability: 0.95, mobility: 1.30, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 1.05 }, description: 'Rapid strikes' },
  { id: 'spark_attack', name: 'Sparkpop', family: 'Spark', variant: 'Attack', baseBand: 5, baseDamage: 9, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.10, potency: 1.05, uptime: 1.0, reliability: 0.97, mobility: 1.05, ccCap: 1.0, reaction: 1.20, cooldown: 1.0, risk: 1.0 }, description: 'Electric burst' },
  { id: 'spark_defense', name: 'Spark Net', family: 'Spark', variant: 'Defense', baseBand: 6, baseDamage: 5, mitigationMultiplier: 0.60, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.0, potency: 1.0, uptime: 1.0, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.90 }, description: '60% mitigation', duration: 2000 },
  { id: 'spark_control', name: 'Thunder-Clap', family: 'Spark', variant: 'Control', baseBand: 12, baseDamage: 6, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.15, potency: 1.0, uptime: 1.0, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.25, cooldown: 1.0, risk: 1.0 }, description: '1.25s Stun', ccDuration: 1.25, ccType: 'Stun' },
  { id: 'spark_safe_attack', name: 'Coilsnip', family: 'Spark', variant: 'Attack', baseBand: 3, baseDamage: 7, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.05, potency: 0.90, uptime: 1.0, reliability: 0.98, mobility: 1.10, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.85 }, description: 'Quick zap' },
  { id: 'spark_agg_attack', name: 'Arcburst', family: 'Spark', variant: 'Attack', baseBand: 8, baseDamage: 16, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.25, potency: 1.20, uptime: 1.0, reliability: 0.95, mobility: 1.05, ccCap: 1.0, reaction: 1.30, cooldown: 1.0, risk: 1.05 }, description: 'Chain lightning' },
  { id: 'spark_heavy_defense', name: 'Arc Ward', family: 'Spark', variant: 'Defense', baseBand: 8, baseDamage: 6, mitigationMultiplier: 0.45, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.0, potency: 1.05, uptime: 1.15, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.25, cooldown: 1.0, risk: 0.85 }, description: '55% mitigation', duration: 2500 },
  { id: 'verdant_attack', name: 'Verdant Strike', family: 'Verdant', variant: 'Attack', baseBand: 5, baseDamage: 8, governingAttr: 'SPR', governingElem: 'Verdant', scalars: { scope: 1.0, potency: 1.0, uptime: 1.25, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 1.0 }, description: 'Nature strike' },
  { id: 'verdant_defense', name: 'Verdant Barrier', family: 'Verdant', variant: 'Defense', baseBand: 5, baseDamage: 3, mitigationMultiplier: 0.55, governingAttr: 'SPR', governingElem: 'Verdant', scalars: { scope: 1.0, potency: 0.90, uptime: 1.30, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 0.90 }, description: '55% mitigation', duration: 2200 },
  { id: 'verdant_control', name: 'Verdant Vines', family: 'Verdant', variant: 'Control', baseBand: 13, baseDamage: 5, governingAttr: 'SPR', governingElem: 'Verdant', scalars: { scope: 1.05, potency: 0.95, uptime: 1.20, reliability: 1.0, mobility: 0.95, ccCap: 1.05, reaction: 1.15, cooldown: 1.0, risk: 1.0 }, description: '1.5s Entangle', ccDuration: 1.5, ccType: 'Entangle' },
  {
    id: 'verdant_safe_attack',
    name: 'Echo Pierce',
    family: 'Verdant',
    variant: 'Attack',
    baseBand: 3,
    baseDamage: 6,
    baseHealing: 80,
    governingAttr: 'SPR',
    governingElem: 'Verdant',
    scalars: {
      scope: 1.0,
      potency: 0.85,
      uptime: 1.35,
      reliability: 1.0,
      mobility: 1.0,
      ccCap: 1.0,
      reaction: 1.10,
      cooldown: 1.0,
      risk: 0.85
    },
    description: 'Pierce that siphons vitality'
  },
  { id: 'verdant_agg_attack', name: 'Wildspin', family: 'Verdant', variant: 'Attack', baseBand: 8, baseDamage: 14, governingAttr: 'SPR', governingElem: 'Verdant', scalars: { scope: 1.20, potency: 1.15, uptime: 1.30, reliability: 1.0, mobility: 1.05, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 1.05 }, description: 'Whirling growth' },
  { id: 'verdant_heavy_defense', name: 'Verdant Rootwall', family: 'Verdant', variant: 'Defense', baseBand: 7, baseDamage: 4, mitigationMultiplier: 0.35, governingAttr: 'SPR', governingElem: 'Verdant', scalars: { scope: 1.0, potency: 0.85, uptime: 1.50, reliability: 1.0, mobility: 0.75, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.75 }, description: '65% mitigation', duration: 3800 },
  { id: 'essence_attack', name: 'Aether Dash', family: 'Essence', variant: 'Attack', baseBand: 6, baseDamage: 10, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.0, potency: 1.15, uptime: 1.0, reliability: 1.0, mobility: 1.10, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 1.0 }, description: 'Phase strike' },
  { id: 'essence_defense', name: 'Essence Shield', family: 'Essence', variant: 'Defense', baseBand: 6, baseDamage: 4, mitigationMultiplier: 0.60, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.0, potency: 1.0, uptime: 1.15, reliability: 1.0, mobility: 1.05, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 0.92 }, description: '60% mitigation', duration: 2100 },
  { id: 'essence_control', name: 'Aether Suspend', family: 'Essence', variant: 'Control', baseBand: 15, baseDamage: 6, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.0, potency: 1.05, uptime: 1.10, reliability: 1.0, mobility: 1.05, ccCap: 1.15, reaction: 1.20, cooldown: 1.0, risk: 1.0 }, description: '2.0s Suspend', ccDuration: 2.0, ccType: 'Suspend' },
  { id: 'essence_safe_attack', name: 'Prism Touch', family: 'Essence', variant: 'Attack', baseBand: 4, baseDamage: 8, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.0, potency: 1.00, uptime: 1.0, reliability: 1.0, mobility: 1.15, ccCap: 1.0, reaction: 1.10, cooldown: 1.0, risk: 0.90 }, description: 'Phase tap' },
  { id: 'essence_agg_attack', name: 'Essence Fission', family: 'Essence', variant: 'Attack', baseBand: 10, baseDamage: 20, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.15, potency: 1.35, uptime: 1.0, reliability: 1.0, mobility: 1.10, ccCap: 1.0, reaction: 1.20, cooldown: 1.0, risk: 1.10 }, description: 'Reality tear' },
  { id: 'essence_heavy_defense', name: 'Stasis Tower', family: 'Essence', variant: 'Defense', baseBand: 9, baseDamage: 5, mitigationMultiplier: 0.40, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.0, potency: 1.10, uptime: 1.25, reliability: 1.0, mobility: 0.85, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.80 }, description: '60% mitigation', duration: 3000 },
  { id: 'water_special', name: 'Torrent Cascade', family: 'Water', variant: 'Special', baseBand: 25, baseDamage: 35, governingAttr: 'SPR', governingElem: 'Water', scalars: { scope: 1.20, potency: 1.30, uptime: 1.15, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.20, cooldown: 1.0, risk: 1.0 }, description: 'Wave burst (R≥0.5)', requiresResonance: 0.5 },
  { id: 'stone_special', name: 'Earthshatter', family: 'Stone', variant: 'Special', baseBand: 30, baseDamage: 50, governingAttr: 'STR', governingElem: 'Stone', scalars: { scope: 1.30, potency: 1.45, uptime: 1.0, reliability: 1.0, mobility: 0.85, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.10 }, description: 'Massive AoE (R≥0.5)', requiresResonance: 0.5 },
  { id: 'air_special', name: 'Cyclone', family: 'Air', variant: 'Special', baseBand: 22, baseDamage: 28, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.25, potency: 1.25, uptime: 1.0, reliability: 1.0, mobility: 1.25, ccCap: 1.0, reaction: 1.15, cooldown: 1.0, risk: 0.95 }, description: 'Mobile vortex (R≥0.5)', requiresResonance: 0.5 },
  { id: 'spark_special', name: 'Lightning Storm', family: 'Spark', variant: 'Special', baseBand: 26, baseDamage: 38, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.35, potency: 1.30, uptime: 1.0, reliability: 0.98, mobility: 1.05, ccCap: 1.0, reaction: 1.30, cooldown: 1.0, risk: 1.05 }, description: 'Chain AoE (R≥0.5)', requiresResonance: 0.5 },
  {
    id: 'verdant_special',
    name: 'Regrowth Pulse',
    family: 'Verdant',
    variant: 'Special',
    baseBand: 24,
    baseDamage: 30,
    baseHealing: 220,
    governingAttr: 'SPR',
    governingElem: 'Verdant',
    scalars: {
      scope: 1.15,
      potency: 1.20,
      uptime: 1.40,
      reliability: 1.0,
      mobility: 1.0,
      ccCap: 1.0,
      reaction: 1.20,
      cooldown: 1.0,
      risk: 1.0
    },
    description: 'Pulse of damage with restorative bloom',
    requiresResonance: 0.5
  },
  { id: 'essence_special', name: 'Void Rift', family: 'Essence', variant: 'Special', baseBand: 32, baseDamage: 45, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.20, potency: 1.40, uptime: 1.10, reliability: 1.0, mobility: 1.15, ccCap: 1.0, reaction: 1.25, cooldown: 1.0, risk: 1.05 }, description: 'Reality tear (R≥0.5)', requiresResonance: 0.5 },
  { id: 'fire_ultimate', name: 'Inferno', family: 'Fire', variant: 'Special', baseBand: 40, baseDamage: 70, governingAttr: 'STR', governingElem: 'Fire', scalars: { scope: 1.50, potency: 1.60, uptime: 1.0, reliability: 1.0, mobility: 0.90, ccCap: 1.0, reaction: 1.25, cooldown: 1.0, risk: 1.15 }, description: 'Massive fire (R≥0.7)', requiresResonance: 0.7 },
  { id: 'water_ultimate', name: 'Tidal Wave', family: 'Water', variant: 'Special', baseBand: 38, baseDamage: 60, governingAttr: 'SPR', governingElem: 'Water', scalars: { scope: 1.45, potency: 1.50, uptime: 1.20, reliability: 1.0, mobility: 1.0, ccCap: 1.0, reaction: 1.30, cooldown: 1.0, risk: 1.10 }, description: 'Tsunami (R≥0.7)', requiresResonance: 0.7 },
  { id: 'stone_ultimate', name: 'Meteor Strike', family: 'Stone', variant: 'Special', baseBand: 42, baseDamage: 80, governingAttr: 'STR', governingElem: 'Stone', scalars: { scope: 1.40, potency: 1.70, uptime: 1.0, reliability: 1.0, mobility: 0.80, ccCap: 1.0, reaction: 1.0, cooldown: 1.0, risk: 1.20 }, description: 'Devastating (R≥0.7)', requiresResonance: 0.7 },
  { id: 'air_ultimate', name: 'Hurricane', family: 'Air', variant: 'Special', baseBand: 35, baseDamage: 55, governingAttr: 'AGI', governingElem: 'Air', scalars: { scope: 1.55, potency: 1.45, uptime: 1.0, reliability: 1.0, mobility: 1.30, ccCap: 1.0, reaction: 1.20, cooldown: 1.0, risk: 1.0 }, description: 'Massive vortex (R≥0.7)', requiresResonance: 0.7 },
  { id: 'spark_ultimate', name: 'Thunderstorm', family: 'Spark', variant: 'Special', baseBand: 36, baseDamage: 65, governingAttr: 'DEX', governingElem: 'Spark', scalars: { scope: 1.60, potency: 1.55, uptime: 1.0, reliability: 1.0, mobility: 1.10, ccCap: 1.0, reaction: 1.40, cooldown: 1.0, risk: 1.10 }, description: 'Chain storm (R≥0.7)', requiresResonance: 0.7 },
  {
    id: 'verdant_ultimate',
    name: 'World Tree',
    family: 'Verdant',
    variant: 'Special',
    baseBand: 34,
    baseDamage: 50,
    baseHealing: 400,
    governingAttr: 'SPR',
    governingElem: 'Verdant',
    scalars: {
      scope: 1.35,
      potency: 1.40,
      uptime: 1.50,
      reliability: 1.0,
      mobility: 0.95,
      ccCap: 1.0,
      reaction: 1.25,
      cooldown: 1.0,
      risk: 1.05
    },
    description: 'World root that devastates and renews (R≥0.7)',
    requiresResonance: 0.7
  },
  { id: 'essence_ultimate', name: 'Reality Collapse', family: 'Essence', variant: 'Special', baseBand: 45, baseDamage: 75, governingAttr: 'INS', governingElem: 'Essence', scalars: { scope: 1.40, potency: 1.65, uptime: 1.15, reliability: 1.0, mobility: 1.20, ccCap: 1.0, reaction: 1.35, cooldown: 1.0, risk: 1.15 }, description: 'Void collapse (R≥0.7)', requiresResonance: 0.7 }
];

export const initialCharacter = {
  attributes: { STR: 40, DEX: 40, TOU: 40, AGI: 40, SPR: 40, INS: 40, CHA: 40, Impact: 40 },
  elements: { Fire: 40, Water: 40, Stone: 40, Air: 40, Spark: 40, Verdant: 40, Essence: 40 },
  weapon: 'Long Swords',
  currentER: 100,
  maxER: 100,
  hp: 1000,
  maxHp: 1000,
  activeDefense: null,
  ccEffects: []
};

export const initialEnemy = {
  hp: 500,
  maxHp: 500,
  currentER: 100,
  maxER: 100,
  attributes: { STR: 40, DEX: 40, TOU: 40, AGI: 40, SPR: 40, INS: 40, CHA: 40, Impact: 40 },
  elements: { Fire: 40, Water: 40, Stone: 40, Air: 40, Spark: 40, Verdant: 40, Essence: 40 },
  weapon: 'Staffs',
  aiEnabled: false,
  activeDefense: null,
  ccEffects: []
};

export const LANE_STYLES = {
  Attack: { active: 'bg-blue-900 border-blue-600', hover: 'hover:bg-blue-800' },
  Defense: { active: 'bg-green-900 border-green-600', hover: 'hover:bg-green-800' },
  Control: { active: 'bg-purple-900 border-purple-600', hover: 'hover:bg-purple-800' },
  Special: { active: 'bg-yellow-900 border-yellow-600', hover: 'hover:bg-yellow-800' }
};
