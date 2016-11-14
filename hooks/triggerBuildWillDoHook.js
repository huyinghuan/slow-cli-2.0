"use strict";
const _ = require('lodash');
const _hookMap = require('./map');
function default_1(buildConfig, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.willBuild] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, buildConfig) => {
        if (error) {
            return callback(error, buildConfig);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, buildConfig);
        }
        processHandle(buildConfig, next);
    };
    next(null, false);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
