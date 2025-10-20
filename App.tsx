import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { Task, StreakData, Achievement, AchievementIdea, AISettings, NotificationSettings, Theme, ThemeSettings, CelebrationSettings } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import IdeasScreen from './screens/IdeasScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import CelebrationAnimation from './components/CelebrationAnimation';
import { generateTasksForAchievement } from './services/aiService';
import {
    scheduleMiddayReminder,
    cancelMiddayReminder,
    showMotivationalNotification,
    scheduleIntervalReminder,
    cancelIntervalReminder,
    showAppreciationNotification
} from './utils/notifications';

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const defaultTasks: Task[] = [
    { id: 1, text: "Balas 1 komentar", completions: {}, pinned: false },
    { id: 2, text: "Rekam 1 klip video pendek", completions: {}, pinned: false },
    { id: 3, text: "Cek ide konten di catatan", completions: {}, pinned: false }
];

const defaultAchievements: Achievement[] = [
    { id: 'first_step', icon: '🎉', title: 'Tugas Pertama Selesai!', description: 'Anda menyelesaikan tugas pertama Anda.' },
    { id: 'consistency', icon: '🔥', title: 'Runtutan 5 Hari', description: 'Jaga runtutan selama 5 hari berturut-turut.' },
    { id: 'hot_streak', icon: '🚀', title: 'Runtutan Keren!', description: 'Anda mempertahankan runtutan 10 hari.' },
    { id: 'task_master', icon: '🎯', title: 'Jagoan Tugas', description: 'Selesaikan total 50 tugas.' },
    { id: 'creator_legend', icon: '🏆', title: 'Legenda Kreator', description: 'Selesaikan total 100 tugas.' },
];

export type Screen = 'home' | 'progress' | 'ideas' | 'profile' | 'settings';

