"use strict";
const _fs = require('fs-extra');
const file_config_1 = require('../file-config');
const getCLIVersion_1 = require('./getCLIVersion');
const index_1 = require('../init/index');
function default_1() {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = index_1.getProjectPackageJSON();
    let currentCLIVersion = getCLIVersion_1.default();
    let macth = packageJSON[file_config_1.default.pluginVersionField] == currentCLIVersion;
    if (macth) {
        return true;
    }
    else {
        console.log(`警告: 项目要求${file_config_1.default.infinity}版本是: ${packageJSON[file_config_1.default.pluginVersionField]} ,本机实际版本为: ${currentCLIVersion}`.red);
        return false;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
