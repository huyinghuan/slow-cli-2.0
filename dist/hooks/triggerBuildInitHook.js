"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _async = require("async");
const _hookMap = require("./map");
function default_1(callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.initial] || [];
    let isStop = false;
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(isStop, (error, flag) => {
            isStop = flag;
            next(error, null);
        });
    }, (error) => {
        callback(error, isStop);
    });
}
exports.default = default_1;
