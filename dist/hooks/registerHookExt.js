"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
function default_1(extName, fn) {
    extName = extName.split(':')[0];
    if (!_hookMap.HookExtQueue[extName]) {
        _hookMap.HookExtQueue[extName] = [];
    }
    //加入hook队列
    _hookMap.HookExtQueue[extName].push(fn);
}
exports.default = default_1;
