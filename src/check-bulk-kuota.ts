import { createInstance } from './axios-instance';

// load env
import dotenv from 'dotenv';

const makulWhiteList = [
  'Business Intelligence',
  'Cyber Security',
  'Expert System',
  'Jaminan Mutu Perangkat Lunak',
  'Kapita Selekta Ilmu Komputer',
  'Komputasi Cloud',
  'Manajemen Proyek',
  'Metode Penelitian/KM',
  'Natural Language Processing',
  'Pengamanan Data Multimedia',
  'Proyek Perangkat Lunak',
  'Sistem Pendukung Keputusan',
  'Software Process',
  'Teknik Multimedia',
];

type JadwalPerDay = {
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU' | 'MINGGU';
  jadwal: JadwalMakul[];
};

type JadwalPerHour = {
  jam: number;
  jadwal: JadwalMakul[];
};

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
  const response = await instance
    .get('https://siakad.uns.ac.id/registrasi/input-krs/index')
    .catch((error) => {
      console.debug(error);
      console.error(
        `Failed to get daftar-makul status-code: ${error.response.status}`
      );
      process.exit(1);
    });
  if (response.data && !response.data.includes('daftar-makul')) {
    console.log('Login failed');
    return;
  }

  const regDaftarMakul = /<button name="daftar-makul"((.|\n)*?)<\/button>/g;

  const daftarMakul: string[] = response.data.match(regDaftarMakul);
  if (!daftarMakul) {
    console.log('Failed to get daftar-makul');
    return;
  }

  Promise.all(
    daftarMakul.map((makul: string) => {
      const regMakul = /data-text="(.*?)"/;
      const regSKS = /data-sks="(.*?)"/;
      const regSemester = /<p>Semester (.*?)<\/p>/;

      const [kodeMakul, namaMakul] = makul
        .match(regMakul)
        ?.at(1)
        ?.split(' - ') || [undefined, undefined];
      const sks = makul.match(regSKS)?.at(1) || undefined;
      const semester = makul.match(regSemester)?.at(1) || undefined;

      if (namaMakul && kodeMakul && sks && makulWhiteList.includes(namaMakul)) {
        return getJadwalMakul(kodeMakul);
      }

      return Promise.resolve(undefined);
    })
  ).then((values) => {
    const jadwalGroupByDay: JadwalPerDay[] = [];
    values.forEach((value: JadwalMakul[]) => {
      if (value) {
        value.forEach((jadwal) => {
          const jadwalDay = jadwalGroupByDay.find(
            (jadwalDay) => jadwalDay.hari === jadwal.nama_hari
          );
          if (jadwalDay) {
            jadwalDay.jadwal = [...jadwalDay.jadwal, jadwal];
          } else {
            jadwalGroupByDay.push({
              hari: jadwal.nama_hari,
              jadwal: value,
            });
          }
        });
      }
    });

    jadwalGroupByDay.forEach((jadwalDay) => {
      console.log(`Hari ${jadwalDay.hari}`);
      const JadwalPerHour: JadwalPerHour[] = [];

      jadwalDay.jadwal.forEach((jadwal) => {
        const jam = jadwal.jam.split(',').map((jam) => parseInt(jam));
        jam.forEach((jam) => {
          const jadwalPerHour = JadwalPerHour.find(
            (jadwalPerHour) => jadwalPerHour.jam === jam
          );
          if (jadwalPerHour) {
            jadwalPerHour.jadwal = [...jadwalPerHour.jadwal, jadwal];
          } else {
            JadwalPerHour.push({
              jam,
              jadwal: [jadwal],
            });
          }
        });
      });

      JadwalPerHour.sort((a, b) => a.jam - b.jam);
      JadwalPerHour.forEach((jadwalHour) => {
        process.stdout.write(`Jam ${jadwalHour.jam} `);
        jadwalHour.jadwal.forEach((jadwal) => {
          process.stdout.write(
            `${shorterNamaMakul(jadwal.nama)}(${jadwal.kelas}) Kuota:${
              parseInt(jadwal.kuota) - parseInt(jadwal.peserta)
            }\t`
          );
        });
        console.log();
      });
    });
  });
};

const shorterNamaMakul = (namaMakul: string) => {
  const reg = /(\w+)/g;
  const matches = namaMakul.match(reg);
  const result = matches?.map((match) => match.at(0)).join('') || namaMakul;
  return result.padEnd(4, ' ');
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
    console.log('Failed to get jadwal makul');
    return;
  }
  return response.data;
};

// if run directly, run main
if (require.main === module) {
  const envPath = process.argv.at(2) || '.env';
  dotenv.config({
    path: envPath,
    override: true,
  });
  console.log(`Menggunakan konfigurasi dari ${envPath}`);
  main();
}

export default main;
