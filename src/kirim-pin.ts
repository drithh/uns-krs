import { createInstance } from './axios-instance';
import dotenv from 'dotenv';
dotenv.config();

const instance = createInstance();
const REQUEST_DELAY_MILLISECONDS: number = 500;

// don't change this
let GET_TOKEN_COUNT = 0;
let KIRIM_PIN_COUNT = 0;
let IS_TOKEN_FOUND = false;

const main = async () => {
  if (process.env.PIN === undefined) {
    console.log('PIN belum diatur');
    return;
  }

  const pin = process.env.PIN;

  const requestCSRF = setInterval(async () => {
    console.log(`Mencoba mengambil token CSRF ke-${++GET_TOKEN_COUNT} kali`);
    const token = await getCSRFToken();
    if (token !== undefined && !IS_TOKEN_FOUND) {
      console.log(`Token didapatkan: ${token}`);
      IS_TOKEN_FOUND = true;
      clearInterval(requestCSRF);
      setInterval(() => {
        console.log(`Mencoba mengirim pin ke-${++KIRIM_PIN_COUNT} kali`);
        kirimPin(token, pin);
      }, REQUEST_DELAY_MILLISECONDS);
    }
  }, REQUEST_DELAY_MILLISECONDS);
};

const getCSRFToken = async () => {
  const response = await instance.get(
    'https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs'
  );
  if (response.status == 200 && response.data.length > 0) {
    const regCSRF = /<meta name="csrf-token" content="(.*)">/;
    const csrfToken = response.data.match(regCSRF)[1];
    return csrfToken;
  }
};

const kirimPin = async (token: string, pin: string) => {
  const response = await instance.post(
    'https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs',
    new URLSearchParams({
      _csrf: token,
      'MhsFix[pin_baru]': pin,
    }),
    { validateStatus: (status) => status === 302 }
  );
  if (response.status == 302) {
    console.log('PIN berhasil dikirim');
    process.exit(0);
  }
};

// if run directly, run main
if (require.main === module) {
  main();
}

export default main;
