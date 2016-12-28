"use strict";
const _ = require("lodash");
const _hookMap = require("./map");
/**
 * route:willResponse
 */
function default_1(req, data, responseContent, callback) {
    let queue = _hookMap.HookQueue[_hookMap.route.willResponse] || [];
    let contentFactoryList = [];
    _.forEach(queue, (hook) => { contentFactoryList.push(hook.fn); });
    let next = (error, responseContent) => {
        if (error) {
            return callback(error, responseContent);
        }
        let contentProcess = contentFactoryList.shift();
        if (!contentProcess) {
            return callback(error, responseContent);
        }
        contentProcess(req, data, responseContent, next);
    };
    next(null, responseContent);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
