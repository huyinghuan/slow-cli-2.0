"use strict";
const _crypto = require('crypto');
const _fs = require('fs');
function default_1(filename, cb) {
    let hash = _crypto.createHash('sha256');
    let input = _fs.createReadStream(filename);
    input.on('readable', () => {
        var data = input.read();
        if (data)
            hash.update(data);
        else {
            cb(null, hash.digest('hex'));
        }
    });
    input.on('error', (error) => {
        cb(error);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
