
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
