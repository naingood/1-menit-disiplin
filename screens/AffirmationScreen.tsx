import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AISettings, Affirmation } from '../types';
import { generateQuotes } from '../services/aiService';

interface AffirmationScreenProps {
    onAddAffirmation: (text: string) => void;
}

const AffirmationScreen: React.FC<AffirmationScreenProps> = ({ onAddAffirmation }) => {
    const [settings] = useLocalStorage<AISettings>('ai-settings', {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: '',
    });

    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
    const [manualText, setManualText] = useState('');
    const [aiInput, setAiInput] = useState('');
    const [generatedAffirmations, setGeneratedAffirmations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (tab: 'manual' | 'ai') => {
        setActiveTab(tab);
        setError(null);
        setIsLoading(false);
        setGeneratedAffirmations([]);
    };

    const validateAndPrepare = () => {
        if (!settings.apiKey) {
            setError('Harap atur kunci API Gemini Anda di tab Pengaturan terlebih dahulu.');
            return false;
        }
        if (!aiInput.trim()) {
            setError('Harap masukkan tema atau tujuan untuk afirmasi.');
            return false;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedAffirmations([]);
        return true;
    };

    const handleGenerateAffirmations = async () => {
        if (!validateAndPrepare()) return;
        try {
            const generated = await generateQuotes(aiInput, settings);
            setGeneratedAffirmations(generated);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddManualAffirmation = () => {
        if (manualText.trim()) {
            onAddAffirmation(manualText.trim());
            setManualText('');
        }
    };

    const handleAddGeneratedAffirmation = (affirmation: string) => {
        onAddAffirmation(affirmation);
        setGeneratedAffirmations(prev => prev.filter(a => a !== affirmation));
    };

    const renderContent = () => {
        if (activeTab === 'manual') {
            return (
                <>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Tambah Afirmasi Manual
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Tulis afirmasi positif Anda sendiri untuk motivasi harian.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <textarea
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                placeholder="Contoh: Saya adalah orang yang disiplin dan produktif setiap hari..."
                                className="flex-grow p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                                rows={3}
                            />
                            <button
                                onClick={handleAddManualAffirmation}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!manualText.trim()}
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Generate Quote AI
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Masukkan konsep, dan AI akan membuat quote sesuai dengan konsep tersebut.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                placeholder="contoh: Meningkatkan kepercayaan diri"
                                className="flex-grow p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleGenerateAffirmations}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !aiInput.trim()}
                            >
                                {isLoading ? 'Menghasilkan...' : 'Hasilkan'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {generatedAffirmations.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Quote yang Dihasilkan:</h3>
                            {generatedAffirmations.map((affirmation, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-center justify-between gap-2 animate-fade-in">
                                    <p className="text-gray-800 dark:text-gray-200 flex-grow">{affirmation}</p>
                                    <button
                                        onClick={() => handleAddGeneratedAffirmation(affirmation)}
                                        className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition"
                                        aria-label={`Tambah afirmasi: ${affirmation}`}
                                    >
                                        Tambah
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }
    };

    const TabButton: React.FC<{ tab: 'manual' | 'ai', label: string }> = ({ tab, label }) => {
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
                    <TabButton tab="manual" label="Manual" />
                    <TabButton tab="ai" label="AI Generate" />
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};

export default AffirmationScreen;
