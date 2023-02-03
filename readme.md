# UNS KRS

Hacky way to fill KRS in Sebelas Maret University.  
Reminder:

> This is not an official way to fill KRS in UNS. Use this script at your own discretion.  
> I cannot be held responsible for any harm or consequences that may result from its use.

## How to use

Theres 2 ways to use this script.

1. You can run index.ts in your terminal with `npm run start` or `yarn start`
2. You can run directly every file in `src` folder with `ts-node` or `node` command or using command in `package.json` file.

## Installation

1. Clone this repo
2. Install NodeJS
3. Install dependencies with `npm install` or `yarn install`
4. Done

## Modules

1. Ambil Mata Kuliah (ambil-maku.ts)

   - Modul ini berfungsi untuk menginputkan mata kuliah yang akan diambil.
   - Data Kode Mata kuliah dan Kelas diambil dari file .env
   - Request akan dilakukan secara berulang (default 500ms) sampai mata kuliah yang diinputkan berhasil diambil (status 200).
   - Jika kode mata kuliah yang diinputkan salah atau belum tersedia, maka request akan diulang sampai mata kuliah yang diinputkan ada di list mata kuliah yang tersedia.

2. Cek Kuota (check-kuota.ts)

   - Modul ini berfungsi untuk melihat kuota mata kuliah yang akan diambil.
   - Data Kode Mata kuliah diambil dari file .env

3. Cek Bulk Kuota (check-bulk-kuota.ts)

   - Modul ini berfungsi untuk melihat semua kuota yang di whitelist.
   - Data Kode Mata kuliah diambil dari file `check-bulk-kuota.json` tepatnya di variabel `makulWhiteList`.
   - Tidak disarankan untuk menggunakan modul ini, karena jika salah satu request gagal, maka semua request akan gagal.

4. Cek Diambil (check-diambil.ts)

   - Modul ini berfungsi untuk mengambil mata kuliah yang sudah diambil di KRS.

5. Kirim PIN (kirim-pin.ts)

   - Modul ini berfungsi untuk mengirimkan PIN ke server UNS sehingga bisa mengambil mata kuliah.
   - Data PIN diambil dari file .env
   - Lebih baik untuk mengirimkan PIN sebelum KRS dimulai, karena jika server UNS penuh, maka pengiriman PIN akan lama, karena perlu menunggu server tersedia.
   - Request akan dilakukan secara berulang (default 500ms) sampai PIN berhasil dikirim (status 302).

6. Ambil token untuk KRS (csrf-krs.ts)

   - Modul ini berfungsi untuk mengambil Token yang dibutuhkan untuk mengelola KRS.
