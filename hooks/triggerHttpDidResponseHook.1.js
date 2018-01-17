"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**定义http response 即将响应完之后的hook */
const _hookMap = require("./map");
const _async = require("async");
/**
 * route:didResponse
 */
function default_1(req) {
    let queue = _hookMap.HookQueue[_hookMap.route.didResponse] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, next);
    }, () => { });
}
exports.default = default_1;
