# Gemini API Setup Guide

## 🔑 Cara Mendapatkan API Key (GRATIS)

1. **Buka Google AI Studio**
   - Kunjungi: https://aistudio.google.com/app/apikey
   - Login dengan akun Google Anda

2. **Generate API Key**
   - Klik "Create API Key"
   - Pilih project atau buat baru
   - Copy API key yang dihasilkan

3. **Tambahkan ke .env**
   - Buka file `backend/.env`
   - Cari baris `GEMINI_API_KEY=`
   - Paste API key Anda: `GEMINI_API_KEY=your_api_key_here`

4. **Restart Laravel Server**
   ```bash
   # Stop server (Ctrl+C)
   # Start lagi
   php artisan serve
   ```

## 📊 Free Tier Limits

- **15 requests per minute** (RPM)
- **1 million tokens per day**
- **1500 requests per day**

Untuk aplikasi penelitian/skripsi, ini lebih dari cukup!

## ✅ Fitur yang Sudah Diimplementasi

- ✅ Konteks aplikasi ProbmaxCare
- ✅ Pemahaman kesehatan mental mahasiswa keperawatan
- ✅ Saran fitur yang relevan (Cek Harian, PMC Game, Buat Janji)
- ✅ Fallback response jika API gagal
- ✅ Bahasa Indonesia yang ramah
- ✅ Jawaban singkat dan to-the-point

## 🔒 Keamanan

- API key disimpan di `.env` (tidak di-commit ke Git)
- Timeout 30 detik untuk mencegah hanging
- Error handling yang baik
- Fallback ke rule-based jika API down

## 🧪 Testing

Setelah setup, coba chat:
- "Halo"
- "Saya lagi stres"
- "Apa itu kesehatan mental?"
- "Saya lagi sedih"

Bot akan merespons dengan konteks ProbmaxCare!
