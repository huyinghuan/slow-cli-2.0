"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _hookMap = require("./map");
function default_1(buildConfig, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.doNothing] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, data) => {
        if (error) {
            return callback(error, data);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, data);
        }
        processHandle(buildConfig, data, next);
    };
    next(null, data);
}
exports.default = default_1;
