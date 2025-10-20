import React from 'react';
import type { Task, Achievement } from '../types';

interface DashboardHeroProps {
  tasks: Task[];
  achievements: Achievement[];
  today: string;
  streak: number;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ tasks, achievements, today, streak }) => {
  const totalCompletionsToday = tasks.reduce((total, task) => {
    return total + (task.completions[today] || 0);
  }, 0);

  const pinnedTasks = tasks.filter(task => task.pinned).length;
  const unlockedAchievements = achievements.length;

  // Calculate weekly average
  const getWeeklyAverage = () => {
    const today = new Date();
    let totalWeekly = 0;
    let daysCount = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayTotal = tasks.reduce((total, task) => {
        return total + (task.completions[dateString] || 0);
      }, 0);

      totalWeekly += dayTotal;
      daysCount++;
    }

    return Math.round((totalWeekly / daysCount) * 10) / 10;
  };

  const weeklyAverage = getWeeklyAverage();

  const getMotivationalMessage = () => {
    if (totalCompletionsToday === 0) {
      return {
        message: "Ayo mulai hari produktifmu!",
        subMessage: "Setiap langkah kecil membawa perubahan besar",
        emoji: "🌅"
      };
    } else if (totalCompletionsToday < 3) {
      return {
        message: "Kerja bagus! Terus lanjutkan!",
        subMessage: "Momentum sedang terbentuk",
        emoji: "💪"
      };
    } else if (totalCompletionsToday < 10) {
      return {
        message: "Luar biasa! Kamu sedang on fire!",
        subMessage: "Produktivitas level tinggi tercapai",
        emoji: "🔥"
      };
    } else {
      return {
        message: "Champion hari ini! 🏆",
        subMessage: "Kamu adalah inspirasi",
        emoji: "👑"
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <div className="mb-8">
      {/* Main Hero Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">{motivation.emoji}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {motivation.message}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{motivation.subMessage}</p>
            </div>
          </div>
          <div className="text-4xl">👑</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50 dark:border-gray-600/50">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCompletionsToday}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Hari Ini</div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50 dark:border-gray-600/50">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Runtutan</div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50 dark:border-gray-600/50">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pinnedTasks}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Di-Pin</div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50 dark:border-gray-600/50">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{unlockedAchievements}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pencapaian</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-md border border-green-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📊</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Rata-rata Mingguan</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{weeklyAverage} tugas/hari</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">Target</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">5+ tugas/hari</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
