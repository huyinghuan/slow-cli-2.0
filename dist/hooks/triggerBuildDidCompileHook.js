"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function default_1(buildConfig, data, content, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.didCompile] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, data, content, (error, processContent) => {
            content = processContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, content);
    });
}
exports.default = default_1;
