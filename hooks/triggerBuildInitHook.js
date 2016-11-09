"use strict";
const _ = require('lodash');
const _hookMap = require('./map');
function default_1(callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.initial] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error, stop) => {
        if (error) {
            return callback(error, stop);
        }
        let processHandle = processFactoryList.shift();
        if (!processHandle) {
            return callback(null, stop);
        }
        processHandle(stop, next);
    };
    next(null, false);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
