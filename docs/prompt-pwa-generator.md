# Prompt untuk Generate Aplikasi PWA "Pelacak Kreator 1 Menit"

Berikut adalah prompt lengkap yang dapat digunakan untuk menghasilkan aplikasi PWA serupa menggunakan AI atau tools development.

## 🎯 Prompt Utama

```
Buatlah aplikasi Progressive Web App (PWA) untuk "Pelacak Kreator 1 Menit" dengan spesifikasi berikut:

## 📋 Spesifikasi Aplikasi

### **Tujuan Utama**
Aplikasi PWA yang membantu kreator konten membangun konsistensi melalui tugas-tugas kecil yang dapat diselesaikan dalam waktu 1 menit.

### **Teknologi Stack**
- Frontend: React 19 dengan TypeScript
- Styling: Tailwind CSS
- Build Tool: Vite
- AI Integration: Google Gemini API
- PWA Features: Service Worker, Web App Manifest

### **Fitur Utama**

#### 1. **Manajemen Tugas**
- Tambah tugas harian dengan estimasi waktu 1 menit
- Tugas default: "Balas 1 komentar", "Rekam 1 klip video pendek", "Cek ide konten di catatan"
- Pelacakan penyelesaian harian dengan counter
- Hapus tugas yang tidak diperlukan

#### 2. **Sistem Pencapaian (Achievements)**
- Pencapaian default:
  - "Tugas Pertama Selesai!" - Menyelesaikan tugas pertama
  - "Runtutan 5 Hari" - Streak 5 hari berturut-turut
  - "Runtutan Keren!" - Streak 10 hari
  - "Jagoan Tugas" - Total 50 tugas
  - "Legenda Kreator" - Total 100 tugas
- Pencapaian kustom yang dapat ditambahkan
- Integrasi AI untuk menghasilkan tugas spesifik per pencapaian

#### 3. **Pelacakan Streak**
- Hitung hari berturut-turut menyelesaikan tugas
- Notifikasi motivasi saat mencapai milestone
- Reset streak jika ada hari tanpa penyelesaian

#### 4. **Integrasi AI**
- Generate ide tugas berdasarkan tujuan kreator
- Buat pencapaian kustom dengan deskripsi
- Gunakan Google Gemini API untuk content generation

#### 5. **Notifikasi**
- Pengingat siang hari jika belum ada tugas diselesaikan
- Notifikasi motivasi saat streak meningkat
- Notifikasi interval yang dapat dikustomisasi (default setiap 1 menit)

#### 6. **Pengaturan Tema**
- 3 pilihan tema: Light, Dark, System (auto-follow OS)
- Persistensi pengaturan tema

#### 7. **Countdown Timer**
- Tombol timer 1 menit di header
- Modal timer dengan countdown display
- Kontrol: Start/Pause/Reset/Close
- Dialog completion saat waktu habis
- Browser notification saat selesai

#### 8. **PWA Features**
- Installable sebagai aplikasi native
- Offline capability dengan service worker
- Cache untuk performa optimal
- Web App Manifest dengan icon dan metadata

### **Struktur File**
```
project/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Header.tsx (dengan timer button)
│   │   ├── BottomNav.tsx
│   │   ├── TaskItem.tsx
│   │   ├── AchievementCard.tsx
│   │   └── ...
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── IdeasScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   │   └── aiService.ts
│   ├── utils/
│   │   └── notifications.ts
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── types.ts
│   ├── App.tsx
│   └── index.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### **UI/UX Requirements**
- Design minimalis dan clean
- Support dark mode
- Responsive untuk mobile dan desktop
- Animasi smooth transitions
- Color scheme: Gray scale dengan blue accents
- Typography: Clean dan readable

### **Data Persistence**
- Gunakan localStorage untuk semua data
- Custom hook useLocalStorage
- Data tersimpan offline

### **Konfigurasi Build**
- Vite untuk development dan build
- Environment variables untuk GEMINI_API_KEY
- PWA manifest dengan proper icons
- Service worker untuk caching

## 🚀 Implementasi Step-by-Step

### **Step 1: Setup Project**
```bash
npm create vite@latest pelacak-kreator-1-menit -- --template react-ts
cd pelacak-kreator-1-menit
npm install
npm install @google/genai tailwindcss
```

### **Step 2: Implementasi Core Features**
1. Buat types dan interfaces
2. Implementasi localStorage hook
3. Buat komponen dasar (Header, BottomNav, etc.)
4. Implementasi state management di App.tsx
5. Buat screens untuk setiap halaman
6. Integrasi AI service
7. Implementasi notifications
8. Setup PWA (manifest, service worker)

### **Step 3: Testing & Optimization**
1. Test semua fitur di browser
2. Test PWA installation
3. Test offline mode
4. Optimize performance
5. Build untuk production

## 📱 PWA Configuration

### **Manifest.json**
```json
{
  "short_name": "Pelacak 1Menit",
  "name": "Pelacak Kreator 1 Menit",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1f2937",
  "background_color": "#111827",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/icons/icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

### **Service Worker**
Implementasi caching untuk offline capability dengan strategi cache-first untuk static assets.

## 🎨 Design System

### **Color Palette**
- Primary: Blue (#3B82F6)
- Background: Gray-100/900 (light/dark)
- Text: Gray-800/200 (light/dark)
- Accent: Green untuk success, Red untuk error

### **Typography**
- Heading: Bold, 2xl-3xl
- Body: Regular, base-lg
- Small: Light, sm

## 🔧 Development Notes

- Gunakan functional components dengan hooks
- Implementasi error boundaries
- TypeScript strict mode
- ESLint untuk code quality
- Responsive design first

---

**Output yang Diharapkan:**
Aplikasi PWA lengkap dengan semua fitur di atas, siap untuk development lokal dan deploy ke production.
```

## 🎯 Prompt Alternatif (Simplified)

Jika ingin versi yang lebih sederhana:

```
Buat aplikasi PWA sederhana untuk tracking tugas harian 1 menit dengan fitur:
- Tambah/hapus tugas
- Countdown timer 1 menit
- Streak tracking
- Dark mode toggle
- PWA installable
- Offline support

Tech stack: React + TypeScript + Tailwind CSS + Vite
```

## 🎯 Prompt untuk AI Code Generator

```
Generate a complete PWA codebase for a "1-Minute Creator Tracker" with these features:
- Task management with daily completion tracking
- Achievement system with streaks
- 1-minute countdown timer with modal
- Theme switching (light/dark/system)
- AI-powered task generation using Gemini API
- Push notifications with customizable intervals
- PWA manifest and service worker
- Local storage persistence
- Responsive design with Tailwind CSS

Structure the code with proper TypeScript types, React hooks, and modular components.
```

## 🚀 Tips Penggunaan Prompt

1. **Sesuaikan dengan AI Tool**: Prompt di atas dirancang untuk AI coding assistants seperti GitHub Copilot, ChatGPT, atau Claude
2. **Iterative Development**: Mulai dengan fitur core, lalu tambahkan fitur advanced secara bertahap
3. **Testing**: Selalu test setiap fitur yang diimplementasikan
4. **Customization**: Sesuaikan spesifikasi sesuai kebutuhan project

## 📚 Resources Tambahan

- [PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [Vite Build Tool](https://vitejs.dev/)
