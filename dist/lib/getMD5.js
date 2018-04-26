"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _crypto = require("crypto");
const _fs = require("fs");
function default_1(filename) {
    return new Promise((resolve, reject) => {
        let hash = _crypto.createHash('md5');
        let input = _fs.createReadStream(filename);
        input.on('data', (data) => {
            hash.update(data);
        });
        input.on('end', () => {
            resolve(hash.digest('hex'));
        });
        input.on('error', (error) => {
            reject(error);
        });
    });
}
exports.default = default_1;
