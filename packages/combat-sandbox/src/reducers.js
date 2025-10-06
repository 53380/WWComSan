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
      return { ...state, currentER: Math.min(state.maxER, state.currentER + action.amount) };
    case 'PASSIVE_REGEN':
      return { ...state, currentER: Math.min(state.maxER, state.currentER + 1) };
    case 'TAKE_DAMAGE': {
      const mitigation = state.activeDefense ? state.activeDefense.mitigationMultiplier : 1.0;
      const touArmor = 1 - (state.attributes.TOU / 100) * 0.20;
      const didDodge = !action.skipDodge && Boolean(action.didDodge);

      if (didDodge) {
        const erGain = action.dodgeErGain ?? 4;
        const nextEr = Math.min(state.maxER, state.currentER + erGain);
        return {
          ...state,
          currentER: nextEr,
          ...(action.dodgeTimestamp != null ? { lastDodge: action.dodgeTimestamp } : {})
        };
      }

      const finalDamage = Math.round(action.amount * mitigation * touArmor);
      const erGain = action.erOnHit ?? 1;
      return {
        ...state,
        hp: Math.max(0, state.hp - finalDamage),
        currentER: Math.min(state.maxER, state.currentER + erGain)
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
      const ccEffect = action.ccEffect ?? {
        type: action.ccType,
        duration: Math.min(action.duration ?? 0, 2.0),
        applied: action.applied ?? 0,
        expiresAt:
          action.expiresAt ?? (action.applied ?? 0) + Math.min(action.duration ?? 0, 2.0) * 1000
      };

      if (!ccEffect) {
        return state;
      }

      return {
        ...state,
        ccEffects: [...state.ccEffects, ccEffect]
      };
    }
    case 'UPDATE_CC':
      if (typeof action.currentTime !== 'number') {
        return state;
      }

      return {
        ...state,
        ccEffects: state.ccEffects.filter((cc) => {
          const expiresAt = cc.expiresAt ?? (cc.applied ?? 0) + (cc.duration ?? 0) * 1000;
          return action.currentTime < expiresAt;
        })
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
    case 'HEAL':
      return { ...state, hp: Math.min(state.maxHp, state.hp + action.amount) };
    case 'TOGGLE_AI':
      return { ...state, aiEnabled: !state.aiEnabled };
    case 'SET_DEFENSE':
      return { ...state, activeDefense: action.defense };
    case 'CLEAR_DEFENSE':
      return { ...state, activeDefense: null };
    case 'ADD_CC': {
      const ccEffect = action.ccEffect ?? {
        type: action.ccType,
        duration: Math.min(action.duration ?? 0, 2.0),
        applied: action.applied ?? 0,
        expiresAt:
          action.expiresAt ?? (action.applied ?? 0) + Math.min(action.duration ?? 0, 2.0) * 1000
      };

      if (!ccEffect) {
        return state;
      }

      return {
        ...state,
        ccEffects: [...state.ccEffects, ccEffect]
      };
    }
    case 'UPDATE_CC':
      if (typeof action.currentTime !== 'number') {
        return state;
      }

      return {
        ...state,
        ccEffects: state.ccEffects.filter((cc) => {
          const expiresAt = cc.expiresAt ?? (cc.applied ?? 0) + (cc.duration ?? 0) * 1000;
          return action.currentTime < expiresAt;
        })
      };
    default:
      return state;
  }
}
