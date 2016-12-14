"use strict";
const _ = require('lodash');
const _hookMap = require('./map');
function default_1(buildConfig, data, content, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.didCompile] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, data, content) => {
        if (error) {
            return callback(error, data, content);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, data, content);
        }
        processHandle(buildConfig, data, content, next);
    };
    next(null, data, content);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
