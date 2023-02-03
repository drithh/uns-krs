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
//  ubah sesuai dengan kelas yang ingin diambil
const instance = (0, axios_instance_1.createInstance)();
const REQUEST_DELAY_MILLISECONDS = 500;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    setInterval(() => {
        getMataKuliahDiambil();
    }, REQUEST_DELAY_MILLISECONDS);
});
const getMataKuliahDiambil = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance.post('https://siakad.uns.ac.id/registrasi/input-krs/makul-diambil');
    if (response.status == 200 && response.data.length > 0) {
        let totalSks = 0;
        response.data.forEach((makul) => {
            totalSks += parseInt(makul.sks);
            console.log(`${makul.nama_mata_kuliah.padEnd(32, ' ')} Kelas: ${makul.kelas} SKS: ${makul.sks}`);
        });
        console.log(`Total SKS: ${totalSks}`);
        process.exit(0);
    }
});
// if run directly, run main
if (require.main === module) {
    main();
}
exports.default = main;