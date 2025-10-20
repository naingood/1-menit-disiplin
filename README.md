<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 1 Menit Disiplin - Pelacak Kreator

PWA sederhana untuk membantu kreator konten membangun konsistensi melalui tugas-tugas kecil yang dapat diselesaikan dalam waktu 1 menit. Lacak progres Anda dan tetap termotivasi dengan pelacak minimalis ini.

## ✨ Fitur Utama

### 📝 Manajemen Tugas
- **Tugas Harian**: Tambah tugas kecil yang bisa diselesaikan dalam 1 menit
- **Pelacakan Penyelesaian**: Counter harian untuk setiap tugas
- **Pinned Tasks**: Pin hingga 3 tugas penting ke posisi teratas
- **Total Counter**: Lihat total jumlah tugas yang telah dibuat

### 🎯 Sistem Pencapaian
- **Pencapaian Default**:
  - 🎉 Tugas Pertama Selesai!
  - 🔥 Runtutan 5 Hari
  - 🚀 Runtutan Keren! (10 hari)
  - 🎯 Jagoan Tugas (50 tugas)
  - 🏆 Legenda Kreator (100 tugas)
- **Pencapaian Kustom**: Buat pencapaian pribadi dengan AI
- **AI Integration**: Generate tugas spesifik untuk setiap pencapaian

### 🔥 Pelacakan Streak
- **Hitung Hari Berturut-turut**: Lacak konsistensi harian
- **Notifikasi Motivasi**: Pesan khusus untuk milestone streak
- **Reset Otomatis**: Streak reset jika ada hari tanpa penyelesaian

### 🤖 Integrasi AI
- **Generate Ide Tugas**: Dapatkan inspirasi tugas dari AI
- **Pencapaian Kustom**: Buat pencapaian dengan deskripsi AI
- **Google Gemini API**: Gunakan AI untuk content generation

### ⏰ Timer & Notifikasi
- **Countdown Timer**: Timer 1 menit dengan kontrol start/pause/reset
- **Auto-Close**: Timer otomatis menutup setelah 1 menit dengan dialog penyelesaian
- **Notifikasi Apresiasi**: Pesan motivasi setiap kelipatan 3 penyelesaian tugas
- **Pengingat Interval**: Notifikasi berkala yang dapat dikustomisasi

### 🎨 Tema & UI
- **Tema Terang**: Interface yang bersih dan fokus
- **Responsive Design**: Optimal di desktop dan mobile
- **PWA Features**: Install sebagai aplikasi native

## 🚀 Quick Start

### Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Instalasi & Jalankan

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd 1-menit-disiplin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   - Copy `.env.local.example` ke `.env.local`
   - Masukkan Google Gemini API key Anda:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. **Buka browser**:
   - Kunjungi `http://localhost:3000`
   - Install sebagai PWA jika diinginkan

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📱 Progressive Web App (PWA)

Aplikasi ini adalah PWA yang dapat diinstall sebagai aplikasi native:

### Fitur PWA
- **Installable**: Tambahkan ke home screen
- **Offline Support**: Bekerja tanpa koneksi internet
- **Service Worker**: Cache untuk performa optimal
- **Web App Manifest**: Metadata lengkap untuk install

### Browser Support
- Chrome/Edge (PWA penuh)
- Firefox (PWA terbatas)
- Safari (PWA terbatas)

## 🛠️ Teknologi Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Storage**: Local Storage (PWA offline)
- **PWA**: Service Worker + Web App Manifest

## 📁 Struktur Project

```
1-menit-disiplin/
├── public/
│   ├── icons/          # PWA icons
│   ├── manifest.json   # PWA manifest
│   └── service-worker.js
├── src/
│   ├── components/     # React components
│   ├── screens/        # Screen components
│   ├── hooks/          # Custom hooks
│   ├── services/       # AI services
│   ├── utils/          # Utilities
│   ├── types.ts        # TypeScript types
│   ├── App.tsx         # Main app component
│   └── index.tsx       # App entry point
├── docs/               # Documentation
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Konfigurasi

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### PWA Settings
Edit `public/manifest.json` untuk mengubah:
- Nama aplikasi
- Ikon aplikasi
- Warna tema
- URL start

## 📚 Dokumentasi

### Cara Deploy ke CPanel
Lihat panduan lengkap di [`docs/cara-deploy-cpanel.md`](docs/cara-deploy-cpanel.md)

### Prompt untuk Generate App Serupa
Lihat template prompt di [`docs/prompt-pwa-generator.md`](docs/prompt-pwa-generator.md)

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Google Gemini AI](https://ai.google.dev/) - AI Integration
- [Vite](https://vitejs.dev/) - Build Tool

---

**Dibuat dengan ❤️ untuk membantu kreator membangun konsistensi**
