"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs-extra");
const _async = require("async");
const _path = require("path");
const compileFile_1 = require("./compileFile");
/**
 * 编译文件队列 */
function default_1(buildConfig, fileQueue, next) {
    //确保编译目录存在
    _fs.ensureDirSync(buildConfig.outdir);
    //清空编译目录
    _fs.emptyDirSync(buildConfig.outdir);
    //异步编译
    _async.map(fileQueue, (fileItem, cb) => {
        let data = {
            inputFilePath: fileItem.filePath,
            outputFilePath: _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName),
            outdir: buildConfig.outdir,
            outRelativeDir: buildConfig.outRelativeDir,
            inputFileRelativePath: _path.join(fileItem.relativeDir, fileItem.fileName),
            outputFileRelativePath: _path.join(buildConfig.outRelativeDir, fileItem.relativeDir, fileItem.fileName),
            fileName: fileItem.fileName,
            appendFile: false,
            ignore: false
        };
        compileFile_1.default(buildConfig, data, cb);
    }, (error, result) => {
        next(error, buildConfig);
    });
}
exports.default = default_1;
