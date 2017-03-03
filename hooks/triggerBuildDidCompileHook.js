"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _hookMap = require("./map");
function default_1(buildConfig, data, content, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.didCompile] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, content) => {
        if (error) {
            return callback(error, content);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, content);
        }
        processHandle(buildConfig, data, content, next);
    };
    next(null, content);
}
exports.default = default_1;
