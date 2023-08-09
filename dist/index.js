"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ambil_makul_1 = __importDefault(require("./ambil-makul"));
const check_bulk_kuota_1 = __importDefault(require("./check-bulk-kuota"));
const check_kuota_1 = __importDefault(require("./check-kuota"));
const check_diambil_1 = __importDefault(require("./check-diambil"));
const kirim_pin_1 = __importDefault(require("./kirim-pin"));
const csrf_krs_1 = __importDefault(require("./csrf-krs"));
const dotenv_1 = __importDefault(require("dotenv"));
const prompts = require('prompts');
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // ask user which action to take
    const action = yield askAction();
    switch (action) {
        case 'ambil':
            (0, ambil_makul_1.default)();
            break;
        case 'bulkKuota':
            (0, check_bulk_kuota_1.default)();
            break;
        case 'kuota':
            (0, check_kuota_1.default)();
            break;
        case 'diambil':
            (0, check_diambil_1.default)();
            break;
        case 'kirimPin':
            (0, kirim_pin_1.default)();
            break;
        case 'ambilToken':
            (0, csrf_krs_1.default)();
            break;
        default:
            console.log('Invalid action');
            break;
    }
});
const askAction = () => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = yield prompts({
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
});
// if run directly, run main
if (require.main === module) {
    const envPath = process.argv.at(2) || '.env';
    dotenv_1.default.config({
        path: envPath,
        override: true,
    });
    console.log(`Menggunakan konfigurasi dari ${envPath}`);
    main();
}
