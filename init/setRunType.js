"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
function default_1(value) {
    value = value || 'tool';
    config_filed_constant_1.default.setGlobal({
        runType: value
    });
}
exports.default = default_1;
