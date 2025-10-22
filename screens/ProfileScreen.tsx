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

    const today = new Date().toISOString().split('T')[0];

    const tasksCompletedToday = tasks.reduce((total, task) => {
        return total + (task.completions[today] || 0);
    }, 0);

    const tasksCompletedTodayCount = tasks.filter(task => (task.completions[today] || 0) > 0).length;

    const productivityToday = tasks.length > 0 ? Math.round((tasksCompletedTodayCount / tasks.length) * 100) : 0;

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
            {/* Header Profil - Elegant Gradient Design */}
            <div className="bg-gradient-to-br from-blue-900 to-black rounded-2xl p-8 text-center shadow-xl border border-blue-800">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">👤</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Profil</h1>
                <p className="text-blue-100 text-lg">
                    Pelacak kemajuan Anda dalam membangun disiplin 1 menit
                </p>
            </div>

            {/* Statistik Cards - Glassmorphism Effect */}
            <div className="grid grid-cols-2 gap-6">
                {profileStats.map((stat, index) => (
                    <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                        <div className={`text-3xl mb-3 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Productivity Today Card - Separate Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg p-6 border border-emerald-100 dark:border-emerald-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xl">📈</span>
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">Produktivitas Hari Ini</div>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{productivityToday}%</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Target</div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">100%</div>
                    </div>
                </div>
            </div>

            {/* Progress Overview - Enhanced Design */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-lg">📊</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Ringkasan Kemajuan
                    </h2>
                </div>

                <div className="space-y-5">
                    <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Total Tugas</span>
                        <span className="font-bold text-gray-800 dark:text-white text-lg">{tasks.length}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Tugas yang Dipin</span>
                        <span className="font-bold text-gray-800 dark:text-white text-lg">
                            {tasks.filter(task => task.pinned).length}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Rata-rata per Hari</span>
                        <span className="font-bold text-gray-800 dark:text-white text-lg">
                            {streakData.currentStreak > 0 ? (totalTasksCompleted / Math.max(streakData.currentStreak, 1)).toFixed(1) : '0'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Share Tasks Button - Modern Design */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6">
                <button
                    onClick={() => setShowTaskReport(true)}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-white/20"
                >
                    <span className="text-2xl">📤</span>
                    <span className="text-lg">Bagikan Tugas</span>
                </button>
            </div>

            {/* Motivational Section - Enhanced Gradient */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white text-center border border-indigo-500/20">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-2xl font-bold mb-4">Tetap Konsisten!</h3>
                <p className="text-indigo-100 text-lg leading-relaxed">
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
