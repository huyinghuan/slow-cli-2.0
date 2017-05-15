"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function default_1(buildConfig, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.doNothing] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, data, (err) => { next(err, null); });
    }, (err) => {
        callback(err, data);
    });
}
exports.default = default_1;
