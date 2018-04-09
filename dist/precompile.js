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
const _hooks = require("./hooks/index");
const _plugin = require("./plugin/index");
const getAllFileInProject_1 = require("./lib/getAllFileInProject");
const getGitHash_1 = require("./lib/getGitHash");
const config_filed_constant_1 = require("./config-filed-constant");
const log_1 = require("./lib/log");
const _fs = require("fs-extra");
const _path = require("path");
function precompileFile(buildConfig, fileItem, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let outpufFilePath = _path.join(buildConfig.outdir, fileItem.relativeDir, fileItem.fileName);
        _fs.ensureFileSync(outpufFilePath);
        content = yield _hooks.triggerPrecompile('include', buildConfig, fileItem, content);
        content = yield _hooks.triggerPrecompile('insert', buildConfig, fileItem, content);
        content = yield _hooks.triggerPrecompile('replace', buildConfig, fileItem, content);
        _fs.writeFileSync(outpufFilePath, content);
    });
}
function compile() {
    return __awaiter(this, void 0, void 0, function* () {
        _plugin.scanPlugins('precompile');
        //获取所有待编译文件
        let fileQueue = getAllFileInProject_1.default(false);
        let targetFileQueue = [];
        fileQueue.forEach((item) => {
            if (item.fileName.indexOf(".hbs") != -1) {
                targetFileQueue.push(item);
            }
        });
        log_1.default.info(`预编译文件:${targetFileQueue.length}个`);
        let __starTime = Date.now();
        let queue = [];
        let gitHash = getGitHash_1.default();
        let buildConfig = config_filed_constant_1.default.getBuildConfig({ gitHash: gitHash });
        //确保编译目录存在
        _fs.ensureDirSync(buildConfig.outdir);
        //清空编译目录
        _fs.emptyDirSync(buildConfig.outdir);
        let successCount = 0;
        for (let i = 0, len = targetFileQueue.length; i < len; i++) {
            let content = _fs.readFileSync(targetFileQueue[i].filePath, { encoding: "utf8" });
            try {
                yield precompileFile(buildConfig, targetFileQueue[i], content);
                successCount = successCount + 1;
            }
            catch (e) {
                console.log(e);
            }
        }
        log_1.default.info(`完成预编译文件:${successCount}个`);
    });
}
exports.compile = compile;
