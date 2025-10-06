import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import CombatSandbox from '../CombatSandbox.jsx';
import { initialCharacter, initialEnemy } from '../constants.js';

vi.mock('lucide-react', () => ({
  Swords: () => <span data-icon="swords" />,
  Target: () => <span data-icon="target" />,
  Activity: () => <span data-icon="activity" />,
  Settings: () => <span data-icon="settings" />
}));

describe('CombatSandbox component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('resolves an attack cast and records combat log entries', async () => {
    const user = userEvent.setup({ delay: null });

    const characterState = {
      ...initialCharacter,
      attributes: { ...initialCharacter.attributes },
      elements: { ...initialCharacter.elements }
    };

    render(
      <CombatSandbox
        initialCharacterState={characterState}
        initialEnemyState={initialEnemy}
        abilityLoadout={{ attack: 'verdant_safe_attack', defense: 'fire_defense', control: 'fire_control', special: 'fire_special' }}
      />
    );

    const attackButton = await screen.findByRole('button', { name: /Echo Pierce/i });

    await user.click(attackButton);

    expect(await screen.findByText('Casting Echo Pierce (-3.1 ER)')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(await screen.findByText('Echo Pierce heals for 133 HP')).toBeInTheDocument();
    expect(await screen.findByText('Echo Pierce hits for 11 damage')).toBeInTheDocument();
    expect(await screen.findByText('+4 ER')).toBeInTheDocument();
  });

  it('applies the healing component of Regrowth Pulse', async () => {
    const user = userEvent.setup({ delay: null });

    const characterState = {
      ...initialCharacter,
      attributes: {
        ...initialCharacter.attributes,
        SPR: 90,
        CHA: 80
      },
      elements: {
        ...initialCharacter.elements,
        Verdant: 90
      }
    };

    render(
      <CombatSandbox
        initialCharacterState={characterState}
        initialEnemyState={initialEnemy}
        abilityLoadout={{ attack: 'verdant_attack', defense: 'fire_defense', control: 'fire_control', special: 'verdant_special' }}
      />
    );

    const specialButton = await screen.findByRole('button', { name: /Regrowth Pulse/i });

    await user.click(specialButton);

    expect(await screen.findByText(/Casting Regrowth Pulse/)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(await screen.findByText('Regrowth Pulse heals for 809 HP')).toBeInTheDocument();
  });
});
