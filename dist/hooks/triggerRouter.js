"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
const responseDir_1 = require("./route/responseDir");
function forward(req, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["route:forward"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0; i < queue.length; i++) {
            yield queue[i].fn(req, data);
        }
        return;
    });
}
function didResponse(req) {
    let queue = _hookMap.HookQueue["route:didResponse"] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, next);
    }, () => { });
}
function didRequest(req, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["route:didRequest"] || [];
        if (!queue.length) {
            return null;
        }
        let content = null;
        for (let i = 0; i < queue.length; i++) {
            content = yield queue[i].fn(req, data, content);
        }
        return content;
    });
}
function routeInint(router) {
    let queue = _hookMap.HookQueue[_hookMap.route.initial];
    if (!queue) {
        return false;
    }
    for (let i = 0, length = queue.length; i < length; i++) {
        if (queue[i].fn(router)) {
            return true;
        }
    }
    return false;
}
function willResponse(req, data, responseContent) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue['route:willResponse'] || [];
        for (let i = 0, length = queue.length; i < length; i++) {
            responseContent = yield queue[i].fn(req, data, responseContent);
        }
        return responseContent;
    });
}
function noFound(req, resp, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue[_hookMap.route.notFound] || [];
        if (queue.length == 0) {
            return false;
        }
        return queue[0].fn(req, resp);
    });
}
function default_1(hookType, ...options) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (hookType) {
            case "forward":
                return forward.apply(null, options);
            case "didResponse":
                didResponse.apply(null, options);
                break;
            case "dir":
                return responseDir_1.default.apply(null, options);
            case "didRequest":
                return didRequest.apply(null, options);
            case "initial":
                return routeInint.apply(null, options);
            case "willResponse":
                return willResponse.apply(null, options);
            case "notFound":
                return noFound.apply(null, options);
        }
    });
}
exports.default = default_1;
