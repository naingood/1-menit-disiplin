import React from 'react';
import type { Task, Achievement } from '../types';
import TaskItem from './TaskItem';

export interface DisplayAchievement extends Achievement {
    unlocked: boolean;
}

interface AchievementCardProps {
    achievement: DisplayAchievement;
    tasks: Task[];
    onCompleteTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    onTogglePinTask: (id: number) => void;
    today: string;
    onGenerateTasks: (achievementId: string) => void;
    isGenerating: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, tasks, onCompleteTask, onDeleteTask, onTogglePinTask, today, onGenerateTasks, isGenerating }) => {
    const showGenerateButton = achievement.id.startsWith('custom_') && tasks.length === 0 && !achievement.unlocked;
    
    return (
        <div className={`p-4 rounded-lg transition-all ${achievement.unlocked ? 'bg-green-100 dark:bg-green-900/60' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
            <div className="flex items-center gap-4">
                <span className="text-4xl">{achievement.unlocked ? achievement.icon : '🔒'}</span>
                <div>
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-green-800 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}`}>{achievement.title}</h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{achievement.description}</p>
                </div>
            </div>

            {showGenerateButton && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <button
                        onClick={() => onGenerateTasks(achievement.id)}
                        disabled={isGenerating}
                        className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isGenerating ? 'Membuat Tugas...' : 'Buat Tugas'}
                    </button>
                </div>
            )}

            {tasks.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Tugas Terkait:</h4>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            today={today}
                            onComplete={onCompleteTask}
                            onDelete={onDeleteTask}
                            onTogglePin={onTogglePinTask}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AchievementCard;