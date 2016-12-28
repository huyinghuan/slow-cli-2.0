"use strict";
const _fs = require("fs");
const _path = require("path");
/**
 * dir：目录
 * fileQueu： file数组
 * relativeDir： 相对路径， 主要用于后续构建使用
 * shouldInclude：是否需要进行文件处理
 * return Array<_allDefine.ProcessFile>
 */
const getAllFileInDir = function (dir, fileQueue, relativeDir, shouldeInclude) {
    fileQueue = fileQueue || [];
    if (!_fs.existsSync(dir)) {
        return [];
    }
    let files = _fs.readdirSync(dir);
    files.forEach((fileName) => {
        let filePath = _path.join(dir, fileName);
        //注入规则
        if (!shouldeInclude(fileName, filePath)) {
            return;
        }
        if (_fs.statSync(filePath).isDirectory()) {
            getAllFileInDir(filePath, fileQueue, _path.join(relativeDir, fileName), shouldeInclude);
        }
        else {
            fileQueue.push({ filePath: filePath, fileName: fileName, relativeDir: relativeDir });
        }
    });
    return fileQueue;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllFileInDir;
