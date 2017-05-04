"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
/**
 * route:didRequest
 */
function default_1(req, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.route.didRequest] || [];
    if (!queue.length) {
        callback(null, null);
        return;
    }
    let content = null;
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, content, (error, compileContent) => {
            content = compileContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, content);
    });
}
exports.default = default_1;
