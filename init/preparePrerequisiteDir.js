"use strict";
const config_filed_constant_1 = require('../config-filed-constant');
const _fs = require('fs-extra');
const _path = require('path');
function default_1() {
    config_filed_constant_1.default.prerequisiteEnvironment.forEach((prerequisite) => {
        _fs.mkdirpSync(_path.join(config_filed_constant_1.default.environmentRootDir, prerequisite));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
