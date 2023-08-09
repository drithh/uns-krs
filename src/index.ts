import ambilMakul from './ambil-makul';
import checkBulkKuota from './check-bulk-kuota';
import checkKuota from './check-kuota';
import checkDiambil from './check-diambil';
import kirimPIN from './kirim-pin';
import csrfKRS from './csrf-krs';
import dotenv from 'dotenv';
const prompts = require('prompts');

const main = async () => {
  // ask user which action to take
  const action = await askAction();
  switch (action) {
    case 'ambil':
      ambilMakul();
      break;
    case 'bulkKuota':
      checkBulkKuota();
      break;
    case 'kuota':
      checkKuota();
      break;
    case 'diambil':
      checkDiambil();
      break;
    case 'kirimPin':
      kirimPIN();
      break;
    case 'ambilToken':
      csrfKRS();
      break;
    default:
      console.log('Invalid action');
      break;
  }
};

const askAction = async () => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Pilih aksi',
    choices: [
      { title: 'Ambil Mata Kuliah', value: 'ambil' },
      { title: 'Cek Kuota', value: 'kuota' },
      { title: 'Cek Bulk Kuota (Not Recommended)', value: 'bulkKuota' },
      { title: 'Cek Diambil', value: 'diambil' },
      { title: 'Kirim PIN', value: 'kirimPin' },
      { title: 'Ambil token untuk KRS', value: 'ambilToken' },
    ],
  });
  return action;
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
