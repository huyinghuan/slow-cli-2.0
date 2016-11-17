"use strict";
const _minimatch = require('minimatch');
const _ = require('lodash');
const _fs = require('fs-extra');
const _child = require('child_process');
const log_1 = require('../lib/log');
/**
 * 文件后缀匹配
 */
function match(path, express) {
    return _minimatch(path, express, { matchBase: true });
}
exports.match = match;
/**
 *lodash.extend
 */
function extend() {
    return _.extend.apply(null, arguments);
}
exports.extend = extend;
function outputFile() {
    return _fs.outputFile.apply(null, arguments);
}
exports.outputFile = outputFile;
function outputFileSync() {
    return _fs.outputFileSync.apply(null, arguments);
}
exports.outputFileSync = outputFileSync;
function ensureFileSync() {
    return _fs.ensureFileSync.apply(null, arguments);
}
exports.ensureFileSync = ensureFileSync;
//执行命令
function executeCommand(command, cb) {
    let options = {
        env: process.env,
        maxBuffer: 20 * 1024 * 1024
    };
    let stdout = '';
    let stderr = '';
    let exec = _child.exec(command, options);
    exec.on('close', (code) => {
        log_1.default.info(stdout);
        log_1.default.error(stderr);
        if (code != 0) {
            log_1.default.error(`执行命令出错 -> ${command}`.red);
            return cb(`执行命令出错 -> ${command}`);
        }
        cb(null);
    });
    exec.stdout.on('data', (message) => {
        console.log(message);
        stdout += message;
    });
    exec.stderr.on('data', (message) => {
        console.log(message);
        stdout += message;
    });
}
exports.executeCommand = executeCommand;
