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
const _fs = require("fs-extra");
const _path = require("path");
const compileFile_1 = require("./compileFile");
/**
 * 编译文件队列 */
function default_1(buildConfig, fileQueue) {
    return __awaiter(this, void 0, void 0, function* () {
        //确保编译目录存在
        _fs.ensureDirSync(buildConfig.outdir);
        //清空编译目录
        _fs.emptyDirSync(buildConfig.outdir);
        let queue = [];
        fileQueue.forEach((fileItem) => {
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
            queue.push(compileFile_1.default(buildConfig, data));
        });
        yield Promise.all(queue);
        return buildConfig;
    });
}
exports.default = default_1;
