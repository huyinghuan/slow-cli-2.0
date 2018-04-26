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
const _hook = require("../hooks/index");
const log_1 = require("../lib/log");
/**
 * 编译单个文件
 * 触发发各类hook，doCompile, didCompile*/
function default_1(buildConfig, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = [];
        let content = yield _hook.triggerBuild('doCompile', buildConfig, data);
        //内容加工
        content = yield _hook.triggerBuild('didCompile', buildConfig, data, content);
        /**
         * 已经编译完成，写入文件。
         * 如果没有任何内容，则跳过, 如果ignore为true也跳过
        */
        if (!content || data.ignore) {
            return;
        }
        let outputFilePathArr = [].concat(data.outputFilePath);
        let appendFile = data.appendFile;
        outputFilePathArr.forEach((outputFilePath) => {
            if (!appendFile) {
                return _fs.outputFileSync(outputFilePath, content);
            }
            log_1.default.info(`append ${data.inputFileRelativePath} to ${outputFilePath.replace(data.outdir, "")}`);
            if (!_fs.existsSync(outputFilePath)) {
                return _fs.outputFileSync(outputFilePath, content);
            }
            if (data.appendFilePrefix) {
                content = data.appendFilePrefix + content;
            }
            _fs.appendFileSync(outputFilePath, content, { encoding: 'utf8' });
        });
        /* 未完成编译， 触发hook， hook如果已经写入文件，那么不做任何事情， 如果ignore为true也不做任何事情
         如果没有写入文件， 那么默认copy[调用默认hook(plugin/default-plugin/build/*)]文件。*/
        yield _hook.triggerBuild('doNothing', buildConfig, data);
        if (!data.hasProcess) {
            log_1.default.info(`忽略文件: ${data.inputFilePath}`);
        }
    });
}
exports.default = default_1;
