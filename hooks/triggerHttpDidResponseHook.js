"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**定义http response 即将响应完之后的hook */
const _hookMap = require("./map");
const _ = require("lodash");
/**
 * route:didResponse
 */
function default_1(req) {
    let queue = _hookMap.HookQueue[_hookMap.route.didResponse] || [];
    let contentFactoryList = [];
    _.forEach(queue, (hook) => { contentFactoryList.push(hook.fn); });
    let next = () => {
        let contentProcess = contentFactoryList.shift();
        if (!contentProcess) {
            return;
        }
        contentProcess(req, next);
    };
    next();
}
exports.default = default_1;
