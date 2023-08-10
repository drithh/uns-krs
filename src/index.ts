import ambilMakul from './ambil-makul';
import checkBulkKuota from './check-bulk-kuota';
import checkKuota from './check-kuota';
import checkDiambil from './check-diambil';
import kirimPIN from './kirim-pin';
import csrfKRS from './csrf-krs';
import dotenv from 'dotenv';
const prompts = require('prompts');

const main = async (envPath: string) => {
  dotenv.config({
    path: envPath,
    override: true,
  });
  // ask user which action to take
  const action = await askAction();
  switch (action) {
    case 'ambil':
      ambilMakul(envPath);
      break;
    case 'bulkKuota':
      checkBulkKuota(envPath);
      break;
    case 'kuota':
      checkKuota(envPath);
      break;
    case 'diambil':
      checkDiambil(envPath);
      break;
    case 'kirimPin':
      kirimPIN(envPath);
      break;
    case 'ambilToken':
      csrfKRS(envPath);
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

  console.log(`Menggunakan konfigurasi dari ${envPath}`);
  main(envPath);
}
