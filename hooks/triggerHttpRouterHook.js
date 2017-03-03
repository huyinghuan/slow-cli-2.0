"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
/**
*触发RouterHook, 可用于自定义路由操作
* 返回 true 停止其他hook，
* 返回 false 使用其他hook
*/
function default_1(router) {
    let queue = _hookMap.HookQueue[_hookMap.route.initial];
    if (!queue) {
        return false;
    }
    for (let i = 0, length = queue.length; i < length; i++) {
        if (queue[i].fn(router)) {
            return true;
        }
    }
    return false;
}
exports.default = default_1;
