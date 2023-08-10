import { AxiosInstance } from 'axios';
import { createInstance } from './axios-instance';
import dotenv from 'dotenv';

type MataKuliah = {
  id: string;
  nim: string;
  kode_mata_kuliah: string;
  nama_mata_kuliah: string;
  nama_prodi: string;
  jenjang: string;
  sks: string;
  kelas: string;
  tahun: string;
  semester: string;
};

//  ubah sesuai dengan kelas yang ingin diambil

const REQUEST_DELAY_MILLISECONDS: number = 500;

const main = async (envPath: string) => {
  dotenv.config({
    path: envPath,
    override: true,
  });
  const instance = createInstance(envPath);

  setInterval(() => {
    getMataKuliahDiambil(instance);
  }, REQUEST_DELAY_MILLISECONDS);
};

const getMataKuliahDiambil = async (instance: AxiosInstance) => {
  const response = await instance
    .post('https://siakad.uns.ac.id/registrasi/input-krs/makul-diambil')
    .catch((error) => {
      console.debug(error);
      console.error(
        `Gagal mengambil kelas status-code: ${error.response.status}`
      );
      process.exit(1);
    });
  if (response.status == 200 && response.data.length > 0) {
    let totalSks = 0;
    response.data.forEach((makul: MataKuliah) => {
      totalSks += parseInt(makul.sks);
      console.log(
        `${makul.nama_mata_kuliah.padEnd(32, ' ')} Kelas: ${makul.kelas} SKS: ${
          makul.sks
        }`
      );
    });
    console.log(`Total SKS: ${totalSks}`);
    process.exit(0);
  }
};

// if run directly, run main
if (require.main === module) {
  const envPath = process.argv.at(2) || '.env';

  console.log(`Menggunakan konfigurasi dari ${envPath}`);
  main(envPath);
}

export default main;
