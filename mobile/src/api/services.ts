import apiClient from './client';
import { ENDPOINTS } from '@config/constants';
import type {
  LoginCredentials,
  SignupCredentials,
  User,
  Challenge,
  ChallengeSubmission,
  ChallengeResult,
  VerificationJob,
  LabTask,
  LabSubmission,
  LabEarnings,
  PayoutRequest,
  Badge,
  BadgeAnalytics,
  Lesson,
  UserStats,
  Achievement,
  PaginatedResponse,
} from '@types/index';

// Authentication Services
export const authService = {
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<{ user: User; token: string; refreshToken: string }>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  },

  signup: async (credentials: SignupCredentials) => {
    return apiClient.post<{ user: User; token: string; refreshToken: string }>(
      ENDPOINTS.AUTH.REGISTER,
      credentials
    );
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post<{ token: string }>(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },
};

// Verification Services
export const verificationService = {
  uploadMedia: async (
    file: { uri: string; name: string; type: string },
    onProgress?: (progress: number) => void
  ) => {
    return apiClient.uploadFile<VerificationJob>(ENDPOINTS.VERIFY.UPLOAD, file, onProgress);
  },

  getVerificationStatus: async (jobId: string) => {
    return apiClient.get<VerificationJob>(ENDPOINTS.VERIFY.STATUS(jobId));
  },

  batchVerify: async (files: Array<{ uri: string; name: string; type: string }>) => {
    return apiClient.post<VerificationJob[]>(ENDPOINTS.VERIFY.BATCH, { files });
  },
};

// Challenge Services
export const challengeService = {
  getDailyChallenge: async () => {
    return apiClient.get<Challenge[]>(ENDPOINTS.CHALLENGES.DAILY);
  },

  submitAnswer: async (submission: ChallengeSubmission) => {
    return apiClient.post<ChallengeResult>(ENDPOINTS.CHALLENGES.SUBMIT, submission);
  },

  getLeaderboard: async (limit: number = 100) => {
    return apiClient.get<Array<{ user: User; rank: number; eloRating: number }>>(
      `${ENDPOINTS.CHALLENGES.LEADERBOARD}?limit=${limit}`
    );
  },

  getChallengeHistory: async (page: number = 1, pageSize: number = 20) => {
    return apiClient.get<
      PaginatedResponse<{ challenge: Challenge; result: ChallengeResult; completedAt: string }>
    >(`${ENDPOINTS.CHALLENGES.HISTORY}?page=${page}&pageSize=${pageSize}`);
  },
};

// Labs Services
export const labsService = {
  getAvailableTasks: async (limit: number = 20) => {
    return apiClient.get<LabTask[]>(`${ENDPOINTS.LABS.TASKS}?limit=${limit}`);
  },

  submitLabel: async (submission: LabSubmission) => {
    return apiClient.post<{ reward: number; accuracyImpact: number }>(
      ENDPOINTS.LABS.SUBMIT,
      submission
    );
  },

  getEarnings: async () => {
    return apiClient.get<LabEarnings>(ENDPOINTS.LABS.EARNINGS);
  },

  requestPayout: async (request: PayoutRequest) => {
    return apiClient.post<{ payoutId: string; estimatedArrival: string }>(
      ENDPOINTS.LABS.PAYOUT,
      request
    );
  },

  getStats: async () => {
    return apiClient.get<{
      labelsSubmitted: number;
      accuracyScore: number;
      averageTimePerTask: number;
      skillRating: number;
    }>(ENDPOINTS.LABS.STATS);
  },
};

// Badge Services
export const badgeService = {
  listBadges: async () => {
    return apiClient.get<Badge[]>(ENDPOINTS.BADGES.LIST);
  },

  issueBadge: async (mediaFile: { uri: string; name: string; type: string }) => {
    return apiClient.uploadFile<Badge>(ENDPOINTS.BADGES.ISSUE, mediaFile);
  },

  revokeBadge: async (badgeId: string) => {
    return apiClient.delete(ENDPOINTS.BADGES.REVOKE(badgeId));
  },

  getAnalytics: async () => {
    return apiClient.get<BadgeAnalytics>(ENDPOINTS.BADGES.ANALYTICS);
  },
};

// Education Services
export const educationService = {
  getLessons: async (category?: string, difficulty?: string) => {
    let url = ENDPOINTS.LESSONS.LIST;
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (params.toString()) url += `?${params.toString()}`;

    return apiClient.get<Lesson[]>(url);
  },

  getLessonDetail: async (lessonId: string) => {
    return apiClient.get<Lesson>(ENDPOINTS.LESSONS.DETAIL(lessonId));
  },

  markLessonComplete: async (lessonId: string, quizScore?: number) => {
    return apiClient.post<{ xpGained: number }>(ENDPOINTS.LESSONS.COMPLETE(lessonId), {
      quizScore,
    });
  },

  getRecommendedLessons: async () => {
    return apiClient.get<Lesson[]>(ENDPOINTS.LESSONS.RECOMMENDED);
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    return apiClient.get<User>(ENDPOINTS.USER.PROFILE);
  },

  updateProfile: async (updates: Partial<User>) => {
    return apiClient.put<User>(ENDPOINTS.USER.PROFILE, updates);
  },

  getStats: async () => {
    return apiClient.get<UserStats>(ENDPOINTS.USER.STATS);
  },

  getAchievements: async () => {
    return apiClient.get<Achievement[]>(ENDPOINTS.USER.ACHIEVEMENTS);
  },
};
