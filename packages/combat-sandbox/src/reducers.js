export function characterReducer(state, action) {
  switch (action.type) {
    case 'SET_ATTRIBUTE':
      return { ...state, attributes: { ...state.attributes, [action.attr]: action.value } };
    case 'SET_ELEMENT':
      return { ...state, elements: { ...state.elements, [action.elem]: action.value } };
    case 'SET_WEAPON':
      return { ...state, weapon: action.weapon };
    case 'SPEND_ER':
      return { ...state, currentER: Math.max(0, state.currentER - action.amount) };
    case 'GAIN_ER':
      return { ...state, currentER: Math.min(100, state.currentER + action.amount) };
    case 'PASSIVE_REGEN':
      return { ...state, currentER: Math.min(state.maxER, state.currentER + 1) };
    case 'TAKE_DAMAGE': {
      const mitigation = state.activeDefense ? state.activeDefense.mitigationMultiplier : 1.0;
      const touArmor = 1 - (state.attributes.TOU / 100) * 0.20;

      if (!action.skipDodge) {
        const agiDodgeChance = (state.attributes.AGI / 100) * 0.15;
        if (Math.random() < agiDodgeChance) {
          return { ...state, currentER: Math.min(100, state.currentER + 4), lastDodge: Date.now() };
        }
      }

      const finalDamage = Math.round(action.amount * mitigation * touArmor);
      return {
        ...state,
        hp: Math.max(0, state.hp - finalDamage),
        currentER: Math.min(100, state.currentER + 1)
      };
    }
    case 'HEAL':
      return { ...state, hp: Math.min(state.maxHp, state.hp + action.amount) };
    case 'RESET_HP':
      return { ...state, hp: state.maxHp, activeDefense: null, ccEffects: [] };
    case 'SET_DEFENSE':
      return { ...state, activeDefense: action.defense };
    case 'CLEAR_DEFENSE':
      return { ...state, activeDefense: null };
    case 'ADD_CC': {
      const cappedDuration = Math.min(action.duration, 2.0);
      return {
        ...state,
        ccEffects: [
          ...state.ccEffects,
          {
            type: action.ccType,
            duration: cappedDuration,
            applied: Date.now()
          }
        ]
      };
    }
    case 'UPDATE_CC':
      return {
        ...state,
        ccEffects: state.ccEffects.filter((cc) => (Date.now() - cc.applied) / 1000 < cc.duration)
      };
    default:
      return state;
  }
}

export function enemyReducer(state, action) {
  switch (action.type) {
    case 'TAKE_DAMAGE': {
      const mitigation = state.activeDefense ? state.activeDefense.mitigationMultiplier : 1.0;
      return { ...state, hp: Math.max(0, state.hp - Math.round(action.amount * mitigation)) };
    }
    case 'RESET':
      return { ...state, hp: state.maxHp, currentER: state.maxER, activeDefense: null, ccEffects: [] };
    case 'SPEND_ER':
      return { ...state, currentER: Math.max(0, state.currentER - action.amount) };
    case 'GAIN_ER':
      return { ...state, currentER: Math.min(state.maxER, state.currentER + action.amount) };
    case 'PASSIVE_REGEN':
      return { ...state, currentER: Math.min(state.maxER, state.currentER + 1) };
    case 'TOGGLE_AI':
      return { ...state, aiEnabled: !state.aiEnabled };
    case 'SET_DEFENSE':
      return { ...state, activeDefense: action.defense };
    case 'CLEAR_DEFENSE':
      return { ...state, activeDefense: null };
    case 'ADD_CC': {
      const cappedDuration = Math.min(action.duration, 2.0);
      return {
        ...state,
        ccEffects: [
          ...state.ccEffects,
          {
            type: action.ccType,
            duration: cappedDuration,
            applied: Date.now()
          }
        ]
      };
    }
    case 'UPDATE_CC':
      return {
        ...state,
        ccEffects: state.ccEffects.filter((cc) => (Date.now() - cc.applied) / 1000 < cc.duration)
      };
    default:
      return state;
  }
}
