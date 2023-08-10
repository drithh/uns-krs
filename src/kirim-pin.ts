import { AxiosInstance } from 'axios';
import { createInstance } from './axios-instance';
import dotenv from 'dotenv';

const REQUEST_DELAY_MILLISECONDS: number = 500;

// don't change this
let GET_TOKEN_COUNT = 0;
let KIRIM_PIN_COUNT = 0;
let IS_TOKEN_FOUND = false;

const main = async (envPath: string) => {
  dotenv.config({
    path: envPath,
    override: true,
    debug: true,
  });
  const instance = createInstance(envPath);

  if (process.env.PIN === undefined) {
    console.error('PIN belum diatur');
    process.exit(1);
  }

  const pin = process.env.PIN;

  const requestCSRF = setInterval(async () => {
    console.log(`Mencoba mengambil token CSRF ke-${++GET_TOKEN_COUNT} kali`);
    const token = await getCSRFToken(instance);
    if (token !== undefined && !IS_TOKEN_FOUND) {
      console.log(`Token didapatkan: ${token}`);
      IS_TOKEN_FOUND = true;
      clearInterval(requestCSRF);
      setInterval(() => {
        console.log(`Mencoba mengirim pin ke-${++KIRIM_PIN_COUNT} kali`);
        kirimPin(token, pin, instance);
      }, REQUEST_DELAY_MILLISECONDS);
    }
  }, REQUEST_DELAY_MILLISECONDS);
};

const getCSRFToken = async (instance: AxiosInstance) => {
  const response = await instance
    .get('https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs', {
      validateStatus: (status) => status >= 200 && status < 303,
    })
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
    return csrfToken;
  }
  if (response.status == 302) {
    console.log('PIN sudah dikirim sebelumnya');
    console.log(response.headers['x-redirect']);
    process.exit(0);
  }
};

const kirimPin = async (
  token: string,
  pin: string,
  instance: AxiosInstance
) => {
  const response = await instance
    .post(
      'https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs',
      new URLSearchParams({
        _csrf: token,
        'MhsFix[pin_baru]': pin,
      }),
      { validateStatus: (status) => status === 302 }
    )
    .catch((error) => {
      console.debug(error);
      console.error(`Gagal mengirim PIN status-code: ${error.response.status}`);
      process.exit(1);
    });
  if (response !== undefined && response.status === 302) {
    console.log('PIN berhasil dikirim');
    console.log(response.headers['x-redirect']);
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
