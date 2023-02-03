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
const makulWhiteList = [
    'Business Intelligence',
    'Cyber Security',
    'Expert System',
    'Jaminan Mutu Perangkat Lunak',
    'Kapita Selekta Ilmu Komputer',
    'Komputasi Cloud',
    'Manajemen Proyek',
    'Metode Penelitian/KM',
    'Natural Language Processing',
    'Pengamanan Data Multimedia',
    'Proyek Perangkat Lunak',
    'Sistem Pendukung Keputusan',
    'Software Process',
    'Teknik Multimedia',
];
const instance = (0, axios_instance_1.createInstance)();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance
        .get('https://siakad.uns.ac.id/registrasi/input-krs/index')
        .catch((err) => {
        throw err;
    });
    if (response.data && !response.data.includes('daftar-makul')) {
        console.log('Login failed');
        return;
    }
    const regDaftarMakul = /<button name="daftar-makul"((.|\n)*?)<\/button>/g;
    const daftarMakul = response.data.match(regDaftarMakul);
    if (!daftarMakul) {
        console.log('Failed to get daftar-makul');
        return;
    }
    Promise.all(daftarMakul.map((makul) => {
        var _a, _b, _c, _d;
        const regMakul = /data-text="(.*?)"/;
        const regSKS = /data-sks="(.*?)"/;
        const regSemester = /<p>Semester (.*?)<\/p>/;
        const [kodeMakul, namaMakul] = ((_b = (_a = makul
            .match(regMakul)) === null || _a === void 0 ? void 0 : _a.at(1)) === null || _b === void 0 ? void 0 : _b.split(' - ')) || [undefined, undefined];
        const sks = ((_c = makul.match(regSKS)) === null || _c === void 0 ? void 0 : _c.at(1)) || undefined;
        const semester = ((_d = makul.match(regSemester)) === null || _d === void 0 ? void 0 : _d.at(1)) || undefined;
        if (namaMakul && kodeMakul && sks && makulWhiteList.includes(namaMakul)) {
            return getJadwalMakul(kodeMakul);
        }
        return Promise.resolve(undefined);
    })).then((values) => {
        const jadwalGroupByDay = [];
        values.forEach((value) => {
            if (value) {
                value.forEach((jadwal) => {
                    const jadwalDay = jadwalGroupByDay.find((jadwalDay) => jadwalDay.hari === jadwal.nama_hari);
                    if (jadwalDay) {
                        jadwalDay.jadwal = [...jadwalDay.jadwal, jadwal];
                    }
                    else {
                        jadwalGroupByDay.push({
                            hari: jadwal.nama_hari,
                            jadwal: value,
                        });
                    }
                });
            }
        });
        jadwalGroupByDay.forEach((jadwalDay) => {
            console.log(`Hari ${jadwalDay.hari}`);
            const JadwalPerHour = [];
            jadwalDay.jadwal.forEach((jadwal) => {
                const jam = jadwal.jam.split(',').map((jam) => parseInt(jam));
                jam.forEach((jam) => {
                    const jadwalPerHour = JadwalPerHour.find((jadwalPerHour) => jadwalPerHour.jam === jam);
                    if (jadwalPerHour) {
                        jadwalPerHour.jadwal = [...jadwalPerHour.jadwal, jadwal];
                    }
                    else {
                        JadwalPerHour.push({
                            jam,
                            jadwal: [jadwal],
                        });
                    }
                });
            });
            JadwalPerHour.sort((a, b) => a.jam - b.jam);
            JadwalPerHour.forEach((jadwalHour) => {
                process.stdout.write(`Jam ${jadwalHour.jam} `);
                jadwalHour.jadwal.forEach((jadwal) => {
                    process.stdout.write(`${shorterNamaMakul(jadwal.nama)}(${jadwal.kelas}) Kuota:${parseInt(jadwal.kuota) - parseInt(jadwal.peserta)}\t`);
                });
                console.log();
            });
        });
    });
});
const shorterNamaMakul = (namaMakul) => {
    const reg = /(\w+)/g;
    const matches = namaMakul.match(reg);
    const result = (matches === null || matches === void 0 ? void 0 : matches.map((match) => match.at(0)).join('')) || namaMakul;
    return result.padEnd(4, ' ');
};
const getJadwalMakul = (kodeMakul) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance
        .post('https://siakad.uns.ac.id/registrasi/input-krs/jadwal-makul', new URLSearchParams({
        kodeMk: kodeMakul,
    }))
        .catch((err) => {
        throw err;
    });
    if (response.data.length === 0) {
        console.log('Failed to get jadwal makul');
        return;
    }
    return response.data;
});
// if run directly, run main
if (require.main === module) {
    main();
}
exports.default = main;
