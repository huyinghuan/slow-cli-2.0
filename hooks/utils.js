"use strict";
const _ = require("lodash");
const _fs = require("fs-extra");
const executeCommand_1 = require("../lib/executeCommand");
const getAllFileInProject_1 = require("../lib/getAllFileInProject");
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
exports.getAllFileInProject = getAllFileInProject_1.default;
