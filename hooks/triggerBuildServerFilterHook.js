"use strict";
const _hookMap = require("./map");
function default_1(route) {
    let queue = _hookMap.HookQueue[_hookMap.build.serverFilter] || [];
    let processFactoryList = [];
    if (!queue) {
        return false;
    }
    for (let i = 0, length = queue.length; i < length; i++) {
        queue[i].fn(route);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
