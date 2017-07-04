"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
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
exports.default = default_1;
