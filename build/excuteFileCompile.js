"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const _fs = require("fs-extra");
const _async = require("async");
const compileFile_1 = require("./compileFile");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * 编译单个文件
 */
function default_1(buildConfig, filepath, finish) {
    let _workspace = config_filed_constant_1.default.getWorkspace();
    //确保编译目录存在
    _fs.ensureDirSync(buildConfig.outdir);
    _fs.emptyDirSync(buildConfig.outdir);
    let realPath = _path.join(_workspace, filepath);
    if (!_fs.existsSync(realPath) || realPath.indexOf(_workspace) == -1) {
        return finish(new Error('编译文件在项目中找不到'));
    }
    let fileName = realPath.split(_path.sep).pop();
    let fileData = {
        inputFilePath: realPath,
        outputFilePath: _path.join(buildConfig.outdir, filepath),
        outdir: buildConfig.outdir,
        outRelativeDir: buildConfig.outRelativeDir,
        inputFileRelativePath: filepath,
        outputFileRelativePath: _path.join(buildConfig.outRelativeDir, filepath),
        fileName: fileName,
        appendFile: false,
        ignore: false
    };
    //compileFile(buildConfig, fileData, finish)
    let queue = [];
    queue.push((next) => {
        compileFile_1.default(buildConfig, fileData, (error) => {
            next(error);
        });
    });
    //编译额外的文件
    queue.push((next) => {
        _async.map(buildConfig.__extra, (fileData, cb) => {
            compileFile_1.default(buildConfig, fileData, cb);
        }, (error) => {
            next(error);
        });
    });
    //删除标记文件
    queue.push((next) => {
        try {
            buildConfig.__del.forEach((filepath) => {
                _fs.removeSync(filepath);
                log_1.default.info(`remove ${filepath}`);
            });
            next(null);
        }
        catch (e) {
            next(e);
        }
    });
    _async.waterfall(queue, (error) => {
        if (error) {
            finish(error);
        }
        else {
            console.log("编译完成");
            finish(null);
        }
    });
}
exports.default = default_1;
