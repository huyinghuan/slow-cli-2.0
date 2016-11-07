"use strict";
/**
 * 用于检测，获取项目相关信息
 */
const _path = require('path');
const file_config_1 = require('../file-config');
const _fs = require('fs-extra');
const index_1 = require('../init/index');
function getProjectDirectoryName() {
    return process.cwd().split(_path.sep).pop();
}
exports.getProjectDirectoryName = getProjectDirectoryName;
function getCLIVersion() {
    return require('../package').version;
}
exports.getCLIVersion = getCLIVersion;
function checkCLIVersion() {
    if (!_fs.existsSync(file_config_1.default.CLIConfigFile)) {
        console.log('默认执行环境，跳过CLI环境检查');
        return true;
    }
    let packageJSON = index_1.getProjectPackageJSON();
    let currentCLIVersion = getCLIVersion();
}
exports.checkCLIVersion = checkCLIVersion;
