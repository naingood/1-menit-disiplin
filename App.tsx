import React, { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { Task, StreakData, Achievement, AchievementIdea, AISettings, NotificationSettings, Theme, ThemeSettings } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import IdeasScreen from './screens/IdeasScreen';
import SettingsScreen from './screens/SettingsScreen';
import { generateTasksForAchievement } from './services/aiService';
import {
    scheduleMiddayReminder,
    cancelMiddayReminder,
    showMotivationalNotification,
    scheduleIntervalReminder,
    cancelIntervalReminder
} from './utils/notifications';

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const defaultTasks: Task[] = [
    { id: 1, text: "Balas 1 komentar", completions: {} },
    { id: 2, text: "Rekam 1 klip video pendek", completions: {} },
    { id: 3, text: "Cek ide konten di catatan", completions: {} }
];

const defaultAchievements: Achievement[] = [
    { id: 'first_step', icon: '🎉', title: 'Tugas Pertama Selesai!', description: 'Anda menyelesaikan tugas pertama Anda.' },
    { id: 'consistency', icon: '🔥', title: 'Runtutan 5 Hari', description: 'Jaga runtutan selama 5 hari berturut-turut.' },
    { id: 'hot_streak', icon: '🚀', title: 'Runtutan Keren!', description: 'Anda mempertahankan runtutan 10 hari.' },
    { id: 'task_master', icon: '🎯', title: 'Jagoan Tugas', description: 'Selesaikan total 50 tugas.' },
    { id: 'creator_legend', icon: '🏆', title: 'Legenda Kreator', description: 'Selesaikan total 100 tugas.' },
];

export type Screen = 'home' | 'progress' | 'ideas' | 'settings';

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
        theme: 'system',
    });
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
            const currentTheme = themeSettings.theme;

            if (currentTheme === 'dark') {
                root.classList.add('dark');
            } else if (currentTheme === 'light') {
                root.classList.remove('dark');
            } else {
                // system theme
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (systemPrefersDark) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyTheme();

        if (themeSettings.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [themeSettings]);

    const handleAddTask = useCallback((text: string) => {
        const newTask: Task = {
            id: Date.now(),
            text,
            completions: {},
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

        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === id) {
                    const newCompletions = { ...task.completions };
                    newCompletions[today] = (newCompletions[today] || 0) + 1;
                    return { ...task, completions: newCompletions };
                }
                return task;
            })
        );

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

    }, [setTasks, today, streakData, setStreakData, notificationsEnabled]);

    const handleDeleteTask = useCallback((id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, [setTasks]);

    const handleViewAchievement = useCallback((achievementId: string) => {
        setActiveScreen('progress');
    }, []);

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
                />;
            case 'progress':
                return <ProgressScreen 
                    tasks={tasks} 
                    streakData={streakData} 
                    achievements={achievements}
                    onCompleteTask={handleCompleteTask}
                    onDeleteTask={handleDeleteTask}
                    today={today}
                    onGenerateTasks={handleGenerateTasksForAchievement}
                    generatingTasksForId={isGeneratingTasks}
                />;
            case 'ideas':
                return <IdeasScreen onAddTask={handleAddTask} onAddAchievement={handleAddAchievement} />;
            case 'settings':
                return <SettingsScreen onThemeChange={setThemeSettings} />;
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
                />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans pb-20">
            <Header />
            <main className="max-w-2xl mx-auto p-4 md:p-6">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default App;