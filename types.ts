
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
}

export enum AppState {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Paused = 'PAUSED',
  Completed = 'COMPLETED'
}

export interface UserStats {
  totalPoints: number;
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: any; // Firestore Timestamp
  zenScore: number; // 0-100 Health prediction
  level: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  stats: UserStats;
}
