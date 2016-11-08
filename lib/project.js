"use strict";
/**
 * 用于检测，获取项目相关信息
 */
const _path = require('path');
const getCLIVersion_1 = require('./getCLIVersion');
exports.getCLIVersion = getCLIVersion_1.default;
const checkCLIVersion_1 = require('./checkCLIVersion');
exports.checkCLIVersion = checkCLIVersion_1.default;
const checkPluginVersion_1 = require('./checkPluginVersion');
exports.checkPluginVersion = checkPluginVersion_1.default;
function getProjectDirectoryName() {
    return process.cwd().split(_path.sep).pop();
}
exports.getProjectDirectoryName = getProjectDirectoryName;
