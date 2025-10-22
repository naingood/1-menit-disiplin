export interface Task {
  id: number;
  text: string;
  completions: { [date: string]: number };
  achievementId?: string; // Menambahkan tautan opsional ke sebuah pencapaian
  pinned?: boolean; // Menandai apakah task di-pin
  pinnedOrder?: number; // Urutan pin (1-3)
  createdAt: string; // Tanggal pembuatan tugas
}

export interface StreakData {
    currentStreak: number;
    lastCompletedDate: string;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic';
  model: string;
  apiKey: string;
}

export interface NotificationSettings {
  enabled: boolean;
  intervalMinutes: number;
  message: string;
}

export type Theme = 'light';

export interface ThemeSettings {
  theme: Theme;
}

export interface CelebrationSettings {
  target: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AchievementIdea {
  title: string;
  description: string;
}

export interface Affirmation {
  id: number;
  text: string;
  date: string;
}
