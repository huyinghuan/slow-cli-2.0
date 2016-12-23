"use strict";
const _hookMap = require('./map');
const _async = require('async');
function default_1(buildConfig, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.build.doCompile] || [];
    let content = null;
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, data, content, (error, processContent) => {
            content = processContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, content);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
