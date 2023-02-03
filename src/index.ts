import ambilMakul from './ambil-makul';
import checkKuota from './check-kuota';
import checkDiambil from './check-diambil';
const prompts = require('prompts');

const main = async () => {
  // ask user which action to take
  const action = await askAction();
  switch (action) {
    case 'ambil':
      ambilMakul();
      break;
    case 'kuota':
      checkKuota();
      break;
    case 'diambil':
      checkDiambil();
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
      { title: 'Ambil', value: 'ambil' },
      { title: 'Cek Kuota', value: 'kuota' },
      { title: 'Cek Diambil', value: 'diambil' },
    ],
  });
  return action;
};

main();
