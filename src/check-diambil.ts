import { createInstance } from './axios-instance';
import dotenv from 'dotenv';
dotenv.config();

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

const instance = createInstance();
const REQUEST_DELAY_MILLISECONDS: number = 500;

const main = async () => {
  setInterval(() => {
    getMataKuliahDiambil();
  }, REQUEST_DELAY_MILLISECONDS);
};

const getMataKuliahDiambil = async () => {
  const response = await instance.post(
    'https://siakad.uns.ac.id/registrasi/input-krs/makul-diambil'
  );
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
  main();
}

export default main;
