import React, { useState } from 'react';
import type { Task, Achievement } from '../types';
import TaskItem from './TaskItem';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  achievements: Achievement[];
  today: string;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onTogglePin?: (id: number) => void;
  onViewAchievement?: (achievementId: string) => void;
  emptyMessage?: string;
  icon?: string;
  variant?: 'pinned' | 'regular';
}

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  tasks,
  achievements,
  today,
  onComplete,
  onDelete,
  onTogglePin,
  onViewAchievement,
  emptyMessage,
  icon,
  variant = 'regular'
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'pinned'); // Pinned tasks always expanded

  if (tasks.length === 0 && !emptyMessage) return null;

  const sectionColors = {
    pinned: {
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: '📌'
    },
    regular: {
      bg: 'bg-white dark:bg-gray-800',
      border: 'border-gray-100 dark:border-gray-700',
      icon: '📝'
    }
  };

  const colors = sectionColors[variant];

  return (
    <div className={`rounded-2xl border ${colors.border} shadow-sm overflow-hidden ${colors.bg}`}>
      {/* Section Header - Clickable for accordion */}
      <div
        className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => variant !== 'pinned' && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
              {icon || colors.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tasks.length} tugas</p>
            </div>
          </div>
          {variant !== 'pinned' && (
            <div className="text-gray-400 dark:text-gray-500">
              <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tasks List - Collapsible */}
      <div className={`divide-y divide-gray-100 dark:divide-gray-700 transition-all duration-300 ${
        isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        {tasks.length > 0 ? (
          tasks.map(task => {
            const achievementTitle = task.achievementId
              ? achievements.find(a => a.id === task.achievementId)?.title
              : undefined;

            return (
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <TaskItem
                  task={task}
                  today={today}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  achievementTitle={achievementTitle}
                  onViewAchievement={onViewAchievement}
                />
              </div>
            );
          })
        ) : (
          emptyMessage && (
            <div className="px-6 py-8 text-center">
              <div className="text-4xl mb-3 opacity-50">{colors.icon}</div>
              <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TaskSection;
