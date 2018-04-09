"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _project = require("./project");
const _fs = require("fs-extra");
const config_filed_constant_1 = require("./config-filed-constant");
const packageJSON = require('../package');
function getVersion() {
    return packageJSON.version;
}
exports.getVersion = getVersion;
function checkVersion() {
    let configFiledConstant = config_filed_constant_1.default.get();
    if (!_fs.existsSync(configFiledConstant.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = _project.getProjectPackageJSON();
    let currentCLIVersion = packageJSON.version;
    let macth = packageJSON[configFiledConstant.pluginVersionField] == currentCLIVersion;
    if (macth) {
        return true;
    }
    else {
        console.log(`警告: 项目要求${configFiledConstant.infinity}版本是: ${packageJSON[configFiledConstant.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red);
        return false;
    }
}
exports.checkVersion = checkVersion;
