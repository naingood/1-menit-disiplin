# Cara Deploy PWA "Pelacak Kreator 1 Menit" ke CPanel Shared Hosting

Panduan lengkap untuk deploy aplikasi PWA ini ke shared hosting dengan Node.js setup.

## 📋 Prasyarat

- Akun CPanel Shared Hosting dengan Node.js support
- Domain/subdomain yang sudah dikonfigurasi
- Akses FTP ke hosting
- Git repository aplikasi

## 🚀 Langkah-langkah Deploy

### 1. Persiapan Build Lokal

```bash
# Pastikan dependencies terinstall
npm install

# Build aplikasi untuk production
npm run build

# Build akan menghasilkan folder 'dist/' dengan file siap deploy
```

### 2. Setup Node.js di CPanel

#### A. Akses CPanel
1. Login ke CPanel hosting Anda
2. Cari menu **"Software"** → **"Setup Node.js App"**

#### B. Buat Aplikasi Node.js
1. Klik **"Create Application"**
2. Konfigurasi:
   - **Node.js version**: Pilih versi 18.x atau 20.x (sesuai dengan package.json)
   - **Application root**: `/home/username/public_html/pelacak-kreator` (atau subdomain folder)
   - **Application URL**: `https://domainanda.com` atau `https://subdomain.domainanda.com`
   - **Application startup file**: Kosongkan (karena ini static build)

#### C. Setup Environment Variables
1. Di bagian **"Environment variables"**, tambahkan:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

### 3. Upload Files via FTP

#### A. Upload Build Files
Upload isi folder `dist/` ke folder aplikasi Node.js Anda:
```
/home/username/public_html/pelacak-kreator/
├── assets/
│   ├── index-XXXXXX.js
│   └── index-XXXXXX.js
├── index.html
└── manifest.json (jika ada)
```

#### B. Upload Source Files (Opsional)
Jika perlu development di server, upload juga:
- `package.json`
- `package-lock.json`
- Source files lainnya

### 4. Konfigurasi File Manager

#### A. Setup .htaccess untuk SPA
Buat file `.htaccess` di root aplikasi:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType image/jpg "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/gif "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 month"
  ExpiresByType application/vnd.ms-fontobject "access plus 1 month"
  ExpiresByType font/ttf "access plus 1 month"
  ExpiresByType font/woff "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 month"
</IfModule>
```

### 5. Setup SSL Certificate

1. Di CPanel, cari **"Security"** → **"SSL/TLS"**
2. Install SSL certificate untuk domain/subdomain
3. Pastikan aplikasi menggunakan HTTPS (penting untuk PWA)

### 6. Konfigurasi PWA Manifest

Pastikan `public/manifest.json` sudah benar:

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

### 7. Testing Deploy

#### A. Test Akses Aplikasi
1. Akses URL aplikasi: `https://domainanda.com`
2. Pastikan aplikasi load dengan benar
3. Test fitur PWA (install prompt, offline mode)

#### B. Test PWA Features
1. **Install Prompt**: Pada mobile, harus muncul banner install
2. **Offline Mode**: Aplikasi harus bisa dibuka offline
3. **Service Worker**: Check di DevTools → Application → Service Workers

#### C. Test Fitur Utama
- Tambah/hapus tugas
- Pelacakan streak
- Notifikasi (jika diaktifkan)
- Tema switching
- AI integration (jika API key disetup)

### 8. Troubleshooting

#### A. 404 Errors pada Refresh
- Pastikan `.htaccess` sudah benar untuk SPA routing
- Check Apache mod_rewrite enabled

#### B. PWA Tidak Bisa Install
- Pastikan HTTPS enabled
- Check manifest.json valid
- Service worker terdaftar dengan benar

#### C. API Tidak Bekerja
- Pastikan GEMINI_API_KEY sudah diset di environment variables
- Check CORS settings jika perlu

#### D. Build Files Tidak Update
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Check file timestamps di server

### 9. Maintenance & Update

#### A. Update Aplikasi
```bash
# Lokal development
npm run build

# Upload dist/ files ke server via FTP
# Replace files di folder aplikasi
```

#### B. Backup
- Backup folder aplikasi secara berkala
- Backup database localStorage (jika perlu)

#### C. Monitoring
- Monitor error logs di CPanel
- Check aplikasi secara berkala

## 📞 Support

Jika mengalami masalah:
1. Check error logs di CPanel → "Errors"
2. Validate manifest.json di [Manifest Validator](https://manifest-validator.appspot.com/)
3. Test service worker di DevTools

## ✅ Checklist Deploy

- [ ] Node.js app created di CPanel
- [ ] Environment variables configured
- [ ] Build files uploaded
- [ ] .htaccess configured
- [ ] SSL certificate installed
- [ ] PWA manifest valid
- [ ] Service worker registered
- [ ] HTTPS enabled
- [ ] Testing semua fitur
- [ ] Install prompt muncul
- [ ] Offline mode bekerja

---

**Catatan**: Pastikan hosting provider support Node.js dan memiliki resource yang cukup untuk aplikasi PWA ini.
