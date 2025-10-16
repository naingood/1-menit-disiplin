import React from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  today: string;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  achievementTitle?: string;
  onViewAchievement?: (achievementId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, today, onComplete, onDelete, achievementTitle, onViewAchievement }) => {
  const completionsToday = task.completions[today] || 0;

  const handleViewClick = () => {
    if (onViewAchievement && task.achievementId) {
        onViewAchievement(task.achievementId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between gap-4 transition-all hover:shadow-lg">
      <div className="flex-grow">
        <p className="text-lg text-gray-800 dark:text-gray-100">{task.text}</p>
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
            Selesai hari ini: {completionsToday}
            </p>
            {achievementTitle && (
                <button
                    onClick={handleViewClick}
                    className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    aria-label={`Lihat pencapaian: ${achievementTitle}`}
                >
                    <span>🏆</span>
                    <span>Bagian dari: {achievementTitle}</span>
                </button>
            )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
            onClick={() => onDelete(task.id)}
            aria-label={`Hapus tugas ${task.text}`}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
        <button
          onClick={() => onComplete(task.id)}
          aria-label={`Selesaikan tugas ${task.text}`}
          className="w-12 h-12 flex items-center justify-center text-2xl bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-700/50 transform hover:scale-110 transition"
        >
          ✅
        </button>
      </div>
    </div>
  );
};

export default TaskItem;