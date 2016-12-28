"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
