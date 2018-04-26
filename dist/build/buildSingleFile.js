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
const config_filed_constant_1 = require("../config-filed-constant");
const getGitHash_1 = require("../lib/getGitHash");
const excuteFileCompile_1 = require("./excuteFileCompile");
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
function default_1(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        //加载插件
        _plugin.scanPlugins('build');
        let stop = yield _hook.triggerBuild("initial");
        if (stop) {
            return;
        }
        let gitHash = getGitHash_1.default();
        let buildConfig = config_filed_constant_1.default.getBuildConfig({
            gitHash: gitHash,
            __extra: [],
            __del: [] //编译完成后需要删除掉冗余文件
        });
        yield excuteFileCompile_1.default(buildConfig, filepath);
    });
}
exports.default = default_1;
