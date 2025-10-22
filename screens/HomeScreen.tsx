import React, { useState, useEffect } from 'react';
import type { Task, Achievement, Affirmation } from '../types';
import DashboardHero from '../components/DashboardHero';
import EmptyState from '../components/EmptyState';
import TaskSection from '../components/TaskSection';
import AddTaskForm from '../components/AddTaskForm';

interface HomeScreenProps {
    tasks: Task[];
    achievements: Achievement[];
    affirmations: Affirmation[];
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
    onDeleteAffirmation?: (id: number) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
    tasks,
    achievements,
    affirmations,
    today,
    streak,
    onAddTask,
    onCompleteTask,
    onDeleteTask,
    onViewAchievement,
    onTogglePinTask,
    onShareTasks,
    onStartTimer,
    onViewProgress,
    onDeleteAffirmation
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const nextAffirmation = () => {
        setCurrentAffirmationIndex((prev) => (prev + 1) % affirmations.length);
    };

    const prevAffirmation = () => {
        setCurrentAffirmationIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
    };

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

    // Show popup when tasks become empty
    useEffect(() => {
        if (tasks.length === 0 && !showAddForm) {
            setShowPopup(true);
        } else {
            // Close popup immediately when tasks are added
            setShowPopup(false);
        }
    }, [tasks.length, showAddForm]);

    return (
        <>
            {/* Popup Notification */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mx-4 max-w-md w-full shadow-xl">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                Masukkan Tugas Anda!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Waktunya untuk menit produktif Anda
                            </p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ketik tugas baru Anda..."
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        onAddTask(e.currentTarget.value.trim());
                                        setShowPopup(false);
                                        e.currentTarget.value = '';
                                    }
                                }}
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Nanti Saja
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Ketik tugas baru Anda..."]') as HTMLInputElement;
                                        if (input && input.value.trim()) {
                                            onAddTask(input.value.trim());
                                            setShowPopup(false);
                                            input.value = '';
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Tambah Tugas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tasks.length === 0 ? (
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
            ) : (
                <>
                    <DashboardHero
                        tasks={tasks}
                        achievements={achievements}
                        today={today}
                        streak={streak}
                        onStartTimer={onStartTimer}
                    />

                    {/* Affirmations Section - moved below DashboardHero */}
                    {affirmations.length > 0 && (
                        <div className="mb-8">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <div className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>💭</span>
                                        Kata Hari Ini
                                    </div>
                                    {onDeleteAffirmation && (
                                        <button
                                            onClick={() => onDeleteAffirmation(affirmations[currentAffirmationIndex]?.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="Hapus kata hari ini"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-purple-900/20 p-6 rounded-lg border-l-4 border-orange-400 relative group min-h-[120px] flex items-center justify-center">
                                        <p className="text-gray-800 dark:text-gray-200 italic text-center text-lg">
                                            "{affirmations[currentAffirmationIndex]?.text}"
                                        </p>

                                    </div>
                                    {affirmations.length > 1 && (
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={prevAffirmation}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition-colors"
                                                disabled={currentAffirmationIndex === 0}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {currentAffirmationIndex + 1} / {affirmations.length}
                                            </div>
                                            <button
                                                onClick={nextAffirmation}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full transition-colors"
                                                disabled={currentAffirmationIndex === affirmations.length - 1}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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
            )}
        </>
    );
};

export default HomeScreen;
