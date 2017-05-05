"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function default_1(buildConfig, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.endBuild] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, next);
    }, (err) => {
        callback(err);
    });
}
exports.default = default_1;
