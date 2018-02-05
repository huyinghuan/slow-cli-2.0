"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function forward(req, data, callback) {
    let queue = _hookMap.HookQueue["route:forward"] || [];
    if (!queue.length) {
        callback(null);
        return;
    }
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, (error) => { next(error); });
    }, (error) => {
        callback(error);
    });
}
function default_1(hookType, ...options) {
    switch (hookType) {
        case "forward":
            forward.apply(null, options);
            break;
    }
}
exports.default = default_1;
