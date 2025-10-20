import type { AISettings, AchievementIdea } from "../types";

export async function generateTaskIdeas(goal: string, settings: AISettings): Promise<string[]> {
    if (settings.provider === 'gemini') {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });

        const model = settings.model || 'gemini-2.5-flash';

        const prompt = `Sebagai ahli produktivitas, buat daftar berisi tepat 10 tugas mikro yang dapat ditindaklanjuti yang bisa dilakukan dalam satu menit atau kurang untuk mencapai tujuan spesifik ini: "${goal}". Tugas-tugas tersebut harus singkat, spesifik, dan siap untuk ditambahkan ke daftar tugas.`;

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
                                description: "Sebuah daftar berisi 10 tugas mikro satu menit.",
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
    } else if (settings.provider === 'openai') {
        const { OpenAI } = await import('openai');
        const ai = new OpenAI({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });

        const model = settings.model || 'gpt-4o-mini';

        const prompt = `Sebagai ahli produktivitas, buat daftar berisi tepat 10 tugas mikro yang dapat ditindaklanjuti yang bisa dilakukan dalam satu menit atau kurang untuk mencapai tujuan spesifik ini: "${goal}". Tugas-tugas tersebut harus singkat, spesifik, dan siap untuk ditambahkan ke daftar tugas.`;

        try {
            const response = await ai.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const jsonText = response.choices[0]?.message?.content?.trim() || '';
            const result = JSON.parse(jsonText);

            if (result && Array.isArray(result.tasks)) {
                 return result.tasks;
            } else {
                throw new Error("Respons AI tidak dalam format yang diharapkan.");
            }

        } catch (error) {
            console.error("Error calling OpenAI service:", error);
            if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
                throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
            }
            throw new Error("Gagal menghasilkan ide dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
        }
    } else if (settings.provider === 'anthropic') {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const ai = new Anthropic({ apiKey: settings.apiKey });

        const model = settings.model || 'claude-3-haiku-20240307';

        const prompt = `Sebagai ahli produktivitas, buat daftar berisi tepat 10 tugas mikro yang dapat ditindaklanjuti yang bisa dilakukan dalam satu menit atau kurang untuk mencapai tujuan spesifik ini: "${goal}". Tugas-tugas tersebut harus singkat, spesifik, dan siap untuk ditambahkan ke daftar tugas.

Format respons sebagai JSON dengan struktur: {"tasks": ["tugas1", "tugas2", ...]}`;

        try {
            const response = await ai.messages.create({
                model: model,
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }],
            });

            const jsonText = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
            const result = JSON.parse(jsonText);

            if (result && Array.isArray(result.tasks)) {
                 return result.tasks;
            } else {
                throw new Error("Respons AI tidak dalam format yang diharapkan.");
            }

        } catch (error) {
            console.error("Error calling Anthropic service:", error);
            if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
                throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
            }
            throw new Error("Gagal menghasilkan ide dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
        }
    } else {
        throw new Error(`Provider ${settings.provider} belum diimplementasikan.`);
    }
}


