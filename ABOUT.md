# 📊 Tentang Probmax

**Probmax** adalah aplikasi web modern yang dirancang untuk membantu menganalisis dan memaksimalkan probabilitas berbagai skenario. Aplikasi ini menggabungkan kekuatan teknologi backend Laravel dengan frontend React yang responsif.

## 🎯 Visi & Misi

- **Visi**: Menyediakan platform analisis probabilitas yang mudah digunakan dan dapat diakses oleh semua orang
- **Misi**: Membantu pengguna membuat keputusan berbasis data dengan analisis probabilitas yang akurat dan visualisasi yang intuitif

## 🏗️ Arsitektur Teknologi

Probmax dibangun menggunakan arsitektur **Full Stack** modern:

### Backend (27.6% PHP)
- **Framework**: Laravel 10.10
- **Authentication**: Laravel Sanctum
- **Database**: Database agnostic dengan support untuk migrations
- **API**: RESTful API dengan Guzzle HTTP Client
- **Development Tools**: Laravel Tinker, Laravel Pint, PHPUnit

### Frontend (69.6% JavaScript + CSS)
- **Framework**: React dengan React Router DOM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Language**: TypeScript
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker support
- **Hosting**: Vercel (Live at https://probmax.vercel.app)

## ✨ Fitur Utama

1. **Analisis Probabilitas** - Kalkulasi dan analisis probabilitas berbagai skenario
2. **Visualisasi Data** - Tampilan grafis yang mudah dipahami untuk hasil analisis
3. **API RESTful** - Backend yang powerful untuk menangani operasi kompleks
4. **Interface Responsif** - Desain modern dengan Tailwind CSS yang dapat diakses di berbagai perangkat
5. **Authentication** - Sistem keamanan dengan Laravel Sanctum

## 🚀 Stack Teknologi

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Backend | Laravel | ^10.10 |
| Frontend | React | Latest |
| Build | Vite | ^5.0.0 |
| Styling | Tailwind CSS | ^3.4.17 |
| Language | TypeScript | ~5.9.3 |
| HTTP | Axios | ^1.13.4 |
| PHP | - | ^8.1 |

## 📁 Struktur Proyek

```
probmax/
├── app/                    # Aplikasi backend (Laravel)
├── database/              # Database migrations & seeders
├── frontend/              # Aplikasi frontend (React)
│   └── src/              # Source code React
├── routes/               # API routes
├── tests/                # Unit & Feature tests
├── composer.json         # PHP dependencies
├── package.json          # Node dependencies
└── dockerfile            # Docker configuration
```

## 🛠️ Cara Memulai

### Prasyarat
- PHP >= 8.1
- Node.js >= 16
- Composer
- npm atau yarn

### Setup Backend
```bash
# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate
```

### Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📈 Komposisi Bahasa Pemrograman

- **JavaScript**: 69.6% - Logika frontend dan build
- **PHP**: 27.6% - Backend API dan business logic
- **CSS**: 1.9% - Styling tambahan
- **Blade**: 0.3% - Template engine Laravel
- **HTML**: 0.2% - Markup
- **Dockerfile**: 0.2% - Container configuration
- **Other**: 0.2% - Konfigurasi lainnya

## 🌐 Live Demo

Aplikasi sudah di-deploy dan dapat diakses di: **https://probmax.vercel.app**

## 📝 Lisensi

MIT License - Lihat file LICENSE untuk detail lebih lanjut

## 👤 Developer

Dikembangkan oleh [@imanmukhlisin](https://github.com/imanmukhlisin)

## 🤝 Berkontribusi

Kami menyambut kontribusi! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak & Support

Untuk pertanyaan atau saran, silakan buat issue di repository ini atau hubungi developer melalui GitHub profile.

---

**Last Updated**: 2026-05-03
