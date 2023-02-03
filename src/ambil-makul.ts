import { createInstance } from './axios-instance';
import dotenv from 'dotenv';
dotenv.config();

type Kode_MK = string;
type Kelas = 'A' | 'B' | 'C' | 'D';

const REQUEST_DELAY_MILLISECONDS: number = 500;
const instance = createInstance();

// do not change this
let AMBIL_COUNT = 0;

const main = async () => {
  if (process.env.KELAS === undefined || process.env.KODE_MK === undefined) {
    console.error('Kelas atau Kode MK belum diatur');
    process.exit(1);
  }

  const kodeMk: Kode_MK = process.env.KODE_MK as Kode_MK;
  const kelas: Kelas = process.env.KELAS as Kelas;

  setInterval(() => {
    ambilKelas(kodeMk, kelas);
  }, REQUEST_DELAY_MILLISECONDS);
};

const ambilKelas = async (kodeMk: Kode_MK, kelas: Kelas) => {
  console.log(`Mencoba mengambil ${kodeMk} kelas ${kelas} ke-${++AMBIL_COUNT}`);
  const response = await instance
    .post(
      'https://siakad.uns.ac.id/registrasi/input-krs/simpan-ke-krs',

      new URLSearchParams({
        kodeMk: kodeMk,
        kelas: kelas,
      })
    )
    .catch((error) => {
      console.debug(error);
      console.error(
        `Gagal mengambil kelas status-code: ${error.response.status}`
      );
      process.exit(1);
    });
  console.log(response.data);
  if (response.data.code == 200) {
    console.log('Kelas berhasil diambil');
    process.exit(0);
  }
};

// if run directly, run main
if (require.main === module) {
  main();
}

export default main;
