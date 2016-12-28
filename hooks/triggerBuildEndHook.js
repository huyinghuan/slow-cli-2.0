"use strict";
const _ = require("lodash");
const _hookMap = require("./map");
function default_1(buildConfig, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.endBuild] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error) => {
        if (error) {
            return callback(error);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null);
        }
        processHandle(buildConfig, next);
    };
    next(null);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
