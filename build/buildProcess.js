"use strict";
const _async = require("async");
const _hook = require("../hooks/index");
const _plugin = require("../plugin/index");
const getGitHash_1 = require("../lib/getGitHash");
const log_1 = require("../lib/log");
const executeProjectCompile_1 = require("./executeProjectCompile");
const config_filed_constant_1 = require("../config-filed-constant");
/**
 * 用于一次性编译
 * 编译完成后即推出进程
 * */
function default_1(prepareFn, finish, needLoadPlugin) {
    prepareFn();
    let __starTime = Date.now();
    //加载插件
    /* istanbul ignore if */
    if (needLoadPlugin != false) {
        _plugin.scanPlugins('build');
    }
    let queue = [];
    let gitHash = null;
    //build初始化HOOK
    queue.push((cb) => { _hook.triggerBuildInitHook(cb); });
    queue.push((stop, cb) => {
        getGitHash_1.default((error, hash) => {
            gitHash = hash;
            cb(error, stop);
        });
    });
    _async.waterfall(queue, (error, stop) => {
        if (error) {
            log_1.default.error(error);
            log_1.default.fail('build 初始化失败'.red);
            _hook.triggerBuildErrorHook(error);
            return;
        }
        if (stop) {
            return;
        }
        executeProjectCompile_1.default(config_filed_constant_1.default.getBuildConfig({ gitHash: gitHash }), (error) => {
            //编译成功
            if (!error) {
                console.log("build success".green);
                console.log(`编译用时: ${Date.now() - __starTime}ms`);
            }
            else {
                log_1.default.error(error);
                log_1.default.error("build fail".red);
                _hook.triggerBuildErrorHook(error);
            }
            finish(error);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
