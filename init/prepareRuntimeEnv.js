"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const _path = require("path");
function default_1(value) {
    value = value || 'develop';
    config_filed_constant_1.default.setGlobal({
        enviroment: value,
        enviromentDir: _path.join(config_filed_constant_1.default.get().environmentRootDir, value)
    });
}
exports.default = default_1;
