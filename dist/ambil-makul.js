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
const axios_instance_1 = require("./axios-instance");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const REQUEST_DELAY_MILLISECONDS = 500;
const instance = (0, axios_instance_1.createInstance)();
// do not change this
let AMBIL_COUNT = 0;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.KELAS === undefined || process.env.KODE_MK === undefined) {
        console.error('Kelas atau Kode MK belum diatur');
        process.exit(1);
    }
    const kodeMk = process.env.KODE_MK;
    const kelas = process.env.KELAS;
    setInterval(() => {
        ambilKelas(kodeMk, kelas);
    }, REQUEST_DELAY_MILLISECONDS);
});
const ambilKelas = (kodeMk, kelas) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Mencoba mengambil ${kodeMk} kelas ${kelas} ke-${++AMBIL_COUNT}`);
    const response = yield instance
        .post('https://siakad.uns.ac.id/registrasi/input-krs/simpan-ke-krs', new URLSearchParams({
        kodeMk: kodeMk,
        kelas: kelas,
    }))
        .catch((error) => {
        console.debug(error);
        console.error(`Gagal mengambil kelas status-code: ${error.response.status}`);
        process.exit(1);
    });
    console.log(response.data);
    if (response.data.code == 200) {
        console.log('Kelas berhasil diambil');
        process.exit(0);
    }
});
// if run directly, run main
if (require.main === module) {
    main();
}
exports.default = main;
