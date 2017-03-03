"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_filed_constant_1 = require("../config-filed-constant");
const _fs = require("fs-extra");
const _path = require("path");
//获取实际已安装插件的版本好 （node_modules/xx）
function default_1(pluginName) {
    let pluginRootDir = config_filed_constant_1.default.get().pluginDir;
    if (!_fs.existsSync(_path.join(pluginRootDir, pluginName))) {
        return -1;
    }
    let packageJson = _fs.readJSONSync(_path.join(pluginRootDir, pluginName, 'package.json'));
    return packageJson['version'] || -1;
}
exports.default = default_1;
