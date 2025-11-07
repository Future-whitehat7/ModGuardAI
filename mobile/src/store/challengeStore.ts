import { create } from 'zustand';
import { challengeService } from '@api/services';
import type { Challenge, ChallengeSubmission, ChallengeResult } from '@types/index';

interface ChallengeState {
  challenges: Challenge[];
  currentChallengeIndex: number;
  isLoading: boolean;
  error: string | null;
  lastResult: ChallengeResult | null;
  completedToday: number;

  // Actions
  loadDailyChallenge: () => Promise<void>;
  submitAnswer: (submission: ChallengeSubmission) => Promise<ChallengeResult | null>;
  nextChallenge: () => void;
  resetChallenges: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  currentChallengeIndex: 0,
  isLoading: false,
  error: null,
  lastResult: null,
  completedToday: 0,

  loadDailyChallenge: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await challengeService.getDailyChallenge();

      if (response.success && response.data) {
        set({
          challenges: response.data,
          currentChallengeIndex: 0,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to load challenges',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load challenges',
        isLoading: false,
      });
    }
  },

  submitAnswer: async (submission: ChallengeSubmission) => {
    set({ isLoading: true, error: null });

    try {
      const response = await challengeService.submitAnswer(submission);

      if (response.success && response.data) {
        set({
          lastResult: response.data,
          completedToday: get().completedToday + 1,
          isLoading: false,
        });
        return response.data;
      } else {
        set({
          error: response.error || 'Failed to submit answer',
          isLoading: false,
        });
        return null;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to submit answer',
        isLoading: false,
      });
      return null;
    }
  },

  nextChallenge: () => {
    const { challenges, currentChallengeIndex } = get();
    if (currentChallengeIndex < challenges.length - 1) {
      set({
        currentChallengeIndex: currentChallengeIndex + 1,
        lastResult: null,
      });
    }
  },

  resetChallenges: () => {
    set({
      challenges: [],
      currentChallengeIndex: 0,
      lastResult: null,
      error: null,
    });
  },
}));
