"use strict";
const _ = require("lodash");
const _hookMap = require("./map");
/**
 * route:didRequest
 */
function default_1(req, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.route.didRequest] || [];
    let contentFactoryList = [];
    _.forEach(queue, (hook) => { contentFactoryList.push(hook.fn); });
    let next = (error, responseContent) => {
        if (error) {
            return callback(error, responseContent);
        }
        let compiler = contentFactoryList.shift();
        if (!compiler) {
            return callback(null, responseContent);
        }
        compiler(req, data, responseContent, next);
    };
    next(null, null);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
