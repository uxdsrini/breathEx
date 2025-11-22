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