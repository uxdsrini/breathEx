
export enum PhaseType {
  Inhale = 'Inhale',
  Hold = 'Hold',
  Exhale = 'Exhale',
  Sustain = 'Sustain', // For generic timers
}

export interface BreathPhase {
  label: string;
  duration: number; // in seconds
  type: PhaseType;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  type: 'breathing' | 'timer';
  phases?: BreathPhase[]; // For breathing exercises
  defaultDuration?: number; // For timer exercises (in minutes)
  benefits: string[];
  technique: string[];
  isPremium?: boolean; // New field to lock specific presets
}

export enum AppState {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Paused = 'PAUSED',
  Completed = 'COMPLETED'
}

export interface UserStats {
  totalPoints: number; // Lifetime XP (Leaderboard)
  currentPoints: number; // Spendable Balance (Coupons) - NEW
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: any; // Firestore Timestamp
  zenScore: number; // 0-100 Health prediction
  level: number;
}

export type SubscriptionStatus = 'free' | 'active' | 'canceled' | 'past_due';
export type PlanInterval = 'month' | 'year';

export interface UserSubscription {
  status: SubscriptionStatus;
  planId?: string; // 'pro_monthly' | 'pro_yearly'
  interval?: PlanInterval;
  currentPeriodEnd?: any; // Firestore Timestamp
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  stats: UserStats;
  subscription?: UserSubscription;
}

// --- REWARDS SYSTEM TYPES ---

export interface Coupon {
  id: string;
  provider: string; // 'Amazon', 'Flipkart', etc.
  description: string;
  valueDisplay: string; // '$10'
  cost: number; // Points required
  logoColor: string; // Tailwind class for placeholder
}

export interface Redemption {
  id: string;
  userId: string;
  couponId: string;
  couponProvider: string;
  code: string;
  cost: number;
  timestamp: any; // Firestore Timestamp
}

export type UpgradeTrigger = 'camera' | 'rewards' | 'generic';
