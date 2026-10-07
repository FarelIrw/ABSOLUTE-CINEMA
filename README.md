# Absolute Cinema

Aplikasi streaming film open source & domain publik berbasis React Native (Expo).
Tugas Praktikum Pemrograman Mobile, Laboratorium Informatika UMM.

## Anggota
- Farel Bayu Putra Irawan 2024-496
- Moh. Khairus Shaleh     2024-499
- Adi Purwito             2024-530

1. Tentang Proyek

Absolute Cinema adalah aplikasi untuk menjelajahi daftar film. Proyek ini dikembangkan bertahap dari Modul 1 sampai Modul 6, sehingga struktur kode dibuat rapi sejak awal agar mudah dikembangkan.

2. Teknologi
React Native dengan Expo
TypeScript
Git dan GitHub (branch per anggota, merge lewat pull request)

3. Struktur Folder
absolute-cinema/
├── assets/            # ikon dan gambar
├── components/
│   └── MovieCard.tsx  # komponen kartu film
├── data/
│   └── movies.ts      # array of objects berisi data film
├── functions/
│   └── movieUtils.ts  # custom function
├── styles/
│   └── homeStyles.ts  # external styles (StyleSheet)
├── types/
│   └── movie.ts       # type Movie
├── App.tsx            # layar utama
└── index.ts           # entry point



## Cara Menyimpan dan Menjalankan

1. git clone https://github.com/FarelIrw/ABSOLUTE-CINEMA.git
2. cd ABSOLUTE-CINEMA
3. npm install
4. npx expo start --go

Scan QR code dengan aplikasi Expo Go di HP. Pastikan versi Expo Go mendukung SDK yang dipakai proyek ini.
