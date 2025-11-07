// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8000'  // Development
    : 'https://api.modguardai.com',  // Production
  TIMEOUT: 30000,
  VERSION: 'v1',
};

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  // Verification
  VERIFY: {
    UPLOAD: '/verify',
    STATUS: (jobId: string) => `/verify/${jobId}`,
    BATCH: '/batch/verify',
  },
  // Challenges
  CHALLENGES: {
    DAILY: '/challenges/daily',
    SUBMIT: '/challenges/submit',
    LEADERBOARD: '/challenges/leaderboard',
    HISTORY: '/challenges/history',
  },
  // Labs
  LABS: {
    TASKS: '/labs/tasks',
    SUBMIT: '/labs/submit',
    EARNINGS: '/labs/earnings',
    PAYOUT: '/labs/payout',
    STATS: '/labs/stats',
  },
  // Badges
  BADGES: {
    LIST: '/badges',
    ISSUE: '/badges/issue',
    REVOKE: (id: string) => `/badges/${id}`,
    ANALYTICS: '/badges/analytics',
  },
  // Education
  LESSONS: {
    LIST: '/lessons',
    DETAIL: (id: string) => `/lessons/${id}`,
    COMPLETE: (id: string) => `/lessons/${id}/complete`,
    RECOMMENDED: '/lessons/recommended',
  },
  // User
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
    ACHIEVEMENTS: '/user/achievements',
  },
};

// App Constants
export const APP_CONSTANTS = {
  FREE_SCANS_PER_MONTH: 3,
  INITIAL_ELO: 1000,
  MIN_PAYOUT_AMOUNT: 10,
  CHALLENGE_COUNT_PER_DAY: 20,
  DEFAULT_CONFIDENCE: 50,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME: 'theme',
};

// Theme Colors
export const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  border: '#334155',
  real: '#10B981',
  fake: '#EF4444',
  inconclusive: '#F59E0B',
};

// Animations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Media Types
export const MEDIA_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
  AUDIO: ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/m4a'],
};
