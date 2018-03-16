"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function default_1(buildConfig, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.willBuild] || [];
    if (!queue.length) {
        callback(null, buildConfig);
        return;
    }
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, (error) => {
            next(error, null);
        });
    }, (error) => {
        callback(error, buildConfig);
    });
}
exports.default = default_1;
