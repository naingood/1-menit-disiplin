import React from 'react';
import type { Task, Achievement } from '../types';
import Summary from '../components/Summary';
import AddTaskForm from '../components/AddTaskForm';
import TaskItem from '../components/TaskItem';
import StreakTracker from '../components/StreakTracker';

interface HomeScreenProps {
    tasks: Task[];
    achievements: Achievement[];
    today: string;
    streak: number;
    onAddTask: (text: string) => void;
    onCompleteTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    onViewAchievement: (achievementId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ tasks, achievements, today, streak, onAddTask, onCompleteTask, onDeleteTask, onViewAchievement }) => {
    
    return (
        <>
            <Summary tasks={tasks} today={today} />
            {streak > 0 && <StreakTracker streak={streak} />}
            <AddTaskForm onAddTask={onAddTask} />
            <div className="mt-8 space-y-4">
                {tasks.length > 0 ? (
                    tasks.map(task => {
                        const achievementTitle = task.achievementId 
                            ? achievements.find(a => a.id === task.achievementId)?.title
                            : undefined;

                        return (
                            <TaskItem
                                key={task.id}
                                task={task}
                                today={today}
                                onComplete={onCompleteTask}
                                onDelete={onDeleteTask}
                                achievementTitle={achievementTitle}
                                onViewAchievement={onViewAchievement}
                            />
                        );
                    })
                ) : (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-500 dark:text-gray-400">Belum ada tugas. Tambahkan satu untuk memulai!</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomeScreen;