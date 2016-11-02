"use strict";
const _ = require('lodash');
const _hookMap = require('./map');
function default_1(req, data, callback) {
    let queue = _hookMap.HookQueue[_hookMap.route.didRequest];
    let contentFactoryList = [];
    _.forEach(queue, (hook) => { contentFactoryList.push(hook.fn); });
    let next = (error, data, responseContent) => {
        if (error) {
            return callback(error, data, responseContent);
        }
        let compiler = contentFactoryList.shift();
        if (!compiler) {
            return callback(null, data, responseContent);
        }
        compiler(req, data, responseContent, next);
    };
    next(null, data, null);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;