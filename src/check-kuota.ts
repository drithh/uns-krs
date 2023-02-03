import { createInstance } from './axios-instance';

// load env
import dotenv from 'dotenv';
dotenv.config();

type JadwalMakul = {
  kode_mk: string;
  nama: string;
  hari: string;
  nama_hari:
    | 'SENIN'
    | 'SELASA'
    | 'RABU'
    | 'KAMIS'
    | 'JUMAT'
    | 'SABTU'
    | 'MINGGU';
  jam: string;
  ruang: string;
  kelas: string;
  kode_dosen: string;
  kuota: string;
  peserta: string;
  kuota_cukup: number;
  tumbukan: number;
  pesan_tumbukan: string;
};

const instance = createInstance();

const main = async () => {
  if (process.env.KODE_MK === undefined) {
    console.log('KODE_MK belum diatur');
    return;
  }
  const kodeMakul = process.env.KODE_MK;
  // setInterval(async () => {
  const jadwalMakul: JadwalMakul[] = await getJadwalMakul(kodeMakul);
  jadwalMakul.forEach((jadwal) => {
    console.log(
      `${jadwal.nama_hari.padEnd(6, ' ')} ${jadwal.jam.padEnd(7, ' ')} Kelas:${
        jadwal.kelas
      } Kuota:${jadwal.kuota} Peserta:${jadwal.peserta}`
    );
  });
  // }, 5000);
};

const getJadwalMakul: any = async (kodeMakul: string) => {
  const response = await instance
    .post(
      'https://siakad.uns.ac.id/registrasi/input-krs/jadwal-makul',
      new URLSearchParams({
        kodeMk: kodeMakul,
      })
    )
    .catch((err) => {
      throw err;
    });
  if (response.data.length === 0) {
    console.log('Kode makul tidak ditemukan');
    process.exit(1);
  }
  return response.data as JadwalMakul[];
};

// if run directly, run main
if (require.main === module) {
  main();
}

export default main;
