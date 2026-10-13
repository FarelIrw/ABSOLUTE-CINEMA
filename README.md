Markdown
# 🎬 Absolute Cinema

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TMDB_API-01B4E4?style=for-the-badge&logo=themoviedb&logoColor=white" alt="TMDB API" />
</p>

Aplikasi eksplorasi film open-source berbasis **React Native (Expo)** yang menyajikan daftar film populer, detail ringkasan, pencarian interaktif, serta integrasi data real-time dari **TMDB (The Movie Database)**.

> **Tugas Praktikum Pemrograman Mobile**  
> Laboratorium Informatika — Universitas Muhammadiyah Malang

---

## 👥 Anggota Tim

| NIM | Nama | Role / Branch |
| :--- | :--- | :--- |
| `202410370311496` | **Farel Bayu Putra Irawan** | Developer (`Farel`) |
| `202410370311499` | **Moh. Khairus Shaleh** | Developer (`Khairus`) |
| `202410370311530` | **Adi Purwito** | Developer (`Adi`) |

---

## ✨ Fitur Utama

- 🏠 **Beranda & Trending:** Menampilkan hero banner film pilihan serta daftar film terpopuler.
- 🔍 **Pencarian Real-Time:** Filter dinamis berdasarkan judul, genre, atau tahun rilis film secara instan.
- 🏷️ **Filter Genre:** Pengelompokan film berdasarkan kategori genre (*Action, Animation, Drama, Horror, Sci-Fi, Thriller*).
- 🌐 **Integrasi TMDB API:** Penarikan data *rating*, poster resolusi tinggi, sinopsis bahasa Indonesia, dan durasi film secara otomatis.
- 🎨 **UI / UX Modern:** Desain antarmuka *dark mode* yang responsif dan nyaman digunakan.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [React Native](https://reactnative.dev/) (Expo SDK)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **API:** [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Icons:** Expo Vector Icons (`Ionicons`)
- **Version Control:** Git & GitHub (Workflow: Branch per anggota & Pull Request)

---

## 📁 Struktur Direktori

```text
ABSOLUTE-CINEMA/
├── assets/          # Aset statis (gambar, ikon, logo)
├── components/      # Komponen UI yang dapat digunakan kembali (MovieCard, SearchBar, BottomNav, dll.)
├── data/            # Data lokal / fallback daftar film
├── functions/       # Fungsi utilitas & integrasi TMDB API (`tmdb.ts`, `movieUtils.ts`)
├── styles/          # File styling terpisah untuk tiap layar & komponen
├── types/           # Definisi tipe data TypeScript (`movie.ts`)
├── App.tsx          # Entry point utama aplikasi
├── app.json         # Konfigurasi Expo
└── tsconfig.json    # Konfigurasi TypeScript

 🚀 Cara Menjalankan Proyek
1. Prasyarat
Pastikan Anda telah menginstal:

Node.js (Versi LTS)

Aplikasi Expo Go pada ponsel Android / iOS Anda.

2. Kloning Repositori
Bash
git clone [https://github.com/FarelIrw/ABSOLUTE-CINEMA.git](https://github.com/FarelIrw/ABSOLUTE-CINEMA.git)
cd ABSOLUTE-CINEMA
3. Instal Dependensi
Bash
npm install
4. Setup Variable Lingkungan (.env.local)
Buat file .env.local di root proyek dan tambahkan API Read Access Token dari TMDB:

Cuplikan kode
EXPO_PUBLIC_TMDB_TOKEN=isi_token_tmdb_anda_di_sini
5. Jalankan Aplikasi
Bash
npx expo start
Pindai (scan) QR Code yang muncul di terminal menggunakan aplikasi Expo Go di HP Anda.

📜 Lisensi
Proyek ini dibuat untuk keperluan akademik Praktikum Pemrograman Mobile UMM.