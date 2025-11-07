import { create } from 'zustand';
import { labsService } from '@api/services';
import type { LabTask, LabSubmission, LabEarnings } from '@types/index';

interface LabsState {
  tasks: LabTask[];
  currentTask: LabTask | null;
  earnings: LabEarnings | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  selectTask: (task: LabTask) => void;
  submitLabel: (submission: LabSubmission) => Promise<boolean>;
  loadEarnings: () => Promise<void>;
  requestPayout: (amount: number, method: 'bank' | 'debit_card') => Promise<boolean>;
}

export const useLabsStore = create<LabsState>((set, get) => ({
  tasks: [],
  currentTask: null,
  earnings: null,
  isLoading: false,
  error: null,
  isSubmitting: false,

  loadTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await labsService.getAvailableTasks(20);

      if (response.success && response.data) {
        set({
          tasks: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to load tasks',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load tasks',
        isLoading: false,
      });
    }
  },

  selectTask: (task: LabTask) => {
    set({ currentTask: task });
  },

  submitLabel: async (submission: LabSubmission) => {
    set({ isSubmitting: true, error: null });

    try {
      const response = await labsService.submitLabel(submission);

      if (response.success) {
        // Remove task from list
        const tasks = get().tasks.filter((t) => t.id !== submission.taskId);
        set({
          tasks,
          currentTask: null,
          isSubmitting: false,
        });

        // Refresh earnings
        get().loadEarnings();

        return true;
      } else {
        set({
          error: response.error || 'Failed to submit label',
          isSubmitting: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to submit label',
        isSubmitting: false,
      });
      return false;
    }
  },

  loadEarnings: async () => {
    try {
      const response = await labsService.getEarnings();

      if (response.success && response.data) {
        set({ earnings: response.data });
      }
    } catch (error: any) {
      console.error('Failed to load earnings:', error);
    }
  },

  requestPayout: async (amount: number, method: 'bank' | 'debit_card') => {
    set({ isLoading: true, error: null });

    try {
      const response = await labsService.requestPayout({ amount, method });

      if (response.success) {
        // Refresh earnings after payout
        await get().loadEarnings();
        set({ isLoading: false });
        return true;
      } else {
        set({
          error: response.error || 'Payout request failed',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Payout request failed',
        isLoading: false,
      });
      return false;
    }
  },
}));
