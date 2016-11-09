"use strict";
const _hook = require('./hooks/index');
const _async = require('async');
function normalExecute() {
    let queue = [];
    //获取所有待编译文件
}
function default_1() {
    let queue = [];
    //加载插件
    queue.push((cb) => {
        _hook.scanPlugins('build', cb);
    });
    //build初始化HOOK
    queue.push((cb) => { _hook.triggerBuildInitHook(cb); });
    _async.waterfall(queue, (error, stop) => {
        if (error) {
            console.log(error);
            console.log('build 初始化失败'.red);
            _hook.triggerBuildErrorHooks(error);
            return;
        }
        if (stop) {
            return;
        }
        normalExecute();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
