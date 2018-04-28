"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
exports.registerPlugin = function (cli, options) {
    cli.registerHook('build:doCompile', (buildConfig, data, content) => {
        let inputFilePath = data.inputFilePath;
        if (!/((\.html)|(\.js)|(\.css))$/.test(inputFilePath)) {
            return content;
        }
        return new Promise((resolve, reject) => {
            _fs.readFile(inputFilePath, 'utf8', (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }, 0);
};
