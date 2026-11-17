export const ARCADE_CAP = 4;
export const HABIT_KEY = 'modguard-play-habits';

export interface PlayHabit {
  streaksOn: boolean;
  freezes: number;
  streak: number;
  lastCorrectDay: string;
  duelDay: string;
  arcadeDay: string;
  arcadePlayed: number;
  arcadeCorrect: number;
}

export const emptyHabit: PlayHabit = {
  streaksOn: true,
  freezes: 1,
  streak: 0,
  lastCorrectDay: '',
  duelDay: '',
  arcadeDay: '',
  arcadePlayed: 0,
  arcadeCorrect: 0,
};

function dayBefore(day: string) {
  const time = Date.parse(`${day}T00:00:00Z`);
  if (Number.isNaN(time)) return '';
  return new Date(time - 86400000).toISOString().slice(0, 10);
}

export function readHabit(value: string | null): PlayHabit {
  if (!value) return emptyHabit;
  try {
    const parsed = JSON.parse(value) as Partial<PlayHabit>;
    return {
      streaksOn: parsed.streaksOn !== false,
      freezes: typeof parsed.freezes === 'number' && parsed.freezes >= 0 ? parsed.freezes : 1,
      streak: parsed.streaksOn === false ? 0 : (typeof parsed.streak === 'number' && parsed.streak >= 0 ? parsed.streak : 0),
      lastCorrectDay: typeof parsed.lastCorrectDay === 'string' ? parsed.lastCorrectDay : '',
      duelDay: typeof parsed.duelDay === 'string' ? parsed.duelDay : '',
      arcadeDay: typeof parsed.arcadeDay === 'string' ? parsed.arcadeDay : '',
      arcadePlayed: typeof parsed.arcadePlayed === 'number' && parsed.arcadePlayed >= 0 ? parsed.arcadePlayed : 0,
      arcadeCorrect: typeof parsed.arcadeCorrect === 'number' && parsed.arcadeCorrect >= 0 ? parsed.arcadeCorrect : 0,
    };
  } catch {
    return emptyHabit;
  }
}

export function duelOpen(habit: PlayHabit, today: string) {
  return habit.duelDay !== today;
}

export function arcadeRemaining(habit: PlayHabit, today: string) {
  if (habit.arcadeDay !== today) return ARCADE_CAP;
  return Math.max(0, ARCADE_CAP - habit.arcadePlayed);
}

export function markDuel(habit: PlayHabit, today: string, correct: boolean): { habit: PlayHabit; usedFreeze: boolean } {
  const closed = { ...habit, duelDay: today };
  if (!habit.streaksOn || !correct) return { habit: closed, usedFreeze: false };
  if (habit.lastCorrectDay === today) {
    return { habit: { ...closed, streak: Math.max(habit.streak, 1) }, usedFreeze: false };
  }
  const yesterday = dayBefore(today);
  if (!habit.lastCorrectDay || habit.lastCorrectDay === yesterday) {
    return {
      habit: { ...closed, lastCorrectDay: today, streak: habit.lastCorrectDay ? habit.streak + 1 : 1 },
      usedFreeze: false,
    };
  }
  if (habit.freezes > 0 && habit.lastCorrectDay === dayBefore(yesterday)) {
    return {
      habit: { ...closed, lastCorrectDay: today, streak: habit.streak + 1, freezes: habit.freezes - 1 },
      usedFreeze: true,
    };
  }
  return { habit: { ...closed, lastCorrectDay: today, streak: 1 }, usedFreeze: false };
}

export function skipDuel(habit: PlayHabit, today: string): PlayHabit {
  return { ...habit, duelDay: today };
}

export function markArcade(habit: PlayHabit, today: string, correct: boolean): PlayHabit {
  const fresh = habit.arcadeDay !== today;
  return {
    ...habit,
    arcadeDay: today,
    arcadePlayed: (fresh ? 0 : habit.arcadePlayed) + 1,
    arcadeCorrect: (fresh ? 0 : habit.arcadeCorrect) + (correct ? 1 : 0),
  };
}

export function setStreaks(habit: PlayHabit, on: boolean): PlayHabit {
  if (on) return { ...habit, streaksOn: true };
  return { ...habit, streaksOn: false, streak: 0 };
}
