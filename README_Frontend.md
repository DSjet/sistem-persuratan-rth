<h1 align="center">
  Dokumentasi Frontend
</h1>

<p align="center">
Panduan ini digunakan untuk pengembangan frontend web sistem persuratan Desa Rambah Tengah Hilir</p>

# Overview

Aplikasi web ini dibangun dengan:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

Fitur web meliputi:

- Mengajukan surat
- Melihat informasi pengajuan surat
- Melihat informasi surat yang telah disetujui
- Mengekspor surat yang telah disetujui ke format DOCX

# Quickstart

### Menginstal library

Gunakan NPM untuk menginstall library.

```shell
npm intall
```

### Mulai mengembangkan

Untuk memulai pengembangan, jalankan perintah berikut.

```shell
npm run dev
```

### Buka kode dan mulai sesuaikan

Web berjalan pada http://localhost:3000!

## Struktur Aplikasi

Untuk versi baru, struktur folder utama tetap tidak berubah. Namun, isinya telah berubah cukup banyak.

```
.
└── consts
└── contexts
└── utils
└── public
└── src
    ├── app
    └── lib
```

### `/app` directory

Folder app berisi semua halaman dan layout Router App di Next.js, serta mengelola routing.

Struktur ini memungkinkan routing yang efisien dan organisasi bagian-bagian berbeda dari Starter.

### `/lib` **directory**

Direktori lib berisi semua utilitas seperti fungsi klien Medusa JS, fungsi util, konfigurasi, dan konstanta.

## Sumber lain untuk Next JS 14

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
