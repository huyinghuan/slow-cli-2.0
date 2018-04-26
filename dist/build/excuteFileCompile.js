"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const _fs = require("fs-extra");
const compileFile_1 = require("./compileFile");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * 编译单个文件
 */
function default_1(buildConfig, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        let _workspace = config_filed_constant_1.default.getWorkspace();
        //确保编译目录存在
        _fs.ensureDirSync(buildConfig.outdir);
        _fs.emptyDirSync(buildConfig.outdir);
        let realPath = _path.join(_workspace, filepath);
        if (!_fs.existsSync(realPath) || realPath.indexOf(_workspace) == -1) {
            throw new Error('编译文件在项目中找不到');
        }
        let fileName = _path.parse(realPath).base;
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
        yield compileFile_1.default(buildConfig, fileData);
        //编译额外的文件
        let queue = [];
        /**/
        //处理额外的文件， 比如html中提取出来的js src， css link等文件合并
        buildConfig.__extra.forEach(fileData => {
            queue.push(compileFile_1.default(buildConfig, fileData));
        });
        yield Promise.all(queue);
        //删除标记文件
        buildConfig.__del.forEach((filepath) => {
            _fs.removeSync(filepath);
            log_1.default.info(`remove ${filepath}`);
        });
        console.log("编译完成");
    });
}
exports.default = default_1;
