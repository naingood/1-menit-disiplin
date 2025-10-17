import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AISettings, NotificationSettings, ThemeSettings } from '../types';
import { requestNotificationPermission, scheduleIntervalReminder, cancelIntervalReminder } from '../utils/notifications';

interface SettingsScreenProps {
    onThemeChange: (themeSettings: ThemeSettings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onThemeChange }) => {
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
        theme: 'system',
    });
    const [apiKeyInput, setApiKeyInput] = React.useState(settings.apiKey);
    const [modelInput, setModelInput] = React.useState(settings.model);
    const [saved, setSaved] = React.useState(false);
    const [, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);
    const [intervalInput, setIntervalInput] = useState(notificationSettings.intervalMinutes.toString());
    const [messageInput, setMessageInput] = useState(notificationSettings.message);

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
        const updatedThemeSettings = { theme: newTheme as 'light' | 'dark' | 'system' };
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Tema</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mode Tema
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                themeSettings.theme === 'light'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            ☀️ Terang
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                themeSettings.theme === 'dark'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            🌙 Gelap
                        </button>
                        <button
                            onClick={() => handleThemeChange('system')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                themeSettings.theme === 'system'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            💻 Sistem
                        </button>
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
                        disabled
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                    >
                        <option value="gemini">Gemini</option>
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
                        Kunci API Gemini
                    </label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Masukkan kunci API Anda"
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