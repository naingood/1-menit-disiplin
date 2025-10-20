import React, { useState } from 'react';
import type { Task, Achievement } from '../types';
import DashboardHero from '../components/DashboardHero';
import EmptyState from '../components/EmptyState';
import TaskSection from '../components/TaskSection';
import AddTaskForm from '../components/AddTaskForm';

interface HomeScreenProps {
    tasks: Task[];
    achievements: Achievement[];
    today: string;
    streak: number;
    onAddTask: (text: string) => void;
    onCompleteTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
    onViewAchievement: (achievementId: string) => void;
    onTogglePinTask: (id: number) => void;
    onShareTasks?: () => void;
    onStartTimer?: () => void;
    onViewProgress?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
    tasks,
    achievements,
    today,
    streak,
    onAddTask,
    onCompleteTask,
    onDeleteTask,
    onViewAchievement,
    onTogglePinTask,
    onShareTasks,
    onStartTimer,
    onViewProgress
}) => {
    const [showAddForm, setShowAddForm] = useState(false);

    const pinnedTasks = tasks.filter(task => task.pinned);
    const regularTasks = tasks.filter(task => !task.pinned);

    const handleAddTaskClick = () => {
        setShowAddForm(true);
        // Scroll to form after a brief delay to allow state update
        setTimeout(() => {
            document.getElementById('add-task-form')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleTaskAdded = (text: string) => {
        onAddTask(text);
        setShowAddForm(false);
    };

    if (tasks.length === 0) {
        return (
            <>
                <DashboardHero
                    tasks={tasks}
                    achievements={achievements}
                    today={today}
                    streak={streak}
                />
                <EmptyState
                    onAddTask={handleAddTaskClick}
                    onStartTimer={onStartTimer}
                />

            </>
        );
    }

    return (
        <>
            <DashboardHero
                tasks={tasks}
                achievements={achievements}
                today={today}
                streak={streak}
                onStartTimer={onStartTimer}
            />

            {/* Add Task Form - conditionally shown */}
            {(showAddForm || tasks.length > 0) && (
                <div id="add-task-form" className="mb-8">
                    <AddTaskForm
                        onAddTask={handleTaskAdded}
                        tasks={tasks}
                        onShareTasks={onShareTasks}
                    />
                </div>
            )}

            {/* Task Sections */}
            <div className="space-y-6">
                {/* Pinned Tasks Section */}
                {pinnedTasks.length > 0 && (
                    <TaskSection
                        title="Tugas Prioritas"
                        tasks={pinnedTasks}
                        achievements={achievements}
                        today={today}
                        onComplete={onCompleteTask}
                        onDelete={onDeleteTask}
                        onTogglePin={onTogglePinTask}
                        onViewAchievement={onViewAchievement}
                        icon="📌"
                        variant="pinned"
                    />
                )}

                {/* Regular Tasks Section */}
                <TaskSection
                    title="Tugas Konsisten"
                    tasks={regularTasks}
                    achievements={achievements}
                    today={today}
                    onComplete={onCompleteTask}
                    onDelete={onDeleteTask}
                    onTogglePin={onTogglePinTask}
                    onViewAchievement={onViewAchievement}
                    emptyMessage="Belum ada tugas konsisten. Tambahkan tugas pertama Anda!"
                    icon="📝"
                    variant="regular"
                />
            </div>


        </>
    );
};

export default HomeScreen;
