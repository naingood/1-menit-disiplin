import type { AISettings, AchievementIdea } from "../types";

export async function generateTaskIdeas(goal: string, settings: AISettings): Promise<string[]> {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: settings.apiKey });

    const model = settings.model || 'gemini-2.5-flash';

    const prompt = `Sebagai ahli produktivitas konten kreator, buat daftar berisi tepat 10 tugas yang dapat ditindaklanjuti yang bisa dilakukan oleh seorang kreator konten dalam satu menit atau kurang untuk mencapai tujuan spesifik ini: "${goal}". Tugas-tugas tersebut harus singkat, spesifik, dan siap untuk ditambahkan ke daftar tugas.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        tasks: {
                            type: 'ARRAY',
                            description: "Sebuah daftar berisi 10 tugas satu menit untuk seorang kreator konten.",
                            items: {
                                type: 'STRING'
                            }
                        }
                    },
                    required: ["tasks"]
                },
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.tasks)) {
             return result.tasks;
        } else {
            throw new Error("Respons AI tidak dalam format yang diharapkan.");
        }

    } catch (error) {
        console.error("Error calling AI service:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
            throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
        }
        throw new Error("Gagal menghasilkan ide dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
    }
}


export async function generateAchievementIdeas(goal: string, settings: AISettings): Promise<AchievementIdea[]> {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: settings.apiKey });

    const model = settings.model || 'gemini-2.5-flash';

    const prompt = `Sebagai seorang desainer gamifikasi, buatlah daftar berisi 5 ide pencapaian yang kreatif dan memotivasi untuk seorang kreator konten yang bertujuan untuk: "${goal}". Setiap pencapaian harus memiliki 'title' (judul singkat) dan 'description' (deskripsi singkat dan memotivasi).`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        achievements: {
                            type: 'ARRAY',
                            description: "Sebuah daftar berisi 5 ide pencapaian untuk seorang kreator konten.",
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    title: {
                                        type: 'STRING',
                                        description: 'Judul pencapaian yang menarik.'
                                    },
                                    description: {
                                        type: 'STRING',
                                        description: 'Deskripsi singkat tentang cara membuka pencapaian.'
                                    }
                                },
                                required: ["title", "description"]
                            }
                        }
                    },
                    required: ["achievements"]
                },
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.achievements)) {
             return result.achievements;
        } else {
            throw new Error("Respons AI tidak dalam format yang diharapkan.");
        }

    } catch (error) {
        console.error("Error calling AI service for achievements:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
            throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
        }
        throw new Error("Gagal menghasilkan ide pencapaian dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
    }
}

export async function generateTasksForAchievement(achievementTitle: string, achievementDescription: string, settings: AISettings): Promise<string[]> {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: settings.apiKey });

    const model = settings.model || 'gemini-2.5-flash';
    const prompt = `Mengingat pencapaian untuk seorang kreator konten berjudul "${achievementTitle}" dengan deskripsi "${achievementDescription}", buatlah daftar berisi tepat 3 tugas yang sangat spesifik, dapat ditindaklanjuti, dan berdurasi satu menit yang akan membantu mereka mulai bekerja untuk mencapai pencapaian ini.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        tasks: {
                            type: 'ARRAY',
                            description: "Sebuah daftar berisi 3 tugas satu menit yang ditargetkan untuk sebuah pencapaian.",
                            items: {
                                type: 'STRING'
                            }
                        }
                    },
                    required: ["tasks"]
                },
            },
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        if (result && Array.isArray(result.tasks)) {
            return result.tasks;
        } else {
            throw new Error("Respons AI untuk tugas pencapaian tidak dalam format yang diharapkan.");
        }
    } catch (error) {
        console.error("Error generating tasks for achievement:", error);
        // Jangan lemparkan error fatal, cukup kembalikan array kosong agar aplikasi tidak rusak.
        // Pengguna masih mendapatkan pencapaian, tetapi tanpa tugas otomatis.
        return []; 
    }
}
