"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(value) {
    if (!value) {
        return {};
    }
    if (!/(\,|\=)/.test(value)) {
        return { extra: value };
    }
    let arr = value.split(',');
    let params = {};
    arr.forEach((item) => {
        let keyValue = item.split('=');
        if (!keyValue[0] || !keyValue[1]) {
            return;
        }
        params[keyValue[0]] = keyValue[1];
    });
    return params;
}
exports.default = default_1;
