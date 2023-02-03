import axios from 'axios';
import https from 'https';
import { constants } from 'crypto';

export const createInstance = () => {
  if (process.env.PHPSESSID === undefined || process.env._csrf === undefined) {
    throw new Error('PHPSESSID and _csrf must be defined in .env');
  }
  const cookie = `PHPSESSID=${process.env.PHPSESSID}; _csrf=${process.env._csrf}`;
  return axios.create({
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'max-age=0',
      'sec-ch-ua': '"Not_A Brand";v="99", "Brave";v="109", "Chromium";v="109"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'sec-gpc': '1',
      'upgrade-insecure-requests': '1',
      cookie: cookie,
      'X-CSRF-Token':
        '345MN_dUCa1gk4eZZKz_V_-z3co0OiYRedBupulw4kSIx2FDhw0_2zbyys82xcYuoISJ83UMRV4InBfepTizBQ==',
      'X-Requested-With': 'XMLHttpRequest',
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://siakad.uns.ac.id',
      referer: 'https://siakad.uns.ac.id/registrasi/input-krs/index',
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      secureOptions:
        constants.SSL_OP_LEGACY_SERVER_CONNECT | constants.SSL_OP_NO_TLSv1_1,
    }),
  });
};
