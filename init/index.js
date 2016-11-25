"use strict";
const config_filed_constant_1 = require('../config-filed-constant');
const _fs = require('fs-extra');
const _ = require('lodash');
const generatorDefaultConfig_1 = require('./generatorDefaultConfig');
exports.generatorDefaultConfig = generatorDefaultConfig_1.default;
const getRemoteServerProjectPluginConfig_1 = require('./getRemoteServerProjectPluginConfig');
exports.getRemoteServerProjectPluginConfig = getRemoteServerProjectPluginConfig_1.default;
const setPluginConfig_1 = require('./setPluginConfig');
exports.setPluginConfig = setPluginConfig_1.default;
const checkBuildArgs_1 = require('./checkBuildArgs');
exports.checkBuildArgs = checkBuildArgs_1.default;
const checkStartArgs_1 = require('./checkStartArgs');
exports.checkStartArgs = checkStartArgs_1.default;
const prepareUserEnv_1 = require('./prepareUserEnv');
exports.prepareUserEnv = prepareUserEnv_1.default;
const prepareRuntimeEnv_1 = require('./prepareRuntimeEnv');
exports.prepareRuntimeEnv = prepareRuntimeEnv_1.default;
const preparePrerequisiteDir_1 = require('./preparePrerequisiteDir');
exports.preparePrerequisiteDir = preparePrerequisiteDir_1.default;
function getProjectPackageJSONField(fieldName) {
    let json = getProjectPackageJSON();
    return json[fieldName];
}
exports.getProjectPackageJSONField = getProjectPackageJSONField;
//返回packageJson内容
function getProjectPackageJSON(fieldName) {
    if (!_fs.existsSync(config_filed_constant_1.default.CLIConfigFile)) {
        return {};
    }
    return _fs.readJSONSync(config_filed_constant_1.default.CLIConfigFile); //require(_configFiledConstant.CLIConfigFile)
}
exports.getProjectPackageJSON = getProjectPackageJSON;
//写入package.json文件
function writeProjectPackageJSON(packageJSON) {
    _fs.outputJSONSync(config_filed_constant_1.default.CLIConfigFile, packageJSON);
}
exports.writeProjectPackageJSON = writeProjectPackageJSON;
function setEnviroment(setting) {
    _.extend(global.__CLI, setting);
}
exports.setEnviroment = setEnviroment;
function setBuildParams(userInputAgruments) {
    _.extend(global.__CLI.buildConfig, userInputAgruments);
}
exports.setBuildParams = setBuildParams;
function setStartParams(userInputAgruments) {
    _.extend(global.__CLI, userInputAgruments);
}
exports.setStartParams = setStartParams;
function getBuildConfig() {
    return global.__CLI.buildConfig;
}
exports.getBuildConfig = getBuildConfig;
function getPluginConfig() {
    return global.__CLI.pluginsConfig;
}
exports.getPluginConfig = getPluginConfig;
// 仅为全局变量
function getFullConfig() {
    return global.__CLI;
}
exports.getFullConfig = getFullConfig;
function writePluginConfigToConfigFile(pluginConfig) {
    let packageJSON = getProjectPackageJSON();
    packageJSON = setPluginConfig_1.default(packageJSON, pluginConfig);
    _fs.outputJSONSync(config_filed_constant_1.default.CLIConfigFile, packageJSON);
}
exports.writePluginConfigToConfigFile = writePluginConfigToConfigFile;
