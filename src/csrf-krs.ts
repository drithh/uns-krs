import { AxiosInstance } from 'axios';
import { createInstance } from './axios-instance';
import dotenv from 'dotenv';

const REQUEST_DELAY_MILLISECONDS: number = 500;

// don't change this
let GET_TOKEN_COUNT = 0;

const main = async (envPath: string) => {
  dotenv.config({
    path: envPath,
    override: true,
    debug: true,
  });
  const instance = createInstance(envPath);

  const requestCSRF = setInterval(() => {
    console.log(`Mencoba mengambil token CSRF ke-${++GET_TOKEN_COUNT} kali`);
    getCSRFToken(instance);
  }, REQUEST_DELAY_MILLISECONDS);
};

const getCSRFToken = async (instance: AxiosInstance) => {
  const response = await instance
    .get('https://siakad.uns.ac.id/registrasi/input-krs/index')
    .catch((error) => {
      console.debug(error);
      console.error(
        `Gagal mengambil token CSRF status-code: ${error.response.status}`
      );
      process.exit(1);
    });
  if (response.status == 200 && response.data.length > 0) {
    const regCSRF = /<meta name="csrf-token" content="(.*)">/;
    const csrfToken = response.data.match(regCSRF)[1];

    const regNama = /<span class="hidden-xs pl15">(.*)<\/span>/;
    const nama = response.data.match(regNama)[1];
    console.log(`Token CSRF didapatkan: ${csrfToken} untuk ${nama}`);
    console.log(
      `Silahkan copy token di atas dan paste ke file .env sebagai value X_CSRF_TOKEN`
    );
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
