"use strict";
const _fs = require('fs');
const _path = require('path');
const getAllFileInDir = function (dir, fileQueue, shouldeInclude) {
    fileQueue = fileQueue || [];
    let files = _fs.readdirSync(dir);
    files.forEach((fileName) => {
        let filePath = _path.join(dir, fileName);
        //注入规则
        if (!shouldeInclude(fileName, filePath)) {
            return;
        }
        if (_fs.statSync(filePath).isDirectory()) {
            getAllFileInDir(filePath, fileQueue, shouldeInclude);
        }
        else {
            fileQueue.push(filePath);
        }
    });
    return fileQueue;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllFileInDir;
