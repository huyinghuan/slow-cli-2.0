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
function compile(req, data, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["preview:compile"] || [];
        if (!queue.length) {
            return;
        }
        let content = null;
        for (let i = 0; i < queue.length; i++) {
            content = yield queue[i].fn(req, data, content);
        }
        return content;
    });
}
function beforeResponse(req, data, responseContent, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["preview:beforeResponse"] || [];
        for (let i = 0; i < queue.length; i++) {
            responseContent = yield queue[i].fn(req, data, responseContent);
        }
        return responseContent;
    });
}
function forward(req, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let queue = _hookMap.HookQueue["preview:forward"] || [];
        if (!queue.length) {
            return;
        }
        for (let i = 0; i < queue.length; i++) {
            yield queue[i].fn(req, data);
        }
    });
}
function default_1(hookType, ...options) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (hookType) {
            case "forward":
                return forward.apply(null, options);
            case "compile":
                return compile.apply(null, options);
            case "beforeResponse":
                return beforeResponse.apply(null, options);
        }
    });
}
exports.default = default_1;