const App: React.FC = () => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', defaultTasks);
    const [achievements, setAchievements] = useLocalStorage<Achievement[]>('achievements', defaultAchievements);
    const [streakData, setStreakData] = useLocalStorage<StreakData>('streak-data', { currentStreak: 0, lastCompletedDate: '' });
    const [settings] = useLocalStorage<AISettings>('ai-settings', { provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '' });
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [isGeneratingTasks, setIsGeneratingTasks] = useState<string | null>(null); // Lacak ID pencapaian
    const [notificationsEnabled] = useLocalStorage('notificationsEnabled', false);
    const [notificationSettings] = useLocalStorage<NotificationSettings>('notification-settings', {
        enabled: false,
        intervalMinutes: 1,
        message: 'Apakah yang akan kamu kerjakan 1 menit ke depan?',
    });
    const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('theme-settings', {
        theme: 'light',
    });
    const [celebrationSettings, setCelebrationSettings] = useLocalStorage<CelebrationSettings>('celebration-settings', {
        target: 3,
    });
    const [showCelebration, setShowCelebration] = useState(false);
    const today = getTodayDateString();

    useEffect(() => {
        const scheduleReminder = async () => {
            if (notificationsEnabled) {
                const tasksCompletedToday = tasks.some(task => (task.completions[today] || 0) > 0);
                if (!tasksCompletedToday) {
                    await scheduleMiddayReminder(today);
                }
            }
        };
        scheduleReminder();
    }, [notificationsEnabled, today, tasks]);

    useEffect(() => {
        const scheduleInterval = async () => {
            if (notificationSettings.enabled && Notification.permission === 'granted') {
                await scheduleIntervalReminder(notificationSettings.intervalMinutes, notificationSettings.message);
            } else {
                await cancelIntervalReminder();
            }
        };
        scheduleInterval();
    }, [notificationSettings]);

    useEffect(() => {
        const applyTheme = () => {
            const root = document.documentElement;
            // Always apply light theme
            root.classList.remove('dark');
        };

        applyTheme();
    }, []);

    const handleAddTask = useCallback((text: string) => {
        const newTask: Task = {
            id: Date.now(),
            text,
            completions: {},
            pinned: false,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    }, [setTasks]);

    const handleAddAchievement = useCallback(async (idea: AchievementIdea) => {
        const icons = ['💡', '🌟', '✨', '🏅', '🎖️', '🥇'];
        const newAchievement: Achievement = {
            id: `custom_${Date.now()}`,
            icon: icons[Math.floor(Math.random() * icons.length)],
            title: idea.title,
            description: idea.description,
        };
        setAchievements(prev => [...prev, newAchievement]);
        // Beralih ke layar progres untuk melihat pencapaian baru
        setActiveScreen('progress');
    }, [setAchievements]);
    
    const handleGenerateTasksForAchievement = useCallback(async (achievementId: string) => {
        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement || !settings.apiKey) return;

        setIsGeneratingTasks(achievementId);
        try {
            const generatedTasks = await generateTasksForAchievement(achievement.title, achievement.description, settings);
            const newTasks: Task[] = generatedTasks.map((taskText, index) => ({
                id: Date.now() + index + 1,
                text: taskText,
                completions: {},
                achievementId: achievement.id,
                pinned: false,
            }));
            setTasks(prevTasks => [...prevTasks, ...newTasks]);
        } catch (error) {
            console.error("Gagal membuat tugas untuk pencapaian:", error);
            // Anda dapat menambahkan umpan balik kesalahan pengguna di sini jika diinginkan
        } finally {
            setIsGeneratingTasks(null);
        }
    }, [achievements, settings, setTasks]);

    const handleCompleteTask = useCallback(async (id: number) => {
        if (notificationsEnabled) {
            await cancelMiddayReminder(today);
        }

        let totalCompletionsToday = 0;
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => {
                if (task.id === id) {
                    const newCompletions = { ...task.completions };
                    newCompletions[today] = (newCompletions[today] || 0) + 1;
                    totalCompletionsToday = newCompletions[today];
                    return { ...task, completions: newCompletions };
                }
                return task;
            });

            // Calculate total completions across all tasks for today
            const allTasksTotal = updatedTasks.reduce((total, task) => {
                return total + (task.completions[today] || 0);
            }, 0);

            // Trigger celebration animation if total completions reach the target multiple
            if (allTasksTotal > 0 && allTasksTotal % celebrationSettings.target === 0) {
                setShowCelebration(true);
            }

            return updatedTasks;
        });

        let newStreak = 0;
        if (streakData.lastCompletedDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            if (streakData.lastCompletedDate === yesterdayString) {
                newStreak = streakData.currentStreak + 1;
                setStreakData(prev => ({ ...prev, currentStreak: newStreak, lastCompletedDate: today }));
            } else {
                newStreak = 1;
                setStreakData(prev => ({ ...prev, currentStreak: 1, lastCompletedDate: today }));
            }
        } else {
             newStreak = streakData.currentStreak;
        }

        if (notificationsEnabled && newStreak > 0) {
            showMotivationalNotification(newStreak);
        }

        // Show appreciation notification for every 3 tasks completed
        if (notificationsEnabled && totalCompletionsToday > 0 && totalCompletionsToday % 3 === 0) {
            showAppreciationNotification(totalCompletionsToday);
        }

    }, [setTasks, today, streakData, setStreakData, notificationsEnabled, celebrationSettings.target]);

    const handleDeleteTask = useCallback((id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, [setTasks]);

    const handleTogglePinTask = useCallback((id: number) => {
        setTasks(prevTasks => {
            const taskToToggle = prevTasks.find(task => task.id === id);
            if (!taskToToggle) return prevTasks;

            const currentlyPinned = prevTasks.filter(task => task.pinned).length;
            const isCurrentlyPinned = taskToToggle.pinned;

            if (!isCurrentlyPinned && currentlyPinned >= 3) {
                // Sudah ada 3 pinned tasks, tidak bisa pin lagi
                return prevTasks;
            }

            return prevTasks.map(task => {
                if (task.id === id) {
                    if (isCurrentlyPinned) {
                        // Unpin task
                        return { ...task, pinned: false, pinnedOrder: undefined };
                    } else {
                        // Pin task dengan order terendah yang tersedia
                        const usedOrders = prevTasks
                            .filter(t => t.pinned && t.id !== id)
                            .map(t => t.pinnedOrder || 0);
                        const availableOrder = [1, 2, 3].find(order => !usedOrders.includes(order)) || 1;
                        return { ...task, pinned: true, pinnedOrder: availableOrder };
                    }
                }
                return task;
            }).sort((a, b) => {
                // Sort: pinned tasks first, then by pinnedOrder, then by id (newest first)
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                if (a.pinned && b.pinned) {
                    return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
                }
                return b.id - a.id; // Newest first for unpinned
            });
        });
    }, [setTasks]);

    const handleViewAchievement = useCallback((achievementId: string) => {
        setActiveScreen('progress');
    }, []);

    const handleSettingsClick = useCallback(() => {
        setActiveScreen('settings');
    }, []);

    const handleProfileClick = useCallback(() => {
        setActiveScreen('profile');
    }, []);

    const handleImportTasks = useCallback((importedTasks: Task[]) => {
        setTasks(prevTasks => [...prevTasks, ...importedTasks]);
    }, [setTasks]);

    const handleShareTasks = useCallback(() => {
        const shareText = tasks.map((task, index) => {
            const todayCompletions = task.completions[today] || 0;
            const isPinned = task.pinned ? 'Ya' : 'Tidak';
            return `----------------------
Tugas ${index + 1}
${task.text}
Selesai hari ini: ${todayCompletions}
Pin: ${isPinned}
----------------------`;
        }).join('\n');

        if (navigator.share) {
            navigator.share({
                title: 'Tugas 1 Menit Disiplin',
                text: shareText,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Tugas berhasil disalin ke clipboard!');
            });
        }
    }, [tasks, today]);

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen
                    tasks={tasks}
                    achievements={achievements}
                    today={today}
                    streak={streakData.currentStreak}
                    onAddTask={handleAddTask}
                    onCompleteTask={handleCompleteTask}
                    onDeleteTask={handleDeleteTask}
                    onViewAchievement={handleViewAchievement}
                    onTogglePinTask={handleTogglePinTask}
                />;
            case 'progress':
                return <ProgressScreen
                    tasks={tasks}
                    streakData={streakData}
                    achievements={achievements}
                    onCompleteTask={handleCompleteTask}
                    onDeleteTask={handleDeleteTask}
                    onTogglePinTask={handleTogglePinTask}
                    today={today}
                    onGenerateTasks={handleGenerateTasksForAchievement}
                    generatingTasksForId={isGeneratingTasks}
                />;
            case 'ideas':
                return <IdeasScreen onAddTask={handleAddTask} onAddAchievement={handleAddAchievement} />;
            case 'profile':
                return <ProfileScreen
                    tasks={tasks}
                    achievements={achievements}
                    streakData={streakData}
                />;
            case 'settings':
                return <SettingsScreen
                    onImportTasks={handleImportTasks}
                    tasks={tasks}
                    notificationSettings={notificationSettings}
                    themeSettings={themeSettings}
                    onThemeChange={setThemeSettings}
                    celebrationSettings={celebrationSettings}
                    onCelebrationChange={setCelebrationSettings}
                />;
            default:
                return <HomeScreen
                    tasks={tasks}
                    achievements={achievements}
                    today={today}
                    streak={streakData.currentStreak}
                    onAddTask={handleAddTask}
                    onCompleteTask={handleCompleteTask}
                    onDeleteTask={handleDeleteTask}
                    onViewAchievement={handleViewAchievement}
                    onShareTasks={handleShareTasks}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans pb-20">
            <Header onSettingsClick={handleSettingsClick} onProfileClick={handleProfileClick} />
            <main className="max-w-2xl mx-auto p-4 md:p-6">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            {showCelebration && (
                <CelebrationAnimation onComplete={() => setShowCelebration(false)} />
            )}
        </div>
    );
};

export default App;