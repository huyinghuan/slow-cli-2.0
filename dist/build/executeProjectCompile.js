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
const getAllFileInProject_1 = require("../lib/getAllFileInProject");
const _hook = require("../hooks/index");
const compileFileQueue_1 = require("./compileFileQueue");
const compileFile_1 = require("./compileFile");
const log_1 = require("../lib/log");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * @params: buildConfig <Object> 编译参数
*/
function default_1(buildConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        //额外需要编译的文件
        buildConfig.__extra = [];
        //编译完成后需要删除掉冗余文件
        buildConfig.__del = [];
        //将要编译了
        yield _hook.triggerBuild("willBuild", buildConfig);
        //处理文件队列 （doCompile，didCompile，doNothing) in there
        config_filed_constant_1.default.setBuildParams(buildConfig);
        //获取所有待编译文件
        let fileQueue = getAllFileInProject_1.default(false);
        //编译文件
        compileFileQueue_1.default(buildConfig, fileQueue);
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
        yield _hook.triggerBuild('end', buildConfig);
    });
}
exports.default = default_1;
