import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AISettings, AchievementIdea } from '../types';
import { generateTaskIdeas, generateAchievementIdeas } from '../services/aiService';
import AffirmationScreen from './AffirmationScreen';

interface IdeasScreenProps {
    onAddTask: (text: string) => void;
    onAddAchievement: (idea: AchievementIdea) => void;
    onAddAffirmation: (text: string) => void;
}

const IdeasScreen: React.FC<IdeasScreenProps> = ({ onAddTask, onAddAchievement, onAddAffirmation }) => {
    const [settings] = useLocalStorage<AISettings>('ai-settings', {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: '',
    });
    
    const [activeTab, setActiveTab] = useState<'tasks' | 'achievements' | 'affirmations'>('tasks');
    const [goal, setGoal] = useState('');
    const [taskIdeas, setTaskIdeas] = useState<string[]>([]);
    const [achievementIdeas, setAchievementIdeas] = useState<AchievementIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (tab: 'tasks' | 'achievements' | 'affirmations') => {
        setActiveTab(tab);
        setError(null);
        setIsLoading(false);
        setTaskIdeas([]);
        setAchievementIdeas([]);
    };
    
    const validateAndPrepare = () => {
        if (!settings.apiKey) {
            setError('Harap atur kunci API Gemini Anda di tab Pengaturan terlebih dahulu.');
            return false;
        }
        if (!goal.trim()) {
            setError('Harap masukkan tujuan.');
            return false;
        }
        
        setIsLoading(true);
        setError(null);
        setTaskIdeas([]);
        setAchievementIdeas([]);
        return true;
    };

    const handleGenerateTaskIdeas = async () => {
        if (!validateAndPrepare()) return;
        try {
            const generatedIdeas = await generateTaskIdeas(goal, settings);
            setTaskIdeas(generatedIdeas);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateAchievementIdeas = async () => {
        if (!validateAndPrepare()) return;
        try {
            const generatedIdeas = await generateAchievementIdeas(goal, settings);
            setAchievementIdeas(generatedIdeas);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTaskAndRemoveIdea = (idea: string) => {
        onAddTask(idea);
        setTaskIdeas(prevIdeas => prevIdeas.filter(i => i !== idea));
        // Simpan tanggal pembuatan ke localStorage
        const taskDate = new Date().toISOString();
        localStorage.setItem(`task_created_${Date.now()}`, taskDate);
    };

    const handleAddAchievementAndRemoveIdea = (idea: AchievementIdea) => {
        onAddAchievement(idea);
        setAchievementIdeas(prevIdeas => prevIdeas.filter(i => i.title !== idea.title));
    };

    const renderContent = () => {
        if (activeTab === 'affirmations') {
            return <AffirmationScreen onAddAffirmation={onAddAffirmation} />;
        }

        const isTaskTab = activeTab === 'tasks';
        return (
            <>
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xl">{isTaskTab ? '🎯' : '🏆'}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Generator Ide AI: {isTaskTab ? 'Tugas' : 'Pencapaian'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {isTaskTab
                                    ? 'Jelaskan tujuan utama Anda, dan AI akan menyarankan tugas mikro 1 menit.'
                                    : 'Dapatkan ide pencapaian yang memotivasi berdasarkan tujuan Anda.'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="contoh: Tingkatkan produktivitas harian"
                                className="w-full p-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={isTaskTab ? handleGenerateTaskIdeas : handleGenerateAchievementIdeas}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            disabled={isLoading || !goal.trim()}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Menghasilkan...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">✨</span>
                                        Hasilkan Ide
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
                        <p>{error}</p>
                    </div>
                )}

                {taskIdeas.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Ide Tugas yang Dihasilkan:</h3>
                        {taskIdeas.map((idea, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-center justify-between gap-2 animate-fade-in">
                                <p className="text-gray-800 dark:text-gray-200 flex-grow">{idea}</p>
                                <button
                                    onClick={() => handleAddTaskAndRemoveIdea(idea)}
                                    className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition"
                                    aria-label={`Tambah tugas: ${idea}`}
                                >
                                    Tambah
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {achievementIdeas.length > 0 && (
                     <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Ide Pencapaian yang Dihasilkan:</h3>
                        {achievementIdeas.map((idea, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in flex items-start justify-between gap-2">
                               <div className="flex-grow">
                                    <h4 className="font-bold text-indigo-700 dark:text-indigo-300">{idea.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">{idea.description}</p>
                               </div>
                               <button
                                    onClick={() => handleAddAchievementAndRemoveIdea(idea)}
                                    className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition whitespace-nowrap"
                                    aria-label={`Tambah pencapaian: ${idea.title}`}
                                >
                                    Tambahkan
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    const TabButton: React.FC<{ tab: 'tasks' | 'achievements' | 'affirmations', label: string }> = ({ tab, label }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => handleTabChange(tab)}
                className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 focus:outline-none ${
                    isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
            >
                {label}
            </button>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Tab Navigation - Modern Design */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-2 border border-white/20 dark:border-gray-700/50">
                <nav className="flex space-x-2">
                    <TabButton tab="tasks" label="Ide Tugas" />
                    <TabButton tab="achievements" label="Ide Pencapaian" />
                    <TabButton tab="affirmations" label="Afirmasi" />
                </nav>
            </div>

            {/* Content Container */}
            <div className="space-y-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default IdeasScreen;
