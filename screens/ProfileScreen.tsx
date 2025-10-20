import React, { useState } from 'react';
import type { Task, Achievement, StreakData } from '../types';

interface ProfileScreenProps {
    tasks: Task[];
    achievements: Achievement[];
    streakData: StreakData;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ tasks, achievements, streakData }) => {
    const [showTaskReport, setShowTaskReport] = useState(false);

    const totalTasksCompleted = tasks.reduce((total, task) => {
        return total + Object.values(task.completions).reduce((sum: number, count: number) => sum + count, 0);
    }, 0);

    const tasksCompletedToday = tasks.reduce((total, task) => {
        const today = new Date().toISOString().split('T')[0];
        return total + (task.completions[today] || 0);
    }, 0);

    const achievementsUnlocked = achievements.length;

    const generateTaskReport = () => {
        const today = new Date().toISOString().split('T')[0];
        return tasks.map((task, index) => {
            const todayCompletions = task.completions[today] || 0;
            const isPinned = task.pinned ? 'ya' : 'tidak';
            return `----------------------
Tugas ${index + 1}
${task.text}
Selesai hari ini: ${todayCompletions}
pin: ${isPinned}`;
        }).join('\n');
    };

    const handleCopyTasks = () => {
        const reportText = generateTaskReport();
        navigator.clipboard.writeText(reportText).then(() => {
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
            notification.textContent = '✅ Laporan tugas berhasil disalin!';
            document.body.appendChild(notification);

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }).catch((err) => {
            console.error('Gagal menyalin ke clipboard:', err);
            // Show error notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
            notification.textContent = '❌ Gagal menyalin laporan';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        });
    };

    const profileStats = [
        {
            label: 'Total Tugas Selesai',
            value: totalTasksCompleted,
            icon: '✅',
            color: 'text-green-600'
        },
        {
            label: 'Tugas Hari Ini',
            value: tasksCompletedToday,
            icon: '📅',
            color: 'text-blue-600'
        },
        {
            label: 'Runtutan Saat Ini',
            value: streakData.currentStreak,
            icon: '🔥',
            color: 'text-orange-600'
        },
        {
            label: 'Pencapaian Terkunci',
            value: achievementsUnlocked,
            icon: '🏆',
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Profil */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👤</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Profil Kreator</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Pelacak kemajuan Anda dalam membangun disiplin 1 menit
                </p>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 gap-4">
                {profileStats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                        <div className={`text-2xl mb-2 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    📊 Ringkasan Kemajuan
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Total Tugas</span>
                        <span className="font-semibold text-gray-800 dark:text-white">{tasks.length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Tugas yang Dipin</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                            {tasks.filter(task => task.pinned).length}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Rata-rata per Hari</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                            {streakData.currentStreak > 0 ? (totalTasksCompleted / Math.max(streakData.currentStreak, 1)).toFixed(1) : '0'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tombol Bagikan Tugas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <button
                    onClick={() => setShowTaskReport(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    📤 Bagikan Tugas
                </button>
            </div>

            {/* Motivasi */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white text-center">
                <h3 className="text-lg font-semibold mb-2">💪 Tetap Konsisten!</h3>
                <p className="text-indigo-100">
                    Setiap menit kecil yang Anda dedikasikan membawa Anda lebih dekat ke tujuan kreator Anda.
                    Teruslah membangun kebiasaan yang luar biasa!
                </p>
            </div>

            {/* Modal Laporan Tugas */}
            {showTaskReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                📊 Laporan Tugas
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Laporan lengkap semua tugas Anda
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                            <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                                {generateTaskReport()}
                            </pre>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCopyTasks}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                📋 Salin
                            </button>
                            <button
                                onClick={() => setShowTaskReport(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;
