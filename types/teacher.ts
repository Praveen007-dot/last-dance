export interface TeacherStats {
  knowledge: number;
  patience: number;
  anger: number;
  humour: number;
  classControl: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string; // path under /public/teachers/
  rank: string;
  location: { lat: number; lng: number };
  stats: TeacherStats;
  mood: string;
  moodEmoji: string;
  moodDescription: string;
  specialAbility: string;
  specialAbilityDesc: string;
  description: string;
}

export type FlowPhase =
  | 'boot'
  | 'hero'
  | 'scanning'
  | 'map'
  | 'detecting'
  | 'card'
  | 'transitioning'
  | 'complete';
