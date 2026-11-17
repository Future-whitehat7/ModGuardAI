export interface Progress {
  tasks: string[];
  streak: number;
  lastDay: string;
  displayName: string;
}

export const emptyProgress: Progress = { tasks: [], streak: 0, lastDay: '', displayName: '' };
export const PROGRESS_KEY = 'modguard-community-progress';

function dayBefore(day: string) {
  const time = Date.parse(`${day}T00:00:00Z`);
  if (Number.isNaN(time)) return '';
  return new Date(time - 86400000).toISOString().slice(0, 10);
}

export function recordTask(current: Progress, taskId: string, today: string): Progress {
  const tasks = current.tasks.includes(taskId) ? current.tasks : [...current.tasks, taskId];
  if (current.lastDay === today) {
    return { ...current, tasks, streak: Math.max(current.streak, 1), lastDay: today };
  }
  const streak = current.lastDay === dayBefore(today) ? current.streak + 1 : 1;
  return { ...current, tasks, streak, lastDay: today };
}

export function readProgress(value: string | null): Progress {
  if (!value) return emptyProgress;
  try {
    const parsed = JSON.parse(value) as Partial<Progress>;
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.filter((item) => typeof item === 'string' && item.trim()) : [];
    return {
      tasks,
      streak: typeof parsed.streak === 'number' && parsed.streak >= 0 ? parsed.streak : 0,
      lastDay: typeof parsed.lastDay === 'string' ? parsed.lastDay : '',
      displayName: typeof parsed.displayName === 'string' ? parsed.displayName.slice(0, 40) : '',
    };
  } catch {
    return emptyProgress;
  }
}
