import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AISettings, AchievementIdea } from '../types';
import { generateTaskIdeas, generateAchievementIdeas } from '../services/aiService';

interface IdeasScreenProps {
    onAddTask: (text: string) => void;
    onAddAchievement: (idea: AchievementIdea) => void;
}

const IdeasScreen: React.FC<IdeasScreenProps> = ({ onAddTask, onAddAchievement }) => {
    const [settings] = useLocalStorage<AISettings>('ai-settings', {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: '',
    });
    
    const [activeTab, setActiveTab] = useState<'tasks' | 'achievements'>('tasks');
    const [goal, setGoal] = useState('');
    const [taskIdeas, setTaskIdeas] = useState<string[]>([]);
    const [achievementIdeas, setAchievementIdeas] = useState<AchievementIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (tab: 'tasks' | 'achievements') => {
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
    };

    const handleAddAchievementAndRemoveIdea = (idea: AchievementIdea) => {
        onAddAchievement(idea);
        setAchievementIdeas(prevIdeas => prevIdeas.filter(i => i.title !== idea.title));
    };

    const renderContent = () => {
        const isTaskTab = activeTab === 'tasks';
        return (
            <>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        Generator Ide AI: {isTaskTab ? 'Tugas' : 'Pencapaian'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {isTaskTab
                            ? 'Jelaskan tujuan utama Anda, dan AI akan menyarankan tugas mikro 1 menit.'
                            : 'Dapatkan ide pencapaian yang memotivasi berdasarkan tujuan Anda.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="contoh: Tingkatkan produktivitas harian"
                            className="flex-grow p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            disabled={isLoading}
                        />
                        <button
                            onClick={isTaskTab ? handleGenerateTaskIdeas : handleGenerateAchievementIdeas}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !goal.trim()}
                        >
                            {isLoading ? 'Menghasilkan...' : 'Hasilkan Ide'}
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

    const TabButton: React.FC<{ tab: 'tasks' | 'achievements', label: string }> = ({ tab, label }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${
                    isActive
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
            >
                {label}
            </button>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-300 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4">
                    <TabButton tab="tasks" label="Ide Tugas" />
                    <TabButton tab="achievements" label="Ide Pencapaian" />
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};

export default IdeasScreen;
