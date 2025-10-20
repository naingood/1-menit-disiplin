import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AISettings, NotificationSettings, ThemeSettings, CelebrationSettings, Task } from '../types';
import { requestNotificationPermission, scheduleIntervalReminder, cancelIntervalReminder } from '../utils/notifications';

interface SettingsScreenProps {
    onThemeChange: (themeSettings: ThemeSettings) => void;
    tasks: Task[];
    onImportTasks: (tasks: Task[]) => void;
    celebrationSettings: CelebrationSettings;
    onCelebrationChange: (settings: CelebrationSettings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onThemeChange, tasks, onImportTasks, celebrationSettings, onCelebrationChange }) => {
    const [settings, setSettings] = useLocalStorage<AISettings>('ai-settings', {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        apiKey: '',
    });
    const [notificationSettings, setNotificationSettings] = useLocalStorage<NotificationSettings>('notification-settings', {
        enabled: false,
        intervalMinutes: 1,
        message: 'Apakah yang akan kamu kerjakan 1 menit ke depan?',
    });
    const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('theme-settings', {
        theme: 'light',
    });
    const [apiKeyInput, setApiKeyInput] = React.useState(settings.apiKey);
    const [modelInput, setModelInput] = React.useState(settings.model);
    const [saved, setSaved] = React.useState(false);
    const [, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);
    const [intervalInput, setIntervalInput] = useState(notificationSettings.intervalMinutes.toString());
    const [messageInput, setMessageInput] = useState(notificationSettings.message);
    const [importText, setImportText] = useState('');
    const [celebrationTargetInput, setCelebrationTargetInput] = useState(celebrationSettings.target.toString());

     useEffect(() => {
        const interval = setInterval(() => {
            if (Notification.permission !== notificationPermission) {
                setNotificationPermission(Notification.permission);
                if (Notification.permission !== 'granted') {
                    setNotificationsEnabled(false);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [notificationPermission, setNotificationsEnabled]);

    const handleSave = () => {
        setSettings({ ...settings, apiKey: apiKeyInput, model: modelInput });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSaveNotificationSettings = () => {
        const interval = parseInt(intervalInput);
        if (isNaN(interval) || interval < 1) {
            alert('Interval harus berupa angka positif.');
            return;
        }
        setNotificationSettings({
            ...notificationSettings,
            intervalMinutes: interval,
            message: messageInput,
        });
        if (notificationSettings.enabled) {
            scheduleIntervalReminder(interval, messageInput);
        }
    };

    const handleToggleIntervalNotifications = async () => {
        const newEnabled = !notificationSettings.enabled;
        setNotificationSettings({ ...notificationSettings, enabled: newEnabled });

        if (newEnabled) {
            const permission = await requestNotificationPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                scheduleIntervalReminder(notificationSettings.intervalMinutes, notificationSettings.message);
            }
        } else {
            cancelIntervalReminder();
        }
    };

    const handleThemeChange = (newTheme: string) => {
        // Force light theme only
        const updatedThemeSettings = { theme: 'light' as const };
        setThemeSettings(updatedThemeSettings);
        onThemeChange(updatedThemeSettings);
    };

    const handleEnableNotifications = async () => {
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
            setNotificationsEnabled(true);
        } else {
            setNotificationsEnabled(false);
        }
    };

    const handleExportTasks = () => {
        const csvContent = [
            'text,pinned,pinnedOrder',
            ...tasks.map(task => `"${task.text}",${task.pinned ? 'true' : 'false'},${task.pinnedOrder || ''}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'tugas-1menit-disiplin.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportTasks = () => {
        try {
            const lines = importText.trim().split('\n');
            if (lines.length < 2) {
                alert('Format CSV tidak valid. Pastikan ada header dan minimal 1 baris data.');
                return;
            }

            const importedTasks: Task[] = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                if (parts.length < 2) continue;

                const text = parts[0].replace(/^"|"$/g, '');
                const pinned = parts[1]?.toLowerCase() === 'true';
                const pinnedOrder = parts[2] ? parseInt(parts[2]) : undefined;

                importedTasks.push({
                    id: Date.now() + i,
                    text,
                    completions: {},
                    pinned,
                    pinnedOrder: pinned ? pinnedOrder : undefined,
                });
            }

            if (importedTasks.length === 0) {
                alert('Tidak ada tugas yang berhasil diimpor.');
                return;
            }

            onImportTasks(importedTasks);
            setImportText('');
            alert(`Berhasil mengimpor ${importedTasks.length} tugas!`);
        } catch (error) {
            alert('Terjadi kesalahan saat mengimpor tugas. Pastikan format CSV benar.');
        }
    };

    const handleSaveCelebrationSettings = () => {
        const target = parseInt(celebrationTargetInput);
        if (isNaN(target) || target < 1) {
            alert('Target perayaan harus berupa angka positif.');
            return;
        }
        onCelebrationChange({ target });
        alert('Pengaturan perayaan disimpan!');
    };

    const sampleCSV = `text,pinned,pinnedOrder
"Balas 1 komentar di postingan terbaru",false,
"Rekam 1 klip video pendek tentang tips kreator",false,
"Cek ide konten di catatan harian",false,`;

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-fade-in space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan</h2>
            
            <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Notifikasi</h3>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pengingat & Motivasi
                    </label>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-grow">
                            {notificationPermission === 'granted' && <p className="text-sm text-green-600 dark:text-green-400">Notifikasi diizinkan.</p>}
                            {notificationPermission === 'default' && <p className="text-sm text-gray-500 dark:text-gray-400">Izinkan notifikasi untuk pengingat dan pesan motivasi.</p>}
                             {notificationPermission === 'denied' && <p className="text-sm text-red-600 dark:text-red-400">Notifikasi diblokir. Harap aktifkan di pengaturan browser Anda.</p>}
                        </div>
                        {notificationPermission === 'default' && (
                            <button
                                onClick={handleEnableNotifications}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition whitespace-nowrap"
                            >
                                Aktifkan
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pengingat Interval 1 Menit
                    </label>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex-grow">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {notificationSettings.enabled ? 'Aktif' : 'Nonaktif'} - Interval: {notificationSettings.intervalMinutes} menit
                                </p>
                            </div>
                            <button
                                onClick={handleToggleIntervalNotifications}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 transition whitespace-nowrap ${
                                    notificationSettings.enabled
                                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                                }`}
                            >
                                {notificationSettings.enabled ? 'Matikan' : 'Aktifkan'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="interval" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Interval (menit)
                                </label>
                                <input
                                    id="interval"
                                    type="number"
                                    min="1"
                                    value={intervalInput}
                                    onChange={(e) => setIntervalInput(e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Pesan Notifikasi
                                </label>
                                <input
                                    id="message"
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveNotificationSettings}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            >
                                Simpan Pengaturan Notifikasi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Perayaan</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Perayaan
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Animasi perayaan akan muncul setiap kali jumlah tugas selesai hari ini adalah kelipatan dari target ini. Default: 3
                    </p>
                    <div className="flex gap-3 items-end">
                        <div className="flex-grow">
                            <label htmlFor="celebrationTarget" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Target
                            </label>
                            <input
                                id="celebrationTarget"
                                type="number"
                                min="1"
                                value={celebrationTargetInput}
                                onChange={(e) => setCelebrationTargetInput(e.target.value)}
                                className="w-full p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <button
                            onClick={handleSaveCelebrationSettings}
                            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Tema</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mode Tema
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className="px-4 py-2 rounded-lg font-medium transition bg-blue-600 text-white"
                        >
                            ☀️ Terang
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 self-center ml-4">
                            Tema terang dipaksa untuk pengalaman yang konsisten.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Impor & Ekspor Tugas</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ekspor Tugas
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Unduh semua tugas Anda dalam format CSV untuk backup atau transfer ke perangkat lain.
                        </p>
                        <button
                            onClick={handleExportTasks}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        >
                            📥 Ekspor Tugas (CSV)
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Impor Tugas
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Impor tugas dari file CSV. Format: text,pinned,pinnedOrder
                        </p>

                        <div className="space-y-3">
                            <textarea
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                placeholder="Tempel CSV di sini..."
                                rows={6}
                                className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setImportText(sampleCSV)}
                                    className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition text-sm"
                                >
                                    📋 Load Sample
                                </button>
                                <button
                                    onClick={handleImportTasks}
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    📤 Impor Tugas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Pengaturan AI</h3>
                <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Penyedia Layanan AI</label>
                    <select
                        id="provider"
                        value={settings.provider}
                        onChange={(e) => setSettings({ ...settings, provider: e.target.value as 'gemini' | 'openai' | 'anthropic' })}
                        className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="gemini">Gemini (Google)</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic (Claude)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Model
                    </label>
                    <input
                        id="model"
                        type="text"
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        placeholder="contoh: gemini-2.5-flash"
                        className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kunci API {settings.provider === 'gemini' ? 'Gemini' : settings.provider === 'openai' ? 'OpenAI' : 'Anthropic'}
                    </label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder={`Masukkan kunci API ${settings.provider === 'gemini' ? 'Gemini' : settings.provider === 'openai' ? 'OpenAI' : 'Anthropic'} Anda`}
                        className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                 <div className="flex items-center justify-end gap-4 pt-4">
                    {saved && <p className="text-sm text-green-600 dark:text-green-400">Pengaturan AI disimpan!</p>}
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition"
                    >
                        Simpan Pengaturan AI
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;