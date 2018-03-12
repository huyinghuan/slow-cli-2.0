"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _hookMap = require("./map");
const _async = require("async");
function doPrecompile(buildConfig, fileItem, content, finish) {
    let queue = _hookMap.HookQueue["precompile:include"] || [];
    var compileContent = "";
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, content, (error, processContent) => {
            compileContent = processContent;
            next(error, null);
        });
    }, (error) => {
        finish(error, compileContent);
    });
}
function insertCompile(buildConfig, fileItem, content, finish) {
    let queue = _hookMap.HookQueue["precompile:insert"] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, fileItem, content, (error, processContent) => {
            content = processContent;
            next(error, null);
        });
    }, (error) => {
        finish(error, content);
    });
}
function replaceCompile(buildConfig, fileItem, content, finish) {
    let queue = _hookMap.HookQueue["precompile:replace"] || [];
    _async.mapSeries(queue, (hook, next) => {
        hook.fn(buildConfig, content, (error, processContent) => {
            content = processContent;
            next(error, null);
        });
    }, (error) => {
        finish(error, content);
    });
}
function default_1(hookType, ...options) {
    switch (hookType) {
        case "include":
            doPrecompile.apply(null, options);
            break;
        case "insert":
            insertCompile.apply(null, options);
            break;
        case "replace":
            replaceCompile.apply(null, options);
            break;
    }
}
exports.default = default_1;
