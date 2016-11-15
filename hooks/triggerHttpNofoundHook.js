"use strict";
const _hookMap = require('./map');
/**
 * route:noFound
 */
function default_1(req, resp, cb) {
    let queue = _hookMap.HookQueue[_hookMap.route.notFound] || [];
    if (queue.length == 0) {
        return cb(false);
    }
    queue[0].fn(req, resp, cb);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
