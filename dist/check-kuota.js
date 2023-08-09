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
// load env
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const instance = (0, axios_instance_1.createInstance)();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.KODE_MK === undefined) {
        console.error('KODE_MK belum diatur');
        process.exit(1);
    }
    const kodeMakul = process.env.KODE_MK;
    // setInterval(async () => {
    const jadwalMakul = yield getJadwalMakul(kodeMakul);
    jadwalMakul.forEach((jadwal) => {
        console.log(`${jadwal.nama} ${jadwal.nama_hari.padEnd(6, ' ')} ${jadwal.jam.padEnd(7, ' ')} Kelas:${jadwal.kelas} Kuota:${jadwal.kuota} Peserta:${jadwal.peserta}`);
    });
    // }, 5000);
});
const getJadwalMakul = (kodeMakul) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance
        .post('https://siakad.uns.ac.id/registrasi/input-krs/jadwal-makul', new URLSearchParams({
        kodeMk: kodeMakul,
    }), {
        validateStatus: (status) => status >= 200 && status < 303,
    })
        .catch((error) => {
        console.debug(error);
        console.error(`Failed to get jadwal-makul status-code: ${error.response.status}`);
        process.exit(1);
    });
    if (response.data.length === 0) {
        console.log('Kode makul tidak ditemukan');
        console.log(response);
        process.exit(1);
    }
    return response.data;
});
// if run directly, run main
if (require.main === module) {
    main();
}
exports.default = main;
