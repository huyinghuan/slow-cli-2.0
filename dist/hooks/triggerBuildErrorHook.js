"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _hookMap = require("./map");
function default_1(error) {
    let queue = _hookMap.HookQueue[_hookMap.build.error] || [];
    let processFactoryList = [];
    _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
    let next = (error) => {
        let errorProcess = processFactoryList.shift();
        if (!errorProcess) {
            return;
        }
        errorProcess(error, next);
    };
    next(error);
}
exports.default = default_1;