export async function generateAchievementIdeas(goal: string, settings: AISettings): Promise<AchievementIdea[]> {
    if (settings.provider === 'gemini') {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });

        const model = settings.model || 'gemini-2.5-flash';

        const prompt = `Sebagai seorang desainer gamifikasi, buatlah daftar berisi 5 ide pencapaian yang kreatif dan memotivasi untuk mencapai tujuan: "${goal}". Setiap pencapaian harus memiliki 'title' (judul singkat) dan 'description' (deskripsi singkat dan memotivasi).`;

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
                                description: "Sebuah daftar berisi 5 ide pencapaian.",
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
    } else if (settings.provider === 'openai') {
        const { OpenAI } = await import('openai');
        const ai = new OpenAI({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });

        const model = settings.model || 'gpt-4o-mini';

        const prompt = `Sebagai seorang desainer gamifikasi, buatlah daftar berisi 5 ide pencapaian yang kreatif dan memotivasi untuk mencapai tujuan: "${goal}". Setiap pencapaian harus memiliki 'title' (judul singkat) dan 'description' (deskripsi singkat dan memotivasi).`;

        try {
            const response = await ai.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const jsonText = response.choices[0]?.message?.content?.trim() || '';
            const result = JSON.parse(jsonText);

            if (result && Array.isArray(result.achievements)) {
                 return result.achievements;
            } else {
                throw new Error("Respons AI tidak dalam format yang diharapkan.");
            }

        } catch (error) {
            console.error("Error calling OpenAI service for achievements:", error);
            if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
                throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
            }
            throw new Error("Gagal menghasilkan ide pencapaian dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
        }
    } else if (settings.provider === 'anthropic') {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const ai = new Anthropic({ apiKey: settings.apiKey });

        const model = settings.model || 'claude-3-haiku-20240307';

        const prompt = `Sebagai seorang desainer gamifikasi, buatlah daftar berisi 5 ide pencapaian yang kreatif dan memotivasi untuk mencapai tujuan: "${goal}". Setiap pencapaian harus memiliki 'title' (judul singkat) dan 'description' (deskripsi singkat dan memotivasi).

Format respons sebagai JSON dengan struktur: {"achievements": [{"title": "judul", "description": "deskripsi"}, ...]}`;

        try {
            const response = await ai.messages.create({
                model: model,
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }],
            });

            const jsonText = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
            const result = JSON.parse(jsonText);

            if (result && Array.isArray(result.achievements)) {
                 return result.achievements;
            } else {
                throw new Error("Respons AI tidak dalam format yang diharapkan.");
            }

        } catch (error) {
            console.error("Error calling Anthropic service for achievements:", error);
            if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is missing'))) {
                throw new Error("Kunci API tidak valid atau hilang. Silakan periksa kunci Anda di tab Pengaturan.");
            }
            throw new Error("Gagal menghasilkan ide pencapaian dari AI. Model mungkin tidak tersedia atau permintaan gagal.");
        }
    } else {
        throw new Error(`Provider ${settings.provider} belum diimplementasikan.`);
    }
}

export async function generateTasksForAchievement(achievementTitle: string, achievementDescription: string, settings: AISettings): Promise<string[]> {
    if (settings.provider === 'gemini') {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: settings.apiKey });

        const model = settings.model || 'gemini-2.5-flash';
        const prompt = `Mengingat pencapaian berjudul "${achievementTitle}" dengan deskripsi "${achievementDescription}", buatlah daftar berisi tepat 3 tugas mikro yang sangat spesifik, dapat ditindaklanjuti, dan berdurasi satu menit yang akan membantu mencapai pencapaian ini.`;

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
                                description: "Sebuah daftar berisi 3 tugas mikro satu menit yang ditargetkan untuk sebuah pencapaian.",
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
    } else if (settings.provider === 'openai') {
        const { OpenAI } = await import('openai');
        const ai = new OpenAI({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });

        const model = settings.model || 'gpt-4o-mini';
        const prompt = `Mengingat pencapaian berjudul "${achievementTitle}" dengan deskripsi "${achievementDescription}", buatlah daftar berisi tepat 3 tugas mikro yang sangat spesifik, dapat ditindaklanjuti, dan berdurasi satu menit yang akan membantu mencapai pencapaian ini.`;

        try {
            const response = await ai.chat.completions.create({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });
            const jsonText = response.choices[0]?.message?.content?.trim() || '';
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
    } else if (settings.provider === 'anthropic') {
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const ai = new Anthropic({ apiKey: settings.apiKey });

        const model = settings.model || 'claude-3-haiku-20240307';
        const prompt = `Mengingat pencapaian berjudul "${achievementTitle}" dengan deskripsi "${achievementDescription}", buatlah daftar berisi tepat 3 tugas mikro yang sangat spesifik, dapat ditindaklanjuti, dan berdurasi satu menit yang akan membantu mencapai pencapaian ini.

Format respons sebagai JSON dengan struktur: {"tasks": ["tugas1", "tugas2", "tugas3"]}`;

        try {
            const response = await ai.messages.create({
                model: model,
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }],
            });
            const jsonText = response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';
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
    } else {
        return [];
    }
}
