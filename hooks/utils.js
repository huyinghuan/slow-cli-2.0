"use strict";
const _minimatch = require('minimatch');
const _ = require('lodash');
const _fs = require('fs-extra');
const executeCommand_1 = require('../lib/executeCommand');
const getAllFileInDir_1 = require('../lib/getAllFileInDir');
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
exports.executeCommand = executeCommand_1.default;
exports.getAllFileInDir = getAllFileInDir_1.default;
