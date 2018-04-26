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
const _ = require("lodash");
function initial() {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:initial"] || [];
        let stop = false;
        for (let i = 0, length = queue.length; i < length; i++) {
            stop = yield queue[i].fn(stop);
        }
        return stop;
    });
}
function handleError() {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:error"] || [];
        let processFactoryList = [];
        _.forEach(queue, (hook) => { processFactoryList.push(hook.fn); });
        let next = (error) => {
            let errorProcess = processFactoryList.shift();
            if (!errorProcess) {
                return;
            }
            errorProcess(error, next);
        };
    });
}
function willBuild(buildConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:willBuild"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0, len = queue.length; i < len; i++) {
            let hook = queue[i];
            yield hook.fn(buildConfig);
        }
    });
}
function doCompile(buildConfig, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:doCompile"] || [];
        if (!queue.length) {
            return;
        }
        let content = null;
        for (let i = 0, len = queue.length; i < len; i++) {
            let hook = queue[i];
            content = yield hook.fn(buildConfig, data, content);
        }
        return content;
    });
}
//didCompile
function didCompile(buildConfig, data, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:didCompile"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0, len = queue.length; i < len; i++) {
            let hook = queue[i];
            content = yield hook.fn(buildConfig, data, content);
        }
        return content;
    });
}
//didCompile
function doNothing(buildConfig, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:doNothing"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0, len = queue.length; i < len; i++) {
            let hook = queue[i];
            yield hook.fn(buildConfig, data);
        }
    });
}
//didCompile
function end(buildConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["build:end"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0, len = queue.length; i < len; i++) {
            let hook = queue[i];
            yield hook.fn(buildConfig);
        }
    });
}
function default_1(hookType, ...options) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (hookType) {
            case "willBuild":
                return initial.apply(null, options);
            case "initial":
                return willBuild.apply(null, options);
            case "error":
                return handleError.apply(null, options);
            case "doCompile":
                return doCompile.apply(null, options);
            case "didCompile":
                return didCompile.apply(null, options);
            case "doNothing":
                return doNothing.apply(null, options);
            case "end":
                return end.apply(null, options);
        }
    });
}
exports.default = default_1;
