"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
const triggerHttpResponseDirHook_1 = require("./triggerHttpResponseDirHook");
const triggerHttpNoFoundHook_1 = require("./triggerHttpNoFoundHook");
function compile(req, data, callback) {
    let queue = _hookMap.HookQueue["preview:compile"] || [];
    if (!queue.length) {
        callback(null, null);
        return;
    }
    let content = null;
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, content, (error, compileContent) => {
            content = compileContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, content);
    });
}
function processCompile(req, data, responseContent, callback) {
    let queue = _hookMap.HookQueue["preview:processCompile"] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, responseContent, (error, processContent) => {
            responseContent = processContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, responseContent);
    });
}
function beforeResponse(req, data, responseContent, callback) {
    let queue = _hookMap.HookQueue["preview:beforeResponse"] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(req, data, responseContent, (error, processContent) => {
            responseContent = processContent;
            next(error, null);
        });
    }, (error) => {
        callback(error, responseContent);
    });
}
function default_1(hookType, ...options) {
    switch (hookType) {
        case "notFound":
            _hookMap.route.notFound = "preview:notFound";
            triggerHttpNoFoundHook_1.default.apply(null, options);
            break;
        case "dir":
            _hookMap.route.isDir = "preview:dir";
            triggerHttpResponseDirHook_1.default.apply(null, options);
            break;
        case "compile":
            compile.apply(null, options);
            break;
        case "processCompile":
            processCompile.apply(null, options);
            break;
        case "beforeResponse":
            beforeResponse.apply(null, options);
    }
}
exports.default = default_1;
