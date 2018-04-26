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
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
const getGitHash_1 = require("../lib/getGitHash");
const executeProjectCompile_1 = require("./executeProjectCompile");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * 用于一次性编译
 * 编译完成后即推出进程
 * */
function default_1(needLoadPlugin) {
    return __awaiter(this, void 0, void 0, function* () {
        //加载插件
        /* istanbul ignore if */
        if (needLoadPlugin != false) {
            _plugin.scanPlugins('build');
        }
        let __starTime = Date.now();
        let queue = [];
        let gitHash = getGitHash_1.default();
        let stop = yield _hook.triggerBuild("initial");
        if (stop) {
            return;
        }
        yield executeProjectCompile_1.default(config_filed_constant_1.default.getBuildConfig({ gitHash: gitHash }));
        console.log("build success".green);
        console.log(`编译用时: ${Date.now() - __starTime}ms`);
    });
}
exports.default = default_1;
