"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs-extra");
const config_filed_constant_1 = require("./config-filed-constant");
const getCLIVersion_1 = require("./lib/getCLIVersion");
exports.getCLIVersion = getCLIVersion_1.default;
const checkCLIVersion_1 = require("./lib/checkCLIVersion");
exports.checkCLIVersion = checkCLIVersion_1.default;
const _path = require("path");
//获取package.json某个字段的值
function getProjectPackageJSONField(fieldName) {
    let json = getProjectPackageJSON();
    return json[fieldName];
}
exports.getProjectPackageJSONField = getProjectPackageJSONField;
//返回packageJson内容
function getProjectPackageJSON(fieldName) {
    if (!_fs.existsSync(config_filed_constant_1.default.get().CLIConfigFile)) {
        return {};
    }
    return _fs.readJSONSync(config_filed_constant_1.default.get().CLIConfigFile); //require(_configFiledConstant.CLIConfigFile)
}
exports.getProjectPackageJSON = getProjectPackageJSON;
//写入package.json文件
function writeProjectPackageJSON(packageJSON) {
    _fs.outputJSONSync(config_filed_constant_1.default.get().CLIConfigFile, packageJSON);
}
exports.writeProjectPackageJSON = writeProjectPackageJSON;
//获取项目所在文件夹的文件夹名称
function getProjectDirectoryName() {
    return config_filed_constant_1.default.getWorkspace().split(_path.sep).pop();
}
exports.getProjectDirectoryName = getProjectDirectoryName;
