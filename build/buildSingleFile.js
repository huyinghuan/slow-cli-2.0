"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const getGitHash_1 = require("../lib/getGitHash");
const excuteFileCompile_1 = require("./excuteFileCompile");
const _async = require("async");
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
function default_1(prepareFn, filepath, finish) {
    prepareFn();
    //加载插件
    _plugin.scanPlugins('build');
    let queue = [];
    queue.push((next) => {
        _hook.triggerBuildInitHook((error, stop) => { next(error); });
    });
    queue.push((next) => {
        getGitHash_1.default(next);
    });
    queue.push((gitHash, next) => {
        let buildConfig = config_filed_constant_1.default.getBuildConfig({
            gitHash: gitHash,
            __extra: [],
            __del: [] //编译完成后需要删除掉冗余文件
        });
        excuteFileCompile_1.default(buildConfig, filepath, next);
    });
    _async.waterfall(queue, finish);
}
exports.default = default_1;
