"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(str, length) {
    if (str.length >= length) {
        return str;
    }
    return str + (new Array(length - str.length)).join(" ");
}
exports.default = default_1;
