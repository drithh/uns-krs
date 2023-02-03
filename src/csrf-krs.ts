import { createInstance } from './axios-instance';
import dotenv from 'dotenv';
dotenv.config();

const instance = createInstance();
const REQUEST_DELAY_MILLISECONDS: number = 500;

// don't change this
let GET_TOKEN_COUNT = 0;

const main = async () => {
  const requestCSRF = setInterval(() => {
    console.log(`Mencoba mengambil token CSRF ke-${++GET_TOKEN_COUNT} kali`);
    getCSRFToken();
  }, REQUEST_DELAY_MILLISECONDS);
};

const getCSRFToken = async () => {
  const response = await instance
    .get('https://siakad.uns.ac.id/registrasi/input-krs/index')
    .catch((error) => {
      console.debug(error);
      console.error('Gagal mengambil token CSRF');
      process.exit(1);
    });
  if (response.status == 200 && response.data.length > 0) {
    const regCSRF = /<meta name="csrf-token" content="(.*)">/;
    const csrfToken = response.data.match(regCSRF)[1];
    console.log(`Token CSRF didapatkan: ${csrfToken}`);
    console.log(
      `Silahkan copy token di atas dan paste ke file .env sebagai value X_CSRF_TOKEN`
    );
    process.exit(0);
  }
};

// if run directly, run main
if (require.main === module) {
  main();
}

export default main;
