"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
/**
 * route:willResponse
 */
function default_1(req, data, responseContent, callback) {
    let queue = _hookMap.HookQueue[_hookMap.route.willResponse] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, responseContent, (error, processContent) => {
            responseContent = processContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, responseContent);
    });
}
exports.default = default_1;
