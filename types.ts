export interface Task {
  id: number;
  text: string;
  completions: { [date: string]: number };
  achievementId?: string; // Menambahkan tautan opsional ke sebuah pencapaian
}

export interface StreakData {
    currentStreak: number;
    lastCompletedDate: string;
}

export interface AISettings {
  provider: 'gemini';
  model: string;
  apiKey: string;
}

export interface NotificationSettings {
  enabled: boolean;
  intervalMinutes: number;
  message: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  theme: Theme;
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
