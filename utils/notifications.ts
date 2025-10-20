
// @ts-nocheck
// Deklarasikan tipe global untuk menghindari kesalahan TypeScript dengan TimestampTrigger
declare global {
  interface Window {
    TimestampTrigger: any;
  }
  class TimestampTrigger {
    constructor(timestamp: number);
  }
}


// Helper untuk mendapatkan registrasi service worker
async function getRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready;
  }
  return undefined;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    return permission;
}

export async function showMotivationalNotification(streak: number): Promise<void> {
    const registration = await getRegistration();
    if (!registration || Notification.permission !== 'granted') {
        return;
    }

    const title = `🔥 Runtutan ${streak} Hari!`;
    const options: NotificationOptions = {
        body: 'Kerja bagus! Tetap semangat dan lanjutkan momentumnya!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'streak-motivation'
    };

    await registration.showNotification(title, options);
}

export async function showAppreciationNotification(completedTasks: number): Promise<void> {
    const registration = await getRegistration();
    if (!registration || Notification.permission !== 'granted') {
        return;
    }

    // Show appreciation for every 3 tasks completed
    if (completedTasks % 3 !== 0) {
        return;
    }

    const messages = [
        '🎉 Hebat! 3 tugas selesai hari ini!',
        '🚀 Luar biasa! Sudah 6 tugas hari ini!',
        '⭐ Kamu luar biasa! 9 tugas selesai!',
        '🏆 Legenda! 12 tugas hari ini!',
        '💎 Kamu tak terhentikan! 15 tugas!',
        '🌟 Pencapaian luar biasa! 18 tugas!',
        '👑 Raja produktivitas! 21 tugas!',
        '🔥 Api semangat tak pernah padam! 24 tugas!',
        '💪 Kamu adalah inspirasi! 27 tugas!',
        '🎯 Target harian tercapai! 30 tugas!'
    ];

    const messageIndex = Math.min(Math.floor(completedTasks / 3) - 1, messages.length - 1);
    const title = messages[messageIndex];
    const options: NotificationOptions = {
        body: 'Teruskan momentum positifmu!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'appreciation-notification'
    };

    await registration.showNotification(title, options);
}

export async function scheduleMiddayReminder(today: string): Promise<void> {
    const registration = await getRegistration();
    if (!registration || Notification.permission !== 'granted' || !window.TimestampTrigger) {
        if (!window.TimestampTrigger) console.log('TimestampTrigger API is not supported.');
        return;
    }

    await cancelMiddayReminder(today);

    const noon = new Date();
    noon.setHours(12, 0, 0, 0);

    if (Date.now() > noon.getTime()) {
        return;
    }
    
    try {
        const title = '👋 Waktunya untuk Tugas 1 Menit Anda!';
        const options: NotificationOptions = {
            body: 'Luangkan satu menit untuk menjaga konsistensi Anda hari ini.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: `midday-reminder-${today}`,
            showTrigger: new TimestampTrigger(noon.getTime()),
        };
        
        await registration.showNotification(title, options);
    } catch (e) {
        console.error('Gagal menjadwalkan notifikasi:', e);
    }
}

export async function cancelMiddayReminder(today: string): Promise<void> {
    const registration = await getRegistration();
    if (!registration) {
        return;
    }

    const notifications = await registration.getNotifications({
        tag: `midday-reminder-${today}`,
        includeTriggered: true
    });

    notifications.forEach(notification => notification.close());
}

export async function scheduleIntervalReminder(intervalMinutes: number, message: string): Promise<void> {
    const registration = await getRegistration();
    if (!registration || Notification.permission !== 'granted' || !window.TimestampTrigger) {
        if (!window.TimestampTrigger) console.log('TimestampTrigger API is not supported.');
        return;
    }

    // Cancel existing interval reminders
    await cancelIntervalReminder();

    const nextTrigger = new Date();
    nextTrigger.setMinutes(nextTrigger.getMinutes() + intervalMinutes);

    try {
        const title = '⏰ Pengingat 1 Menit';
        const options: NotificationOptions = {
            body: message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: 'interval-reminder',
            showTrigger: new TimestampTrigger(nextTrigger.getTime()),
        };

        await registration.showNotification(title, options);
    } catch (e) {
        console.error('Gagal menjadwalkan notifikasi interval:', e);
    }
}

export async function cancelIntervalReminder(): Promise<void> {
    const registration = await getRegistration();
    if (!registration) {
        return;
    }

    const notifications = await registration.getNotifications({
        tag: 'interval-reminder',
        includeTriggered: true
    });

    notifications.forEach(notification => notification.close());
}

export async function showIntervalNotification(message: string): Promise<void> {
    const registration = await getRegistration();
    if (!registration || Notification.permission !== 'granted') {
        return;
    }

    const title = '⏰ Pengingat 1 Menit';
    const options: NotificationOptions = {
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'interval-reminder'
    };

    await registration.showNotification(title, options);
}
