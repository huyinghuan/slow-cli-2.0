"use strict";
const _ = require('lodash');
const _hookMap = require('./map');
function default_1(buildConfig, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.doCompile] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, content) => {
        if (error) {
            return callback(error, content);
        }
        if (content) {
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, content);
        }
        processHandle(buildConfig, data, content, next);
    };
    next(null, null);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
