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
const instance = (0, axios_instance_1.createInstance)();
const REQUEST_DELAY_MILLISECONDS = 500;
// don't change this
let GET_TOKEN_COUNT = 0;
let KIRIM_PIN_COUNT = 0;
let IS_TOKEN_FOUND = false;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.PIN === undefined) {
        console.error('PIN belum diatur');
        process.exit(1);
    }
    const pin = process.env.PIN;
    const requestCSRF = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Mencoba mengambil token CSRF ke-${++GET_TOKEN_COUNT} kali`);
        const token = yield getCSRFToken();
        if (token !== undefined && !IS_TOKEN_FOUND) {
            console.log(`Token didapatkan: ${token}`);
            IS_TOKEN_FOUND = true;
            clearInterval(requestCSRF);
            setInterval(() => {
                console.log(`Mencoba mengirim pin ke-${++KIRIM_PIN_COUNT} kali`);
                kirimPin(token, pin);
            }, REQUEST_DELAY_MILLISECONDS);
        }
    }), REQUEST_DELAY_MILLISECONDS);
});
const getCSRFToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance
        .get('https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs', {
        validateStatus: (status) => status >= 200 && status < 303,
    })
        .catch((error) => {
        console.debug(error);
        console.error(`Gagal mengambil token CSRF status-code: ${error.response.status}`);
        process.exit(1);
    });
    if (response.status == 200 && response.data.length > 0) {
        const regCSRF = /<meta name="csrf-token" content="(.*)">/;
        const csrfToken = response.data.match(regCSRF)[1];
        return csrfToken;
    }
    if (response.status == 302) {
        console.log('PIN sudah dikirim sebelumnya');
        console.log(response.headers['x-redirect']);
        process.exit(0);
    }
});
const kirimPin = (token, pin) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield instance
        .post('https://siakad.uns.ac.id/registrasi/biodata/cek-pin-krs', new URLSearchParams({
        _csrf: token,
        'MhsFix[pin_baru]': pin,
    }), { validateStatus: (status) => status === 302 })
        .catch((error) => {
        console.debug(error);
        console.error(`Gagal mengirim PIN status-code: ${error.response.status}`);
        process.exit(1);
    });
    if (response !== undefined && response.status === 302) {
        console.log('PIN berhasil dikirim');
        console.log(response.headers['x-redirect']);
        process.exit(0);
    }
});
// if run directly, run main
if (require.main === module) {
    main();
}
exports.default = main;
