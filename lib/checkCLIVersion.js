"use strict";
const _fs = require('fs-extra');
const config_filed_constant_1 = require('../config-filed-constant');
const getCLIVersion_1 = require('./getCLIVersion');
const index_1 = require('../init/index');
function default_1() {
    if (!_fs.existsSync(config_filed_constant_1.default.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = index_1.getProjectPackageJSON();
    let currentCLIVersion = getCLIVersion_1.default();
    let macth = packageJSON[config_filed_constant_1.default.pluginVersionField] == currentCLIVersion;
    if (macth) {
        return true;
    }
    else {
        console.log(`警告: 项目要求${config_filed_constant_1.default.infinity}版本是: ${packageJSON[config_filed_constant_1.default.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red);
        return false;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
