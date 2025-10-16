import React, { useMemo } from 'react';
import type { Task, StreakData, Achievement } from '../types';
import AchievementCard from '../components/AchievementCard';

interface ProgressScreenProps {
    tasks: Task[];
    streakData: StreakData;
    achievements: Achievement[];
    onCompleteTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    today: string;
    onGenerateTasks: (achievementId: string) => void;
    generatingTasksForId: string | null;
}

interface DisplayAchievement extends Achievement {
    unlocked: boolean;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ tasks, streakData, achievements, onCompleteTask, onDeleteTask, today, onGenerateTasks, generatingTasksForId }) => {
    const totalCompletions = useMemo(() => {
        return tasks.reduce((total, task) => {
            return total + Object.values(task.completions).reduce((sum, count) => sum + count, 0);
        }, 0);
    }, [tasks]);

    const processedAchievements = useMemo((): DisplayAchievement[] => {
        return achievements.map(ach => {
            let unlocked = false;
            // Cek kondisi pembukaan kunci untuk pencapaian default
            switch (ach.id) {
                case 'first_step':
                    unlocked = totalCompletions > 0;
                    break;
                case 'consistency':
                    unlocked = streakData.currentStreak >= 5;
                    break;
                case 'hot_streak':
                    unlocked = streakData.currentStreak >= 10;
                    break;
                case 'task_master':
                    unlocked = totalCompletions >= 50;
                    break;
                case 'creator_legend':
                    unlocked = totalCompletions >= 100;
                    break;
                default:
                    if (ach.id.startsWith('custom_')) {
                        const relatedTasks = tasks.filter(t => t.achievementId === ach.id);
                        if (relatedTasks.length > 0) {
                            // Buka jika semua tugas terkait telah diselesaikan setidaknya sekali
                            const allTasksCompletedOnce = relatedTasks.every(t => 
                                Object.values(t.completions).some(count => count > 0)
                            );
                            unlocked = allTasksCompletedOnce;
                        } else {
                            unlocked = false;
                        }
                    } else {
                         unlocked = false;
                    }
            }
            return { ...ach, unlocked };
        });
    }, [achievements, totalCompletions, streakData.currentStreak, tasks]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Progres Anda</h2>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Tugas Selesai</p>
                    <p className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 my-2">{totalCompletions}</p>
                    <p className="text-gray-500 dark:text-gray-400">Kerja bagus, lanjutkan!</p>
                </div>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pencapaian</h2>
                <div className="space-y-4">
                    {processedAchievements.map(ach => {
                        const achievementTasks = tasks.filter(task => task.achievementId === ach.id);
                        const isGenerating = generatingTasksForId === ach.id;
                        return <AchievementCard 
                            key={ach.id} 
                            achievement={ach} 
                            tasks={achievementTasks}
                            onCompleteTask={onCompleteTask}
                            onDeleteTask={onDeleteTask}
                            today={today}
                            onGenerateTasks={onGenerateTasks}
                            isGenerating={isGenerating}
                        />
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressScreen;