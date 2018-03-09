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
function default_1(hookType, ...options) {
    switch (hookType) {
        case "include":
            doPrecompile.apply(null, options);
            break;
    }
}
exports.default = default_1;
