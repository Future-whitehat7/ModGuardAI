// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  eloRating: number;
  accuracy: number;
  streak: number;
  level: number;
  xp: number;
  scanCredits: number;
  isPremium: boolean;
  createdAt: string;
}

// Authentication
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
}

// Challenges
export interface Challenge {
  id: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  difficulty: number;
  isReal: boolean;
  cues?: string[];
  explanation?: string;
}

export interface ChallengeSubmission {
  challengeId: string;
  userAnswer: boolean;
  confidence: number;
  timeSpent: number;
}

export interface ChallengeResult {
  correct: boolean;
  explanation: string;
  cues: string[];
  eloChange: number;
  xpGained: number;
}

// Verification/Scan
export interface MediaUpload {
  uri: string;
  type: 'image' | 'video' | 'audio';
  fileName: string;
  fileSize: number;
}

export interface VerificationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  createdAt: string;
  completedAt?: string;
  result?: VerificationResult;
}

export interface VerificationResult {
  verdict: 'real' | 'fake' | 'inconclusive';
  confidence: number;
  cues: VisualCue[];
  explanation: string;
  metadata?: Record<string, any>;
}

export interface VisualCue {
  type: 'facial' | 'audio' | 'lighting' | 'edge' | 'metadata';
  description: string;
  confidence: number;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Labs (Crowdsourced Labeling)
export interface LabTask {
  id: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  duration?: number;
  reward: number;
  difficulty: number;
  isGoldStandard?: boolean;
}

export interface LabSubmission {
  taskId: string;
  label: boolean;
  confidence: number;
  reasoning: string;
  timeSpent: number;
}

export interface LabEarnings {
  totalEarnings: number;
  weeklyEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  labelsSubmitted: number;
  accuracyScore: number;
  averageTimePerTask: number;
}

export interface PayoutRequest {
  amount: number;
  method: 'bank' | 'debit_card';
}

// Badges (C2PA)
export interface Badge {
  id: string;
  traceId: string;
  mediaUrl: string;
  mediaType: 'video' | 'image' | 'audio';
  createdAt: string;
  verificationCount: number;
  trustScore: number;
  metadata: {
    deviceModel?: string;
    location?: string;
    timestamp: string;
  };
}

export interface BadgeAnalytics {
  totalBadges: number;
  totalVerifications: number;
  averageTrustScore: number;
  verificationsByDate: Array<{ date: string; count: number }>;
  geographicDistribution: Array<{ country: string; count: number }>;
}

// Education
export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  thumbnailUrl: string;
  contentUrl: string;
  completed: boolean;
  quizScore?: number;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  VerificationResult: { jobId: string };
  LessonDetail: { lessonId: string };
  BadgeDetail: { badgeId: string };
  Settings: undefined;
  PaymentSetup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Challenges: undefined;
  Scan: undefined;
  Labs: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Stats
export interface UserStats {
  challengesCompleted: number;
  accuracy: number;
  eloRating: number;
  streak: number;
  level: number;
  xp: number;
  totalEarnings: number;
  badgesEarned: string[];
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}
