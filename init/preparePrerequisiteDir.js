"use strict";
const config_filed_constant_1 = require("../config-filed-constant");
const _fs = require("fs-extra");
const _path = require("path");
function default_1() {
    let configFiledConstant = config_filed_constant_1.default.get();
    configFiledConstant.prerequisiteEnvironment.forEach((prerequisite) => {
        _fs.mkdirpSync(_path.join(configFiledConstant.environmentRootDir, prerequisite));
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
