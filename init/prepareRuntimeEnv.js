"use strict";
const config_filed_constant_1 = require('../config-filed-constant');
const _init = require('./index');
const _path = require('path');
function default_1(value) {
    value = value || 'develop';
    _init.setEnviroment({
        enviroment: value,
        enviromentDir: _path.join(config_filed_constant_1.default.environmentRootDir, value)
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
