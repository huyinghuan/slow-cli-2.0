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
function doPrecompile(buildConfig, fileItem, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["precompile:include"] || [];
        for (let i = 0, length = queue.length; i < length; i++) {
            content = yield queue[i].fn(buildConfig, content);
        }
        return content;
    });
}
function insertCompile(buildConfig, fileItem, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["precompile:insert"] || [];
        for (let i = 0, length = queue.length; i < length; i++) {
            content = yield queue[i].fn(buildConfig, fileItem, content);
        }
        return content;
    });
}
function replaceCompile(buildConfig, fileItem, content) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["precompile:replace"] || [];
        for (let i = 0, length = queue.length; i < length; i++) {
            content = yield queue[i].fn(buildConfig, content);
        }
        return content;
    });
}
function default_1(hookType, ...options) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (hookType) {
            case "include":
                return doPrecompile.apply(null, options);
            case "insert":
                return insertCompile.apply(null, options);
            case "replace":
                return replaceCompile.apply(null, options);
        }
    });
}
exports.default = default_1;
