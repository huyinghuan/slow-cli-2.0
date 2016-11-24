"use strict";
const _fs = require('fs');
exports.registerPlugin = function (cli, options) {
    cli.registerHook('build:doCompile', (data, content, cb) => {
        let inputFilePath = data.inputFilePath;
        if (!/((\.html)|(\.js)|(\.css))$/.test(inputFilePath)) {
            return cb(null, data, content);
        }
        _fs.readFile(inputFilePath, 'utf8', (err, result) => {
            cb(err, data, result);
        });
    }, 0);
};
