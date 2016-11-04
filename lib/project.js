"use strict";
/**
 * 用于检测，获取项目相关信息
 */
const _path = require('path');
function getProjectDirectoryName() {
    return process.cwd().split(_path.sep).pop();
}
exports.getProjectDirectoryName = getProjectDirectoryName;
