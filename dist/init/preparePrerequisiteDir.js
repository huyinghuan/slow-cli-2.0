"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const _fs = require("fs-extra");
const _path = require("path");
function default_1() {
    let configFiledConstant = config_filed_constant_1.default.get();
    configFiledConstant.prerequisiteEnvironment.forEach((prerequisite) => {
        _fs.mkdirpSync(_path.join(configFiledConstant.environmentRootDir, prerequisite));
    });
}
exports.default = default_1;
