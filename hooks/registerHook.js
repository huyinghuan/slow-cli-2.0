"use strict";
const _ = require("lodash");
const _hookMap = require("./map");
//排序 升序 越小先执行
function sortHook(hookName) {
    _hookMap.HookQueue[hookName] = _.orderBy(_hookMap.HookQueue[hookName], 'priority');
}
/**
 * 注册hooks
 * priority  优先级
 */
function default_1(hookName, callback, priority) {
    priority = ~~priority ? ~~priority : 1;
    if (!_hookMap.HookQueue[hookName]) {
        _hookMap.HookQueue[hookName] = [];
    }
    //加入hook队列
    _hookMap.HookQueue[hookName].push({ fn: callback, priority: priority });
    //排序
    sortHook(hookName);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
